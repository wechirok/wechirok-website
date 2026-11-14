import { getLocale, isLocale, setLocale } from '../lib/i18n';

function readPreference(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function rememberPreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Switching still works when browser storage is unavailable.
  }
}

function setTheme(theme: 'dark' | 'light') {
  document.documentElement.dataset.theme = theme;
  const favicon = document.querySelector<HTMLLinkElement>(
    '[data-theme-favicon]',
  );
  const iconUrl =
    theme === 'light' ? favicon?.dataset.iconLight : favicon?.dataset.iconDark;
  if (favicon && iconUrl) favicon.href = iconUrl;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#50505c' : '#eeeef3');
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute('content', theme);
  for (const button of document.querySelectorAll<HTMLButtonElement>(
    '[data-theme-choice]',
  )) {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.themeChoice === theme),
    );
  }
}

const preferences = document.querySelector<HTMLElement>('[data-preferences]');
if (preferences) {
  const language = readPreference('wechirok.language');
  setLocale(isLocale(language) ? language : 'en');
  setTheme(readPreference('wechirok.theme') === 'light' ? 'light' : 'dark');
  preferences.hidden = false;
  preferences.closest('header')?.removeAttribute('hidden');

  let closeLanguageMenu: ((restoreFocus?: boolean) => void) | undefined;
  const picker = preferences.querySelector<HTMLElement>(
    '[data-language-picker]',
  );
  const toggle = preferences.querySelector<HTMLButtonElement>(
    '[data-language-toggle]',
  );
  const menu = preferences.querySelector<HTMLElement>('[data-language-menu]');
  if (picker && toggle && menu) {
    const items = Array.from(
      menu.querySelectorAll<HTMLButtonElement>('[data-locale]'),
    );
    let menuOpen = false;
    let menuAnimations: Animation[] = [];
    const fadeTargets = Array.from(
      menu.querySelectorAll<HTMLElement>(
        ':scope > .glass-surface, :scope > button',
      ),
    );
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finishMenuAnimation = () => {
      if (!menuOpen) menu.hidden = true;
      for (const animation of menuAnimations) animation.cancel();
      menuAnimations = [];
    };
    motion.addEventListener('change', () => {
      if (motion.matches) finishMenuAnimation();
    });
    const setMenuOpen = (open: boolean) => {
      if (menuOpen === open) return;
      const collapsed = {
        transform: 'translateY(-6px) scale(0.98)',
      };
      const expanded = { transform: 'translateY(0) scale(1)' };
      const style = getComputedStyle(menu);
      const from = menu.hidden ? collapsed : { transform: style.transform };
      const fadeFrom = fadeTargets.map((target) =>
        menu.hidden ? '0' : getComputedStyle(target).opacity,
      );
      for (const animation of menuAnimations) animation.cancel();
      menuAnimations = [];
      menuOpen = open;
      menu.hidden = false;
      menu.inert = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (motion.matches || typeof menu.animate !== 'function') {
        finishMenuAnimation();
        return;
      }
      const timing: KeyframeAnimationOptions = {
        duration: open ? 200 : 160,
        easing: open ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'ease-in',
        fill: 'both',
      };
      const movement = menu.animate(
        [from, open ? expanded : collapsed],
        timing,
      );
      menuAnimations = [
        movement,
        ...fadeTargets.map((target, index) =>
          target.animate(
            [{ opacity: fadeFrom[index] }, { opacity: open ? '1' : '0' }],
            timing,
          ),
        ),
      ];
      movement.onfinish = finishMenuAnimation;
    };

    const openMenu = (
      index = items.findIndex((item) => item.dataset.locale === getLocale()),
    ) => {
      setMenuOpen(true);
      items[Math.max(0, index)]?.focus({ preventScroll: true });
    };
    closeLanguageMenu = (restoreFocus = false) => {
      setMenuOpen(false);
      if (restoreFocus) toggle.focus({ preventScroll: true });
    };

    toggle.addEventListener('click', () => {
      if (!menuOpen) openMenu();
      else closeLanguageMenu?.();
    });
    picker.addEventListener('keydown', (event) => {
      if (
        event.target === toggle &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp')
      ) {
        event.preventDefault();
        openMenu(event.key === 'ArrowDown' ? 0 : items.length - 1);
        return;
      }
      if (!menuOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeLanguageMenu?.(true);
      } else if (event.key === 'Tab') {
        closeLanguageMenu?.(true);
      } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const current = items.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : (current +
                  (event.key === 'ArrowDown' ? 1 : -1) +
                  items.length) %
                items.length;
        items[next]?.focus({ preventScroll: true });
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (event.target instanceof Node && !picker.contains(event.target))
        closeLanguageMenu?.();
    });
    picker.addEventListener('focusout', (event) => {
      if (
        !(event.relatedTarget instanceof Node) ||
        !picker.contains(event.relatedTarget)
      )
        closeLanguageMenu?.();
    });
  }

  preferences.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('button');
    if (!button) return;
    const locale = button.dataset.locale;
    if (isLocale(locale)) {
      setLocale(locale, { animate: true });
      rememberPreference('wechirok.language', locale);
      closeLanguageMenu?.(true);
    }
    const theme = button.dataset.themeChoice;
    if (theme === 'dark' || theme === 'light') {
      setTheme(theme);
      rememberPreference('wechirok.theme', theme);
    }
  });
}
