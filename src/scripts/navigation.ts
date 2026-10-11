import { finishLocaleTransitions } from '../lib/locale-transition';
import { attachSectionGestures } from '../lib/section-gestures';

interface TransitionOptions {
  focus?: boolean;
  animate?: boolean;
  scroll?: 'top' | 'bottom';
  instantScroll?: boolean;
}

const root = document.querySelector<HTMLElement>('[data-personal-space]');
const stage = root?.querySelector<HTMLElement>('[data-space-stage]');

if (root && stage) {
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
    for (const link of links) link.removeAttribute('data-label-visible');
  };
  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      labelTimers.delete(timer);
      callback();
    }, delay);
    labelTimers.add(timer);
  };
  const revealLabel = (link: HTMLAnchorElement, duration = 1600) => {
    clearLabels();
    link.setAttribute('data-label-visible', '');
    later(() => link.removeAttribute('data-label-visible'), duration);
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
    if (
      event.target instanceof Element &&
      event.target.closest('[data-preferences], [data-home]')
    )
      clearLabels();
  });
  let current = 'home';
  let requested = current;
  let revision = 0;
  const animations = new Set<Animation>();

  const cancelAnimations = () => {
    for (const animation of animations) animation.cancel();
    animations.clear();
    stage.style.height = '';
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
      instantScroll = false,
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
    const height = stage.getBoundingClientRect().height;
    const animated =
      useMotion && !motion.matches && typeof stage.animate === 'function';

    if (animated) {
      stage.style.height = `${height}px`;
      previous.inert = true;
      await animate(
        previous,
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-6px)' },
        ],
        { duration: 130, easing: 'ease-in', fill: 'forwards' },
      );
      if (ticket !== revision) return;
    }

    previous.hidden = true;
    previous.inert = false;
    next.hidden = false;
    current = name;
    for (const link of links) {
      if (link.dataset.section === name)
        link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    stage.style.height = '';
    const nextHeight = stage.getBoundingClientRect().height;
    if (focus) {
      next.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
      window.scrollTo({
        top:
          scroll === 'bottom'
            ? (document.scrollingElement?.scrollHeight ?? 0)
            : 0,
        behavior: instantScroll || motion.matches ? 'instant' : 'smooth',
      });
    }
    const activeLink = links.find((link) => link.dataset.section === name);
    if (activeLink) revealLabel(activeLink);

    if (animated) {
      await Promise.all([
        // Resizing the document would clamp the scroll position at its bottom.
        scroll === 'bottom'
          ? Promise.resolve()
          : animate(
              stage,
              [{ height: `${height}px` }, { height: `${nextHeight}px` }],
              { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
            ),
        animate(
          next,
          [
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        ),
      ]);
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
        instantScroll: true,
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
