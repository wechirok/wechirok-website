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
    let menuAnimation: Animation | undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finishMenuAnimation = () => {
      if (!menuOpen) menu.hidden = true;
      menuAnimation?.cancel();
      menuAnimation = undefined;
    };
    motion.addEventListener('change', () => {
      if (motion.matches) finishMenuAnimation();
    });
    const setMenuOpen = (open: boolean) => {
      if (menuOpen === open) return;
      const collapsed = {
        opacity: '0',
        transform: 'translateY(-6px) scale(0.98)',
      };
      const expanded = { opacity: '1', transform: 'translateY(0) scale(1)' };
      const style = getComputedStyle(menu);
      const from = menu.hidden
        ? collapsed
        : { opacity: style.opacity, transform: style.transform };
      menuAnimation?.cancel();
      menuOpen = open;
      menu.hidden = false;
      menu.inert = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (motion.matches || typeof menu.animate !== 'function') {
        finishMenuAnimation();
        return;
      }
      menuAnimation = menu.animate([from, open ? expanded : collapsed], {
        duration: open ? 200 : 160,
        easing: open ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'ease-in',
        fill: 'both',
      });
      menuAnimation.onfinish = finishMenuAnimation;
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

  const updateHeaderHeight = () => {
    document.documentElement.style.setProperty(
      '--preferences-height',
      `${preferences.getBoundingClientRect().height}px`,
    );
  };
  updateHeaderHeight();
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(updateHeaderHeight).observe(preferences);
  } else {
    window.addEventListener('resize', updateHeaderHeight);
    document.addEventListener('localechange', updateHeaderHeight);
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
