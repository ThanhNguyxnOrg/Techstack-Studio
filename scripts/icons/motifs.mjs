// Composable story building blocks (props + track keyframe presets).
// Every keyframe strictly stays within the 6%..72% story window (T = 4.8s).

const clamp = (v) => Math.max(6, Math.min(72, Math.round(v * 100) / 100));

// ── Props (invisible at rest 0..6% and 72..100%) ─────────────────────────────

export const pulseRing = (cx, cy, r, color, t0 = 20, t1 = 54, opts = {}) => ({
  layer: opts.layer || 'under',
  origin: [cx, cy],
  svg: `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${opts.sw ?? 0.6}"${opts.dash ? ` stroke-dasharray="${opts.dash}"` : ''}/>`,
  keys: {
    [clamp(t0)]: { s: opts.s0 ?? 0.72, o: 0, e: 'out' },
    [clamp(t0 + (t1 - t0) * 0.35)]: { s: opts.sMid ?? 1.1, o: opts.o ?? 0.85, e: 'out' },
    [clamp(t1)]: { s: opts.s1 ?? 1.32, o: 0, e: 'out' },
  },
});

export const packet = (x0, y0, x1, y1, color, t0 = 14, t1 = 56, r = 1.0) => ({
  layer: 'over',
  svg: `<circle cx="${x0}" cy="${y0}" r="${r}" fill="${color}"/>`,
  keys: {
    [clamp(t0)]: { x: 0, y: 0, s: 0.4, o: 0, e: 'out' },
    [clamp(t0 + 4)]: { x: 0, y: 0, s: 1.08, o: 1, e: 'inout' },
    [clamp(t1 - 5)]: { x: x1 - x0, y: y1 - y0, s: 1.0, o: 1, e: 'out' },
    [clamp(t1)]: { x: x1 - x0, y: y1 - y0, s: 1.4, o: 0, e: 'out' },
  },
});

export const spark = (x, y, dx, dy, color, t0 = 24, t1 = 44) => ({
  layer: 'over',
  svg: `<line x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}" stroke="${color}" stroke-width="0.75" stroke-linecap="round"/>`,
  keys: {
    [clamp(t0)]: { x: -dx * 0.4, y: -dy * 0.4, s: 0.4, o: 0, e: 'out' },
    [clamp(t0 + (t1 - t0) * 0.35)]: { x: dx * 0.15, y: dy * 0.15, s: 1.08, o: 1, e: 'out' },
    [clamp(t1)]: { x: dx * 0.7, y: dy * 0.7, s: 0.6, o: 0, e: 'out' },
  },
});

export const radar = (cx, cy, r, color, t0 = 12, t1 = 64, deg = 120) => ({
  layer: 'under',
  origin: [cx, cy],
  svg: `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="0.55" stroke-dasharray="5 8"/>`,
  keys: {
    [clamp(t0)]: { r: 0, s: 0.92, o: 0, e: 'out' },
    [clamp(t0 + 10)]: { r: deg * 0.25, s: 1.0, o: 0.75, e: 'linear' },
    [clamp(t1 - 10)]: { r: deg * 0.8, s: 1.02, o: 0.6, e: 'out' },
    [clamp(t1)]: { r: deg, s: 1.04, o: 0, e: 'out' },
  },
});

export const waveLine = (y, color, t0 = 10, t1 = 64) => ({
  layer: 'under',
  svg: `<path d="M2.5 ${y} Q7 ${y - 1.3} 12 ${y} T21.5 ${y}" fill="none" stroke="${color}" stroke-width="0.65" stroke-linecap="round"/>`,
  keys: {
    [clamp(t0)]: { x: -1.4, o: 0, e: 'out' },
    [clamp(t0 + 12)]: { x: -0.3, o: 0.7, e: 'inout' },
    [clamp(t1 - 12)]: { x: 0.9, o: 0.6, e: 'inout' },
    [clamp(t1)]: { x: 1.6, o: 0, e: 'out' },
  },
});

export const checkFlash = (x, y, color = '#86EFAC', t0 = 42, t1 = 66) => ({
  layer: 'over',
  svg: `<path d="M${x} ${y} l1.2 1.2 l2.4 -2.6" fill="none" stroke="${color}" stroke-width="0.95" stroke-linecap="round" stroke-linejoin="round"/>`,
  keys: {
    [clamp(t0)]: { s: 0.5, o: 0, e: 'out' },
    [clamp(t0 + 6)]: { s: 1.1, o: 1, e: 'settle' },
    [clamp(t1 - 6)]: { s: 1.0, o: 0.95, e: 'out' },
    [clamp(t1)]: { s: 0.85, o: 0, e: 'out' },
  },
});

export const boltFlash = (x, y, color = '#FDE047', t0 = 20, t1 = 48) => ({
  layer: 'over',
  svg: `<path d="M${x} ${y} l-1.5 3.1 h2.1 l-1.5 3.0" fill="none" stroke="${color}" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round"/>`,
  keys: {
    [clamp(t0)]: { s: 0.4, o: 0, e: 'out' },
    [clamp(t0 + 6)]: { s: 1.12, o: 1, e: 'out' },
    [clamp(t1 - 8)]: { s: 0.98, o: 0.9, e: 'out' },
    [clamp(t1)]: { s: 0.6, o: 0, e: 'out' },
  },
});

export const sheen = (clipSvg, t0 = 42, t1 = 66, opacity = 0.28) => ({
  layer: 'over',
  defs: `<clipPath id="clip">${clipSvg}</clipPath>`,
  svg: `<g clip-path="url(#clip)"><polygon points="-4,0 2,0 -4,24 -10,24" fill="#FFFFFF" opacity="${opacity}"/></g>`,
  keys: {
    [clamp(t0)]: { x: 0, o: 0, e: 'linear' },
    [clamp(t0 + 3)]: { x: 2, o: 1, e: 'inout' },
    [clamp(t1 - 3)]: { x: 30, o: 1, e: 'linear' },
    [clamp(t1)]: { x: 32, o: 0, e: 'out' },
  },
});

export const guides = (lines, color = '#38BDF8', t0 = 10, t1 = 58) => ({
  layer: 'under',
  svg: `<g stroke="${color}" stroke-width="0.35" stroke-dasharray="1.1 1.1">${lines.map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`).join('')}</g>`,
  keys: {
    [clamp(t0)]: { o: 0, e: 'out' },
    [clamp(t0 + 8)]: { o: 0.7, e: 'linear' },
    [clamp(t1 - 10)]: { o: 0.65, e: 'out' },
    [clamp(t1)]: { o: 0, e: 'out' },
  },
});

export const telemetryBar = (x, y, w, h, color, t0 = 16, t1 = 58) => ({
  layer: 'over',
  origin: [x + w / 2, y + h],
  svg: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="0.4" fill="${color}"/>`,
  keys: {
    [clamp(t0)]: { sy: 0.15, o: 0, e: 'out' },
    [clamp(t0 + 10)]: { sy: 1.05, o: 0.9, e: 'settle' },
    [clamp(t1 - 10)]: { sy: 0.95, o: 0.85, e: 'out' },
    [clamp(t1)]: { sy: 0.2, o: 0, e: 'out' },
  },
});

// ── Track keyframe presets ───────────────────────────────────────────────────

export const dropIn = (t0 = 12, dy = 3.2) => ({
  [clamp(t0)]: { y: -dy, o: 0, e: 'in' },
  [clamp(t0 + 4)]: { y: -dy * 0.72, o: 1, e: 'out' },
  [clamp(t0 + 16)]: { y: 0.3, o: 1, e: 'settle' },
  [clamp(t0 + 24)]: { y: 0, o: 1, e: 'out' },
});

export const riseIn = (t0 = 12, dy = 3.2) => ({
  [clamp(t0)]: { y: dy, o: 0, e: 'in' },
  [clamp(t0 + 4)]: { y: dy * 0.72, o: 1, e: 'out' },
  [clamp(t0 + 16)]: { y: -0.3, o: 1, e: 'settle' },
  [clamp(t0 + 24)]: { y: 0, o: 1, e: 'out' },
});

export const slideIn = (t0 = 12, dx = -3.0, dy = 0) => ({
  [clamp(t0)]: { x: dx, y: dy, o: 0.2, e: 'inout' },
  [clamp(t0 + 16)]: { x: -dx * 0.08, y: -dy * 0.08, o: 1, e: 'settle' },
  [clamp(t0 + 24)]: { x: 0, y: 0, o: 1, e: 'out' },
});

export const popIn = (t0 = 12, s0 = 0.35) => ({
  [clamp(t0)]: { s: s0, o: 0, e: 'in' },
  [clamp(t0 + 12)]: { s: 1.14, o: 1, e: 'settle' },
  [clamp(t0 + 22)]: { s: 1, o: 1, e: 'out' },
});

export const sway = (t0 = 10, deg = 5, dy = 0.5) => ({
  [clamp(t0)]: { r: -deg, y: dy, e: 'inout' },
  [clamp(t0 + 18)]: { r: deg * 0.8, y: -dy, e: 'inout' },
  [clamp(t0 + 36)]: { r: -deg * 0.45, y: dy * 0.5, e: 'inout' },
  [clamp(t0 + 50)]: { r: 0, y: 0, e: 'out' },
});

export const torque = (t0 = 12, d1 = 22, d2 = 46) => ({
  [clamp(t0)]: { r: -12, e: 'inout' },
  [clamp(t0 + 14)]: { r: d1, e: 'settle' },
  [clamp(t0 + 22)]: { r: d1 - 4, e: 'inout' },
  [clamp(t0 + 36)]: { r: d2, e: 'settle' },
  [clamp(t0 + 48)]: { r: -3, e: 'settle' },
  [clamp(t0 + 56)]: { r: 0, e: 'out' },
});

export const steer = (t0 = 12, left = -42, right = 54) => ({
  [clamp(t0)]: { r: left, e: 'inout' },
  [clamp(t0 + 26)]: { r: right, e: 'inout' },
  [clamp(t0 + 42)]: { r: -5, e: 'settle' },
  [clamp(t0 + 52)]: { r: 0, e: 'out' },
});

export const heartbeat = (t0 = 12, amp = 0.1) => ({
  [clamp(t0)]: { s: 0.94, e: 'inout' },
  [clamp(t0 + 10)]: { s: 1 + amp, e: 'settle' },
  [clamp(t0 + 18)]: { s: 0.96, e: 'inout' },
  [clamp(t0 + 28)]: { s: 1 + amp * 0.65, e: 'settle' },
  [clamp(t0 + 42)]: { s: 1, e: 'out' },
});

export const nod = (t0 = 20, deg = 6) => ({
  [clamp(t0)]: { r: -deg, y: -0.4, e: 'inout' },
  [clamp(t0 + 14)]: { r: deg * 0.55, y: 0.25, e: 'settle' },
  [clamp(t0 + 28)]: { r: 0, y: 0, e: 'out' },
});

export const flipX = (t0 = 14) => ({
  [clamp(t0)]: { sx: 0.15, o: 0.5, e: 'in' },
  [clamp(t0 + 18)]: { sx: 1.07, o: 1, e: 'settle' },
  [clamp(t0 + 30)]: { sx: 1, o: 1, e: 'out' },
});

export const breathe = (t0 = 12, amp = 0.06) => ({
  [clamp(t0)]: { s: 1 - amp * 0.6, e: 'inout' },
  [clamp(t0 + 20)]: { s: 1 + amp, e: 'inout' },
  [clamp(t0 + 42)]: { s: 1, e: 'out' },
});
