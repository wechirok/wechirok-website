import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  attachSectionGestures,
  swipeIntent,
  GestureProgress,
  wheelPixels,
} from '../src/lib/section-gestures.ts';

test('transition progress follows movement and reverses without a reset or lock', () => {
  const gesture = new GestureProgress();
  gesture.move(30);
  assert.equal(gesture.progress, 0.25);
  gesture.move(30);
  assert.equal(gesture.progress, 0.5);
  gesture.move(-45);
  assert.equal(gesture.progress, 0.125);
  gesture.move(-45);
  assert.equal(gesture.direction, -1);
  assert.equal(gesture.progress, 0.25);
  gesture.move(-500);
  assert.equal(gesture.progress, 1);
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
  let menu = false;
  let selection = false;
  let available = true;
  const moves = [];
  const steps = [];
  const gesture = new GestureProgress();
  let axis;
  let timerId = 0;
  const timers = new Map();
  const finish = (commit = Math.abs(gesture.distance) >= 40) => {
    if (commit && gesture.direction)
      moves.push({ direction: gesture.direction, axis });
    gesture.distance = 0;
  };
  viewport.innerHeight = 800;
  viewport.innerWidth = 390;
  viewport.getSelection = () => ({ isCollapsed: !selection });
  viewport.scrollBy = ({ top }) => {
    page.scrollTop += top;
  };
  viewport.setTimeout = (callback) => {
    timers.set(++timerId, callback);
    return timerId;
  };
  viewport.clearTimeout = (id) => timers.delete(id);
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
    active: () => gesture.distance !== 0,
    canNavigate: () => available,
    progress: (delta, nextAxis, complete) => {
      axis = nextAxis;
      gesture.move(delta);
      steps.push(gesture.distance);
      if (complete && gesture.progress === 1) finish(true);
    },
    finish,
    start: () => {
      gesture.distance = 0;
    },
    cancel: () => {
      gesture.distance = 0;
    },
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
    steps,
    idle: () => {
      for (const callback of timers.values()) callback();
      timers.clear();
    },
    wheel: (deltaY) =>
      viewport.emit('wheel', { target: root, deltaY, deltaX: 0, deltaMode: 0 }),
    point,
    start,
    move,
    end,
    change: () => {
      section = 'work';
    },
    menu: () => {
      menu = true;
    },
    select: () => {
      selection = true;
    },
    last: () => {
      available = false;
    },
  };
}

test('wheel movement continues across transitions without waiting for a new gesture', (t) => {
  const b = browser(t);
  b.page.scrollTop = 1200;
  b.wheel(30);
  b.wheel(90);
  b.wheel(120);
  assert.deepEqual(b.steps, [30, 120, 120]);
  assert.equal(b.moves.length, 2);
});

test('the same wheel gesture starts a transition as soon as content reaches its edge', (t) => {
  const b = browser(t);
  b.page.scrollTop = 400;
  assert.equal(b.wheel(100).defaultPrevented, false);
  b.page.scrollTop = 1200;
  assert.equal(b.wheel(40).defaultPrevented, true);
  assert.deepEqual(b.steps, [40]);
  b.idle();
  assert.deepEqual(b.moves, [{ direction: 1, axis: 'vertical' }]);
});

test('wheel reversal rolls back progress and tiny movements settle without navigation', (t) => {
  const b = browser(t);
  b.page.scrollTop = 1200;
  b.wheel(60);
  b.wheel(-40);
  assert.deepEqual(b.steps, [60, 20]);
  b.idle();
  assert.deepEqual(b.moves, []);
});

test('only wheel movement beyond the content boundary drives the transition', (t) => {
  const b = browser(t);
  b.page.scrollTop = 1180;
  assert.equal(b.wheel(60).defaultPrevented, true);
  assert.equal(b.page.scrollTop, 1200);
  assert.deepEqual(b.steps, [40]);
  b.idle();
  assert.equal(b.moves.length, 1);
});

test('the end of the section list keeps native scrolling', (t) => {
  const b = browser(t);
  b.page.scrollTop = 1200;
  b.last();
  assert.equal(b.wheel(100).defaultPrevented, false);
  assert.deepEqual(b.steps, []);
});

test('wheel progress is canceled when controls or zoom take over', (t) => {
  const b = browser(t);
  b.page.scrollTop = 1200;
  b.wheel(50);
  b.viewport.emit('wheel', {
    target: b.root,
    deltaY: 100,
    deltaX: 0,
    ctrlKey: true,
  });
  b.idle();
  assert.deepEqual(b.moves, []);
});

test('short horizontal swipes navigate from the middle of a long page', (t) => {
  const b = browser(t);
  b.page.scrollTop = 400;
  b.start();
  assert.equal(b.move(190, 301).defaultPrevented, true);
  assert.deepEqual(b.steps, [10]);
  assert.deepEqual(b.moves, []);
  b.end(160, 310);
  assert.deepEqual(b.moves, [{ direction: 1, axis: 'horizontal' }]);
});

test('a long swipe follows the finger and can be reversed before release', (t) => {
  const b = browser(t);
  b.start();
  b.move(20, 300);
  b.move(80, 300);
  b.move(180, 300);
  assert.deepEqual(b.steps, [180, 120, 20]);
  assert.deepEqual(b.moves, []);
  b.end(180, 300);
  assert.deepEqual(b.moves, []);
});

test('native content scrolling does not count toward the swipe commit threshold', (t) => {
  const b = browser(t);
  b.page.scrollTop = 400;
  b.start();
  b.move(200, 210);
  b.page.scrollTop = 1200;
  b.move(200, 200);
  b.end(200, 190);
  assert.deepEqual(b.steps, [10]);
  assert.deepEqual(b.moves, []);
});

test('vertical swipes scroll content natively then track only movement beyond its edge', (t) => {
  const b = browser(t);
  b.page.scrollTop = 400;
  b.start();
  assert.equal(b.move(200, 290).defaultPrevented, false);
  b.page.scrollTop = 1200;
  b.move(200, 200);
  b.end(200, 150);
  assert.deepEqual(b.steps, [90, 140]);
  assert.deepEqual(b.moves, [{ direction: 1, axis: 'vertical' }]);
});

test('short vertical swipes switch at the bottom and top', (t) => {
  const b = browser(t);
  b.page.scrollTop = 1200;
  b.start();
  b.move(200, 290);
  b.end(200, 260);
  b.page.scrollTop = 0;
  b.start();
  b.move(200, 310);
  b.end(200, 340);
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
  b.end(180, 300);
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

for (const state of ['change', 'menu', 'select']) {
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
