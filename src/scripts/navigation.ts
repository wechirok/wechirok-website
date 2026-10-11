import { finishLocaleTransitions } from '../lib/locale-transition';
import {
  attachSectionGestures,
  GestureProgress,
  type GestureAxis,
  type GestureDirection,
} from '../lib/section-gestures';

interface TransitionOptions {
  focus?: boolean;
  animate?: boolean;
  scroll?: 'top' | 'bottom';
}

const root = document.querySelector<HTMLElement>('[data-personal-space]');
const stage = root?.querySelector<HTMLElement>('[data-space-stage]');
const homeButton = root?.querySelector<HTMLButtonElement>('[data-home]');

if (root && stage && homeButton) {
  const panels = new Map(
    Array.from(root.querySelectorAll<HTMLElement>('[data-panel]')).map(
      (panel) => [panel.dataset.panel!, panel],
    ),
  );
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-section]'),
  );
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const labelTimers = new Set<number>();
  const clearLabels = () => {
    for (const timer of labelTimers) window.clearTimeout(timer);
    labelTimers.clear();
    for (const link of links) {
      link.removeAttribute('data-label-visible');
      link.removeAttribute('data-entry-active');
    }
  };
  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      labelTimers.delete(timer);
      callback();
    }, delay);
    labelTimers.add(timer);
  };
  const highlightEntry = (link: HTMLAnchorElement, duration = 450) => {
    clearLabels();
    link.setAttribute('data-entry-active', '');
    later(() => link.removeAttribute('data-entry-active'), duration);
  };
  const introduceLabels = () => {
    clearLabels();
    if (document.activeElement?.closest('.section-navigation')) return;
    if (links.some((link) => link.matches(':hover'))) return;
    links.forEach((link, index) => {
      later(
        () => {
          for (const item of links) item.removeAttribute('data-label-visible');
          link.setAttribute('data-label-visible', '');
        },
        250 + index * 1450,
      );
    });
    later(clearLabels, 250 + links.length * 1450);
  };
  for (const link of links) {
    link.addEventListener('focus', clearLabels);
    link.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') clearLabels();
    });
  }
  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-home]'))
      clearLabels();
    if (
      event.target instanceof Element &&
      event.target.closest('[data-preferences]')
    )
      cancelPreview();
  });
  let current = 'home';
  let requested = current;
  let revision = 0;
  const animations = new Set<Animation>();

  const cancelAnimations = () => {
    for (const animation of animations) animation.cancel();
    animations.clear();
    homeButton.inert = false;
    for (const panel of panels.values()) panel.inert = false;
  };

  const animate = async (
    element: HTMLElement,
    frames: Keyframe[],
    options: KeyframeAnimationOptions,
  ) => {
    const animation = element.animate(frames, options);
    animations.add(animation);
    try {
      await animation.finished;
    } catch {
      // A newer selection or reduced-motion setting supersedes this transition.
    } finally {
      animation.cancel();
      animations.delete(animation);
    }
  };

  const show = async (
    name: string,
    {
      focus = true,
      animate: useMotion = true,
      scroll = 'top',
    }: TransitionOptions = {},
  ) => {
    cancelPreview();
    const next = panels.get(name);
    if (!next || (name === current && name === requested)) return;
    requested = name;
    const ticket = ++revision;
    clearLabels();
    finishLocaleTransitions();
    cancelAnimations();
    const previous = panels.get(current)!;
    const animated =
      useMotion && !motion.matches && typeof stage.animate === 'function';

    if (animated) {
      previous.inert = true;
      const exitFrames = [
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
        { opacity: 0, transform: 'translateY(-4px)', filter: 'blur(3px)' },
      ];
      const exitOptions = {
        duration: 150,
        easing: 'ease-in',
        fill: 'forwards',
      } as const;
      const outgoing = [animate(previous, exitFrames, exitOptions)];
      if (name === 'home' && !homeButton.hidden) {
        homeButton.inert = true;
        outgoing.push(animate(homeButton, exitFrames, exitOptions));
      }
      await Promise.all(outgoing);
      if (ticket !== revision) return;
    }

    const enteringHomeButton = homeButton.hidden && name !== 'home';
    homeButton.hidden = name === 'home';
    homeButton.inert = false;
    previous.hidden = true;
    previous.inert = false;
    next.hidden = false;
    current = name;
    for (const link of links) {
      if (link.dataset.section === name)
        link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    if (focus) {
      next.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
      window.scrollTo({
        top:
          scroll === 'bottom'
            ? (document.scrollingElement?.scrollHeight ?? 0)
            : 0,
        // Position the page before its entrance, so scrolling cannot reveal it in slices.
        behavior: 'instant',
      });
    }
    const activeLink = links.find((link) => link.dataset.section === name);
    if (activeLink) highlightEntry(activeLink);

    if (animated) {
      const entryFrames = [
        { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
      ];
      const entryOptions = {
        duration: 340,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      };
      const incoming = [animate(next, entryFrames, entryOptions)];
      // Keep this shared control stationary when moving between sections.
      if (enteringHomeButton)
        incoming.push(animate(homeButton, entryFrames, entryOptions));
      await Promise.all(incoming);
    }
  };

  const navigate = (name: string, options?: TransitionOptions) => {
    const hash = name === 'home' ? '' : `#${name}`;
    if (location.hash !== hash)
      history.pushState(
        null,
        '',
        `${location.pathname}${location.search}${hash}`,
      );
    void show(name, options);
  };
  const sectionOrder = Array.from(panels.keys());
  const gesture = new GestureProgress();
  let preview: {
    name: string;
    direction: GestureDirection;
    axis: GestureAxis;
    next: HTMLElement;
    previous: HTMLElement;
  } | null = null;
  let settling: number | undefined;
  let settlingCommit = false;
  const resetStyle = (element: HTMLElement) => {
    for (const property of [
      'position',
      'top',
      'left',
      'width',
      'opacity',
      'transform',
      'will-change',
    ])
      element.style.removeProperty(property);
  };
  const stopSettling = () => {
    if (settling !== undefined) window.cancelAnimationFrame(settling);
    settling = undefined;
    settlingCommit = false;
  };
  const cancelPreview = () => {
    stopSettling();
    if (preview) {
      resetStyle(preview.previous);
      resetStyle(preview.next);
      preview.previous.inert = false;
      preview.next.inert = false;
      preview.next.removeAttribute('aria-hidden');
      preview.next.hidden = true;
      resetStyle(homeButton);
      homeButton.hidden = current === 'home';
      homeButton.inert = false;
      preview = null;
    }
    gesture.distance = 0;
  };
  const renderPreview = () => {
    if (!preview) return;
    const { previous, next, direction, axis } = preview;
    const progress = motion.matches ? 0 : gesture.progress;
    const translate = (distance: number) =>
      axis === 'horizontal'
        ? `translateX(${distance}px)`
        : `translateY(${distance}px)`;
    previous.style.opacity = String(1 - progress);
    previous.style.transform = translate(-direction * progress * 40);
    next.style.opacity = String(progress);
    next.style.transform = translate(direction * (1 - progress) * 40);
    if (current === 'home' || preview.name === 'home')
      homeButton.style.opacity = String(
        current === 'home' ? progress : 1 - progress,
      );
  };
  const commitPreview = () => {
    if (!preview) return;
    const { name, axis, direction } = preview;
    cancelPreview();
    navigate(name, {
      animate: false,
      scroll: axis === 'vertical' && direction < 0 ? 'bottom' : 'top',
    });
  };
  const finishPreview = (commit = Math.abs(gesture.distance) >= 40) => {
    if (!preview) return;
    stopSettling();
    if (motion.matches || (commit && gesture.progress === 1)) {
      if (commit) commitPreview();
      else cancelPreview();
      return;
    }
    const from = gesture.distance;
    settlingCommit = commit;
    const to = commit ? preview.direction * gesture.travel : 0;
    const start = performance.now();
    const settle = (time: number) => {
      const progress = Math.min(1, (time - start) / 140);
      gesture.distance = from + (to - from) * (1 - (1 - progress) ** 3);
      renderPreview();
      if (progress < 1) settling = window.requestAnimationFrame(settle);
      else if (commit) commitPreview();
      else cancelPreview();
    };
    settling = window.requestAnimationFrame(settle);
  };
  const movePreview = (delta: number, axis: GestureAxis, complete = false) => {
    stopSettling();
    gesture.move(delta);
    const direction = gesture.direction;
    const name = sectionOrder[sectionOrder.indexOf(current) + direction];
    if (!direction || !name) {
      cancelPreview();
      return;
    }
    if (!preview || preview.name !== name || preview.axis !== axis) {
      const distance = gesture.distance;
      const page = document.scrollingElement;
      if (
        axis === 'vertical' &&
        page &&
        (direction < 0
          ? window.scrollY > 3
          : window.scrollY < page.scrollHeight - window.innerHeight - 3)
      ) {
        const room = Math.max(
          0,
          direction < 0
            ? window.scrollY
            : page.scrollHeight - window.innerHeight - window.scrollY,
        );
        const scroll = Math.min(Math.abs(distance), room);
        cancelPreview();
        window.scrollBy({ top: direction * scroll, behavior: 'instant' });
        const rest = distance - direction * scroll;
        if (rest) movePreview(rest, axis, complete);
        return;
      }
      cancelPreview();
      ++revision;
      requested = current;
      clearLabels();
      finishLocaleTransitions();
      cancelAnimations();
      gesture.distance = distance;
      const previous = panels.get(current)!;
      const next = panels.get(name)!;
      const pageHeight = document.scrollingElement?.scrollHeight ?? 0;
      const stageHeight = stage.getBoundingClientRect().height;
      const homeStyle = getComputedStyle(homeButton);
      const homeHeight =
        Math.max(
          homeButton.getBoundingClientRect().height,
          parseFloat(homeStyle.minHeight),
        ) + parseFloat(homeStyle.marginBottom);
      const homeOffset =
        (name === 'home' ? 0 : homeHeight) -
        (current === 'home' ? 0 : homeHeight);
      next.hidden = false;
      next.inert = true;
      next.setAttribute('aria-hidden', 'true');
      const stageRect = stage.getBoundingClientRect();
      next.style.position = 'fixed';
      next.style.left = `${stageRect.left}px`;
      next.style.width = `${stageRect.width}px`;
      const nextHeight = Math.max(
        next.getBoundingClientRect().height,
        parseFloat(getComputedStyle(stage).minHeight),
      );
      const scroll =
        axis === 'vertical' && direction < 0
          ? Math.max(
              0,
              pageHeight +
                nextHeight -
                stageHeight +
                homeOffset -
                window.innerHeight,
            )
          : 0;
      const top = stageRect.top + homeOffset + window.scrollY - scroll;
      next.style.top = `${top}px`;
      previous.inert = true;
      previous.style.willChange = next.style.willChange = 'transform, opacity';
      if (current === 'home') {
        homeButton.hidden = false;
        homeButton.inert = true;
        homeButton.style.position = 'fixed';
        homeButton.style.left = `${root.getBoundingClientRect().left}px`;
        homeButton.style.top = `${root.getBoundingClientRect().top + parseFloat(getComputedStyle(root).paddingTop) + window.scrollY}px`;
      }
      preview = { name, direction, axis, next, previous };
    }
    renderPreview();
    // Wheel momentum can continue onto the next section without a cooldown.
    if (complete && gesture.progress === 1) {
      const remaining = gesture.distance - direction * gesture.travel;
      commitPreview();
      if (remaining) {
        const page = document.scrollingElement;
        const room = Math.max(
          0,
          direction < 0
            ? window.scrollY
            : (page?.scrollHeight ?? 0) - window.innerHeight - window.scrollY,
        );
        const scroll = Math.min(Math.abs(remaining), room);
        window.scrollBy({ top: direction * scroll, behavior: 'instant' });
        const rest = remaining - direction * scroll;
        if (rest && sectionOrder[sectionOrder.indexOf(current) + direction])
          movePreview(rest, axis, true);
      }
    }
  };
  attachSectionGestures(root, {
    section: () => current,
    active: () => preview !== null,
    canNavigate: (direction) =>
      !!sectionOrder[sectionOrder.indexOf(current) + direction],
    progress: movePreview,
    finish: finishPreview,
    start: () => {
      if (settling !== undefined && settlingCommit) commitPreview();
      else cancelPreview();
    },
    cancel: cancelPreview,
  });
  for (const link of links)
    link.addEventListener('click', (event) => {
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey &&
        event.button === 0
      ) {
        event.preventDefault();
        navigate(link.dataset.section!);
      }
    });
  root.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-home]'))
      navigate('home');
  });

  const fromAddress = () => {
    const name = location.hash.slice(1);
    if (name === 'links' || name === 'profiles') return 'home';
    // Utility anchors such as the skip link should keep the current section.
    return panels.has(name) ? name : name ? current : 'home';
  };
  window.addEventListener('popstate', () => void show(fromAddress()));
  window.addEventListener('hashchange', () => void show(fromAddress()));
  window.addEventListener('resize', cancelPreview);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelPreview();
  });
  document.addEventListener('localechange', () => {
    void show(requested, { focus: false, animate: false });
    if (current === 'home' && requested === 'home') introduceLabels();
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      cancelPreview();
      const name = requested;
      ++revision;
      cancelAnimations();
      requested = '';
      void show(name, { focus: false, animate: false });
    }
  });
  void show(fromAddress(), { focus: false, animate: false });
  if (current === 'home') introduceLabels();
}
