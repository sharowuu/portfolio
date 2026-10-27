#!/usr/bin/env node
// 复验媒体优化账单：
//  1) 每条映射的新物理文件存在且字节与 manifest 一致；
//  2) 旧原件仍在 public/（dev 全量可用，不删源素材）；
//  3) 新文件字节合计 == manifest.optimized_bytes_total；
//  4) 若 dist/output 存在（已构建）：被替换原件不得出现在输出，新文件必须存在。
// 用法：node scripts/audit-media-optimization.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, 'scripts/media-optimization-manifest.json'), 'utf8'),
);

let failures = 0;
const fail = (msg) => { failures++; console.error('FAIL', msg); };
const ok = (msg) => console.log('ok  ', msg);

// 1) new physical files exist + bytes match
let sum = 0;
const seen = new Set();
for (const [oldPath, newPath] of Object.entries(manifest.mapping)) {
  const abs = path.join(root, 'public', newPath);
  if (!fs.existsSync(abs)) { fail(`missing new file: ${newPath}`); continue; }
  if (!seen.has(newPath)) {
    seen.add(newPath);
    const size = fs.statSync(abs).size;
    const expected = manifest.new_bytes[newPath];
    if (expected == null) { fail(`new file not listed in new_bytes: ${newPath}`); continue; }
    if (size !== expected) fail(`byte mismatch ${newPath}: disk=${size} manifest=${expected}`);
    sum += size;
  }
  // 2) old original still present on disk
  if (!fs.existsSync(path.join(root, 'public', oldPath))) fail(`original removed from disk (dev broken): ${oldPath}`);
}
if (sum === manifest.optimized_bytes_total) ok(`new bytes sum ${sum} == manifest total`);
else fail(`new bytes sum ${sum} != manifest total ${manifest.optimized_bytes_total}`);

// new_bytes must cover exactly the physical files referenced
for (const newPath of Object.keys(manifest.new_bytes)) {
  if (!seen.has(newPath)) fail(`new_bytes entry never used by mapping: ${newPath}`);
}

// 4) built output checks (only if present)
const outDir = path.join(root, 'dist/output');
if (fs.existsSync(outDir)) {
  for (const oldPath of Object.keys(manifest.mapping)) {
    const victim = path.join(outDir, oldPath);
    if (fs.existsSync(victim)) fail(`replaced original shipped in output: ${oldPath}`);
  }
  for (const newPath of seen) {
    if (!fs.existsSync(path.join(outDir, newPath))) fail(`optimized file missing in output: ${newPath}`);
  }
  ok('dist/output: replaced originals absent, optimized files present');
} else {
  console.log('skip dist/output checks (not built yet)');
}

console.log(failures === 0 ? `\nPASS (${Object.keys(manifest.mapping).length} mappings, ${seen.size} physical files, ${sum} bytes)` : `\nFAILED (${failures})`);
process.exit(failures === 0 ? 0 : 1);
