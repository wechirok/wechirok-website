import assert from 'node:assert/strict';
import { test } from 'node:test';

let instance = 0;

async function browser(t, { compact = false, pointCount = 12 } = {}) {
  const window = new EventTarget();
  window.scrollY = 0;
  const document = new EventTarget();
  document.hidden = false;
  let writes = 0;
  const points = Array.from({ length: pointCount }, (_, index) => ({
    dataset: { starIndex: String(index) },
    values: {},
    setAttribute(name, value) {
      writes++;
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
      media.matches = query.includes('pointer: fine')
        ? !compact
        : query.includes('max-width') && compact;
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
  return {
    window,
    document,
    frames,
    fire,
    settle,
    queries,
    points,
    writes: () => writes,
  };
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

test('layout clamping the old page before its scroll event does not move the background again', async (t) => {
  const b = await browser(t);
  b.window.scrollY = 900;
  b.fire(b.window, 'scroll');
  b.settle();
  b.fire(b.document, 'backgroundtravel', { detail: -240 });
  const expected = b.settle();
  b.window.scrollY = 0;
  b.fire(b.document, 'backgroundscrollreset', { detail: 0 });
  b.fire(b.window, 'scroll');
  assert.deepEqual(b.settle(), expected);
  b.window.scrollY = 100;
  b.fire(b.window, 'scroll');
  assert.notDeepEqual(b.settle(), expected);
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

test('touch layout updates only 72 particles and unchanged attributes are not rewritten', async (t) => {
  const b = await browser(t, { compact: true, pointCount: 144 });
  assert.equal(
    b.points.filter((point) => point.values.cx !== undefined).length,
    72,
  );
  const initialWrites = b.writes();
  b.fire(b.document, 'backgroundtravel', { detail: 0 });
  b.settle();
  assert.equal(b.writes(), initialWrites);
  b.fire(b.document, 'backgroundtravel', { detail: 240 });
  b.settle();
  assert.ok(b.writes() > initialWrites);
  assert.equal(
    b.points.filter((point) => point.values.cx !== undefined).length,
    72,
  );
  const compact = b.queries.get('(max-width: 760px), (pointer: coarse)');
  compact.matches = false;
  compact.dispatchEvent(new Event('change'));
  b.settle();
  assert.equal(
    b.points.filter((point) => point.values.cx !== undefined).length,
    144,
  );
});
