import { finishLocaleTransitions } from '../lib/locale-transition';
import { attachSectionGestures } from '../lib/section-gestures';

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

  const animate = (
    element: HTMLElement,
    frames: Keyframe[],
    options: KeyframeAnimationOptions,
  ) => {
    const animation = element.animate(frames, options);
    animations.add(animation);
    return animation;
  };
  const finishAnimations = (active: Animation[]) => {
    for (const animation of active) {
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
    const outgoing: Animation[] = [];

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
      outgoing.push(animate(previous, exitFrames, exitOptions));
      if (name === 'home' && !homeButton.hidden) {
        homeButton.inert = true;
        outgoing.push(animate(homeButton, exitFrames, exitOptions));
      }
      // Keep the final exit frame until the old panel is hidden.
      await Promise.allSettled(outgoing.map((animation) => animation.finished));
      if (ticket !== revision) return;
    }

    const enteringHomeButton = homeButton.hidden && name !== 'home';
    homeButton.hidden = name === 'home';
    homeButton.inert = false;
    previous.hidden = true;
    previous.inert = false;
    next.hidden = false;
    current = name;
    const scrollTop =
      focus && scroll === 'bottom'
        ? Math.max(
            0,
            (document.scrollingElement?.scrollHeight ?? 0) - window.innerHeight,
          )
        : 0;
    const incoming: Animation[] = [];
    if (animated) {
      const entryFrames = [
        { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
      ];
      const entryOptions = {
        duration: 340,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      } as const;
      // Apply the first entry frame before focus or scrolling can force layout.
      incoming.push(animate(next, entryFrames, entryOptions));
      if (enteringHomeButton)
        incoming.push(animate(homeButton, entryFrames, entryOptions));
    }
    finishAnimations(outgoing);
    for (const link of links) {
      if (link.dataset.section === name)
        link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    if (focus) {
      next.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
      window.scrollTo({
        top: scrollTop,
        // Position the page before its entrance, so scrolling cannot reveal it in slices.
        behavior: 'instant',
      });
    }
    const activeLink = links.find((link) => link.dataset.section === name);
    if (activeLink) highlightEntry(activeLink);

    await Promise.allSettled(incoming.map((animation) => animation.finished));
    finishAnimations(incoming);
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
  attachSectionGestures(root, {
    section: () => current,
    busy: () => requested !== current || animations.size > 0,
    canNavigate: (direction) =>
      !!sectionOrder[sectionOrder.indexOf(current) + direction],
    navigate: (direction, axis) => {
      const name = sectionOrder[sectionOrder.indexOf(current) + direction];
      if (!name) return;
      navigate(name, {
        scroll: axis === 'vertical' && direction < 0 ? 'bottom' : 'top',
      });
    },
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
  document.addEventListener('localechange', () => {
    void show(requested, { focus: false, animate: false });
    if (current === 'home' && requested === 'home') introduceLabels();
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
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
