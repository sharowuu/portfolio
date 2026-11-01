import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/hooks/verticalWheelIntent.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { VerticalWheelIntent } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const simulate = (entries) => {
  const intent = new VerticalWheelIntent();
  return entries.map(([delta, ms]) => intent.consume(delta, ms));
};
test('four deliberate gestures are all accepted without the old animation lock', () => {
  assert.deepEqual(simulate([0, 320, 640, 960].map(t => [80, t])), [1, 1, 1, 1]);
});
test('new gesture during animation remains available for the next card', () => {
  assert.deepEqual(simulate([[80, 0], [60, 16], [30, 32], [80, 190]]), [1, 0, 0, 1]);
});
test('one trackpad swipe with a decaying tail cannot skip several cards', () => {
  const values = Array.from({length: 90}, (_, i) => [80 * .94 ** i, i * 16]);
  assert.equal(simulate(values).filter(Boolean).length, 1);
});
test('sustained deliberate wheel input continues without requiring a pause', () => {
  const accepted = simulate(Array.from({length: 21}, (_, i) => [24, i * 50]));
  assert.deepEqual(accepted.map((v, i) => v ? i * 50 : null).filter(v => v !== null), [0, 300, 600, 900]);
});
test('direction reversal reacts before an existing animation finishes', () => {
  assert.deepEqual(simulate([[80, 0], [30, 16], [-20, 100]]), [1, 0, -1]);
});
test('renewed acceleration after a tail is a deliberate second swipe', () => {
  assert.deepEqual(simulate([[80, 0], [60, 50], [30, 100], [12, 150], [50, 200]]), [1, 0, 0, 0, 1]);
});
test('tiny noise, zero and invalid input do not trigger a card change', () => {
  assert.deepEqual(simulate([[0, 0], [NaN, 1], [Infinity, 2], [2, 3], [2, 20]]), [0, 0, 0, 0, 0]);
});
test('line-normalized mouse notches still trigger promptly', () => {
  assert.deepEqual(simulate([[3 * 16, 0], [3 * 16, 180]]), [1, 1]);
});

const simulateContinuous = entries => {
  const intent = new VerticalWheelIntent(true);
  let availableAt = -Infinity;
  return entries.map(([delta, ms]) => {
    const result = intent.consume(delta, ms, ms >= availableAt);
    if (result) availableAt = ms + 330;
    return result;
  });
};
test('Aily: a short continuous push does not auto-queue the next card', () => {
  const entries = Array.from({ length: 24 }, (_, i) => [40, i * 20]);
  assert.equal(simulateContinuous(entries).filter(Boolean).length, 1);
});
test('Aily: ongoing intentional input continues without requiring a quiet gap', () => {
  const entries = Array.from({ length: 80 }, (_, i) => [40, i * 20]);
  const times = simulateContinuous(entries).flatMap((result, i) => result ? [i * 20] : []);
  assert.deepEqual(times, [0, 480, 960, 1440]);
});
test('Aily: renewed deliberate pushes can continue while the tail is still arriving', () => {
  const entries = [[80, 0], [40, 50], [20, 100], [10, 150], [60, 200], [60, 250], [60, 300], [60, 350], [10, 400], [10, 450], [60, 500], [60, 550], [60, 600], [60, 650], [60, 700]];
  assert.deepEqual(simulateContinuous(entries).flatMap((result, i) => result ? [entries[i][1]] : []), [0, 350, 700]);
});
test('Aily: old animation input never executes later without a new live event', () => {
  assert.deepEqual(simulateContinuous([[80, 0], [60, 50], [30, 100], [10, 150], [60, 200], [20, 250], [5, 400]]), [1, 0, 0, 0, 0, 0, 0]);
});
test('Aily: reversal works without waiting for arrival', () => {
  assert.deepEqual(simulateContinuous([[80, 0], [30, 16], [-20, 100], [-40, 130]]), [1, 0, -1, 0]);
});
test('Aily: long decaying momentum and small tail bumps do not restart navigation', () => {
  const entries = Array.from({ length: 90 }, (_, i) => [80 * .94 ** i, i * 16]);
  assert.equal(simulateContinuous(entries).filter(Boolean).length, 1);
  assert.deepEqual(simulateContinuous([[80, 0], [40, 50], [10, 100], [8, 150], [20, 200], [12, 250], [5, 350]]), [1, 0, 0, 0, 0, 0, 0]);
});
test('Aily: short gaps and normal wheel notches remain responsive after arrival', () => {
  assert.deepEqual(simulateContinuous([[48, 0], [48, 180], [48, 360], [48, 540], [48, 720]]), [1, 0, 1, 0, 1]);
});
