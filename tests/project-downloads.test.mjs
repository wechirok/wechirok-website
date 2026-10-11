import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  downloadEndpoint,
  downloadTotal,
} from '../src/lib/project-downloads.ts';

test('download sources are restricted to public credential-free APIs', () => {
  assert.equal(
    downloadEndpoint('modrinth', 'Y9WA7rNf'),
    'https://api.modrinth.com/v2/project/Y9WA7rNf',
  );
  assert.equal(
    downloadEndpoint('curseforge', '1535996'),
    'https://api.cfwidget.com/1535996',
  );
  for (const id of [
    '../other',
    '123?token=secret',
    'https://example.com',
    '',
  ]) {
    assert.throws(() => downloadEndpoint('modrinth', id));
    assert.throws(() => downloadEndpoint('curseforge', id));
  }
});

test('each provider reads only the matching project total, including zero', () => {
  assert.equal(
    downloadTotal('modrinth', 'Y9WA7rNf', { id: 'Y9WA7rNf', downloads: 0 }),
    0,
  );
  assert.equal(
    downloadTotal('curseforge', '1535996', {
      id: 1535996,
      downloads: { total: 259, monthly: 12 },
    }),
    259,
  );
  assert.throws(() =>
    downloadTotal('modrinth', 'Y9WA7rNf', { id: 'ZDCwiIc3', downloads: 123 }),
  );
  assert.throws(() =>
    downloadTotal('curseforge', '1535996', {
      id: 1655703,
      downloads: { total: 123 },
    }),
  );
});

test('missing or malformed API responses cannot become misleading counts', () => {
  for (const value of [
    undefined,
    null,
    '100',
    -1,
    NaN,
    Infinity,
    1.5,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    assert.throws(() =>
      downloadTotal('modrinth', 'Y9WA7rNf', {
        id: 'Y9WA7rNf',
        downloads: value,
      }),
    );
    assert.throws(() =>
      downloadTotal('curseforge', '1535996', {
        id: 1535996,
        downloads: { total: value },
      }),
    );
  }
  for (const payload of [
    null,
    {},
    { error: 'unavailable' },
    { id: 'Y9WA7rNf' },
  ]) {
    assert.throws(() => downloadTotal('modrinth', 'Y9WA7rNf', payload));
  }
});
