import * as en from '../data/en';
import * as de from '../data/de';
import * as uk from '../data/uk';
import * as ru from '../data/ru';
import {
  captureLocaleText,
  finishLocaleTransitions,
  transitionLocaleText,
} from './locale-transition';

export const locales = ['en', 'de', 'uk', 'ru'] as const;
export type Locale = (typeof locales)[number];

type CopyShape<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly CopyShape<Item>[]
    : { [Key in keyof T]: CopyShape<T[Key]> };

const translations = { en, de, uk, ru } satisfies Record<
  Locale,
  CopyShape<typeof en>
>;

export function isLocale(value: unknown): value is Locale {
  return locales.some((locale) => locale === value);
}

export function getLocale(): Locale {
  const language = document.documentElement.lang;
  return isLocale(language) ? language : 'en';
}

export function getCopy() {
  return translations[getLocale()];
}

function flatten(
  value: unknown,
  prefix = '',
  result = new Map<string, string>(),
) {
  if (typeof value === 'string') result.set(prefix, value);
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, result);
    }
  }
  return result;
}

const dictionaries = {
  en: flatten(en),
  de: flatten(de),
  uk: flatten(uk),
  ru: flatten(ru),
};

export function localize(scope: ParentNode = document) {
  const dictionary = dictionaries[getLocale()];
  const attributes = ['aria-label', 'placeholder', 'title'] as const;
  const selector = [
    '[data-i18n]',
    ...attributes.map((attribute) => `[data-i18n-${attribute}]`),
  ].join(',');
  const elements = Array.from(scope.querySelectorAll<HTMLElement>(selector));
  if (scope instanceof HTMLElement && scope.matches(selector)) {
    elements.unshift(scope);
  }

  for (const element of elements) {
    const key = element.dataset.i18n;
    if (key) {
      const text = dictionary.get(key) ?? dictionaries.en.get(key);
      if (text !== undefined) element.textContent = text;
    }
    for (const attribute of attributes) {
      const key = element.getAttribute(`data-i18n-${attribute}`);
      if (!key) continue;
      const text = dictionary.get(key) ?? dictionaries.en.get(key);
      if (text !== undefined) element.setAttribute(attribute, text);
    }
  }
}

export function setLocale(locale: Locale, options: { animate?: boolean } = {}) {
  finishLocaleTransitions();
  if (options.animate && locale === getLocale()) return;
  const snapshots = options.animate ? captureLocaleText() : [];
  document.documentElement.lang = locale;
  localize();

  const copy = getCopy();
  const page = document.documentElement.dataset.page;
  const section =
    page && page in copy.sections
      ? copy.sections[page as keyof typeof copy.sections]
      : page === 'notFound'
        ? copy.notFound
        : undefined;
  const title = section
    ? `${section.title} — ${copy.site.name}`
    : copy.site.title;
  const description = section?.description ?? copy.site.description;
  document.title = title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', description);
  document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute('content', title);
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute('content', description);

  for (const button of document.querySelectorAll<HTMLButtonElement>(
    '[data-locale]',
  )) {
    button.setAttribute(
      'aria-checked',
      String(button.dataset.locale === locale),
    );
  }
  document.dispatchEvent(new Event('localechange'));
  if (snapshots.length) transitionLocaleText(snapshots);
}
