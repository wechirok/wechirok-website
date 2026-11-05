import {
  advanceTravel,
  approach,
  clamp,
  createStars,
  displacement,
  projectStar,
} from '../lib/starfield-motion.ts';

const field = document.querySelector<HTMLElement>('.site-starfield');
if (field) {
  const svg = field.querySelector('svg')!;
  const data = createStars();
  const stars = Array.from(
    field.querySelectorAll<SVGCircleElement>('circle'),
  ).map((node) => ({
    node,
    star: data[Number(node.dataset.starIndex)]!,
    offsetX: 0,
    offsetY: 0,
  }));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const colours = matchMedia('(forced-colors: active)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const measure = () => ({ width: svg.clientWidth, height: svg.clientHeight });
  let bounds = measure();
  let pointer: { x: number; y: number } | undefined;
  let travel = 0;
  let targetTravel = 0;
  let parallaxX = 0;
  let parallaxY = 0;
  let scrollPosition = window.scrollY;
  let pendingScrollReset: number | undefined;
  let lastWheel = -Infinity;
  let touch: { x: number; y: number; scroll: number } | undefined;
  let frame = 0;
  let lastTime = 0;
  const enabled = () => !document.hidden && !motion.matches && !colours.matches;

  function paint(seconds: number) {
    travel = approach(travel, targetTravel, seconds, 0.38);
    const targetX = pointer
      ? clamp((pointer.x / bounds.width - 0.5) * -36, 18)
      : 0;
    const targetY = pointer
      ? clamp((pointer.y / bounds.height - 0.5) * -28, 14)
      : 0;
    parallaxX = approach(parallaxX, targetX, seconds);
    parallaxY = approach(parallaxY, targetY, seconds);
    let unsettled =
      travel !== targetTravel || parallaxX !== targetX || parallaxY !== targetY;
    for (const point of stars) {
      const projected = projectStar(
        point.star,
        bounds.width,
        bounds.height,
        travel,
      );
      const strength = Math.min(1, projected.scale * 0.6);
      const x = projected.x + parallaxX * strength;
      const y = projected.y + parallaxY * strength;
      const offset = pointer
        ? displacement(x - pointer.x, y - pointer.y, strength)
        : { x: 0, y: 0 };
      point.offsetX = approach(point.offsetX, offset.x, seconds);
      point.offsetY = approach(point.offsetY, offset.y, seconds);
      point.node.setAttribute('cx', (x + point.offsetX).toFixed(2));
      point.node.setAttribute('cy', (y + point.offsetY).toFixed(2));
      point.node.setAttribute(
        'r',
        (point.star.radius * Math.min(projected.scale, 1.6)).toFixed(2),
      );
      point.node.setAttribute('opacity', projected.opacity.toFixed(3));
      unsettled ||= point.offsetX !== offset.x || point.offsetY !== offset.y;
    }
    return unsettled;
  }

  function schedule() {
    if (!frame && enabled()) frame = requestAnimationFrame(update);
  }

  function update(time: number) {
    frame = 0;
    if (!enabled()) return;
    const seconds = lastTime
      ? Math.min((time - lastTime) / 1000, 0.05)
      : 1 / 60;
    lastTime = time;
    if (paint(seconds)) schedule();
    else lastTime = 0;
  }

  function moveScene(delta: number) {
    if (!enabled()) return;
    targetTravel = advanceTravel(travel, targetTravel, delta);
    schedule();
  }

  function releasePointer() {
    pointer = undefined;
    schedule();
  }

  document.addEventListener('backgroundtravel', (event) => {
    moveScene((event as CustomEvent<number>).detail);
  });
  document.addEventListener('backgroundscrollreset', (event) => {
    const top = (event as CustomEvent<number>).detail;
    pendingScrollReset = window.scrollY === top ? undefined : top;
  });

  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches || !enabled())
        return;
      pointer = {
        x: event.clientX,
        y: event.clientY,
      };
      schedule();
    },
    { passive: true },
  );
  document.addEventListener(
    'pointerout',
    (event) => {
      if (!event.relatedTarget) releasePointer();
    },
    { passive: true },
  );
  window.addEventListener('blur', releasePointer);

  window.addEventListener(
    'wheel',
    (event) => {
      if (
        !enabled() ||
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1;
      lastWheel = performance.now();
      moveScene(event.deltaY * unit);
    },
    { passive: true },
  );
  window.addEventListener(
    'scroll',
    () => {
      const next = window.scrollY;
      if (pendingScrollReset !== undefined) {
        const reset = Math.abs(next - pendingScrollReset) < 1;
        pendingScrollReset = undefined;
        if (reset) {
          scrollPosition = next;
          return;
        }
      }
      // The native scroll following a wheel event must not move the scene twice.
      if (performance.now() - lastWheel > 180) moveScene(next - scrollPosition);
      scrollPosition = next;
    },
    { passive: true },
  );

  document.addEventListener(
    'touchstart',
    (event) => {
      const start = event.touches.length === 1 ? event.touches[0] : undefined;
      touch = start
        ? { x: start.clientX, y: start.clientY, scroll: window.scrollY }
        : undefined;
    },
    { passive: true },
  );
  document.addEventListener(
    'touchend',
    (event) => {
      const end = event.changedTouches[0];
      if (
        touch &&
        end &&
        event.touches.length === 0 &&
        Math.abs(window.scrollY - touch.scroll) < 8
      ) {
        const dx = touch.x - end.clientX,
          dy = touch.y - end.clientY;
        const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
        if (Math.abs(delta) > 40) moveScene(delta);
      }
      touch = undefined;
    },
    { passive: true },
  );
  document.addEventListener(
    'touchcancel',
    () => {
      touch = undefined;
    },
    { passive: true },
  );

  const resize = new ResizeObserver(() => {
    bounds = measure();
    releasePointer();
    if (!enabled()) paint(1);
  });
  resize.observe(svg);

  function configure() {
    field!.toggleAttribute('data-paused', !enabled());
    if (!enabled()) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      pointer = undefined;
      touch = undefined;
      targetTravel = travel;
    } else schedule();
    scrollPosition = window.scrollY;
  }
  document.addEventListener('visibilitychange', configure);
  motion.addEventListener('change', configure);
  colours.addEventListener('change', configure);
  finePointer.addEventListener('change', releasePointer);
  configure();
}
