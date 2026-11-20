// Path maths: parse, absolutize, flatten, measure, and split into islands.

const NUM = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
const ARGC = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

/** Tokenize into [{cmd, args}] keeping the original letter case. */
export function tokenize(d) {
  const out = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
  let m;
  while ((m = re.exec(d)) !== null) {
    const cmd = m[1];
    const up = cmd.toUpperCase();
    let nums;
    if (up === 'A') nums = parseArcArgs(m[2]);
    else nums = (m[2].match(NUM) || []).map(Number);
    const n = ARGC[up];
    if (n === 0) {
      out.push({ cmd, args: [] });
      continue;
    }
    for (let i = 0; i + n <= nums.length; i += n) {
      // Extra pairs after M/m are implicit lineto.
      const c = i > 0 && up === 'M' ? (cmd === 'M' ? 'L' : 'l') : cmd;
      out.push({ cmd: c, args: nums.slice(i, i + n) });
    }
  }
  return out;
}

// Arc flags can be written without separators ("a1 1 0 011 1").
function parseArcArgs(s) {
  const out = [];
  let i = 0;
  const str = s.trim();
  const re = /[\s,]*([-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?)/y;
  const flag = /[\s,]*([01])/y;
  while (i < str.length) {
    const slot = out.length % 7;
    const r = slot === 3 || slot === 4 ? flag : re;
    r.lastIndex = i;
    const m = r.exec(str);
    if (!m) break;
    out.push(Number(m[1]));
    i = r.lastIndex;
    if (!str.slice(i).trim()) break;
  }
  return out;
}

/** Convert to absolute M/L/C/Q/A/Z segments with explicit start points. */
export function absolutize(d) {
  const segs = [];
  let x = 0,
    y = 0,
    sx = 0,
    sy = 0,
    lastC = null,
    lastQ = null;
  for (const { cmd, args } of tokenize(d)) {
    const rel = cmd === cmd.toLowerCase();
    const up = cmd.toUpperCase();
    const ox = rel ? x : 0,
      oy = rel ? y : 0;
    let seg;
    switch (up) {
      case 'M':
        x = args[0] + ox;
        y = args[1] + oy;
        sx = x;
        sy = y;
        seg = { c: 'M', p: [x, y] };
        lastC = lastQ = null;
        break;
      case 'L':
        seg = { c: 'L', from: [x, y], p: [args[0] + ox, args[1] + oy] };
        break;
      case 'H':
        seg = { c: 'L', from: [x, y], p: [args[0] + (rel ? x : 0), y] };
        break;
      case 'V':
        seg = { c: 'L', from: [x, y], p: [x, args[0] + (rel ? y : 0)] };
        break;
      case 'C':
        seg = {
          c: 'C',
          from: [x, y],
          c1: [args[0] + ox, args[1] + oy],
          c2: [args[2] + ox, args[3] + oy],
          p: [args[4] + ox, args[5] + oy],
        };
        break;
      case 'S': {
        const c1 = lastC ? [2 * x - lastC[0], 2 * y - lastC[1]] : [x, y];
        seg = {
          c: 'C',
          from: [x, y],
          c1,
          c2: [args[0] + ox, args[1] + oy],
          p: [args[2] + ox, args[3] + oy],
        };
        break;
      }
      case 'Q':
        seg = {
          c: 'Q',
          from: [x, y],
          c1: [args[0] + ox, args[1] + oy],
          p: [args[2] + ox, args[3] + oy],
        };
        break;
      case 'T': {
        const c1 = lastQ ? [2 * x - lastQ[0], 2 * y - lastQ[1]] : [x, y];
        seg = { c: 'Q', from: [x, y], c1, p: [args[0] + ox, args[1] + oy] };
        break;
      }
      case 'A':
        seg = {
          c: 'A',
          from: [x, y],
          rx: Math.abs(args[0]),
          ry: Math.abs(args[1]),
          rot: args[2],
          large: args[3],
          sweep: args[4],
          p: [args[5] + ox, args[6] + oy],
        };
        break;
      case 'Z':
        seg = { c: 'Z', from: [x, y], p: [sx, sy] };
        break;
    }
    if (!seg) continue;
    lastC = seg.c === 'C' ? seg.c2 : null;
    lastQ = seg.c === 'Q' ? seg.c1 : null;
    if (seg.c !== 'M') {
      x = seg.p[0];
      y = seg.p[1];
    }
    segs.push(seg);
  }
  return segs;
}

const r3 = (n) => {
  const v = Math.round(n * 1000) / 1000;
  return Object.is(v, -0) ? '0' : String(v);
};

export function segsToD(segs) {
  return segs
    .map((s) => {
      switch (s.c) {
        case 'M':
        case 'L':
          return s.c + r3(s.p[0]) + ' ' + r3(s.p[1]);
        case 'C':
          return `C${[...s.c1, ...s.c2, ...s.p].map(r3).join(' ')}`;
        case 'Q':
          return `Q${[...s.c1, ...s.p].map(r3).join(' ')}`;
        case 'A':
          return `A${r3(s.rx)} ${r3(s.ry)} ${r3(s.rot)} ${s.large ? 1 : 0} ${s.sweep ? 1 : 0} ${r3(s.p[0])} ${r3(s.p[1])}`;
        case 'Z':
          return 'Z';
      }
      return '';
    })
    .join('');
}

function arcPoints(s, steps = 16) {
  const [x1, y1] = s.from;
  const [x2, y2] = s.p;
  let { rx, ry } = s;
  if (!rx || !ry) return [s.p];
  const phi = (s.rot * Math.PI) / 180;
  const cos = Math.cos(phi),
    sin = Math.sin(phi);
  const dx = (x1 - x2) / 2,
    dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) {
    rx *= Math.sqrt(lam);
    ry *= Math.sqrt(lam);
  }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let co = Math.sqrt(Math.max(0, num / den));
  if (s.large === s.sweep) co = -co;
  const cxp = (co * rx * y1p) / ry;
  const cyp = (-co * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => {
    const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
    return a;
  };
  const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!s.sweep && dt > 0) dt -= 2 * Math.PI;
  if (s.sweep && dt < 0) dt += 2 * Math.PI;
  const pts = [];
  for (let i = 1; i <= steps; i++) {
    const t = t1 + (dt * i) / steps;
    pts.push([
      cos * rx * Math.cos(t) - sin * ry * Math.sin(t) + cx,
      sin * rx * Math.cos(t) + cos * ry * Math.sin(t) + cy,
    ]);
  }
  return pts;
}

/** Flatten into closed polygons, one per subpath. */
export function flatten(segsOrD, steps = 10) {
  const segs = typeof segsOrD === 'string' ? absolutize(segsOrD) : segsOrD;
  const polys = [];
  let cur = null;
  for (const s of segs) {
    if (s.c === 'M') {
      cur = [s.p];
      polys.push(cur);
      continue;
    }
    if (!cur) {
      cur = [s.from];
      polys.push(cur);
    }
    if (s.c === 'L' || s.c === 'Z') cur.push(s.p);
    else if (s.c === 'C') {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps,
          u = 1 - t;
        cur.push([
          u * u * u * s.from[0] +
            3 * u * u * t * s.c1[0] +
            3 * u * t * t * s.c2[0] +
            t * t * t * s.p[0],
          u * u * u * s.from[1] +
            3 * u * u * t * s.c1[1] +
            3 * u * t * t * s.c2[1] +
            t * t * t * s.p[1],
        ]);
      }
    } else if (s.c === 'Q') {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps,
          u = 1 - t;
        cur.push([
          u * u * s.from[0] + 2 * u * t * s.c1[0] + t * t * s.p[0],
          u * u * s.from[1] + 2 * u * t * s.c1[1] + t * t * s.p[1],
        ]);
      }
    } else if (s.c === 'A') cur.push(...arcPoints(s));
    if (s.c === 'Z') cur = null;
  }
  return polys.filter((p) => p.length > 1);
}

export function boundsOfPoints(points) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

export const pathBounds = (d) => boundsOfPoints(flatten(d).flat());

export function polyArea(poly) {
  let a = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]);
  }
  return a / 2;
}

export function pointInPoly([x, y], poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i],
      [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * Split a compound path into islands: each outer contour together with the
 * holes (and nested islands-in-holes stay separate) that sit inside it.
 * Returns [{ d, bounds, area }] in drawing order, or a single entry.
 */
export function splitIslands(d) {
  const segs = absolutize(d);
  const subs = [];
  let cur = null;
  for (const s of segs) {
    if (s.c === 'M' || !cur) {
      cur = [];
      subs.push(cur);
      if (s.c !== 'M') cur.push({ c: 'M', p: s.from });
    }
    cur.push(s);
  }
  if (subs.length < 2) return [{ d: segsToD(segs), segs, bounds: pathBounds(d) }];
  const info = subs.map((ss) => {
    const poly = flatten(ss)[0] || [];
    return { segs: ss, poly, bounds: boundsOfPoints(poly), area: Math.abs(polyArea(poly)) };
  });
  // Depth = how many other contours contain this one.
  const sample = (poly) => {
    // A point on the contour nudged nowhere; use several to dodge shared edges.
    return [poly[0], poly[Math.floor(poly.length / 3)], poly[Math.floor((2 * poly.length) / 3)]];
  };
  const contains = (a, b) => {
    if (!a.bounds || !b.bounds || a === b || a.area <= b.area) return false;
    const bb = b.bounds,
      ab = a.bounds;
    if (
      bb.minX < ab.minX - 1e-6 ||
      bb.maxX > ab.maxX + 1e-6 ||
      bb.minY < ab.minY - 1e-6 ||
      bb.maxY > ab.maxY + 1e-6
    )
      return false;
    const pts = sample(b.poly);
    return pts.filter((p) => pointInPoly(p, a.poly)).length >= 2;
  };
  info.forEach((s) => {
    s.parents = info.filter((o) => contains(o, s));
    s.depth = s.parents.length;
  });
  const islands = [];
  for (const s of info) {
    if (s.depth % 2 === 0) islands.push({ outer: s, holes: [] });
  }
  for (const s of info) {
    if (s.depth % 2 === 1) {
      // Attach to the smallest even-depth container.
      const host = islands
        .filter((i) => s.parents.includes(i.outer))
        .sort((a, b) => a.outer.area - b.outer.area)[0];
      if (host) host.holes.push(s);
      else islands.push({ outer: s, holes: [] });
    }
  }
  const order = new Map(info.map((s, i) => [s, i]));
  islands.sort((a, b) => order.get(a.outer) - order.get(b.outer));
  return islands.map((i) => {
    const all = [i.outer, ...i.holes].sort((a, b) => order.get(a) - order.get(b));
    const ss = all.flatMap((s) => s.segs);
    return {
      d: segsToD(ss),
      segs: ss,
      bounds: i.outer.bounds,
      area: i.outer.area - i.holes.reduce((t, h) => t + h.area, 0),
    };
  });
}

/** Total length of a flattened path, used to sample motion along it. */
export function samplePath(d, count) {
  const poly = flatten(d, 24).flat();
  const lens = [0];
  for (let i = 1; i < poly.length; i++) {
    lens.push(lens[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]));
  }
  const total = lens[lens.length - 1];
  const out = [];
  for (let k = 0; k < count; k++) {
    const target = (total * k) / (count - 1);
    let i = lens.findIndex((l) => l >= target);
    if (i <= 0) i = 1;
    const t = (target - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
    out.push([
      poly[i - 1][0] + (poly[i][0] - poly[i - 1][0]) * t,
      poly[i - 1][1] + (poly[i][1] - poly[i - 1][1]) * t,
    ]);
  }
  return out;
}
