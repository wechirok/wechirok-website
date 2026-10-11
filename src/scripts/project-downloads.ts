import { getCopy, getLocale } from '../lib/i18n';
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
}

const counters: Counter[] = Array.from(
  document.querySelectorAll<HTMLElement>('[data-download-provider]'),
).flatMap((element) => {
  const provider = element.dataset.downloadProvider;
  const id = element.dataset.downloadId;
  if ((provider !== 'modrinth' && provider !== 'curseforge') || !id) return [];
  return [
    {
      element,
      provider,
      id,
      visible: false,
      nextRefresh: 0,
      pending: false,
      stale: false,
    },
  ];
});

const queue = new Set<Counter>();
let running = false;
let lastCurseForgeRequest = 0;

function render(counter: Counter) {
  if (counter.total === undefined) return;
  const locale = getLocale();
  const count = counter.element.querySelector('[data-download-count]');
  if (count) {
    count.textContent = new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(counter.total);
  }
  const copy = getCopy().projectActions;
  const exact = new Intl.NumberFormat(locale).format(counter.total);
  counter.element.title = `${copy.downloads}: ${exact}${counter.stale ? ` · ${copy.lastAvailable}` : ''}`;
  const label = counter.element.querySelector('[data-download-label]');
  if (label) label.textContent = counter.element.title;
  counter.element.hidden = false;
}

async function load(counter: Counter) {
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
    // Keep the last successful count, or leave the badge hidden without inventing zero.
    counter.stale = true;
    counter.nextRefresh = Date.now() + 60_000;
  } finally {
    window.clearTimeout(timeout);
    counter.pending = false;
    render(counter);
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
  // Observe the button, since its initially hidden badge has no layout box.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const counter = counters.find(
        (item) => item.element.parentElement === entry.target,
      );
      if (counter) counter.visible = entry.isIntersecting;
    }
    refresh();
  });
  for (const counter of counters) {
    if (counter.element.parentElement)
      observer.observe(counter.element.parentElement);
  }
  document.addEventListener('visibilitychange', refresh);
  document.addEventListener('localechange', () => counters.forEach(render));
  window.setInterval(refresh, 60_000);
}
