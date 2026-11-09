import test from 'node:test';
import assert from 'node:assert/strict';
import { composeTransforms, parseTransform, transformBounds } from './svgFrame.mjs';

const box = { minX: 0, minY: 0, maxX: 10, maxY: 10, width: 10, height: 10 };

test('uniform scale multiplies both axes', () => {
  assert.deepEqual(parseTransform('scale(2)'), [2, 0, 0, 2, 0, 0]);
  const out = transformBounds(box, parseTransform('scale(2)'));
  assert.equal(out.width, 20);
  assert.equal(out.height, 20);
});

test('non-uniform scale is kept per axis', () => {
  const out = transformBounds(box, parseTransform('scale(2, 0.5)'));
  assert.equal(out.width, 20);
  assert.equal(out.height, 5);
});

test('translate then scale composes in the right order', () => {
  const matrix = composeTransforms(['translate(5, 5)', 'scale(2)']);
  const out = transformBounds(box, matrix);
  assert.equal(out.minX, 5);
  assert.equal(out.minY, 5);
  assert.equal(out.width, 20);
  assert.equal(out.height, 20);
});

test('matrix() and rotation are parsed', () => {
  const out = transformBounds(box, parseTransform('matrix(2 0 0 3 0 0)'));
  assert.equal(out.width, 20);
  assert.equal(out.height, 30);
  const rotated = transformBounds(box, parseTransform('rotate(90)'));
  assert.ok(Math.abs(rotated.width - 10) < 1e-9);
  assert.ok(Math.abs(rotated.minX + 10) < 1e-9);
});

test('nested groups compose outermost first', () => {
  const matrix = composeTransforms(['translate(0, 8.57) scale(0.652004)', 'scale(0.256)']);
  const art = { minX: 0, minY: 0, maxX: 196.32, maxY: 170.02, width: 196.32, height: 170.02 };
  const out = transformBounds(art, matrix);
  assert.ok(Math.abs(out.width - 196.32 * 0.652004 * 0.256) < 1e-6);
});
