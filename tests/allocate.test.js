const { test } = require('node:test');
const assert = require('node:assert/strict');
const { allocateHours } = require('../allocate.js');

const total = (rows) => Math.round(rows.reduce((s, r) => s + r.hours, 0) * 10) / 10;

test('hours are proportional to priority and add up to the daily total', () => {
  const rows = allocateHours([{ name: 'Math', priority: 5 }, { name: 'Art', priority: 1 }], 4);
  assert.deepEqual(rows.map((r) => r.hours), [3.3, 0.7]);
  assert.equal(total(rows), 4);
});

test('rounding never drifts from the total (three equal subjects, 4h)', () => {
  const rows = allocateHours(['A', 'B', 'C'].map((name) => ({ name, priority: 3 })), 4);
  assert.equal(total(rows), 4);
});

test('blank or out-of-range priorities are clamped instead of producing NaN or negative hours', () => {
  const rows = allocateHours([{ name: 'A', priority: '' }, { name: 'B', priority: -5 }, { name: 'C', priority: 99 }], 6);
  assert.ok(rows.every((r) => Number.isFinite(r.hours) && r.hours >= 0));
  assert.deepEqual(rows.map((r) => r.priority), [1, 1, 5]);
  assert.equal(total(rows), 6);
});

test('rows without a name are ignored; no subjects gives an empty result', () => {
  assert.deepEqual(allocateHours([{ name: '  ', priority: 3 }], 4), []);
  assert.equal(allocateHours([{ name: 'A', priority: 2 }, { name: '', priority: 5 }], 4).length, 1);
});

test('invalid hour totals fall back to a safe range', () => {
  assert.equal(total(allocateHours([{ name: 'A', priority: 1 }], NaN)), 4);
  assert.equal(total(allocateHours([{ name: 'A', priority: 1 }], 500)), 16);
});
