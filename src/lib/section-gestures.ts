export type GestureDirection = -1 | 1;
export type GestureAxis = 'horizontal' | 'vertical';

export function swipeIntent(x: number, y: number, threshold: number) {
  if (Math.abs(x) >= threshold && Math.abs(x) > Math.abs(y) * 1.35)
    return {
      direction: (x < 0 ? 1 : -1) as GestureDirection,
      axis: 'horizontal' as const,
    };
  if (Math.abs(y) >= threshold && Math.abs(y) > Math.abs(x) * 1.35)
    return {
      direction: (y < 0 ? 1 : -1) as GestureDirection,
      axis: 'vertical' as const,
    };
  return null;
}

export function wheelPixels(
  delta: number,
  mode: number,
  lineHeight: number,
  pageHeight: number,
) {
  return delta * (mode === 1 ? lineHeight : mode === 2 ? pageHeight : 1);
}

export class WheelGesture {
  private lastTime = -Infinity;
  private direction = 0;
  private distance = 0;
  private eligible = false;
  private consumed = false;

  reset() {
    this.lastTime = -Infinity;
    this.distance = 0;
    this.eligible = false;
    this.consumed = false;
  }

  update(delta: number, time: number, canNavigate: boolean, busy = false) {
    const direction = Math.sign(delta) as GestureDirection;
    if (!direction) return { consume: false, direction: null };
    if (time - this.lastTime > 280) {
      this.distance = 0;
      this.eligible = canNavigate && !busy;
      this.consumed = false;
    } else if (direction !== this.direction) {
      this.distance = 0;
    }
    this.lastTime = time;
    this.direction = direction;
    if (busy) this.consumed = true;
    if (this.consumed) return { consume: true, direction: null };
    // A gesture that started inside the content must finish scrolling it first.
    if (!this.eligible || !canNavigate) {
      this.eligible = false;
      return { consume: false, direction: null };
    }
    this.distance += Math.abs(delta);
    if (this.distance < 40) return { consume: true, direction: null };
    this.consumed = true;
    return { consume: true, direction };
  }
}

interface GestureNavigation {
  section: () => string;
  busy: () => boolean;
  canNavigate: (direction: GestureDirection) => boolean;
  navigate: (direction: GestureDirection, axis: GestureAxis) => void;
}

export function attachSectionGestures(
  root: HTMLElement,
  navigation: GestureNavigation,
) {
  const wheel = new WheelGesture();
  const touchSurface = root.ownerDocument?.defaultView ?? window;
  const boundary = (direction: GestureDirection) => {
    const page = document.scrollingElement;
    if (!page) return false;
    const limit = Math.max(0, page.scrollHeight - window.innerHeight);
    return direction < 0 ? page.scrollTop <= 3 : page.scrollTop >= limit - 3;
  };
  const ignored = (target: EventTarget | null, measureScroll = true) => {
    if (
      document.querySelector(
        '[data-language-toggle][aria-expanded="true"], [data-navigation-toggle][aria-expanded="true"]',
      ) ||
      window.getSelection()?.isCollapsed === false
    )
      return true;
    if (!(target instanceof Element)) return true;
    if (
      target.closest(
        'header, button, input, textarea, select, [contenteditable]:not([contenteditable="false"])',
      )
    )
      return true;
    if (!measureScroll) return false;
    for (
      let element: Element | null = target;
      element && element !== document.body;
      element = element.parentElement
    ) {
      if (element === document.documentElement) break;
      const style = getComputedStyle(element);
      if (
        (/(auto|scroll)/.test(style.overflowY) &&
          element.scrollHeight > element.clientHeight + 3) ||
        (/(auto|scroll)/.test(style.overflowX) &&
          element.scrollWidth > element.clientWidth + 3)
      )
        return true;
    }
    return false;
  };

  window.addEventListener(
    'wheel',
    (event) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        ignored(event.target)
      ) {
        wheel.reset();
        return;
      }
      if (navigation.busy()) {
        // Momentum only needs its direction while the current transition runs.
        // Avoid measuring the document on every wheel event during animation.
        const decision = wheel.update(
          event.deltaY,
          performance.now(),
          false,
          true,
        );
        if (decision.consume && event.cancelable) event.preventDefault();
        return;
      }
      const lineHeight =
        parseFloat(getComputedStyle(document.body).lineHeight) || 24;
      const delta = wheelPixels(
        event.deltaY,
        event.deltaMode,
        lineHeight,
        window.innerHeight,
      );
      const direction = Math.sign(delta) as GestureDirection;
      const decision = wheel.update(
        delta,
        performance.now(),
        boundary(direction) && navigation.canNavigate(direction),
        false,
      );
      if (decision.consume && event.cancelable) event.preventDefault();
      if (decision.direction)
        navigation.navigate(decision.direction, 'vertical');
    },
    { passive: false },
  );

  let touch: {
    id: number;
    x: number;
    y: number;
    time: number;
    section: string;
    previous: boolean;
    next: boolean;
    claimed: boolean;
    stationary: boolean;
    scrollTop: number;
  } | null = null;

  touchSurface.addEventListener(
    'touchstart',
    (event) => {
      touch = null;
      wheel.reset();
      const point = event.touches[0];
      if (
        event.touches.length !== 1 ||
        !point ||
        navigation.busy() ||
        ignored(event.target)
      )
        return;
      touch = {
        id: point.identifier,
        x: point.clientX,
        y: point.clientY,
        time: performance.now(),
        section: navigation.section(),
        previous: boundary(-1),
        next: boundary(1),
        claimed: false,
        stationary:
          (document.scrollingElement?.scrollHeight ?? 0) <=
          window.innerHeight + 3,
        scrollTop: document.scrollingElement?.scrollTop ?? 0,
      };
    },
    { passive: true },
  );
  touchSurface.addEventListener(
    'touchmove',
    (event) => {
      if (!touch) return;
      const point = Array.from(event.touches).find(
        (point) => point.identifier === touch!.id,
      );
      if (
        event.touches.length !== 1 ||
        !point ||
        ignored(event.target, false) ||
        navigation.busy() ||
        navigation.section() !== touch.section ||
        performance.now() - touch.time > 800
      ) {
        touch = null;
        return;
      }
      const intent = swipeIntent(
        point.clientX - touch.x,
        point.clientY - touch.y,
        6,
      );
      if (!intent) return;
      if (
        !navigation.canNavigate(intent.direction) ||
        (intent.axis === 'vertical' &&
          !(intent.direction < 0 ? touch.previous : touch.next))
      ) {
        touch = null;
        return;
      }
      if (!event.cancelable) {
        // A short page has no native scroll to compete with. Some mobile
        // browsers still mark its move events noncancelable.
        if (!touch.stationary) touch = null;
        return;
      }
      event.preventDefault();
      touch.claimed = true;
    },
    { passive: false },
  );
  touchSurface.addEventListener(
    'touchend',
    (event) => {
      const gesture = touch;
      touch = null;
      if (
        !gesture ||
        (!gesture.claimed && !gesture.stationary) ||
        event.touches.length ||
        navigation.busy() ||
        navigation.section() !== gesture.section ||
        ignored(event.target, false) ||
        (gesture.stationary &&
          (Math.abs(
            (document.scrollingElement?.scrollTop ?? 0) - gesture.scrollTop,
          ) > 3 ||
            (document.scrollingElement?.scrollHeight ?? 0) >
              window.innerHeight + 3)) ||
        performance.now() - gesture.time > 800
      )
        return;
      const point = Array.from(event.changedTouches).find(
        (point) => point.identifier === gesture.id,
      );
      if (!point) return;
      const intent = swipeIntent(
        point.clientX - gesture.x,
        point.clientY - gesture.y,
        Math.min(36, window.innerWidth * 0.12),
      );
      if (
        !intent ||
        !navigation.canNavigate(intent.direction) ||
        (intent.axis === 'vertical' &&
          !(intent.direction < 0 ? gesture.previous : gesture.next))
      )
        return;
      if (event.cancelable) event.preventDefault();
      navigation.navigate(intent.direction, intent.axis);
    },
    { passive: false },
  );
  touchSurface.addEventListener(
    'touchcancel',
    () => {
      touch = null;
    },
    { passive: true },
  );
}
