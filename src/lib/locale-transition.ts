interface TextSnapshot {
  element: HTMLElement;
  text: string;
}

const active = new Set<() => void>();
const excluded =
  '.visually-hidden, [hidden], [data-language-picker], .navigation-label';
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

function readText({ element }: TextSnapshot) {
  return element.textContent ?? '';
}

function writeText({ element }: TextSnapshot, text: string) {
  element.textContent = text;
}

export function captureLocaleText(): TextSnapshot[] {
  if (reducedMotion() || typeof Element.prototype.animate !== 'function')
    return [];

  const snapshots: TextSnapshot[] = [];
  for (const element of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    if (element.closest(excluded)) continue;

    const snapshot: TextSnapshot = {
      element,
      text: '',
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
      element.closest(excluded) ||
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
      active.delete(finish);
    };
    active.add(finish);

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
