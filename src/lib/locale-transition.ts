interface TextSnapshot {
  element: HTMLElement;
  text: string;
  attribute?: 'placeholder';
}

const active = new Set<() => void>();
const excluded = '.visually-hidden, [hidden], [data-language-picker]';
let motion: MediaQueryList | undefined;

export function finishLocaleTransitions() {
  for (const finish of Array.from(active)) finish();
}

function reducedMotion() {
  if (!motion) {
    motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    motion.addEventListener('change', () => {
      if (motion?.matches) finishLocaleTransitions();
    });
  }
  return motion.matches;
}

function readText({ element, attribute }: TextSnapshot) {
  return attribute
    ? (element.getAttribute(attribute) ?? '')
    : (element.textContent ?? '');
}

function writeText({ element, attribute }: TextSnapshot, text: string) {
  if (attribute) element.setAttribute(attribute, text);
  else element.textContent = text;
}

export function captureLocaleText(): TextSnapshot[] {
  if (reducedMotion() || typeof Element.prototype.animate !== 'function')
    return [];

  const snapshots: TextSnapshot[] = [];
  for (const element of document.querySelectorAll<HTMLElement>(
    '[data-i18n], [data-unknown-command], [data-i18n-placeholder]',
  )) {
    if (
      element.closest(excluded) ||
      (element instanceof HTMLInputElement && element.value)
    )
      continue;

    const snapshot: TextSnapshot = {
      element,
      text: '',
      attribute: element.hasAttribute('data-i18n-placeholder')
        ? 'placeholder'
        : undefined,
    };
    snapshot.text = readText(snapshot);
    snapshots.push(snapshot);
  }
  return snapshots;
}

export function transitionLocaleText(snapshots: TextSnapshot[]) {
  if (reducedMotion()) return;

  for (const snapshot of snapshots) {
    const { element } = snapshot;
    const translated = readText(snapshot);
    if (
      !element.isConnected ||
      element.closest(`${excluded}, .is-typewriting`) ||
      snapshot.text.trim() === translated.trim()
    )
      continue;

    // Locale and metadata update immediately; only the visual text fades.
    writeText(snapshot, snapshot.text);
    let animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 110,
      easing: 'ease-out',
      fill: 'forwards',
    });
    const finish = () => {
      animation.onfinish = null;
      animation.cancel();
      writeText(snapshot, translated);
      element.removeEventListener('input', finish);
      active.delete(finish);
    };
    active.add(finish);
    if (snapshot.attribute) element.addEventListener('input', finish);

    animation.onfinish = () => {
      writeText(snapshot, translated);
      animation.onfinish = null;
      animation.cancel();
      animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 170,
        easing: 'ease-out',
      });
      animation.onfinish = finish;
    };
  }
}
