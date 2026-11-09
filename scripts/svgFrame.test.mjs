import test from 'node:test';
import assert from 'node:assert/strict';
import { composeTransforms, measureArtwork, parseTransform, transformBounds } from './svgFrame.mjs';

const box = { minX: 0, minY: 0, maxX: 10, maxY: 10, width: 10, height: 10 };
const unitBox = () => ({ minX: 0, minY: 0, maxX: 10, maxY: 10 });
const noPaths = () => null;

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

test('measureArtwork follows each element’s own matrix', () => {
  const svg =
    '<svg viewBox="0 0 24 24"><g transform="translate(2 3)"><path d="M0 0H10V10Z"/></g></svg>';
  const out = measureArtwork(svg, unitBox);
  assert.equal(out.minX, 2);
  assert.equal(out.minY, 3);
  assert.equal(out.width, 10);
});

test('measureArtwork counts image width and height', () => {
  const svg = '<svg><image x="1" y="1" width="4" height="6"/></svg>';
  const out = measureArtwork(svg, noPaths);
  assert.equal(out.minX, 1);
  assert.equal(out.minY, 1);
  assert.equal(out.width, 4);
  assert.equal(out.height, 6);
});

test('measureArtwork applies the use x/y offset to the referenced shape', () => {
  const svg =
    '<svg><defs><symbol id="s"><path d="M0 0H10V10Z"/></symbol></defs><use href="#s" x="5" y="7"/></svg>';
  const out = measureArtwork(svg, unitBox);
  assert.equal(out.minX, 5);
  assert.equal(out.minY, 7);
  assert.equal(out.width, 10);
  assert.equal(out.height, 10);
});

test('measureArtwork ignores definitions that are never used', () => {
  const svg = '<svg><defs><path d="M100 100H110V110Z"/></defs><path d="M0 0H5V5Z"/></svg>';
  const bounds = (d) =>
    d.includes('100')
      ? { minX: 100, minY: 100, maxX: 110, maxY: 110 }
      : { minX: 0, minY: 0, maxX: 5, maxY: 5 };
  const out = measureArtwork(svg, bounds);
  assert.equal(out.minX, 0);
  assert.equal(out.maxX, 5);
});

test('measureArtwork measures circle and ellipse geometry', () => {
  const circle = measureArtwork('<svg><circle cx="5" cy="6" r="2"/></svg>', noPaths);
  assert.deepEqual([circle.minX, circle.minY, circle.width, circle.height], [3, 4, 4, 4]);
  const ellipse = measureArtwork('<svg><ellipse cx="5" cy="6" rx="3" ry="2"/></svg>', noPaths);
  assert.deepEqual([ellipse.minX, ellipse.minY, ellipse.width, ellipse.height], [2, 4, 6, 4]);
});

test('measureArtwork measures rect, line, polygon and polyline geometry', () => {
  const rect = measureArtwork('<svg><rect x="1" y="2" width="4" height="5"/></svg>', noPaths);
  assert.deepEqual([rect.minX, rect.minY, rect.width, rect.height], [1, 2, 4, 5]);

  const line = measureArtwork('<svg><line x1="1" y1="1" x2="6" y2="9"/></svg>', noPaths);
  assert.deepEqual([line.minX, line.minY, line.width, line.height], [1, 1, 5, 8]);

  const polygon = measureArtwork('<svg><polygon points="1,2 6,2 3,8"/></svg>', noPaths);
  assert.deepEqual([polygon.minX, polygon.minY, polygon.width, polygon.height], [1, 2, 5, 6]);

  const polyline = measureArtwork('<svg><polyline points="0,0 4,4"/></svg>', noPaths);
  assert.deepEqual([polyline.minX, polyline.minY, polyline.width, polyline.height], [0, 0, 4, 4]);
});

test('shape geometry honours the ancestor matrix', () => {
  const svg = '<svg><g transform="translate(10 20)"><circle cx="5" cy="5" r="1"/></g></svg>';
  const out = measureArtwork(svg, noPaths);
  assert.deepEqual([out.minX, out.minY, out.width, out.height], [14, 24, 2, 2]);
});
