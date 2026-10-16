import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DownloadCounter } from '../src/lib/download-counter.ts';

// Minimal DOM-shaped nodes keep animation lifecycle checks independent of a browser.
function element() {
  return {
    ownerDocument: { createElement: element },
    children: [],
    dataset: {},
    style: {},
    className: '',
    parent: null,
    text: '',
    get firstElementChild() {
      return this.children[0] ?? null;
    },
    get textContent() {
      return (
        this.text + this.children.map((child) => child.textContent).join('')
      );
    },
    set textContent(text) {
      this.text = text;
      this.children = [];
    },
    append(...children) {
      for (const child of children) {
        child.parent = this;
        this.children.push(child);
      }
    },
    replaceChildren(...children) {
      this.textContent = '';
      this.append(...children);
    },
    remove() {
      if (this.parent)
        this.parent.children = this.parent.children.filter(
          (child) => child !== this,
        );
    },
  };
}

test('badge and tooltip keep identical digit phases throughout a slow response', () => {
  const badge = element();
  const tooltip = element();
  const compact = new DownloadCounter(badge);
  const exact = new DownloadCounter(tooltip);
  compact.loading(100);
  exact.loading(100);
  for (const now of [100, 350, 1_200, 9_999, 20_000]) {
    compact.tick(now);
    exact.tick(now);
    assert.equal(badge.textContent, tooltip.textContent);
    const positions = (node) =>
      node.firstElementChild.children.map(
        (cell) => cell.firstElementChild.style.transform,
      );
    assert.deepEqual(positions(badge), positions(tooltip));
  }
  compact.settle('819.5K', 20_000, true);
  exact.settle('819,515', 20_000, true);
  compact.tick(21_100);
  exact.tick(21_100);
  assert.equal(badge.textContent, '819.5K');
  assert.equal(tooltip.textContent, '819,515');
  assert.equal(compact.active || exact.active, false);
});

test('zero and unavailable both finish loading without hiding the counter', () => {
  for (const result of ['0', '—']) {
    const node = element();
    const counter = new DownloadCounter(node);
    counter.loading(0);
    counter.settle(result, 400, true);
    assert.equal(counter.active, true);
    counter.tick(1_500);
    assert.equal(counter.active, false);
    assert.equal(node.textContent, result);
    assert.equal(node.dataset.state, 'ready');
    assert.equal(node.children.length, 0);
  }
});

test('reduced motion and a locale change during settling leave no old layers', () => {
  const node = element();
  const counter = new DownloadCounter(node);
  counter.loading(0);
  counter.tick(100, true);
  assert.equal(node.textContent, '…');
  counter.tick(200);
  assert.equal(node.children.length, 1);
  counter.settle('819,515', 300, true);
  counter.tick(400);
  counter.settle('819.515', 400, true);
  assert.equal(node.children.length, 2);
  counter.tick(500, true);
  assert.equal(node.textContent, '819.515');
  assert.equal(node.children.length, 0);
  assert.equal(counter.active, false);
  counter.settle('819.515', 600, true);
  assert.equal(counter.active, false);
});
