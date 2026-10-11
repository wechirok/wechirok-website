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

export class GestureProgress {
  distance = 0;
  readonly travel = 120;

  move(delta: number) {
    this.distance += delta;
  }

  get direction() {
    return Math.sign(this.distance) as GestureDirection;
  }

  get progress() {
    return Math.min(1, Math.abs(this.distance) / this.travel);
  }
}

interface GestureNavigation {
  section: () => string;
  active: () => boolean;
  canNavigate: (direction: GestureDirection) => boolean;
  progress: (delta: number, axis: GestureAxis, complete?: boolean) => void;
  finish: (commit?: boolean) => void;
  start: () => void;
  cancel: () => void;
}

export function attachSectionGestures(
  root: HTMLElement,
  navigation: GestureNavigation,
) {
  let wheelTimer: number | undefined;
  const clearWheel = () => {
    window.clearTimeout(wheelTimer);
    wheelTimer = undefined;
  };
  const distanceToBoundary = (direction: GestureDirection) => {
    const page = document.scrollingElement;
    if (!page) return Infinity;
    const limit = Math.max(0, page.scrollHeight - window.innerHeight);
    return Math.max(0, direction < 0 ? page.scrollTop : limit - page.scrollTop);
  };
  const ignored = (target: EventTarget | null) => {
    if (
      document.querySelector('[data-language-toggle][aria-expanded="true"]') ||
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
        clearWheel();
        navigation.cancel();
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
      if (!delta) return;
      const room = distanceToBoundary(direction);
      if (
        !event.cancelable ||
        (!navigation.active() &&
          !(Math.abs(delta) > room && navigation.canNavigate(direction)))
      ) {
        clearWheel();
        if (!event.cancelable) navigation.cancel();
        return;
      }
      event.preventDefault();
      let movement = delta;
      if (!navigation.active() && room > 0) {
        window.scrollBy({ top: direction * room, behavior: 'instant' });
        movement -= direction * room;
      }
      navigation.progress(movement, 'vertical', true);
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        navigation.finish();
        clearWheel();
      }, 160);
    },
    { passive: false },
  );

  let touch: {
    id: number;
    x: number;
    y: number;
    section: string;
    claimed: boolean;
    axis: GestureAxis | null;
    last: number;
    offset: number;
  } | null = null;

  root.addEventListener(
    'touchstart',
    (event) => {
      touch = null;
      clearWheel();
      navigation.start();
      const point = event.touches[0];
      if (event.touches.length !== 1 || !point || ignored(event.target)) return;
      touch = {
        id: point.identifier,
        x: point.clientX,
        y: point.clientY,
        section: navigation.section(),
        claimed: false,
        axis: null,
        last: 0,
        offset: 0,
      };
    },
    { passive: true },
  );
  root.addEventListener(
    'touchmove',
    (event) => {
      if (!touch) return;
      const point = Array.from(event.touches).find(
        (point) => point.identifier === touch!.id,
      );
      if (
        event.touches.length !== 1 ||
        !point ||
        ignored(event.target) ||
        navigation.section() !== touch.section
      ) {
        touch = null;
        navigation.cancel();
        return;
      }
      if (!event.cancelable) {
        touch = null;
        navigation.cancel();
        return;
      }
      const intent = swipeIntent(
        point.clientX - touch.x,
        point.clientY - touch.y,
        6,
      );
      if (!intent) {
        if (touch.claimed && event.cancelable) {
          event.preventDefault();
          const distance =
            touch.axis === 'horizontal'
              ? touch.x - point.clientX
              : touch.y - point.clientY;
          navigation.progress(distance - touch.last, touch.axis!);
          touch.last = distance;
        }
        return;
      }
      if (
        (!navigation.active() && !navigation.canNavigate(intent.direction)) ||
        (intent.axis === 'vertical' &&
          !navigation.active() &&
          distanceToBoundary(intent.direction) > 3)
      ) {
        // Keep native scrolling, and track it so only movement beyond the edge
        // participates in the transition if the browser lets us claim it later.
        touch.last =
          touch.axis === 'horizontal' || intent.axis === 'horizontal'
            ? touch.x - point.clientX
            : touch.y - point.clientY;
        return;
      }
      if (touch.axis && touch.axis !== intent.axis) {
        touch = null;
        navigation.finish(false);
        return;
      }
      event.preventDefault();
      if (!touch.claimed) {
        touch.offset = intent.axis === 'vertical' ? touch.last : 0;
        if (intent.axis === 'horizontal') touch.last = 0;
      }
      touch.claimed = true;
      touch.axis ??= intent.axis;
      const distance =
        touch.axis === 'horizontal'
          ? touch.x - point.clientX
          : touch.y - point.clientY;
      navigation.progress(distance - touch.last, touch.axis);
      touch.last = distance;
    },
    { passive: false },
  );
  root.addEventListener(
    'touchend',
    (event) => {
      const gesture = touch;
      touch = null;
      if (
        !gesture ||
        !gesture.claimed ||
        event.touches.length ||
        navigation.section() !== gesture.section ||
        ignored(event.target)
      ) {
        navigation.cancel();
        return;
      }
      const point = Array.from(event.changedTouches).find(
        (point) => point.identifier === gesture.id,
      );
      if (!point) {
        navigation.cancel();
        return;
      }
      const intent = swipeIntent(
        point.clientX - gesture.x,
        point.clientY - gesture.y,
        Math.min(36, window.innerWidth * 0.12),
      );
      const distance =
        gesture.axis === 'horizontal'
          ? gesture.x - point.clientX
          : gesture.y - point.clientY;
      if (
        !intent ||
        !navigation.canNavigate(intent.direction) ||
        intent.axis !== gesture.axis ||
        Math.abs(distance - gesture.offset) <
          Math.min(36, window.innerWidth * 0.12)
      ) {
        navigation.finish(false);
        return;
      }
      if (event.cancelable) event.preventDefault();
      navigation.progress(distance - gesture.last, intent.axis);
      navigation.finish(true);
    },
    { passive: false },
  );
  root.addEventListener(
    'touchcancel',
    () => {
      touch = null;
      navigation.cancel();
    },
    { passive: true },
  );
}
