export const IDENTITY = [1, 0, 0, 1, 0, 0];

const degrees = (value) => (value * Math.PI) / 180;

/** Multiply two 2D affine matrices (a, b, c, d, e, f). */
export function multiply(m, n) {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

/** Parse one SVG transform list such as "translate(...) scale(...)" into a matrix. */
export function parseTransform(input) {
  let matrix = IDENTITY;
  const pattern = /(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g;
  let match;
  while ((match = pattern.exec(String(input || ''))) !== null) {
    const name = match[1];
    const args = match[2]
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number)
      .filter((value) => Number.isFinite(value));
    let next = IDENTITY;

    if (name === 'matrix' && args.length >= 6) {
      next = args.slice(0, 6);
    } else if (name === 'translate') {
      next = [1, 0, 0, 1, args[0] || 0, args[1] || 0];
    } else if (name === 'scale') {
      const sx = args[0] === undefined ? 1 : args[0];
      next = [sx, 0, 0, args[1] === undefined ? sx : args[1], 0, 0];
    } else if (name === 'rotate') {
      const angle = degrees(args[0] || 0);
      const rotation = [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0];
      if (args.length >= 3) {
        const [, cx, cy] = args;
        next = multiply(multiply([1, 0, 0, 1, cx, cy], rotation), [1, 0, 0, 1, -cx, -cy]);
      } else {
        next = rotation;
      }
    } else if (name === 'skewX') {
      next = [1, 0, Math.tan(degrees(args[0] || 0)), 1, 0, 0];
    } else if (name === 'skewY') {
      next = [1, Math.tan(degrees(args[0] || 0)), 0, 1, 0, 0];
    }

    matrix = multiply(matrix, next);
  }
  return matrix;
}

/** Compose a list of transform strings, outermost first. */
export function composeTransforms(list) {
  return (list || []).reduce((acc, value) => multiply(acc, parseTransform(value)), IDENTITY);
}

/** Bounding box of a rectangle after a matrix, kept per axis for non-uniform scale. */
export function transformBounds(bounds, matrix) {
  const points = [
    [bounds.minX, bounds.minY],
    [bounds.maxX, bounds.minY],
    [bounds.maxX, bounds.maxY],
    [bounds.minX, bounds.maxY],
  ].map(([x, y]) => [
    matrix[0] * x + matrix[2] * y + matrix[4],
    matrix[1] * x + matrix[3] * y + matrix[5],
  ]);
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

const CONTAINERS = new Set(['svg', 'g', 'a', 'switch']);
const DEFINITIONS = new Set(['defs', 'symbol', 'clipPath', 'mask', 'marker', 'pattern']);

const attr = (attrs, name) => {
  const match = new RegExp(`\\s${name}="([^"]*)"`).exec(attrs);
  return match ? match[1] : null;
};

const number = (attrs, name, fallback) => {
  const raw = attr(attrs, name);
  const value = raw === null ? NaN : Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
};

const union = (a, b) => {
  if (a === null) return b;
  if (b === null) return a;
  const minX = Math.min(a.minX, b.minX);
  const minY = Math.min(a.minY, b.minY);
  const maxX = Math.max(a.maxX, b.maxX);
  const maxY = Math.max(a.maxY, b.maxY);
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
};

/** Inner markup of the element that owns `id`, used to resolve <use href="#id">. */
const extractById = (source, id) => {
  const opening = new RegExp(`<([A-Za-z][\\w:.-]*)([^>]*?\\sid="${id}"[^>]*?)(/?)>`).exec(source);
  if (!opening) return null;
  const whole = opening[0];
  const name = opening[1];
  if (opening[3] === '/') return '';
  const start = opening.index + whole.length;
  const pattern = new RegExp(`<(/?)${name}\\b[^>]*?(/?)>`, 'g');
  pattern.lastIndex = start;
  let depth = 1;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    if (match[0].length === 0) break;
    if (match[1] === '/') depth -= 1;
    else if (match[2] !== '/') depth += 1;
    if (depth === 0) return source.slice(start, match.index);
  }
  return null;
};

const TAG_SOURCE = '<(\\/?)([A-Za-z][\\w:.-]*)([^>]*?)(\\/?)>';

/**
 * Union of everything the document actually draws, in root user space.
 * Each element uses its own ancestor matrix, definitions only count where a
 * <use> places them, and <image> rectangles and <use> offsets are measured.
 *
 * @param svg markup to measure
 * @param pathBounds (d: string) => {minX,minY,maxX,maxY} | null
 */
export function measureArtwork(svg, pathBounds) {
  const source = String(svg || '');

  const walk = (markup, startMatrix, hidden, depth) => {
    const stack = [{ matrix: startMatrix, hidden, name: 'root' }];
    let bounds = null;
    const pattern = new RegExp(TAG_SOURCE, 'g');
    let match;

    const leaf = (name, attrs, matrix) => {
      if (name === 'path') {
        const d = attr(attrs, 'd');
        const box = d ? pathBounds(d) : null;
        return box ? transformBounds(box, matrix) : null;
      }
      const rectOf = (x, y, width, height) =>
        transformBounds(
          { minX: x, minY: y, maxX: x + width, maxY: y + height, width, height },
          matrix
        );
      if (name === 'circle') {
        const r = number(attrs, 'r', 0);
        if (!(r > 0)) return null;
        return rectOf(number(attrs, 'cx', 0) - r, number(attrs, 'cy', 0) - r, 2 * r, 2 * r);
      }
      if (name === 'ellipse') {
        const rx = number(attrs, 'rx', 0);
        const ry = number(attrs, 'ry', 0);
        if (!(rx > 0) || !(ry > 0)) return null;
        return rectOf(number(attrs, 'cx', 0) - rx, number(attrs, 'cy', 0) - ry, 2 * rx, 2 * ry);
      }
      if (name === 'rect') {
        const width = number(attrs, 'width', 0);
        const height = number(attrs, 'height', 0);
        if (!(width > 0) || !(height > 0)) return null;
        return rectOf(number(attrs, 'x', 0), number(attrs, 'y', 0), width, height);
      }
      if (name === 'line') {
        return rectOf(
          Math.min(number(attrs, 'x1', 0), number(attrs, 'x2', 0)),
          Math.min(number(attrs, 'y1', 0), number(attrs, 'y2', 0)),
          Math.abs(number(attrs, 'x2', 0) - number(attrs, 'x1', 0)),
          Math.abs(number(attrs, 'y2', 0) - number(attrs, 'y1', 0))
        );
      }
      if (name === 'polygon' || name === 'polyline') {
        const values = (attr(attrs, 'points') || '')
          .split(/[\s,]+/)
          .filter(Boolean)
          .map(Number)
          .filter((value) => Number.isFinite(value));
        if (values.length < 4) return null;
        const xs = values.filter((_, index) => index % 2 === 0);
        const ys = values.filter((_, index) => index % 2 === 1);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        return rectOf(minX, minY, Math.max(...xs) - minX, Math.max(...ys) - minY);
      }
      if (name === 'image') {
        const width = number(attrs, 'width', 0);
        const height = number(attrs, 'height', 0);
        if (!(width > 0) || !(height > 0)) return null;
        const x = number(attrs, 'x', 0);
        const y = number(attrs, 'y', 0);
        return transformBounds(
          { minX: x, minY: y, maxX: x + width, maxY: y + height, width, height },
          matrix
        );
      }
      if (name === 'use' && depth < 4) {
        const href = attr(attrs, 'href') || attr(attrs, 'xlink:href');
        if (!href || !href.startsWith('#')) return null;
        const inner = extractById(source, href.slice(1));
        if (!inner) return null;
        const offset = multiply(matrix, [1, 0, 0, 1, number(attrs, 'x', 0), number(attrs, 'y', 0)]);
        return walk(inner, offset, false, depth + 1);
      }
      return null;
    };

    while ((match = pattern.exec(markup)) !== null) {
      const closing = match[1];
      const name = match[2];
      const attrs = match[3];
      const selfClosing = match[4] === '/';
      const top = stack[stack.length - 1];
      if (closing) {
        if (stack.length > 1 && top.name === name) stack.pop();
        continue;
      }
      const transform = attr(attrs, 'transform');
      const own = transform ? multiply(top.matrix, parseTransform(transform)) : top.matrix;
      const nestedHidden = top.hidden || DEFINITIONS.has(name);
      if (!selfClosing && (CONTAINERS.has(name) || DEFINITIONS.has(name))) {
        stack.push({ matrix: own, hidden: nestedHidden, name });
        continue;
      }
      if (!nestedHidden) bounds = union(bounds, leaf(name, attrs, own));
    }
    return bounds;
  };

  return walk(source, IDENTITY, false, 0);
}
