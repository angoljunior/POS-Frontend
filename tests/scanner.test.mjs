import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addScannedProduct, createScanQueue } from '../src/lib/scanner.js';
const product = { id: 1, name: 'Tea', price: '3.50', stock: 2, isActive: true };
test('successful scan adds one item and preserves existing cart', () => {
  const cart = [{ ...product, id: 2, quantity: 1 }];
  const next = addScannedProduct(cart, product);
  assert.equal(next.length, 2); assert.equal(next[1].price, 3.5); assert.equal(next[1].quantity, 1);
  assert.equal(cart.length, 1);
});
test('repeat by the same product ID is rejected without incrementing quantity', () => {
  const cart = addScannedProduct([], product);
  assert.throws(() => addScannedProduct(cart, { ...product, id: '1' }), /already been scanned/);
  assert.equal(cart[0].quantity, 1);
});
test('inactive and insufficient stock scans are rejected', () => {
  assert.throws(() => addScannedProduct([], { ...product, isActive: false }), /inactive/);
  for (const stock of [0, null, undefined, -1]) assert.throws(() => addScannedProduct([], { ...product, stock }), /stock/);
});
test('rapid scans are ordered and duplicate barcode/SKU aliases do not add twice', async () => {
  let cart = []; const errors = []; const calls = []; let pending = 0;
  const queue = createScanQueue(async (code) => { calls.push(code); return code === 'other' ? { ...product, id: 2 } : product; },
    (p) => { cart = addScannedProduct(cart, p); }, (e) => errors.push(e), (n) => { pending = n; });
  await Promise.all(['barcode', 'sku', 'other'].map((code) => queue.enqueue(code)));
  assert.deepEqual(calls, ['barcode', 'sku', 'other']); assert.equal(cart.length, 2);
  assert.match(errors[0], /already been scanned/); assert.equal(pending, 0);
});
test('invalid codes never request backend; missing product errors are shown and queue recovers', async () => {
  let calls = 0; const errors = []; let added = 0;
  const queue = createScanQueue(async () => { if (++calls === 1) throw { response: { data: { detail: 'Product not found.' } } }; return product; },
    () => added++, (e) => errors.push(e), () => {});
  for (const code of ['', ' ', 'a'.repeat(101), 'a\u0000b']) await queue.enqueue(code);
  assert.equal(calls, 0); await queue.enqueue('missing'); await queue.enqueue('valid');
  assert.equal(added, 1); assert.equal(errors.at(-1), 'Product not found.');
});
test('pausing scanner discards in-flight and queued scans', async () => {
  let resolve; let added = 0;
  const queue = createScanQueue(() => new Promise((done) => { resolve = done; }), () => added++, () => {}, () => {});
  const first = queue.enqueue('one'); const second = queue.enqueue('two');
  await Promise.resolve(); queue.cancel(); resolve(product); await Promise.all([first, second]);
  assert.equal(added, 0);
});
