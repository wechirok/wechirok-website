import { getCopy, getLocale } from '../lib/i18n';
import { DownloadCounter } from '../lib/download-counter';
import {
  downloadEndpoint,
  DOWNLOAD_REFRESH_INTERVAL,
  downloadTotal,
  type DownloadProvider,
} from '../lib/project-downloads';

interface Counter {
  element: HTMLElement;
  provider: DownloadProvider;
  id: string;
  visible: boolean;
  total?: number;
  nextRefresh: number;
  pending: boolean;
  stale: boolean;
  number: DownloadCounter;
  exact: DownloadCounter;
}

const counters: Counter[] = Array.from(
  document.querySelectorAll<HTMLElement>('[data-download-provider]'),
).flatMap((element) => {
  const provider = element.dataset.downloadProvider;
  const id = element.dataset.downloadId;
  if ((provider !== 'modrinth' && provider !== 'curseforge') || !id) return [];
  const count = element.querySelector<HTMLElement>('[data-download-count]');
  const exact = element.parentElement?.querySelector<HTMLElement>(
    '[data-download-tooltip-count]',
  );
  if (!count || !exact) return [];
  return [
    {
      element,
      provider,
      id,
      visible: false,
      nextRefresh: 0,
      pending: false,
      stale: false,
      number: new DownloadCounter(count),
      exact: new DownloadCounter(exact),
    },
  ];
});

const queue = new Set<Counter>();
let running = false;
let lastCurseForgeRequest = 0;
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compact = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
let frame = 0;

function tick(now: number) {
  frame = 0;
  if (document.hidden) return;
  let active = false;
  for (const counter of counters) {
    if (!counter.visible) continue;
    counter.number.tick(now, motion.matches);
    counter.exact.tick(now, motion.matches);
    active ||= counter.number.active || counter.exact.active;
  }
  if (active && !motion.matches) frame = requestAnimationFrame(tick);
}

function animate() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
}

function alignTooltip(counter: Counter) {
  const button = counter.element.parentElement;
  const tooltip = button?.querySelector<HTMLElement>('.tooltip-label');
  if (!button || !tooltip || !button.getClientRects().length) return;
  const left = button.getBoundingClientRect().left;
  const viewport = document.documentElement.clientWidth;
  const offset = Math.max(
    18 - left,
    Math.min(0, viewport - 18 - left - tooltip.offsetWidth),
  );
  button.style.setProperty('--download-tooltip-offset', `${offset}px`);
}

function render(counter: Counter, useMotion = false) {
  const now = performance.now();
  const copy = getCopy().projectActions;
  const loading = counter.total === undefined && !counter.stale;
  counter.element.setAttribute('aria-busy', String(loading));
  if (loading) {
    counter.number.loading(now);
    counter.exact.loading(now);
  }
  const locale = getLocale();
  const exact =
    counter.total === undefined
      ? copy.unavailable
      : new Intl.NumberFormat(locale).format(counter.total);
  if (!loading) {
    const animated = useMotion && counter.visible && !motion.matches;
    counter.number.settle(
      counter.total === undefined ? '—' : compact.format(counter.total),
      now,
      animated,
    );
    counter.exact.settle(exact, now, animated);
  }
  const description = `${copy.downloads}: ${exact}${counter.stale ? ` · ${copy.lastAvailable}` : ''}`;
  const label = counter.element.querySelector('[data-download-label]');
  if (label)
    label.textContent = loading
      ? copy.loading
      : counter.total === undefined
        ? `${copy.downloads}: ${copy.unavailable}`
        : description;
  const status = counter.element.parentElement?.querySelector<HTMLElement>(
    '[data-download-tooltip-status]',
  );
  if (status) {
    status.textContent = copy.lastAvailable;
    status.hidden = !counter.stale || counter.total === undefined;
  }
  alignTooltip(counter);
  animate();
}

async function load(counter: Counter) {
  if (counter.total === undefined && counter.stale) {
    counter.stale = false;
    render(counter);
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(
      downloadEndpoint(counter.provider, counter.id),
      {
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      },
    );
    if (!response.ok || response.status === 202)
      throw new Error('Statistics unavailable');
    counter.total = downloadTotal(
      counter.provider,
      counter.id,
      await response.json(),
    );
    counter.stale = false;
    counter.nextRefresh = Date.now() + DOWNLOAD_REFRESH_INTERVAL;
  } catch {
    // Preserve the last successful total, or show unavailable instead of a fake zero.
    counter.stale = true;
    counter.nextRefresh = Date.now() + 60_000;
  } finally {
    window.clearTimeout(timeout);
    counter.pending = false;
    render(counter, true);
  }
}

async function drain() {
  if (running) return;
  running = true;
  try {
    for (const counter of queue) {
      queue.delete(counter);
      if (document.hidden || !counter.visible) {
        counter.pending = false;
        continue;
      }
      if (counter.provider === 'curseforge') {
        // Respect CFWidget's request guidance, including on fast connections.
        const delay = Math.max(0, 500 - (Date.now() - lastCurseForgeRequest));
        if (delay)
          await new Promise((resolve) => window.setTimeout(resolve, delay));
        lastCurseForgeRequest = Date.now();
      }
      await load(counter);
    }
  } finally {
    running = false;
  }
}

function refresh() {
  if (document.hidden) return;
  for (const counter of counters) {
    if (
      counter.visible &&
      !counter.pending &&
      Date.now() >= counter.nextRefresh
    ) {
      counter.pending = true;
      queue.add(counter);
    }
  }
  void drain();
}

if (counters.length) {
  counters.forEach((counter) => render(counter));
  // Animate only counters in view, including those waiting in the request queue.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const counter = counters.find(
        (item) => item.element.parentElement === entry.target,
      );
      if (counter) counter.visible = entry.isIntersecting;
    }
    counters.forEach(alignTooltip);
    refresh();
    animate();
  });
  for (const counter of counters) {
    const button = counter.element.parentElement;
    if (button) {
      observer.observe(button);
      button.addEventListener('pointerenter', () => alignTooltip(counter));
      button.addEventListener('focusin', () => alignTooltip(counter));
    }
  }
  window.addEventListener('resize', () => {
    counters.forEach(alignTooltip);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      refresh();
      animate();
    }
  });
  motion.addEventListener('change', animate);
  document.addEventListener('localechange', () =>
    counters.forEach((counter) => render(counter)),
  );
  window.setInterval(refresh, 60_000);
}
