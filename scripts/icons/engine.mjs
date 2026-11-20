// Story engine: turns a per-logo story spec into one self-contained animated SVG.
//
// Contract (every icon):
//   - one duration (T), no animation-delay, every timing lives in keyframes
//   - 0%..REST.in and REST.out..100% are the clean logo, so frame 0 = last frame = static
//   - props (extra story elements) are invisible at rest
//   - prefers-reduced-motion freezes on the clean logo

import { loadArt, serializeBody, invert, apply } from './art.mjs';
import { parseXml, serialize, getAttr, setAttr } from './xml.mjs';
import { leafGeometry } from './art.mjs';
import { boundsOfPoints } from './geometry.mjs';
import { transformBounds, parseTransform, IDENTITY, multiply } from '../svgFrame.mjs';

export const T = 4.8;
export const REST = { in: 6, out: 72 };
export const EASE = {
  out: 'cubic-bezier(.22,1,.36,1)',
  inout: 'cubic-bezier(.65,0,.35,1)',
  in: 'cubic-bezier(.55,0,1,.45)',
  settle: 'cubic-bezier(.34,1.5,.64,1)',
  linear: 'linear',
};

const r = (n, p = 3) => {
  const v = Math.round(n * 10 ** p) / 10 ** p;
  return Object.is(v, -0) ? 0 : v;
};
const pct = (n) => `${r(n, 2)}%`;

/** Resolve a target selector into part indices. */
function resolveTarget(on, art, groups) {
  if (on === 'all') return 'all';
  if (typeof on === 'number') return [on];
  if (Array.isArray(on)) return on.flatMap((x) => resolveTarget(x, art, groups));
  if (typeof on === 'string') {
    if (groups[on] === undefined) throw new Error(`${art.id}: unknown group "${on}"`);
    return resolveTarget(groups[on], art, groups);
  }
  if (typeof on === 'function') return on(art.parts).map((p) => (typeof p === 'number' ? p : p.i));
  throw new Error(`${art.id}: bad target ${JSON.stringify(on)}`);
}

const unionBox = (boxes) =>
  boundsOfPoints(
    boxes.filter(Boolean).flatMap((b) => [
      [b.minX, b.minY],
      [b.maxX, b.maxY],
    ])
  );

/** "50% 100%" | [x,y] (24 frame) | 'center' -> absolute 24-frame point within box. */
function originPoint(origin, box) {
  if (Array.isArray(origin)) return origin;
  const spec = !origin || origin === 'center' ? '50% 50%' : origin;
  const [ox, oy] = spec.split(/\s+/).map((s) => parseFloat(s) / 100);
  return [box.minX + box.width * ox, box.minY + box.height * (Number.isFinite(oy) ? oy : ox)];
}

/** Convert a 24-frame point to fill-box percentages for a part wrapper. */
function partOriginPct(part, point) {
  const local = apply(invert(part.toFrame), point);
  const b = part.local;
  if (!b || !b.width || !b.height) return '50% 50%';
  return `${r(((local[0] - b.minX) / b.width) * 100, 2)}% ${r(((local[1] - b.minY) / b.height) * 100, 2)}%`;
}

const poseCss = (k, unit = 1) => {
  const x = (k.x || 0) / unit,
    y = (k.y || 0) / unit;
  const sx = k.sx ?? k.s ?? 1,
    sy = k.sy ?? k.s ?? 1;
  const parts = [];
  parts.push(
    `transform:translate(${r(x)}px,${r(y)}px) rotate(${r(k.r || 0, 2)}deg) scale(${r(sx)},${r(sy)})`
  );
  return parts;
};

/**
 * Build keyframes text from a map {pct: pose}. Rest anchors are added.
 * @param {'part'|'prop'|'leaf'|'trace'} kind
 */
function buildFrames(keys, { unit = 1, kind = 'part', id, end }) {
  const entries = Object.entries(keys)
    .map(([k, v]) => [Number(k), v || {}])
    .sort((a, b) => a[0] - b[0]);
  for (const [k] of entries) {
    if (k < REST.in || k > REST.out)
      throw new Error(`${id}: key ${k}% is outside the story window`);
  }
  const restOpacity = kind === 'prop' || kind === 'trace' ? 0 : 1;
  const rest = { o: restOpacity, rest: true };
  const endRest = end ? { ...end, o: restOpacity, rest: true } : rest;
  const list = [[0, rest], [REST.in, rest], ...entries, [REST.out, endRest], [100, endRest]];
  // Merge duplicate anchors (author keyed exactly on a rest edge).
  const merged = [];
  for (const item of list) {
    const last = merged[merged.length - 1];
    if (last && last[0] === item[0]) last[1] = item[1].rest ? last[1] : item[1];
    else merged.push([item[0], { ...item[1] }]);
  }
  return merged
    .map(([k, pose], idx) => {
      const decl = [];
      if (kind === 'trace') {
        decl.push(`stroke-dashoffset:${r(pose.draw ?? 1)}`);
        decl.push(`opacity:${r(pose.o ?? (pose.rest ? 0 : 1))}`);
      } else if (kind === 'leaf') {
        decl.push(`opacity:${r(pose.o ?? 1)}`);
      } else {
        decl.push(...poseCss(pose, unit));
        decl.push(`opacity:${r(pose.o ?? (pose.rest ? restOpacity : 1))}`);
      }
      // Easing for the segment that starts here.
      const next = merged[idx + 1];
      let ease = pose.e;
      if (!ease) {
        if (!next) ease = 'linear';
        else if (next[1].rest && !pose.rest) ease = 'out';
        else if (pose.rest && !next[1].rest) ease = 'inout';
        else ease = 'inout';
      }
      decl.push(`animation-timing-function:${EASE[ease] || ease}`);
      return `${pct(k)}{${decl.join(';')}}`;
    })
    .join('');
}

const shiftKeys = (keys, by) =>
  Object.fromEntries(Object.entries(keys).map(([k, v]) => [String(r(Number(k) + by, 2)), v]));

function sortParts(indices, art, order) {
  if (!order) return indices;
  const desc = order.startsWith('-');
  const axis = order.replace('-', '');
  const val = (i) => {
    const c = art.parts[i].center;
    if (axis === 'x') return c[0];
    if (axis === 'y') return c[1];
    if (axis === 'r') return Math.hypot(c[0] - 12, c[1] - 12);
    if (axis === 'a') return Math.atan2(c[1] - 12, c[0] - 12);
    return 0;
  };
  return [...indices].sort((a, b) => (desc ? val(b) - val(a) : val(a) - val(b)));
}

function propBox(markup) {
  const doc = parseXml(`<g>${markup}</g>`);
  const boxes = [];
  const visit = (n, m) => {
    for (const c of n.children || []) {
      if (!c.attrs) continue;
      const own = getAttr(c, 'transform') ? parseTransform(getAttr(c, 'transform')) : IDENTITY;
      const mm = multiply(m, own);
      const g = leafGeometry(c);
      if (g.bounds) boxes.push(transformBounds(g.bounds, mm));
      visit(c, mm);
    }
  };
  visit(doc.children[0], IDENTITY);
  return unionBox(boxes) || { minX: 11, minY: 11, maxX: 13, maxY: 13, width: 2, height: 2 };
}

/**
 * @param {object} item catalog entry ({id, name})
 * @param {object} spec story spec
 */
export function buildIcon(item, spec) {
  const id = item.id;
  const uid = id.replace(/[^a-zA-Z0-9]/g, '');
  const label = String(item.name)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
  const artOpts = { split: spec.split, frame: spec.frame, uid };

  const staticArt = loadArt(id, artOpts);
  const defsStatic = staticArt.defs.length ? serialize(staticArt.defs) : '';
  const staticBody = `<g transform="${staticArt.normTransform}">${serializeBody(staticArt.body)}</g>`;

  const art = loadArt(id, artOpts);
  const groups = typeof spec.groups === 'function' ? spec.groups(art.parts) : spec.groups || {};
  const css = [];
  const animated = [];
  let n = 0;
  const cls = (name) => `tss_${uid}_${name}`;
  let allWrap = null;
  const extraDefs = [];

  const emit = (name, frames, base) => {
    const c = cls(name);
    css.push(`@keyframes ${c}{${frames}}`);
    css.push(`.${c}{${base ? base + ';' : ''}animation:${c} ${T}s linear infinite}`);
    animated.push(c);
    return c;
  };

  for (const track of spec.tracks || []) {
    const target = resolveTarget(track.on, art, groups);
    if (target === 'all') {
      const box = art.artBox;
      const o = originPoint(track.origin, box);
      const origin = `${r(((o[0] - box.minX) / box.width) * 100, 2)}% ${r(((o[1] - box.minY) / box.height) * 100, 2)}%`;
      const c = emit(
        `t${n++}`,
        buildFrames(track.keys, { id }),
        `transform-box:fill-box;transform-origin:${origin}`
      );
      allWrap = allWrap ? [...allWrap, c] : [c];
      continue;
    }
    const ordered = sortParts(target, art, track.order);
    const groupBox = unionBox(ordered.map((i) => art.parts[i].box));
    const point = originPoint(track.origin, groupBox);
    const each = track.each; // origin per part instead of shared
    ordered.forEach((pi, k) => {
      const part = art.parts[pi];
      if (!part) throw new Error(`${id}: no part ${pi}`);
      const keys = track.stagger
        ? shiftKeys(track.keys || {}, k * track.stagger)
        : track.keys || {};
      const pt = each ? originPoint(track.origin, part.box) : point;
      const origin = partOriginPct(part, pt);
      part.layers ||= [];
      part.overlays ||= [];
      if (track.keys) {
        const c = emit(
          `t${n++}`,
          buildFrames(keys, { unit: part.unit, id, end: track.end }),
          `transform-box:fill-box;transform-origin:${origin}`
        );
        part.layers.push(c);
      }
      if (track.draw) {
        const [a, b] = track.draw.map((v) => v + (track.stagger ? k * track.stagger : 0));
        const width = (track.width ?? 0.45) / part.unit;
        const leaf = part.leaf;
        const color =
          part.fill && part.fill !== 'none'
            ? part.fill
            : part.stroke && part.stroke !== 'none'
              ? part.stroke
              : '#fff';
        const overlay = {
          tag: leaf.tag,
          attrs: leaf.attrs
            .filter(
              ([k2]) =>
                ![
                  'fill',
                  'stroke',
                  'style',
                  'stroke-width',
                  'opacity',
                  'fill-opacity',
                  'id',
                ].includes(k2)
            )
            .concat([
              ['fill', 'none'],
              ['stroke', color],
              ['stroke-width', String(r(width, 4))],
              ['stroke-linecap', 'round'],
              ['stroke-linejoin', 'round'],
              ['pathLength', '1'],
              ['stroke-dasharray', '1 1'],
            ]),
          children: [],
        };
        const fadeIn = track.fill ?? [b - 6, b + 4];
        const ghost = track.ghost ?? 0.16;
        const leafKeys = {
          [Math.max(REST.in, a - 4)]: { o: ghost, e: 'out' },
          [fadeIn[0]]: { o: ghost, e: 'inout' },
          [Math.min(REST.out, fadeIn[1])]: { o: 1, e: 'out' },
        };
        const lc = emit(`t${n++}`, buildFrames(leafKeys, { kind: 'leaf', id }));
        const tc = emit(
          `t${n++}`,
          buildFrames(
            {
              [Math.max(REST.in, a - 4)]: { draw: 1, o: 0, e: 'linear' },
              [a]: { draw: 1, o: 1 },
              [b]: { draw: 0, o: 1 },
              [Math.min(REST.out, b + 8)]: { draw: 0, o: 0 },
            },
            { kind: 'trace', id }
          ),
          'opacity:0;stroke-dashoffset:1'
        );
        setAttr(overlay, 'class', tc);
        part.leafClass = lc;
        part.overlays.push(overlay);
      }
    });
  }

  // Assemble each touched part: transform layers > [leaf (fade layer), trace overlays].
  for (const part of art.parts) {
    if (!part.layers) continue;
    let content = [part.leaf];
    if (part.leafClass)
      content = [{ tag: 'g', attrs: [['class', part.leafClass]], children: content }];
    content = [...content, ...part.overlays];
    const layers = [...part.layers];
    const outer = layers.shift();
    for (const c of layers.reverse())
      content = [{ tag: 'g', attrs: [['class', c]], children: content }];
    if (outer) {
      setAttr(part.wrapper, 'class', outer);
      part.wrapper.children = content;
    } else {
      part.wrapper.children = content;
    }
  }

  // Props (auto-scope any internal id="..." / url(#...) references to tss_${uid}_p${k}_*)
  const under = [];
  const over = [];
  (spec.props || []).forEach((prop, k) => {
    const scopeProp = (s) => {
      if (!s) return s;
      const pfx = `tss_${uid}_p${k}_`;
      const ids = [...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
      let out = s;
      for (const rawId of ids) {
        if (rawId.startsWith(`tss_${uid}_`)) continue;
        out = out
          .replace(new RegExp(`\\bid="${rawId}"`, 'g'), `id="${pfx}${rawId}"`)
          .replace(new RegExp(`url\\(#${rawId}\\)`, 'g'), `url(#${pfx}${rawId})`)
          .replace(new RegExp(`href="#${rawId}"`, 'g'), `href="#${pfx}${rawId}"`);
      }
      return out;
    };
    const combined = scopeProp((prop.defs || '') + '\0' + prop.svg);
    const [scopedDefs, markup] = combined.split('\0');
    const box = propBox(markup);
    const o = originPoint(prop.origin, box);
    const origin = `${r(((o[0] - box.minX) / box.width) * 100, 2)}% ${r(((o[1] - box.minY) / box.height) * 100, 2)}%`;
    const c = emit(
      `q${k}`,
      buildFrames(prop.keys || {}, { kind: 'prop', id }),
      `opacity:0;transform-box:fill-box;transform-origin:${origin}`
    );
    const g = `<g class="${c}">${markup}</g>`;
    (prop.layer === 'under' ? under : over).push(g);
    if (scopedDefs) extraDefs.push(scopedDefs);
  });

  let artMarkup = `<g transform="${art.normTransform}">${serializeBody(art.body)}</g>`;
  if (allWrap)
    for (const c of [...allWrap].reverse()) artMarkup = `<g class="${c}">${artMarkup}</g>`;
  const body = `${under.join('')}${artMarkup}${over.join('')}`;
  const defs = [defsStatic, ...extraDefs].filter(Boolean).join('');

  const reduced = `@media (prefers-reduced-motion: reduce){${animated.map((c) => '.' + c).join(',')}{animation:none!important}}`;
  const style = css.join('') + reduced;

  const xlink = /xlink:/.test(defs + body) ? ' xmlns:xlink="http://www.w3.org/1999/xlink"' : '';
  const head = `<svg xmlns="http://www.w3.org/2000/svg"${xlink} viewBox="0 0 24 24" role="img" aria-label="${label}">`;
  const animatedSvg = `${head}${defs ? `<defs>${defs}</defs>` : ''}<style>${style}</style>${body}</svg>`;
  const xlinkS = /xlink:/.test(defsStatic + staticBody)
    ? ' xmlns:xlink="http://www.w3.org/1999/xlink"'
    : '';
  const sourceSvg = `<svg xmlns="http://www.w3.org/2000/svg"${xlinkS} viewBox="0 0 24 24" role="img" aria-label="${label}">${defsStatic ? `<defs>${defsStatic}</defs>` : ''}${staticBody}</svg>`;

  return {
    sourceSvg,
    animatedSvg,
    parts: { defs, style, body, staticBody, viewBox: '0 0 24 24' },
    concept: spec.story,
    technique: spec.technique || describe(spec),
  };
}

function describe(spec) {
  const bits = [];
  for (const t of spec.tracks || []) {
    const name =
      typeof t.on === 'string'
        ? t.on
        : Array.isArray(t.on)
          ? 'parts'
          : t.on === 'all'
            ? 'mark'
            : 'part';
    bits.push(`${name}${t.draw ? ' outline trace' : ''}${t.stagger ? ' staggered' : ''}`);
  }
  if (spec.props?.length) bits.push(`${spec.props.length} story props`);
  return bits.join(' + ');
}
