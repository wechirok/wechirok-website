import assert from 'node:assert/strict';
import { test } from 'node:test';

let instance = 0;

async function browser(t) {
  const window = new EventTarget();
  window.scrollY = 0;
  const document = new EventTarget();
  document.hidden = false;
  const points = Array.from({ length: 12 }, (_, index) => ({
    dataset: { starIndex: String(index) },
    values: {},
    setAttribute(name, value) {
      this.values[name] = value;
    },
  }));
  const svg = { clientWidth: 1200, clientHeight: 800 };
  const field = {
    querySelector: () => svg,
    querySelectorAll: () => points,
    toggleAttribute() {},
  };
  document.querySelector = () => field;
  const frames = new Map();
  let id = 0;
  let time = 0;
  const queries = new Map();
  for (const [key, value] of Object.entries({
    window,
    document,
    matchMedia(query) {
      const media = new EventTarget();
      media.matches = query.includes('pointer: fine');
      queries.set(query, media);
      return media;
    },
    requestAnimationFrame(callback) {
      frames.set(++id, callback);
      return id;
    },
    cancelAnimationFrame(id) {
      frames.delete(id);
    },
    ResizeObserver: class {
      observe() {}
    },
  })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() =>
      original
        ? Object.defineProperty(globalThis, key, original)
        : delete globalThis[key],
    );
  }
  const fire = (target, type, fields = {}) => {
    const event = new Event(type);
    for (const [key, value] of Object.entries(fields))
      Object.defineProperty(event, key, { value });
    target.dispatchEvent(event);
  };
  const settle = () => {
    let count = 0;
    while (frames.size && count++ < 600) {
      const pending = [...frames.values()];
      frames.clear();
      time += 1000 / 60;
      pending.forEach((callback) => callback(time));
    }
    assert.equal(
      frames.size,
      0,
      'background must settle rather than keep scheduling frames',
    );
    return points.map((point) => ({ ...point.values }));
  };
  await import(`../src/scripts/starfield.ts?events=${++instance}`);
  settle();
  return { window, document, frames, fire, settle, queries };
}

test('section controls use the identical forward and reverse background motion as the wheel', async (t) => {
  const b = await browser(t);
  b.fire(b.window, 'wheel', {
    deltaY: 240,
    deltaX: 0,
    deltaMode: 0,
    ctrlKey: false,
  });
  const wheelForward = b.settle();
  b.fire(b.window, 'wheel', {
    deltaY: -240,
    deltaX: 0,
    deltaMode: 0,
    ctrlKey: false,
  });
  const wheelBackward = b.settle();
  b.fire(b.document, 'backgroundtravel', { detail: 240 });
  assert.deepEqual(b.settle(), wheelForward);
  b.fire(b.document, 'backgroundtravel', { detail: -240 });
  assert.deepEqual(b.settle(), wheelBackward);
});

test('navigation scroll reset cannot reverse or double the requested background movement', async (t) => {
  const b = await browser(t);
  b.window.scrollY = 900;
  b.fire(b.document, 'backgroundtravel', { detail: -240 });
  const expected = b.settle();
  b.fire(b.document, 'backgroundscrollreset', { detail: 0 });
  b.window.scrollY = 0;
  b.fire(b.window, 'scroll');
  assert.deepEqual(b.settle(), expected);
});

test('section controls respect reduced motion and hidden documents', async (t) => {
  const b = await browser(t);
  const initial = b.settle();
  const media = b.queries.get('(prefers-reduced-motion: reduce)');
  media.matches = true;
  media.dispatchEvent(new Event('change'));
  b.fire(b.document, 'backgroundtravel', { detail: 240 });
  assert.deepEqual(b.settle(), initial);
  media.matches = false;
  media.dispatchEvent(new Event('change'));
  b.settle();
  b.document.hidden = true;
  b.fire(b.document, 'visibilitychange');
  b.fire(b.document, 'backgroundtravel', { detail: 240 });
  assert.equal(b.frames.size, 0);
});
