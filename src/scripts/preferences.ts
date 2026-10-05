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
    const updateLanguageIndicator = () => {
      for (const mark of toggle.querySelectorAll<HTMLElement>(
        '[data-current-language]',
      )) {
        mark.hidden = mark.dataset.currentLanguage !== getLocale();
      }
    };
    updateLanguageIndicator();
    document.addEventListener('localechange', updateLanguageIndicator);

    const openMenu = (
      index = items.findIndex((item) => item.dataset.locale === getLocale()),
    ) => {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      items[Math.max(0, index)]?.focus({ preventScroll: true });
    };
    closeLanguageMenu = (restoreFocus = false) => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) toggle.focus({ preventScroll: true });
    };

    toggle.addEventListener('click', () => {
      if (menu.hidden) openMenu();
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
      if (menu.hidden) return;
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
