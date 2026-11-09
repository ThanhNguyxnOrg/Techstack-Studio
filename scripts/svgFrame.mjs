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
