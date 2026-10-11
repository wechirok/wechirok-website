import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  attachSectionGestures,
  swipeIntent,
  WheelGesture,
  wheelPixels,
} from '../src/lib/section-gestures.ts';

test('one wheel gesture switches once, including its momentum and reversal', () => {
  const wheel = new WheelGesture();
  assert.equal(wheel.update(45, 0, true).direction, null);
  assert.equal(wheel.update(50, 30, true).direction, 1);
  for (const [delta, time] of [
    [120, 60],
    [80, 120],
    [-110, 180],
  ]) {
    assert.deepEqual(wheel.update(delta, time, true), {
      consume: true,
      direction: null,
    });
  }
  assert.equal(wheel.update(-100, 500, true).direction, -1);
});

test('reaching the bottom while scrolling requires a fresh gesture', () => {
  const wheel = new WheelGesture();
  assert.equal(wheel.update(120, 0, false).consume, false);
  assert.equal(wheel.update(120, 100, true).consume, false);
  assert.equal(wheel.update(100, 500, true).direction, 1);
});

test('reversing before the threshold discards accumulated movement', () => {
  const wheel = new WheelGesture();
  wheel.update(80, 0, true);
  assert.equal(wheel.update(-30, 30, true).direction, null);
  assert.equal(wheel.update(-60, 60, true).direction, -1);
});

test('a transition consumes wheel momentum until the next gesture', () => {
  const wheel = new WheelGesture();
  assert.equal(wheel.update(100, 0, true, true).direction, null);
  assert.equal(wheel.update(100, 100, true, false).direction, null);
  assert.equal(wheel.update(100, 500, true, false).direction, 1);
});

test('the first and last sections keep ordinary scrolling', () => {
  const wheel = new WheelGesture();
  assert.deepEqual(wheel.update(-200, 0, false), {
    consume: false,
    direction: null,
  });
  assert.deepEqual(wheel.update(0, 50, true), {
    consume: false,
    direction: null,
  });
});

test('wheel units and dominant swipe axes are normalized', () => {
  assert.equal(wheelPixels(4, 0, 24, 800), 4);
  assert.equal(wheelPixels(4, 1, 24, 800), 96);
  assert.equal(wheelPixels(1, 2, 24, 800), 800);
  assert.deepEqual(swipeIntent(-100, 10, 72), {
    direction: 1,
    axis: 'horizontal',
  });
  assert.deepEqual(swipeIntent(100, 10, 72), {
    direction: -1,
    axis: 'horizontal',
  });
  assert.deepEqual(swipeIntent(10, -100, 72), {
    direction: 1,
    axis: 'vertical',
  });
  assert.deepEqual(swipeIntent(10, 100, 72), {
    direction: -1,
    axis: 'vertical',
  });
  assert.equal(swipeIntent(70, 0, 72), null);
  assert.equal(swipeIntent(100, 100, 72), null);
});

// Exercise the event adapter with browser-shaped event targets, without a DOM dependency.
function browser(t) {
  class Surface {
    listeners = new Map();
    parentElement = null;
    scrollHeight = 0;
    clientHeight = 0;
    scrollWidth = 0;
    clientWidth = 0;
    blocked = false;
    overflowY = 'visible';
    closest() {
      return this.blocked ? this : null;
    }
    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    }
    emit(type, properties) {
      const event = {
        target: this,
        cancelable: true,
        defaultPrevented: false,
        preventDefault() {
          this.defaultPrevented = true;
        },
        ...properties,
      };
      this.listeners.get(type)?.(event);
      return event;
    }
  }
  const root = new Surface();
  const viewport = new Surface();
  const page = { scrollTop: 0, scrollHeight: 2000 };
  let section = 'about';
  let busy = false;
  let menu = false;
  let selection = false;
  const moves = [];
  viewport.innerHeight = 800;
  viewport.innerWidth = 390;
  viewport.getSelection = () => ({ isCollapsed: !selection });
  for (const [name, value] of Object.entries({
    Element: Surface,
    window: viewport,
    document: {
      scrollingElement: page,
      body: new Surface(),
      querySelector: () => (menu ? {} : null),
    },
    getComputedStyle: (element) => ({
      overflowX: 'visible',
      overflowY: element.overflowY,
      lineHeight: '24px',
    }),
  })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, value });
    t.after(() =>
      original
        ? Object.defineProperty(globalThis, name, original)
        : delete globalThis[name],
    );
  }
  attachSectionGestures(root, {
    section: () => section,
    busy: () => busy,
    canNavigate: () => true,
    navigate: (direction, axis) => moves.push({ direction, axis }),
  });
  const point = (x, y, identifier = 1) => ({
    clientX: x,
    clientY: y,
    identifier,
  });
  const start = (x = 200, y = 300) =>
    root.emit('touchstart', { touches: [point(x, y)] });
  const move = (x, y, properties = {}) =>
    root.emit('touchmove', { touches: [point(x, y)], ...properties });
  const end = (x, y) =>
    root.emit('touchend', { touches: [], changedTouches: [point(x, y)] });
  return {
    root,
    viewport,
    page,
    moves,
    point,
    start,
    move,
    end,
    busy: () => {
      busy = true;
    },
    change: () => {
      section = 'work';
    },
    menu: () => {
      menu = true;
    },
    select: () => {
      selection = true;
    },
  };
}

test('horizontal swipes navigate from the middle of a long page', (t) => {
  const b = browser(t);
  b.page.scrollTop = 400;
  b.start();
  assert.equal(b.move(190, 301).defaultPrevented, true);
  b.end(80, 310);
  assert.deepEqual(b.moves, [{ direction: 1, axis: 'horizontal' }]);
});

test('vertical swipes inside content remain native even when they reach the bottom', (t) => {
  const b = browser(t);
  b.page.scrollTop = 400;
  b.start();
  assert.equal(b.move(200, 290).defaultPrevented, false);
  b.page.scrollTop = 1200;
  b.move(200, 200);
  b.end(200, 150);
  assert.deepEqual(b.moves, []);
});

test('vertical swipes switch at the bottom and top', (t) => {
  const b = browser(t);
  b.page.scrollTop = 1200;
  b.start();
  b.move(200, 290);
  b.end(200, 180);
  b.page.scrollTop = 0;
  b.start();
  b.move(200, 310);
  b.end(200, 420);
  assert.deepEqual(b.moves, [
    { direction: 1, axis: 'vertical' },
    { direction: -1, axis: 'vertical' },
  ]);
});

test('taps, short gestures, diagonals and canceled touches do not navigate', (t) => {
  const b = browser(t);
  b.start();
  b.end(200, 300);
  b.start();
  b.move(190, 300);
  b.end(160, 300);
  b.start();
  b.move(100, 200);
  b.end(100, 200);
  b.start();
  b.move(190, 300);
  b.root.emit('touchcancel', {});
  b.end(80, 300);
  assert.deepEqual(b.moves, []);
});

test('pinch gestures and noncancelable native scrolling do not navigate', (t) => {
  const b = browser(t);
  b.start();
  assert.equal(
    b.move(190, 300, { touches: [b.point(190, 300), b.point(250, 300, 2)] })
      .defaultPrevented,
    false,
  );
  b.end(80, 300);
  b.start();
  b.move(190, 300, { cancelable: false });
  b.end(80, 300);
  assert.deepEqual(b.moves, []);
});

for (const state of ['busy', 'change', 'menu', 'select']) {
  test(`a swipe is canceled when ${state} changes during it`, (t) => {
    const b = browser(t);
    b.start();
    b.move(190, 300);
    b[state]();
    b.end(80, 300);
    assert.deepEqual(b.moves, []);
  });
}

test('controls and nested scrollable content keep their own gestures', (t) => {
  const b = browser(t);
  b.root.blocked = true;
  b.start();
  b.move(80, 300);
  b.end(80, 300);
  b.root.blocked = false;
  b.root.overflowY = 'auto';
  b.root.scrollHeight = 500;
  b.root.clientHeight = 200;
  b.start();
  b.move(80, 300);
  b.end(80, 300);
  assert.deepEqual(b.moves, []);
});

test('zoom, horizontal wheel movement and controls do not change sections', (t) => {
  const b = browser(t);
  b.page.scrollTop = 1200;
  for (const properties of [
    { ctrlKey: true },
    { deltaX: 300 },
    { shiftKey: true },
  ]) {
    const event = b.viewport.emit('wheel', {
      target: b.root,
      deltaY: 100,
      deltaX: 0,
      deltaMode: 0,
      ...properties,
    });
    assert.equal(event.defaultPrevented, false);
  }
  b.root.blocked = true;
  b.viewport.emit('wheel', {
    target: b.root,
    deltaY: 100,
    deltaX: 0,
    deltaMode: 0,
  });
  assert.deepEqual(b.moves, []);
});
