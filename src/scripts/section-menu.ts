export {};

const navigation = document.querySelector<HTMLElement>(
  '[data-section-navigation]',
);
const toggle = navigation?.querySelector<HTMLButtonElement>(
  '[data-navigation-toggle]',
);
const links = navigation?.querySelector<HTMLElement>('[data-navigation-links]');

if (navigation && toggle && links) {
  const compact = window.matchMedia('(max-width: 760px)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let open = false;
  let animations: Animation[] = [];
  const fadeTargets = Array.from(
    links.querySelectorAll<HTMLElement>(':scope > .glass-surface, :scope > a'),
  );

  const finishAnimation = () => {
    links.hidden = compact.matches && !open;
    for (const animation of animations) animation.cancel();
    animations = [];
  };

  const setOpen = (next: boolean, restoreFocus = false) => {
    if (!compact.matches || next === open) return;
    const collapsed = {
      transform: 'translateY(-8px) scale(0.98)',
    };
    const expanded = { transform: 'translateY(0) scale(1)' };
    const style = getComputedStyle(links);
    const from = links.hidden ? collapsed : { transform: style.transform };
    const fadeFrom = fadeTargets.map((target) =>
      links.hidden ? '0' : getComputedStyle(target).opacity,
    );
    for (const animation of animations) animation.cancel();
    animations = [];
    open = next;
    links.hidden = false;
    links.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (restoreFocus) toggle.focus({ preventScroll: true });

    if (motion.matches || typeof links.animate !== 'function') {
      finishAnimation();
      return;
    }
    const timing: KeyframeAnimationOptions = {
      duration: open ? 220 : 170,
      easing: open ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'ease-in',
      fill: 'both',
    };
    // Opacity on the container creates a backdrop root and cuts off its child's blur.
    const movement = links.animate([from, open ? expanded : collapsed], timing);
    animations = [
      movement,
      ...fadeTargets.map((target, index) =>
        target.animate(
          [{ opacity: fadeFrom[index] }, { opacity: open ? '1' : '0' }],
          timing,
        ),
      ),
    ];
    movement.onfinish = finishAnimation;
  };

  const updateLayout = () => {
    const focusInLinks = links.contains(document.activeElement);
    const focusOnToggle = document.activeElement === toggle;
    open = false;
    toggle.setAttribute('aria-expanded', 'false');
    links.inert = compact.matches;
    finishAnimation();
    if (compact.matches && focusInLinks) toggle.focus({ preventScroll: true });
    if (!compact.matches && focusOnToggle) {
      const destination =
        links.querySelector<HTMLAnchorElement>('[aria-current="page"]') ??
        links.querySelector<HTMLAnchorElement>('a');
      destination?.focus({ preventScroll: true });
    }
  };

  navigation.setAttribute('data-navigation-ready', '');
  updateLayout();
  compact.addEventListener('change', updateLayout);
  motion.addEventListener('change', () => {
    if (motion.matches) finishAnimation();
  });
  toggle.addEventListener('click', () => setOpen(!open));

  navigation.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false, true);
    }
    if (
      compact.matches &&
      event.target === toggle &&
      (event.key === 'ArrowDown' || event.key === 'ArrowUp')
    ) {
      event.preventDefault();
      setOpen(true);
      const destinations = links.querySelectorAll<HTMLAnchorElement>('a');
      const index = event.key === 'ArrowDown' ? 0 : destinations.length - 1;
      destinations[index]?.focus({ preventScroll: true });
    }
  });

  links.addEventListener('click', (event) => {
    if (
      event.button === 0 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey &&
      event.target instanceof Element &&
      event.target.closest('a')
    )
      setOpen(false, true);
  });
  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Node && !navigation.contains(event.target))
      setOpen(false);
  });
  navigation.addEventListener('focusout', (event) => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !navigation.contains(event.relatedTarget)
    )
      setOpen(false);
  });
}
