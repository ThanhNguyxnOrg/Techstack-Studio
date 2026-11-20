// Master art loader: reads assets/icons/art/{id}.svg, splits it into numbered
// parts, and fits it into the shared 24-unit frame.

import fs from 'node:fs';
import path from 'node:path';
import { parseXml, serialize, getAttr, setAttr, el, styleValue } from './xml.mjs';
import { parseTransform, multiply, transformBounds, IDENTITY } from '../svgFrame.mjs';
import { pathBounds, splitIslands, boundsOfPoints, flatten, polyArea } from './geometry.mjs';

export const ART_DIR = path.resolve('assets/icons/art');
export const FRAME = { size: 24, maxW: 23, maxH: 22, area: 20.5 };

const NON_RENDERED = new Set([
  'defs',
  'clipPath',
  'mask',
  'pattern',
  'symbol',
  'linearGradient',
  'radialGradient',
  'filter',
  'marker',
  'style',
  'title',
  'desc',
  'metadata',
]);
const LEAVES = new Set([
  'path',
  'circle',
  'ellipse',
  'rect',
  'polygon',
  'polyline',
  'line',
  'use',
  'image',
  'text',
]);
const INHERITED = ['fill', 'stroke', 'stroke-width', 'fill-rule', 'opacity', 'fill-opacity'];

const num = (v, f = 0) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : f;
};

export function invert(m) {
  const [a, b, c, d, e, f] = m;
  const det = a * d - b * c || 1e-12;
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
}
export const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
export const matScale = (m) => Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));

/** Geometry of a leaf in its own coordinates (before its transform attribute). */
export function leafGeometry(node) {
  const a = (n) => num(getAttr(node, n));
  switch (node.tag) {
    case 'path': {
      const d = getAttr(node, 'd') || '';
      const polys = flatten(d);
      return {
        bounds: boundsOfPoints(polys.flat()),
        area: polys.reduce((t, p) => t + Math.abs(polyArea(p)), 0),
      };
    }
    case 'circle': {
      const r = a('r');
      return {
        bounds: boundsOfPoints([
          [a('cx') - r, a('cy') - r],
          [a('cx') + r, a('cy') + r],
        ]),
        area: Math.PI * r * r,
      };
    }
    case 'ellipse': {
      const rx = a('rx'),
        ry = a('ry');
      return {
        bounds: boundsOfPoints([
          [a('cx') - rx, a('cy') - ry],
          [a('cx') + rx, a('cy') + ry],
        ]),
        area: Math.PI * rx * ry,
      };
    }
    case 'rect':
    case 'image':
      return {
        bounds: boundsOfPoints([
          [a('x'), a('y')],
          [a('x') + a('width'), a('y') + a('height')],
        ]),
        area: a('width') * a('height'),
      };
    case 'line':
      return {
        bounds: boundsOfPoints([
          [a('x1'), a('y1')],
          [a('x2'), a('y2')],
        ]),
        area: 0,
      };
    case 'polygon':
    case 'polyline': {
      const v = (getAttr(node, 'points') || '')
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(Number);
      const pts = [];
      for (let i = 0; i + 1 < v.length; i += 2) pts.push([v[i], v[i + 1]]);
      return { bounds: boundsOfPoints(pts), area: Math.abs(polyArea(pts)) };
    }
  }
  return { bounds: null, area: 0 };
}

/** Effective presentation value walking up the ancestor chain. */
function inherited(chain, name, fallback) {
  for (let i = chain.length - 1; i >= 0; i--) {
    const v = styleValue(chain[i], name);
    if (v !== null && v !== undefined && v !== 'inherit') return v;
  }
  return fallback;
}

export function readArtFile(id) {
  const file = path.join(ART_DIR, `${id}.svg`);
  if (!fs.existsSync(file)) throw new Error(`No master art for ${id} (${file})`);
  return fs.readFileSync(file, 'utf8');
}

/**
 * @param {string} id
 * @param {{ split?: boolean|number[], frame?: {scale?:number, dx?:number, dy?:number}, uid?: string }} opts
 */
export function loadArt(id, opts = {}) {
  const uid = opts.uid || id.replace(/[^a-zA-Z0-9]/g, '');
  const doc = parseXml(readArtFile(id));
  const svg = doc.children.find((n) => n.tag === 'svg');
  if (!svg) throw new Error(`${id}: art has no <svg>`);

  // 1. Prefix every id so several icons can share a page.
  const idMap = new Map();
  const visit = (n, fn) => {
    fn(n);
    (n.children || []).forEach((c) => visit(c, fn));
  };
  visit(svg, (n) => {
    const v = n.attrs && getAttr(n, 'id');
    if (v) {
      const next = `tss_${uid}_a${idMap.size}`;
      idMap.set(v, next);
      setAttr(n, 'id', next);
    }
  });
  const rewrite = (value) =>
    value
      .replace(/url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/g, (w, ref) =>
        idMap.has(ref) ? `url(#${idMap.get(ref)})` : w
      )
      .replace(/^#(.+)$/, (w, ref) => (idMap.has(ref) ? `#${idMap.get(ref)}` : w));
  visit(svg, (n) => {
    if (!n.attrs) return;
    n.attrs = n.attrs
      .filter(([k]) => k !== 'class' && k !== 'data-devicon')
      .map(([k, v]) => [k, rewrite(v)]);
    if (n.tag === 'style') n.children = [];
  });

  // 2. Find leaves and split compound paths into islands.
  const parts = [];
  const defs = [];
  const splitAll = opts.split !== false;
  const walkNode = (node, chain, matrix) => {
    const kids = node.children || [];
    const out = [];
    for (const child of kids) {
      if (child.tag === '#text') {
        out.push(child);
        continue;
      }
      if (child.tag === 'defs') {
        defs.push(...child.children);
        continue;
      }
      if (NON_RENDERED.has(child.tag)) {
        // Paint servers outside <defs> still work from <defs>.
        defs.push(child);
        continue;
      }
      if (LEAVES.has(child.tag)) {
        const own = getAttr(child, 'transform')
          ? parseTransform(getAttr(child, 'transform'))
          : IDENTITY;
        const fullChain = [...chain, child];
        const strokeVal = inherited(fullChain, 'stroke', 'none');
        const sw = strokeVal !== 'none' ? num(inherited(fullChain, 'stroke-width', '1'), 1) : 0;
        const fill = inherited(fullChain, 'fill', '#000');
        const pieces =
          child.tag === 'path' &&
          (splitAll === true || (Array.isArray(opts.split) && opts.split.includes(parts.length)))
            ? splitIslands(getAttr(child, 'd') || '')
            : null;
        const leaves =
          pieces && pieces.length > 1
            ? pieces.map((p) => {
                const clone = {
                  ...child,
                  attrs: child.attrs.map(([k, v]) => [k, k === 'd' ? p.d : v]),
                  children: [],
                };
                return clone;
              })
            : [child];
        for (const leaf of leaves) {
          const g = leafGeometry(leaf);
          const localBox = g.bounds ? transformBounds(g.bounds, own) : null;
          const wrapper = { tag: 'g', attrs: [], children: [leaf], part: parts.length };
          parts.push({
            i: parts.length,
            tag: leaf.tag,
            leaf,
            wrapper,
            chain: fullChain,
            parentMatrix: matrix, // art root -> wrapper local
            local: localBox, // fill-box in wrapper coordinates
            strokeWidth: sw,
            fill,
            stroke: strokeVal,
            area: g.area * matScale(multiply(matrix, own)) ** 2,
          });
          out.push(wrapper);
        }
        continue;
      }
      if (child.tag === 'g' || child.tag === 'a' || child.tag === 'switch' || child.tag === 'svg') {
        const own = getAttr(child, 'transform')
          ? parseTransform(getAttr(child, 'transform'))
          : IDENTITY;
        child.children = walkNode(child, [...chain, child], multiply(matrix, own));
        out.push(child);
        continue;
      }
      out.push(child);
    }
    return out;
  };
  const body = walkNode(svg, [svg], IDENTITY);

  // 3. Fit to the frame.
  let art = null;
  for (const p of parts) {
    if (!p.local) continue;
    const pad = p.strokeWidth / 2;
    const b = transformBounds(
      {
        minX: p.local.minX - pad,
        minY: p.local.minY - pad,
        maxX: p.local.maxX + pad,
        maxY: p.local.maxY + pad,
      },
      p.parentMatrix
    );
    p.rootBox = b;
    art = art
      ? boundsOfPoints([
          [art.minX, art.minY],
          [art.maxX, art.maxY],
          [b.minX, b.minY],
          [b.maxX, b.maxY],
        ])
      : b;
  }
  if (!art) throw new Error(`${id}: art draws nothing measurable`);
  const f = opts.frame || {};
  const s =
    Math.min(
      FRAME.maxW / art.width,
      FRAME.maxH / art.height,
      FRAME.area / Math.sqrt(art.width * art.height)
    ) * (f.scale || 1);
  const cx = (art.minX + art.maxX) / 2,
    cy = (art.minY + art.maxY) / 2;
  const N = [s, 0, 0, s, 12 - s * cx + (f.dx || 0), 12 - s * cy + (f.dy || 0)];
  for (const p of parts) {
    p.toFrame = multiply(N, p.parentMatrix); // wrapper local -> 24 frame
    p.unit = matScale(p.toFrame); // 24-units per local unit
    p.box = p.rootBox ? transformBounds(p.rootBox, N) : null;
    p.center = p.box ? [(p.box.minX + p.box.maxX) / 2, (p.box.minY + p.box.maxY) / 2] : [12, 12];
    p.area24 = p.area * s * s;
  }
  const r = (n) => Math.round(n * 10000) / 10000;
  const normTransform = `matrix(${N.map(r).join(' ')})`;
  return { id, uid, defs, body, parts, normTransform, N, artBox: transformBounds(art, N) };
}

/** Serialize the art body; wrappers with no class collapse into their children. */
export function serializeBody(nodes) {
  const strip = (n) => {
    if (n.part !== undefined && !n.attrs.length) return n.children.map(strip);
    if (n.children) return { ...n, children: n.children.flatMap((c) => [].concat(strip(c))) };
    return n;
  };
  return serialize(nodes.flatMap((n) => [].concat(strip(n))));
}

export function staticSvg(art, label) {
  const defs = art.defs.length ? `<defs>${serialize(art.defs)}</defs>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}">${defs}<g transform="${art.normTransform}">${serializeBody(art.body)}</g></svg>`;
}

export { el, serialize, getAttr, setAttr };
