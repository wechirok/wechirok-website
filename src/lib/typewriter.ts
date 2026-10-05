interface TypingOptions {
  duration?: number;
  maxDuration?: number;
}

export interface TypingAnimation {
  finish: () => void;
}

interface TypingStep {
  progress: number;
  reveal: () => void;
  character?: HTMLElement;
}

const active = new Map<HTMLElement, TypingAnimation>();
let motion: MediaQueryList | undefined;

export function finishAllTyping() {
  for (const animation of Array.from(active.values())) animation.finish();
}

function reducedMotion() {
  if (!motion) {
    motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    motion.addEventListener('change', () => {
      if (motion?.matches) finishAllTyping();
    });
  }
  return motion.matches;
}

function graphemes(text: string) {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(document.documentElement.lang, {
      granularity: 'grapheme',
    });
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return Array.from(text);
}

// Keep the full accessible text and its layout while revealing a visual copy.
// Restoring the original nodes leaves links, translations and handlers intact.
export function typeText(
  scope: HTMLElement,
  options: TypingOptions = {},
): TypingAnimation {
  for (const [element, animation] of Array.from(active)) {
    if (scope.contains(element) || element.contains(scope)) animation.finish();
  }

  const idle = { finish() {} };
  if (reducedMotion() || scope.closest('[hidden]')) return idle;

  const walker = document.createTreeWalker(
    scope,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );
  const nodes: Node[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  const steps: TypingStep[] = [];
  const restore: (() => void)[] = [];
  let weight = 0;
  let characterCount = 0;

  const elements = [
    scope,
    ...nodes.filter((node) => node instanceof HTMLElement),
  ];
  const underlined = elements.filter((element) =>
    getComputedStyle(element).textDecorationLine.includes('underline'),
  );
  for (const element of underlined) {
    element.classList.add('typing-underlined');
    restore.push(() => element.classList.remove('typing-underlined'));
  }
  if (scope.matches('.conversation-entry')) {
    scope.classList.add('typing-border-pending');
    restore.push(() => scope.classList.remove('typing-border-pending'));
  }

  for (const node of nodes) {
    const parent = node instanceof Element ? node : node.parentElement;
    if (
      !parent ||
      parent.closest('.visually-hidden, [hidden], script, style, template')
    )
      continue;

    if (
      node instanceof HTMLElement &&
      node.matches('.text-row, .profile-list > li')
    ) {
      node.classList.add('typing-row');
      steps.push({
        progress: weight,
        reveal: () => node.classList.add('is-revealed'),
      });
      restore.push(() => node.classList.remove('typing-row', 'is-revealed'));
    }

    if (node instanceof SVGElement && node.tagName.toLowerCase() === 'svg') {
      node.classList.add('typing-decoration');
      steps.push({
        progress: weight,
        reveal: () => node.classList.add('is-revealed'),
      });
      restore.push(() =>
        node.classList.remove('typing-decoration', 'is-revealed'),
      );
      continue;
    }
    if (parent.closest('svg')) continue;

    if (!(node instanceof Text) || !node.data.trim()) continue;
    const run = document.createElement('span');
    run.className = 'typing-run';
    const source = document.createElement('span');
    source.className = 'visually-hidden';
    source.textContent = node.data;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');

    for (const letter of graphemes(node.data)) {
      if (/^\s+$/.test(letter)) {
        visual.append(document.createTextNode(letter));
        continue;
      }
      const character = document.createElement('span');
      character.className = 'typing-character';
      character.textContent = letter;
      visual.append(character);
      steps.push({
        progress: weight,
        character,
        reveal: () => character.classList.add('is-revealed'),
      });
      weight += /[.!?…]/.test(letter) ? 4 : /[,;:]/.test(letter) ? 2 : 1;
      characterCount += 1;
    }

    run.append(source, visual);
    node.replaceWith(run);
    restore.push(() => run.replaceWith(node));
  }

  if (!steps.length) {
    for (const reset of restore) reset();
    return idle;
  }

  const duration =
    options.duration ??
    Math.min(options.maxDuration ?? 4500, Math.max(240, characterCount * 12));
  const startedAt = performance.now();
  let frame = 0;
  let nextStep = 0;
  let caret: HTMLElement | undefined;
  let finished = false;

  const animation: TypingAnimation = {
    finish() {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      caret?.classList.remove('typing-caret');
      for (const reset of restore) reset();
      scope.classList.remove('is-typewriting');
      active.delete(scope);
    },
  };
  active.set(scope, animation);
  scope.classList.add('is-typewriting');

  function tick(now: number) {
    const progress = Math.min(1, (now - startedAt) / duration) * weight;
    let current = caret;
    while (nextStep < steps.length) {
      const step = steps[nextStep];
      if (!step || step.progress > progress) break;
      step.reveal();
      if (step.character) current = step.character;
      nextStep += 1;
    }
    if (current !== caret) {
      caret?.classList.remove('typing-caret');
      current?.classList.add('typing-caret');
      caret = current;
    }
    if (now - startedAt >= duration + 160) animation.finish();
    else frame = requestAnimationFrame(tick);
  }

  frame = requestAnimationFrame(tick);
  return animation;
}
