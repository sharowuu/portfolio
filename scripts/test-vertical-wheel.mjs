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
