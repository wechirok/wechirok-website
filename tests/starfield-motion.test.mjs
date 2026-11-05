import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  advanceTravel,
  approach,
  createStars,
  displacement,
  projectStar,
  starLifetime,
} from '../src/lib/starfield-motion.ts';

test('particle coordinates have no shared diagonal sequence or duplicate positions', () => {
  const stars = createStars();
  assert.deepEqual(stars, createStars());
  assert.equal(
    new Set(stars.map((star) => `${star.x},${star.y}`)).size,
    stars.length,
  );
  const mean = (key) =>
    stars.reduce((sum, star) => sum + star[key], 0) / stars.length;
  const correlation = (a, b) => {
    const ma = mean(a),
      mb = mean(b);
    const numerator = stars.reduce(
      (sum, star) => sum + (star[a] - ma) * (star[b] - mb),
      0,
    );
    const variance = (key) =>
      stars.reduce((sum, star) => sum + (star[key] - mean(key)) ** 2, 0);
    return numerator / Math.sqrt(variance(a) * variance(b));
  };
  assert.ok(Math.abs(correlation('x', 'y')) < 0.2);
  assert.ok(Math.abs(correlation('y', 'z')) < 0.2);
});

test('scroll changes the composition permanently and smoothly wraps particle depth', () => {
  const stars = createStars();
  const travel = advanceTravel(0, 0, 240);
  const changes = stars.map((star) => {
    const before = projectStar(star, 1200, 800, 0);
    const after = projectStar(star, 1200, 800, travel);
    return Math.hypot(after.x - before.x, after.y - before.y);
  });
  assert.ok(
    changes.filter((distance) => distance > 50).length > stars.length / 2,
  );
  for (const star of stars) {
    const crossing = (star.z * starLifetime) / star.speed;
    assert.ok(projectStar(star, 1200, 800, crossing - 0.00001).opacity < 0.001);
    assert.ok(projectStar(star, 1200, 800, crossing + 0.00001).opacity < 0.001);
  }
  let current = 0;
  for (let index = 0; index < 400; index++)
    current = approach(current, travel, 1 / 60);
  assert.equal(current, travel);
  let target = 0;
  for (let index = 0; index < 100; index++)
    target = advanceTravel(0, target, 10000);
  assert.equal(target, 0.9);
});

test('particles stay visible longer and fade gradually in both travel directions', () => {
  const star = { ...createStars(1)[0], z: 0.5, speed: 1 };
  const crossing = star.z * starLifetime;
  assert.ok(projectStar(star, 1200, 800, 0.5).opacity > 0.9);
  const duration = 0.18 * starLifetime;
  for (const direction of [-1, 1]) {
    const samples = Array.from(
      { length: 121 },
      (_, index) =>
        projectStar(
          star,
          1200,
          800,
          crossing + direction * duration * (1 - index / 120),
        ).opacity,
    );
    assert.ok(samples[0] > 0.999);
    assert.ok(samples.at(-1) < 0.001);
    assert.ok(samples[60] > 0.49 && samples[60] < 0.51);
    for (let index = 1; index < samples.length; index++) {
      assert.ok(samples[index] <= samples[index - 1] + 0.000001);
      assert.ok(Math.abs(samples[index] - samples[index - 1]) < 0.02);
    }
  }
});

test('smoothing stays consistent across refresh rates and pointer displacement is bounded', () => {
  const run = (fps) => {
    let value = 0;
    for (let step = 0; step < fps / 2; step++)
      value = approach(value, 5, 1 / fps);
    return value;
  };
  assert.ok(Math.abs(run(60) - run(120)) < 0.000001);
  assert.deepEqual(displacement(0, 0, 1), { x: 0, y: 0 });
  assert.deepEqual(displacement(180, 0, 1), { x: 0, y: 0 });
  for (let x = -190; x <= 190; x += 3) {
    for (let y = -190; y <= 190; y += 3) {
      const offset = displacement(x, y, 1);
      assert.ok(Number.isFinite(offset.x) && Number.isFinite(offset.y));
      assert.ok(Math.hypot(offset.x, offset.y) <= 44);
    }
  }
});
