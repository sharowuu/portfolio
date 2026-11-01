import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function setup() {
  let clock = 0, sequence = 0;
  const timers = new Map();
  const images = [];
  const window = {
    setTimeout(fn, delay) { const id = ++sequence; timers.set(id, { fn, at: clock + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    requestIdleCallback(fn) { fn(); },
  };
  class Image {
    constructor() { images.push(this); }
    set src(value) { this.url = value; this.active = true; }
    removeAttribute() { this.active = false; }
  }
  const context = vm.createContext({ window, document: { hidden: false, readyState: 'complete' }, navigator: { connection: {} }, Image, exports: {} });
  const source = readFileSync(new URL('../src/lib/media-load-queue.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInContext(compiled, context);
  const tick = ms => {
    clock += ms;
    for (const [id, task] of [...timers]) if (task.at <= clock && timers.has(id)) { timers.delete(id); task.fn(); }
  };
  return { ...context.exports, context, images, tick, active: () => images.filter(image => image.active) };
}

test('visible image requests are limited to two concurrent jobs', () => {
  const q = setup();
  ['a', 'b', 'c'].forEach(src => q.requestImage(src, 'visible', () => {}));
  assert.equal(q.active().length, 2);
  q.active()[0].onload();
  assert.equal(q.active().length, 2);
  assert.equal(q.active()[1].url, 'c');
});
test('idle images do not start on initial render and load serially', () => {
  const q = setup();
  q.requestImage('a', 'idle', () => {});
  q.requestImage('b', 'idle', () => {});
  assert.equal(q.active().length, 0);
  q.tick(1200);
  assert.equal(q.active().length, 1);
});
test('visible media interrupts speculative image loading', () => {
  const q = setup();
  q.requestImage('idle', 'idle', () => {});
  q.tick(1200);
  q.requestImage('current', 'visible', () => {});
  assert.deepEqual(q.active().map(image => image.url), ['current']);
});
test('cancelled pagination requests never begin later', () => {
  const q = setup();
  const cancel = q.requestImage('hidden-page', 'idle', () => {});
  cancel();
  q.tick(1200);
  assert.equal(q.active().length, 0);
});
test('save-data and slow networks suppress idle work', () => {
  const q = setup();
  q.context.navigator.connection.saveData = true;
  q.requestImage('next-page', 'idle', () => {});
  q.tick(1200);
  assert.equal(q.active().length, 0);
  q.requestImage('current-page', 'visible', () => {});
  assert.equal(q.active().length, 1);
});
test('the first video frame takes priority over background images', () => {
  const q = setup();
  q.requestImage('next-page', 'idle', () => {});
  q.tick(1200);
  const release = q.holdIdleImages();
  assert.equal(q.active().length, 0);
  q.tick(1200);
  assert.equal(q.active().length, 0);
  release();
  q.tick(1200);
  assert.equal(q.active().length, 1);
});
test('duplicate image URLs share one request and notify every subscriber', () => {
  const q = setup();
  let ready = 0;
  q.requestImage('same', 'visible', () => ready++);
  q.requestImage('same', 'visible', () => ready++);
  assert.equal(q.active().length, 1);
  q.active()[0].onload();
  assert.equal(ready, 2);
  q.requestImage('same', 'visible', () => ready++);
  assert.equal(ready, 3);
  assert.equal(q.active().length, 0);
});
