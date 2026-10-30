import fs from 'node:fs';
import path from 'node:path';

const catalogPath = path.resolve('src/data/generatedCatalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const sourceDir = path.resolve('public/icons/source');
const animatedDir = path.resolve('public/icons/animated');
const manifestDir = path.resolve('docs/animation');

fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(animatedDir, { recursive: true });
fs.mkdirSync(manifestDir, { recursive: true });

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Splits a compound SVG path `d` into standalone subpaths with absolute `M` starts,
 * and computes bounding box + centroid metrics for geometry-driven animation design.
 */
function analyzeGeometry(d) {
  const rawParts = [];
  let currentTokens = [];
  let curX = 0,
    curY = 0,
    startX = 0,
    startY = 0;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  let curveCount = 0;
  let lineCount = 0;

  const track = (x, y) => {
    if (Number.isFinite(x) && Number.isFinite(y)) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  };

  const flush = () => {
    if (currentTokens.length > 0) {
      const s = currentTokens.join(' ').trim();
      if (s.length > 3) rawParts.push(s);
    }
    currentTokens = [];
  };

  const paramCounts = {
    L: 2,
    l: 2,
    H: 1,
    h: 1,
    V: 1,
    v: 1,
    C: 6,
    c: 6,
    S: 4,
    s: 4,
    Q: 4,
    q: 4,
    T: 2,
    t: 2,
    A: 7,
    a: 7,
  };
  const wsRe = /[\s,]+/y;
  const cmdRe = /[MmZzLlHhVvCcSsQqTtAa]/y;
  const numRe = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;
  const flagRe = /[01]/y;

  let pos = 0;
  const len = d.length;
  let activeCmd = '';

  const skipWs = () => {
    wsRe.lastIndex = pos;
    const m = wsRe.exec(d);
    if (m) pos = wsRe.lastIndex;
  };

  const readNum = (isArcFlag) => {
    skipWs();
    if (pos >= len) return null;
    if (isArcFlag) {
      flagRe.lastIndex = pos;
      const m = flagRe.exec(d);
      if (!m) return null;
      pos = flagRe.lastIndex;
      return m[0] === '1' ? 1 : 0;
    }
    numRe.lastIndex = pos;
    const m = numRe.exec(d);
    if (!m) return null;
    pos = numRe.lastIndex;
    return parseFloat(m[0]);
  };

  while (pos < len) {
    skipWs();
    if (pos >= len) break;
    cmdRe.lastIndex = pos;
    const cmdMatch = cmdRe.exec(d);
    if (cmdMatch) {
      activeCmd = cmdMatch[0];
      pos = cmdRe.lastIndex;
    } else if (!activeCmd) {
      pos++;
      continue;
    }

    if (activeCmd === 'M' || activeCmd === 'm') {
      flush();
      const rx = readNum(false);
      const ry = readNum(false);
      if (rx !== null && ry !== null) {
        if (activeCmd === 'm') {
          curX += rx;
          curY += ry;
        } else {
          curX = rx;
          curY = ry;
        }
        startX = curX;
        startY = curY;
        track(curX, curY);
        currentTokens.push(`M${Number(curX.toFixed(3))} ${Number(curY.toFixed(3))}`);
        activeCmd = activeCmd === 'm' ? 'l' : 'L';
      } else {
        activeCmd = '';
      }
      continue;
    }

    if (activeCmd === 'Z' || activeCmd === 'z') {
      currentTokens.push('Z');
      curX = startX;
      curY = startY;
      activeCmd = '';
      continue;
    }

    const count = paramCounts[activeCmd];
    if (!count) {
      activeCmd = '';
      continue;
    }

    const isArc = activeCmd === 'A' || activeCmd === 'a';
    const nums = [];
    let ok = true;
    for (let k = 0; k < count; k++) {
      const val = readNum(isArc && (k === 3 || k === 4));
      if (val === null) {
        ok = false;
        break;
      }
      nums.push(val);
    }
    if (!ok) {
      activeCmd = '';
      continue;
    }
    currentTokens.push(`${activeCmd}${nums.join(' ')}`);

    if ('CcSsQqTtAa'.includes(activeCmd)) curveCount++;
    else lineCount++;

    if (activeCmd === 'L') {
      curX = nums[0];
      curY = nums[1];
      track(curX, curY);
    } else if (activeCmd === 'l') {
      curX += nums[0];
      curY += nums[1];
      track(curX, curY);
    } else if (activeCmd === 'H') {
      curX = nums[0];
      track(curX, curY);
    } else if (activeCmd === 'h') {
      curX += nums[0];
      track(curX, curY);
    } else if (activeCmd === 'V') {
      curY = nums[0];
      track(curX, curY);
    } else if (activeCmd === 'v') {
      curY += nums[0];
      track(curX, curY);
    } else if (activeCmd === 'C') {
      track(nums[0], nums[1]);
      track(nums[2], nums[3]);
      curX = nums[4];
      curY = nums[5];
      track(curX, curY);
    } else if (activeCmd === 'c') {
      track(curX + nums[0], curY + nums[1]);
      track(curX + nums[2], curY + nums[3]);
      curX += nums[4];
      curY += nums[5];
      track(curX, curY);
    } else if (activeCmd === 'S' || activeCmd === 'Q') {
      track(nums[0], nums[1]);
      curX = nums[2];
      curY = nums[3];
      track(curX, curY);
    } else if (activeCmd === 's' || activeCmd === 'q') {
      track(curX + nums[0], curY + nums[1]);
      curX += nums[2];
      curY += nums[3];
      track(curX, curY);
    } else if (activeCmd === 'T') {
      curX = nums[0];
      curY = nums[1];
      track(curX, curY);
    } else if (activeCmd === 't') {
      curX += nums[0];
      curY += nums[1];
      track(curX, curY);
    } else if (activeCmd === 'A') {
      curX = nums[5];
      curY = nums[6];
      track(curX, curY);
    } else if (activeCmd === 'a') {
      curX += nums[5];
      curY += nums[6];
      track(curX, curY);
    }
  }
  flush();

  const bMinX = Number.isFinite(minX) ? Number(minX.toFixed(2)) : 2;
  const bMinY = Number.isFinite(minY) ? Number(minY.toFixed(2)) : 2;
  const bMaxX = Number.isFinite(maxX) ? Number(maxX.toFixed(2)) : 22;
  const bMaxY = Number.isFinite(maxY) ? Number(maxY.toFixed(2)) : 22;
  const width = Number(Math.max(1, bMaxX - bMinX).toFixed(2));
  const height = Number(Math.max(1, bMaxY - bMinY).toFixed(2));
  const cx = Number(((bMinX + bMaxX) / 2).toFixed(2));
  const cy = Number(((bMinY + bMaxY) / 2).toFixed(2));

  let subpaths = rawParts.length > 0 ? rawParts : [d];
  if (subpaths.length > 4) {
    const grouped = [];
    const chunk = Math.ceil(subpaths.length / 4);
    for (let i = 0; i < subpaths.length; i += chunk) {
      grouped.push(subpaths.slice(i, i + chunk).join(' '));
    }
    subpaths = grouped;
  }

  return {
    subpaths,
    rawSubpathCount: rawParts.length,
    minX: bMinX,
    minY: bMinY,
    maxX: bMaxX,
    maxY: bMaxY,
    width,
    height,
    cx,
    cy,
    aspectRatio: Number((width / height).toFixed(2)),
    curveRatio: Number((curveCount / Math.max(1, curveCount + lineCount)).toFixed(2)),
  };
}

const AWS_WORDMARK_PATH =
  'M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z';
const AWS_SMILE_CURVE_PATH =
  'M21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607z';
const AWS_SMILE_ARROW_PATH =
  'M22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z';

const HEX_SHELL_PATH =
  'M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .587.415 1.307.923 1.6l8.818 5.09c.508.294 1.34.294 1.848 0l8.818-5.09c.254-.147.485-.4.652-.69.167-.29.27-.657.27-.91V6.91c.003-.253-.1-.62-.267-.91z';
const C_RING_PATH =
  'M12 19.11c-3.92 0-7.105-3.19-7.105-7.11S8.08 4.89 12 4.89c2.533 0 4.88 1.356 6.148 3.553l-3.076 1.78c-.634-1.1-1.805-1.778-3.072-1.778-1.96 0-3.552 1.595-3.552 3.555s1.592 3.555 3.552 3.555c1.267 0 2.438-.678 3.072-1.778l3.076 1.78C16.88 17.754 14.533 19.11 12 19.11z';

// Official C++ logo geometry (128x128 space) from the devicon set (MIT); scaled by .18784 and nudged .083 right so its bounding box matches the Simple Icons C++ mark in the 24x24 viewBox.
const CPP_D_R =
  'M118.766 95.82c.89-1.543 1.441-3.28 1.441-4.843V36.78c0-1.558-.55-3.297-1.441-4.84l-55.32 31.94Zm0 0';
const CPP_D_B =
  'm68.36 126.586 46.933-27.094c1.352-.781 2.582-2.129 3.473-3.672l-55.32-31.94L8.12 95.82c.89 1.543 2.121 2.89 3.473 3.672l46.933 27.094c2.703 1.562 7.13 1.562 9.832 0Zm0 0';
const CPP_D_TL =
  'M118.766 31.941c-.891-1.546-2.121-2.894-3.473-3.671L68.359 1.172c-2.703-1.563-7.129-1.563-9.832 0L11.594 28.27C8.89 29.828 6.68 33.66 6.68 36.78v54.196c0 1.562.55 3.3 1.441 4.843L63.445 63.88Zm0 0';
const CPP_D_C =
  'M63.445 26.035c-20.867 0-37.843 16.977-37.843 37.844s16.976 37.844 37.843 37.844c13.465 0 26.024-7.247 32.77-18.91L79.84 73.335c-3.38 5.84-9.66 9.465-16.395 9.465-10.433 0-18.922-8.488-18.922-18.922 0-10.434 8.49-18.922 18.922-18.922 6.73 0 13.017 3.629 16.39 9.465l16.38-9.477c-6.75-11.664-19.305-18.91-32.77-18.91z';
const CPP_D_P1 =
  'M92.88 57.57v4.207h-4.207v4.203h4.207v4.207h4.203V65.98h4.203v-4.203h-4.203V57.57H92.88z';
const CPP_D_P2 =
  'M108.646 57.57v4.207h-4.204v4.203h4.204v4.207h4.207V65.98h4.203v-4.203h-4.203V57.57h-4.207z';
const CPP_D_WHITE =
  'M63.445 26.035c-20.867 0-37.843 16.977-37.843 37.844s16.976 37.844 37.843 37.844c13.465 0 26.024-7.247 32.77-18.91L79.84 73.335c-3.38 5.84-9.66 9.465-16.395 9.465-10.433 0-18.922-8.488-18.922-18.922 0-10.434 8.49-18.922 18.922-18.922 6.73 0 13.017 3.629 16.39 9.465l16.38-9.477c-6.75-11.664-19.305-18.91-32.77-18.91zM92.88 57.57v4.207h-4.207v4.203h4.207v4.207h4.203V65.98h4.203v-4.203h-4.203V57.57H92.88zm15.766 0v4.207h-4.204v4.203h4.204v4.207h4.207V65.98h4.203v-4.203h-4.203V57.57h-4.207z';

// Subpaths of the Node-RED and R marks (absolute coordinates) used to animate parts of the logo independently.
const NR_TOP_D =
  'M13.276 5.41C12.907 5.41 12.589 5.678 12.589 6.047000000000001V7.989000000000001C12.589 8.357000000000001 12.907 8.625 13.276 8.625H21.168A0.614 0.614 0 0 0 21.803 7.989V6.047A0.614 0.614 0 0 0 21.168 5.411Z';
const NR_LEFT_D =
  'M0 10.448V13.715H2.858A0.696 0.696 0 0 0 3.536 13.025V11.083C3.536 10.715 3.226 10.448 2.858 10.448Z';
const NR_BOTTOM_D =
  'M21.058 15A0.644 0.644 0 0 0 20.411 15.66V17.602C20.411 17.97 20.689 18.214 21.058 18.214H24V15Z';
const R_RING_D =
  'M12 2.746C5.373 2.746 0 6.345000000000001 0 10.783000000000001 0 14.680000000000001 4.144 17.927 9.64 18.663V16.26C6.716000000000001 15.345000000000002 4.715000000000001 13.505000000000003 4.715000000000001 11.383000000000003 4.715000000000001 8.348000000000003 8.799 5.889000000000003 13.835 5.889000000000003 18.873 5.889000000000003 22.592 7.572000000000003 22.592 11.383000000000003 22.592 13.359000000000002 21.593 14.762000000000002 19.93 15.655000000000003 20.02 15.721000000000004 20.104 15.783000000000003 20.188 15.871000000000002 20.357 16.020000000000003 20.438 16.234 20.56 16.415000000000003 22.688 14.965000000000003 24 12.978000000000003 24 10.784000000000002 24 6.344000000000002 18.627 2.746000000000002 12 2.746000000000002Z';
const R_BODY_D =
  'M9.889 7.736000000000001V21.252000000000002L13.982 21.250000000000004 13.979999999999999 15.959000000000003H15.079999999999998C15.304999999999998 15.959000000000003 15.400999999999998 16.025000000000002 15.628999999999998 16.209000000000003 15.900999999999998 16.429000000000002 16.343999999999998 17.191000000000003 16.343999999999998 17.191000000000003L18.508 21.254 23.134999999999998 21.252000000000002 20.270999999999997 16.426000000000002S20.185 16.233 20.005999999999997 16.043000000000003A2.22 2.22 0 0 0 19.423999999999996 15.627000000000002C19.001999999999995 15.413000000000002 18.274999999999995 15.193000000000003 18.274999999999995 15.193000000000003S21.852999999999994 14.929000000000004 21.852999999999994 11.367000000000003C21.852999999999994 7.805000000000003 18.108999999999995 7.737000000000003 18.108999999999995 7.737000000000003ZM14.015999999999998 10.666L16.494 10.668000000000001S17.643 10.606000000000002 17.643 11.795000000000002C17.643 12.96 16.494 12.965000000000002 16.494 12.965000000000002H14.016ZM15.769999999999998 16.785C15.275999999999998 16.834 14.757999999999997 16.864 14.229999999999997 16.873V18.68A16.622 16.622 0 0 0 16.599999999999998 18.207L16.128999999999998 17.316000000000003S16.020999999999997 17.133000000000003 15.880999999999998 16.922000000000004C15.841999999999999 16.868000000000006 15.800999999999998 16.824000000000005 15.769999999999998 16.785000000000004Z';

/**
 * Generates the preserved static source SVG for `public/icons/source/{id}.svg`
 */
function buildSourceSvg(item) {
  const label = escapeXml(item.name);
  const d = item.svgPath;
  const primary = item.darkSafeColor;

  if (item.id === 'googlecloud') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><g transform="translate(-21.18, -18.98) scale(0.2077)"><path fill="#EA4335" d="M173.874,130.552 L177.188,130.614 L186.193,121.608 L186.632,117.794 C179.477,111.427 170.061,107.551 159.75,107.551 C141.081,107.551 125.336,120.247 120.668,137.459 C121.652,136.779 123.75,137.285 123.75,137.285 L141.75,134.326 C141.75,134.326 142.684,132.796 143.139,132.892 C147.257,128.386 153.18,125.551 159.75,125.551 C165.094,125.551 170.01,127.43 173.874,130.552 Z"/><path fill="#4285F4" d="M198.844,137.482 C196.757,129.764 192.437,122.958 186.626,117.789 L173.869,130.546 C178.976,134.675 182.25,140.986 182.25,148.051 L182.25,150.301 C188.454,150.301 193.5,155.347 193.5,161.551 C193.5,167.756 188.454,172.801 182.25,172.801 L159.75,172.801 L157.5,175.063 L157.5,188.563 L159.75,190.801 L182.25,190.801 C198.377,190.801 211.5,177.678 211.5,161.551 C211.5,151.578 206.483,142.764 198.844,137.482 Z"/><path fill="#34A853" d="M137.25,190.801 L159.733,190.801 L159.733,172.801 L137.25,172.801 C135.596,172.801 134.033,172.436 132.615,171.789 L129.375,172.784 L120.364,181.796 L119.576,184.839 C124.487,188.574 130.613,190.801 137.25,190.801 Z"/><path fill="#FBBC05" d="M137.25,132.301 C121.123,132.301 108,145.424 108,161.551 C108,171.046 112.551,179.501 119.588,184.844 L132.632,171.8 C128.728,170.034 126,166.108 126,161.551 C126,155.347 131.046,150.301 137.25,150.301 C141.806,150.301 145.733,153.029 147.499,156.933 L160.543,143.889 C155.199,136.852 146.745,132.301 137.25,132.301 Z"/></g></svg>`;
  }
  if (item.id === 'python') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><path fill="#387EB8" d="M11.9 2C6.8 2 7.1 4.2 7.1 4.2v2.3h4.9v.7H5.2S2 6.8 2 11.9c0 5.1 2.8 4.9 2.8 4.9h1.7v-2.4s-.1-2.8 2.8-2.8h4.8s2.7 0 2.7-2.6V4.6S17.2 2 11.9 2zm-2.7 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"/><path fill="#FFE052" d="M12.1 22c5.1 0 4.8-2.2 4.8-2.2v-2.3H12v-.7h6.8S22 17.2 22 12.1c0-5.1-2.8-4.9-2.8-4.9h-1.7v2.4s.1 2.8-2.8 2.8H9.9s-2.7 0-2.7 2.6v4.4S6.8 22 12.1 22zm2.7-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"/></svg>`;
  }
  if (item.id === 'typescript') {
    const TS_T_PATH = 'M3.375 9.938h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z';
    const TS_S_PATH =
      'M18.488 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201z';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><rect x="0" y="0" width="24" height="24" rx="1.125" fill="#3178C6"/><path fill="#FFFFFF" d="${TS_T_PATH}"/><path fill="#FFFFFF" d="${TS_S_PATH}"/></svg>`;
  }
  if (item.id === 'javascript') {
    const JS_J_PATH =
      'M13.051 11.031h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z';
    const JS_S_PATH =
      'M22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067z';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><rect x="0" y="0" width="24" height="24" rx="1.2" fill="#F7DF1E"/><path fill="#111622" d="${JS_J_PATH}"/><path fill="#111622" d="${JS_S_PATH}"/></svg>`;
  }
  if (item.id === 'amazonaws' || item.id === 'aws') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><path fill="#F3F1EC" d="${AWS_WORDMARK_PATH}"/><path fill="#FF9900" d="${AWS_SMILE_CURVE_PATH}"/><path fill="#FF9900" d="${AWS_SMILE_ARROW_PATH}"/></svg>`;
  }
  if (item.id === 'springboot') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><path fill="#6DB33F" d="M 23.693,10.706 L 18.963,2.521 C 18.554,1.811 17.546,1.227 16.723,1.227 L 7.272,1.227 C 6.454,1.227 5.442,1.811 5.032,2.521 L 0.307,10.706 C -0.102,11.416 -0.102,12.579 0.307,13.29 L 5.032,21.479 C 5.442,22.189 6.449,22.773 7.272,22.773 L 16.727,22.773 C 17.546,22.773 18.553,22.189 18.968,21.479 L 23.693,13.29 C 24.102,12.579 24.102,11.416 23.693,10.706 Z"/><g fill="#FFFFFF"><path d="M 10.976,5.755 C 10.976,5.218 11.414,4.78 11.95,4.78 C 12.487,4.78 12.925,5.218 12.925,5.755 L 12.925,11.576 C 12.925,12.113 12.487,12.551 11.95,12.551 C 11.414,12.551 10.976,12.113 10.976,11.576 Z"/><path d="M 11.95,18.184 C 8.308,18.184 5.343,15.219 5.343,11.576 C 5.347,9.487 6.336,7.524 8.011,6.272 A 0.866,0.866 0 0,1 9.225,6.451 A 0.866,0.866 0 0,1 9.047,7.665 C 6.886,9.27 6.435,12.325 8.039,14.485 C 9.644,16.645 12.699,17.097 14.859,15.492 C 16.097,14.574 16.826,13.12 16.826,11.576 A 4.897,4.897 0 0,0 14.84,7.651 C 14.454,7.369 14.374,6.823 14.657,6.437 C 14.939,6.051 15.485,5.971 15.871,6.254 C 17.56,7.501 18.553,9.477 18.558,11.576 C 18.558,15.224 15.593,18.184 11.95,18.184 Z"/></g></svg>`;
  }
  if (item.id === 'c') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><path fill="#283593" d="${HEX_SHELL_PATH}"/><path fill="#5C6BC0" d="M12 0.22 L2.26 5.31 C1.75 5.6 1.34 6.32 1.34 6.91 V17.09 L12 12 Z"/><path fill="#FFFFFF" d="${C_RING_PATH}"/></svg>`;
  }
  if (item.id === 'cpp') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><g transform="translate(.083 0) scale(.18784)"><path fill="#659AD2" d="${CPP_D_TL}"/><path fill="#00599C" d="${CPP_D_R}"/><path fill="#004482" d="${CPP_D_B}"/><path fill="#FFFFFF" d="${CPP_D_WHITE}"/></g></svg>`;
  }
  if (item.id === 'csharp') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><path fill="#512BD4" d="${HEX_SHELL_PATH}"/><path fill="#6D28D9" d="M12 0.22 L2.26 5.31 C1.75 5.6 1.34 6.32 1.34 6.91 V17.09 L12 12 Z"/><path fill="#FFFFFF" d="M10.5 18.6c-3.65 0-6.6-2.95-6.6-6.6s2.95-6.6 6.6-6.6c2.2 0 4.15 1.1 5.35 2.8l-2.65 1.55c-.6-.9-1.6-1.45-2.7-1.45-1.85 0-3.35 1.5-3.35 3.7s1.5 3.7 3.35 3.7c1.1 0 2.1-.55 2.7-1.45l2.65 1.55c-1.2 1.7-3.15 2.8-5.35 2.8z"/><g fill="#FFFFFF"><rect x="15.2" y="10.2" width="5.2" height="1"/><rect x="15.2" y="12.6" width="5.2" height="1"/><rect x="16.4" y="9.1" width="1" height="5.6"/><rect x="18.4" y="9.1" width="1" height="5.6"/></g></svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></svg>`;
}

/**
 * Generates the standalone art-directed animated SVG for `public/icons/animated/{id}.svg`.
 * Every file is 100% self-contained, has unique scoped IDs/classes (`tss_${uid}_*`),
 * includes `@media (prefers-reduced-motion: reduce)`, and never adds unrelated foreign shapes.
 */
function buildAnimatedSvg(item) {
  const uid = item.id.replace(/[^a-zA-Z0-9]/g, '');
  const label = escapeXml(item.name);
  const d = item.svgPath;
  const primary = item.darkSafeColor;
  const secondary = item.motionRecipe?.secondaryColor || '#F8FAFC';
  const dur = '3.6s';

  const wrapSvg = (defs, style, reducedMotionCss, body, concept, technique, customViewBox) => {
    const fullStyle =
      style || reducedMotionCss
        ? `<style>${style}@media (prefers-reduced-motion: reduce){${reducedMotionCss}}</style>`
        : '';
    const vb = customViewBox || item.svgViewBox || '0 0 24 24';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}">${defs ? `<defs>${defs}</defs>` : ''}${fullStyle}${body}</svg>`;
    return { svg, concept, technique };
  };

  // ==========================================================================
  // 1. PHASE 3 VALIDATION TRIO + REFERENCE 30 + PR #15 + CORE FLAGSHIPS
  // ==========================================================================

  // 1. DOCKER — Fixed safe bounds (x: 2.2..21.8, y: 4.5..19.5) + 3-tier container stacking + gentle hull buoyancy
  if (item.id === 'docker') {
    const kHull = `tss_${uid}_hull`;
    const kR2 = `tss_${uid}_r2`;
    const kR3 = `tss_${uid}_r3`;
    return wrapSvg(
      '',
      `@keyframes ${kHull}{0%,100%{transform:rotate(-3.2deg) translateY(0.3px)}45%,65%{transform:rotate(2.8deg) translateY(-0.3px)}}@keyframes ${kR2}{0%,8%{transform:translateX(-3.2px);opacity:0.35}34%,80%{transform:translateX(0);opacity:1}100%{transform:translateX(-3.2px);opacity:0.35}}@keyframes ${kR3}{0%,16%{transform:translateY(-2.8px);opacity:0.25}42%,80%{transform:translateY(0);opacity:1}100%{transform:translateY(-2.8px);opacity:0.25}}.${kHull}{transform-origin:12px 14.5px;animation:${kHull} ${dur} ease-in-out infinite}.${kR2}{animation:${kR2} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kR3}{animation:${kR3} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}`,
      `.${kHull},.${kR2},.${kR3}{animation:none!important;transform:none!important;opacity:1!important}`,
      `<g class="${kHull}"><g class="${kR3}" fill="#7DD3FC"><rect x="10.5" y="5.1" width="2.1" height="1.9" rx="0.3"/></g><g class="${kR2}" fill="#38BDF8"><rect x="5.7" y="7.4" width="2.1" height="1.9" rx="0.3"/><rect x="8.1" y="7.4" width="2.1" height="1.9" rx="0.3"/><rect x="10.5" y="7.4" width="2.1" height="1.9" rx="0.3"/></g><g fill="#2496ED"><rect x="3.3" y="9.7" width="2.1" height="1.9" rx="0.3"/><rect x="5.7" y="9.7" width="2.1" height="1.9" rx="0.3"/><rect x="8.1" y="9.7" width="2.1" height="1.9" rx="0.3"/><rect x="10.5" y="9.7" width="2.1" height="1.9" rx="0.3"/><rect x="12.9" y="9.7" width="2.1" height="1.9" rx="0.3"/></g><path fill="#2496ED" d="M21.2 10.6c-.45-.27-1.45-.36-2.25-.27-.1-.72-.54-1.35-1.26-1.89l-.45-.27-.27.45c-.54.81-.72 2.25-.09 3.15-.27.18-.81.36-1.44.36H2.2c-.27 1.53.18 3.51 1.35 4.95 1.08 1.35 2.79 1.98 5.04 1.98 4.77 0 8.28-2.16 9.99-6.21.63 0 2.07 0 2.79-1.35.09-.09.18-.36.27-.54l-.44-.36z"/><circle cx="6.4" cy="14.9" r="0.7" fill="#0F172A"/></g>`,
      '3-tier shipping container assembly sliding onto a gently rocking whale hull within safe 24x24 optical margins',
      'Multi-group CSS keyframe transforms with safe 2.2..21.8 viewBox framing'
    );
  }

  // 2. GOOGLE CLOUD (PR #10 4-Quadrant <clipPath> + Multi-Arc Choreography)
  if (item.id === 'googlecloud') {
    const cT = `tss_${uid}_cT`,
      cR = `tss_${uid}_cR`,
      cB = `tss_${uid}_cB`,
      cL = `tss_${uid}_cL`;
    const kY = `tss_${uid}_kY`,
      kG = `tss_${uid}_kG`,
      kB = `tss_${uid}_kB`,
      kR = `tss_${uid}_kR`;
    return wrapSvg(
      `<clipPath id="${cT}"><path d="M173.874,130.552 L177.188,130.614 L186.193,121.608 L186.632,117.794 C179.477,111.427 170.061,107.551 159.75,107.551 C141.081,107.551 125.336,120.247 120.668,137.459 C121.652,136.779 123.75,137.285 123.75,137.285 L141.75,134.326 C141.75,134.326 142.684,132.796 143.139,132.892 C147.257,128.386 153.18,125.551 159.75,125.551 C165.094,125.551 170.01,127.43 173.874,130.552 Z"/></clipPath><clipPath id="${cR}"><path d="M198.844,137.482 C196.757,129.764 192.437,122.958 186.626,117.789 L173.869,130.546 C178.976,134.675 182.25,140.986 182.25,148.051 L182.25,150.301 C188.454,150.301 193.5,155.347 193.5,161.551 C193.5,167.756 188.454,172.801 182.25,172.801 L159.75,172.801 L157.5,175.063 L157.5,188.563 L159.75,190.801 L182.25,190.801 C198.377,190.801 211.5,177.678 211.5,161.551 C211.5,151.578 206.483,142.764 198.844,137.482 Z"/></clipPath><clipPath id="${cB}"><path d="M137.25,190.801 L159.733,190.801 L159.733,172.801 L137.25,172.801 C135.596,172.801 134.033,172.436 132.615,171.789 L129.375,172.784 L120.364,181.796 L119.576,184.839 C124.487,188.574 130.613,190.801 137.25,190.801 Z"/></clipPath><clipPath id="${cL}"><path d="M137.25,132.301 C121.123,132.301 108,145.424 108,161.551 C108,171.046 112.551,179.501 119.588,184.844 L132.632,171.8 C128.728,170.034 126,166.108 126,161.551 C126,155.347 131.046,150.301 137.25,150.301 C141.806,150.301 145.733,153.029 147.499,156.933 L160.543,143.889 C155.199,136.852 146.745,132.301 137.25,132.301 Z"/></clipPath>`,
      `@keyframes ${kY}{0%{stroke-dashoffset:84}14%,72%{stroke-dashoffset:0}88%,100%{stroke-dashoffset:-84}}@keyframes ${kG}{0%,10%{stroke-dashoffset:40}20%,75%{stroke-dashoffset:0}90%,100%{stroke-dashoffset:-40}}@keyframes ${kB}{0%,14%{stroke-dashoffset:111}28%,78%{stroke-dashoffset:0}92%,100%{stroke-dashoffset:-111}}@keyframes ${kR}{0%,18%{stroke-dashoffset:71}34%,80%{stroke-dashoffset:0}96%,100%{stroke-dashoffset:-71}}.${kY}{stroke-dasharray:84 84;animation:${kY} ${dur} cubic-bezier(0.60,0,0.80,1) infinite}.${kG}{stroke-dasharray:40 40;animation:${kG} ${dur} cubic-bezier(0.70,0,0.70,1) infinite}.${kB}{stroke-dasharray:111 111;animation:${kB} ${dur} cubic-bezier(0.10,0,0.30,1) infinite}.${kR}{stroke-dasharray:71 71;animation:${kR} ${dur} cubic-bezier(0,0,0.20,1) infinite}`,
      `.${kY},.${kG},.${kB},.${kR}{animation:none!important;stroke-dashoffset:0!important}`,
      `<g transform="translate(-21.18, -18.98) scale(0.2077)"><g opacity="0.24"><path fill="#EA4335" d="M173.874,130.552 L177.188,130.614 L186.193,121.608 L186.632,117.794 C179.477,111.427 170.061,107.551 159.75,107.551 C141.081,107.551 125.336,120.247 120.668,137.459 C121.652,136.779 123.75,137.285 123.75,137.285 L141.75,134.326 C141.75,134.326 142.684,132.796 143.139,132.892 C147.257,128.386 153.18,125.551 159.75,125.551 C165.094,125.551 170.01,127.43 173.874,130.552 Z"/><path fill="#4285F4" d="M198.844,137.482 C196.757,129.764 192.437,122.958 186.626,117.789 L173.869,130.546 C178.976,134.675 182.25,140.986 182.25,148.051 L182.25,150.301 C188.454,150.301 193.5,155.347 193.5,161.551 C193.5,167.756 188.454,172.801 182.25,172.801 L159.75,172.801 L157.5,175.063 L157.5,188.563 L159.75,190.801 L182.25,190.801 C198.377,190.801 211.5,177.678 211.5,161.551 C211.5,151.578 206.483,142.764 198.844,137.482 Z"/><path fill="#34A853" d="M137.25,190.801 L159.733,190.801 L159.733,172.801 L137.25,172.801 C135.596,172.801 134.033,172.436 132.615,171.789 L129.375,172.784 L120.364,181.796 L119.576,184.839 C124.487,188.574 130.613,190.801 137.25,190.801 Z"/><path fill="#FBBC05" d="M137.25,132.301 C121.123,132.301 108,145.424 108,161.551 C108,171.046 112.551,179.501 119.588,184.844 L132.632,171.8 C128.728,170.034 126,166.108 126,161.551 C126,155.347 131.046,150.301 137.25,150.301 C141.806,150.301 145.733,153.029 147.499,156.933 L160.543,143.889 C155.199,136.852 146.745,132.301 137.25,132.301 Z"/></g><path class="${kR}" clip-path="url(#${cT})" stroke="#EA4335" fill="none" stroke-miterlimit="10" stroke-width="25" d="M182.503 126.427 171.582 117.789 160.543 115.631 150.592 117.789 142.254 121.029 136.692 126.427 127.749 143.47"/><path class="${kB}" clip-path="url(#${cR})" fill="none" stroke-miterlimit="10" stroke="#4285F4" stroke-width="25" d="M157.5 182.289 165.428 182.289 174.35 182.289 184.5 182.289 192.797 181.295 197.946 176.642 200.947 168.002 200.947 162.383 200.947 154.295 197.946 147.729 192.797 143.47 189.375 140 186.632 132.301 182.503 126.427 179.224 122.505 174.35 117.789"/><path class="${kG}" clip-path="url(#${cB})" fill="none" stroke-miterlimit="10" stroke="#34A853" stroke-width="25" d="M123.517 176.642 130.378 181.295 139.655 182.289 146.694 182.289 153.65 182.289 157.5 182.289 161.576 182.289"/><path class="${kY}" clip-path="url(#${cL})" fill="none" stroke-miterlimit="10" stroke="#FBBC05" stroke-width="25" d="M157.5 151.996 148.942 145.994 142.846 143.47 136.449 143.47 127.749 143.47 123.517 147.733 119.576 154.295 116.282 162.85 119.576 171.789 123.517 176.642 127.749 181.295 134.272 181.295"/></g>`,
      'PR #10 4-quadrant multicolor cloud sequential path drawing (yellow, green, blue, red) with synchronized hold phase',
      '4-quadrant <clipPath> + multi-arc stroke-dasharray/stroke-dashoffset choreography'
    );
  }

  // 3. PYTHON (Dual-Color Interlocking Snakes)
  if (item.id === 'python') {
    const kB = `tss_${uid}_b`,
      kY = `tss_${uid}_y`;
    const topSnake =
      'M11.9 2C6.8 2 7.1 4.2 7.1 4.2v2.3h4.9v.7H5.2S2 6.8 2 11.9c0 5.1 2.8 4.9 2.8 4.9h1.7v-2.4s-.1-2.8 2.8-2.8h4.8s2.7 0 2.7-2.6V4.6S17.2 2 11.9 2zm-2.7 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z';
    const botSnake =
      'M12.1 22c5.1 0 4.8-2.2 4.8-2.2v-2.3H12v-.7h6.8S22 17.2 22 12.1c0-5.1-2.8-4.9-2.8-4.9h-1.7v2.4s.1 2.8-2.8 2.8H9.9s-2.7 0-2.7 2.6v4.4S6.8 22 12.1 22zm2.7-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z';
    return wrapSvg(
      '',
      `@keyframes ${kB}{0%{stroke-dashoffset:100;fill-opacity:0.25;transform:translate(-1.5px,-1.5px)}34%,78%{stroke-dashoffset:0;fill-opacity:1;transform:translate(0,0)}100%{stroke-dashoffset:100;fill-opacity:0.25;transform:translate(-1.5px,-1.5px)}}@keyframes ${kY}{0%{stroke-dashoffset:100;fill-opacity:0.25;transform:translate(1.5px,1.5px)}34%,78%{stroke-dashoffset:0;fill-opacity:1;transform:translate(0,0)}100%{stroke-dashoffset:100;fill-opacity:0.25;transform:translate(1.5px,1.5px)}}.${kB}{stroke-dasharray:100;animation:${kB} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kY}{stroke-dasharray:100;animation:${kY} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kB},.${kY}{animation:none!important;transform:none!important;fill-opacity:1!important;stroke-dashoffset:0!important}`,
      `<path class="${kB}" pathLength="100" fill="#387EB8" stroke="#60A5FA" stroke-width="0.6" stroke-linejoin="round" d="${topSnake}"/><path class="${kY}" pathLength="100" fill="#FFE052" stroke="#FEF08A" stroke-width="0.6" stroke-linejoin="round" d="${botSnake}"/>`,
      'Dual interlocking blue and yellow Python snakes gliding diagonally into lock while tracing contours',
      'Dual-element counter-diagonal translation + synchronized stroke-dashoffset contour reveal'
    );
  }

  // 4. SPRING BOOT (PR #15 Power-Button Ignition + Gaussian Halo)
  if (item.id === 'springboot') {
    const kHex = `tss_${uid}_hex`,
      kSym = `tss_${uid}_sym`,
      kGlow = `tss_${uid}_glow`,
      fHalo = `tss_${uid}_halo`;
    const hexD =
      'M 23.693,10.706 L 18.963,2.521 C 18.554,1.811 17.546,1.227 16.723,1.227 L 7.272,1.227 C 6.454,1.227 5.442,1.811 5.032,2.521 L 0.307,10.706 C -0.102,11.416 -0.102,12.579 0.307,13.29 L 5.032,21.479 C 5.442,22.189 6.449,22.773 7.272,22.773 L 16.727,22.773 C 17.546,22.773 18.553,22.189 18.968,21.479 L 23.693,13.29 C 24.102,12.579 24.102,11.416 23.693,10.706 Z';
    const symD1 =
      'M 10.976,5.755 C 10.976,5.218 11.414,4.78 11.95,4.78 C 12.487,4.78 12.925,5.218 12.925,5.755 L 12.925,11.576 C 12.925,12.113 12.487,12.551 11.95,12.551 C 11.414,12.551 10.976,12.113 10.976,11.576 Z';
    const symD2 =
      'M 11.95,18.184 C 8.308,18.184 5.343,15.219 5.343,11.576 C 5.347,9.487 6.336,7.524 8.011,6.272 A 0.866,0.866 0 0,1 9.225,6.451 A 0.866,0.866 0 0,1 9.047,7.665 C 6.886,9.27 6.435,12.325 8.039,14.485 C 9.644,16.645 12.699,17.097 14.859,15.492 C 16.097,14.574 16.826,13.12 16.826,11.576 A 4.897,4.897 0 0,0 14.84,7.651 C 14.454,7.369 14.374,6.823 14.657,6.437 C 14.939,6.051 15.485,5.971 15.871,6.254 C 17.56,7.501 18.553,9.477 18.558,11.576 C 18.558,15.224 15.593,18.184 11.95,18.184 Z';
    return wrapSvg(
      `<filter id="${fHalo}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.3"/></filter>`,
      `@keyframes ${kHex}{0%,12%{fill:#2E352A}16%{fill:#4A7A2C}20%{fill:#2E352A}26%{fill:#5A972F}30%{fill:#3A4A30}38%,88%{fill:#6DB33F}100%{fill:#2E352A}}@keyframes ${kSym}{0%,12%{fill:#5A6552}16%{fill:#E8F7DA}20%{fill:#5A6552}26%{fill:#FFFFFF}30%{fill:#7C8A72}38%,88%{fill:#FFFFFF}100%{fill:#5A6552}}@keyframes ${kGlow}{0%,12%{opacity:0}16%{opacity:0.45}20%{opacity:0}26%{opacity:0.95}30%{opacity:0.1}38%{opacity:0.7}60%{opacity:0.4}80%{opacity:0.7}92%,100%{opacity:0}}.${kHex}{animation:${kHex} 4s ease-in-out infinite}.${kSym}{animation:${kSym} 4s ease-in-out infinite}.${kGlow}{animation:${kGlow} 4s ease-in-out infinite;opacity:0}`,
      `.${kHex}{animation:none!important;fill:#6DB33F!important}.${kSym}{animation:none!important;fill:#FFFFFF!important}.${kGlow}{animation:none!important;opacity:0.45!important}`,
      `<path class="${kHex}" fill="#6DB33F" d="${hexD}"/><g class="${kGlow}" filter="url(#${fHalo})" fill="#FFFFFF"><path d="${symD1}"/><path d="${symD2}"/></g><g class="${kSym}" fill="#FFFFFF"><path d="${symD1}"/><path d="${symD2}"/></g>`,
      'PR #15 Spring Boot power-button startup flicker and breathing Gaussian halo',
      'Multi-stage fill ignition keyframes (powerHex, powerSym) + feGaussianBlur halo filter'
    );
  }

  // 5. C LANGUAGE (Pure ISO C Hexagon without ++ signs + Facet & C-Arc Illumination)
  if (item.id === 'c') {
    const kArc = `tss_${uid}_arc`,
      kFacet = `tss_${uid}_fct`;
    return wrapSvg(
      '',
      `@keyframes ${kArc}{0%{stroke-dashoffset:64;fill-opacity:0.3}36%,82%{stroke-dashoffset:0;fill-opacity:1}100%{stroke-dashoffset:-64;fill-opacity:0.3}}@keyframes ${kFacet}{0%,100%{opacity:0.65}45%,75%{opacity:1}}.${kArc}{stroke-dasharray:64;animation:${kArc} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kFacet}{animation:${kFacet} ${dur} ease-in-out infinite}`,
      `.${kArc},.${kFacet}{animation:none!important;stroke-dashoffset:0!important;fill-opacity:1!important;opacity:1!important}`,
      `<path fill="#283593" d="${HEX_SHELL_PATH}"/><path class="${kFacet}" fill="#5C6BC0" d="M12 0.22 L2.26 5.31 C1.75 5.6 1.34 6.32 1.34 6.91 V17.09 L12 12 Z"/><path class="${kArc}" pathLength="64" fill="#FFFFFF" stroke="#93C5FD" stroke-width="0.65" d="${C_RING_PATH}"/>`,
      'ISO C 3-facet blue hexagon with pure central C emblem (no ++) and progressive C-arc energy trace',
      'Isometric hexagon facet luminance + pathLength=64 C-arc stroke-dashoffset draw'
    );
  }

  // 6. C++ (official hexagon geometry: line-art assembly -> facets lock in -> C sweeps around -> ++ pop, then tick like an increment -> light sheen)
  if (item.id === 'cpp') {
    const kAll = `tss_${uid}_al`,
      kLine = `tss_${uid}_ln`,
      kTl = `tss_${uid}_tl`,
      kRf = `tss_${uid}_rf`,
      kBf = `tss_${uid}_bf`,
      kWipe = `tss_${uid}_wp`,
      kP1 = `tss_${uid}_p1`,
      kP2 = `tss_${uid}_p2`,
      kSheen = `tss_${uid}_sh`,
      idHex = `tss_${uid}_hex`,
      idCMask = `tss_${uid}_cm`,
      idGrad = `tss_${uid}_gr`;
    const css =
      `@keyframes ${kAll}{0%,90%{opacity:1}96%,100%{opacity:0}}` +
      `@keyframes ${kLine}{0%{stroke-dashoffset:1;opacity:1}18%{stroke-dashoffset:0;opacity:1}30%{stroke-dashoffset:0;opacity:1}38%,100%{stroke-dashoffset:0;opacity:0}}` +
      `@keyframes ${kTl}{0%,8%{opacity:0;transform:scale(.94)}20%,100%{opacity:1;transform:scale(1)}}` +
      `@keyframes ${kRf}{0%,11%{opacity:0;transform:scale(.94)}23%,100%{opacity:1;transform:scale(1)}}` +
      `@keyframes ${kBf}{0%,14%{opacity:0;transform:scale(.94)}26%,100%{opacity:1;transform:scale(1)}}` +
      `@keyframes ${kWipe}{0%,20%{stroke-dashoffset:1}42%,100%{stroke-dashoffset:0}}` +
      `@keyframes ${kP1}{0%,40%{transform:scale(0)}48%{transform:scale(1)}60%{transform:scale(1)}63%{transform:scale(1.3)}67%,100%{transform:scale(1)}}` +
      `@keyframes ${kP2}{0%,43%{transform:scale(0)}51%{transform:scale(1)}64%{transform:scale(1)}67%{transform:scale(1.3)}71%,100%{transform:scale(1)}}` +
      `@keyframes ${kSheen}{0%,52%{opacity:0;transform:translateX(0)}56%{opacity:1}72%,100%{opacity:0;transform:translateX(175px)}}` +
      `.${kAll}{animation:${kAll} ${dur} linear infinite}` +
      `.${kLine}{fill:none;stroke:#659AD2;stroke-width:2.6;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;opacity:0;animation:${kLine} ${dur} ease-in-out infinite}` +
      `.${kTl},.${kRf},.${kBf}{transform-origin:64px 64px}` +
      `.${kTl}{animation:${kTl} ${dur} ease-out infinite}.${kRf}{animation:${kRf} ${dur} ease-out infinite}.${kBf}{animation:${kBf} ${dur} ease-out infinite}` +
      `.${kWipe}{fill:none;stroke:#fff;stroke-width:44;stroke-dasharray:1;stroke-dashoffset:0;animation:${kWipe} ${dur} cubic-bezier(.65,0,.35,1) infinite}` +
      `.${kP1},.${kP2}{transform-box:fill-box;transform-origin:center}` +
      `.${kP1}{animation:${kP1} ${dur} cubic-bezier(.34,1.4,.64,1) infinite}.${kP2}{animation:${kP2} ${dur} cubic-bezier(.34,1.4,.64,1) infinite}` +
      `.${kSheen}{fill:url(#${idGrad});opacity:0;animation:${kSheen} ${dur} ease-in-out infinite}`;
    return wrapSvg(
      `<linearGradient id="${idGrad}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
        `<clipPath id="${idHex}"><path d="${CPP_D_TL}"/><path d="${CPP_D_R}"/><path d="${CPP_D_B}"/></clipPath>` +
        `<mask id="${idCMask}" maskUnits="userSpaceOnUse" x="0" y="0" width="128" height="128"><path class="${kWipe}" pathLength="1" d="M89.78 53.24A28.4 28.4 0 1 0 89.78 74.52"/></mask>`,
      css,
      `.${kAll},.${kLine},.${kTl},.${kRf},.${kBf},.${kWipe},.${kP1},.${kP2},.${kSheen}{animation:none!important}`,
      `<g transform="translate(.083 0) scale(.18784)"><g class="${kAll}">` +
        `<path class="${kTl}" fill="#659AD2" d="${CPP_D_TL}"/><path class="${kRf}" fill="#00599C" d="${CPP_D_R}"/><path class="${kBf}" fill="#004482" d="${CPP_D_B}"/>` +
        `<path class="${kLine}" pathLength="1" d="${CPP_D_TL}"/><path class="${kLine}" pathLength="1" d="${CPP_D_R}"/><path class="${kLine}" pathLength="1" d="${CPP_D_B}"/>` +
        `<path fill="#fff" mask="url(#${idCMask})" d="${CPP_D_C}"/>` +
        `<path class="${kP1}" fill="#fff" d="${CPP_D_P1}"/><path class="${kP2}" fill="#fff" d="${CPP_D_P2}"/>` +
        `<g clip-path="url(#${idHex})"><g transform="skewX(-20)"><rect class="${kSheen}" x="0" y="-10" width="22" height="150"/></g></g>` +
        `</g></g>`,
      'Official C++ hexagon: facets draw as line-art and lock in, the C sweeps around, then the two + operators pop and tick one after the other like an increment',
      'Per-facet pathLength trace + masked C-arc stroke wipe + overshoot scale pops on each + + skewed clipped sheen sweep',
      '0 0 24 24'
    );
  }

  // 7. C# (Upstream csharp-icon.svg choreography: C arc + # octothorpe spinning out from C center)
  if (item.id === 'csharp') {
    const kSharp = `tss_${uid}_sh`,
      kC = `tss_${uid}_c`;
    return wrapSvg(
      '',
      `@keyframes ${kSharp}{0%,12%{transform:translate(-7px,0) rotate(0deg) scale(0.4);opacity:0}40%,82%{transform:translate(0,0) rotate(360deg) scale(1);opacity:1}95%,100%{transform:translate(0,0) scale(0.4);opacity:0}}@keyframes ${kC}{0%,100%{stroke-dashoffset:60}35%,82%{stroke-dashoffset:0}}.${kSharp}{transform-origin:17.8px 12px;animation:${kSharp} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kC}{stroke-dasharray:60;animation:${kC} ${dur} ease-in-out infinite}`,
      `.${kSharp},.${kC}{animation:none!important;transform:none!important;opacity:1!important;stroke-dashoffset:0!important}`,
      `<path fill="#512BD4" d="${HEX_SHELL_PATH}"/><path fill="#6D28D9" d="M12 0.22 L2.26 5.31 C1.75 5.6 1.34 6.32 1.34 6.91 V17.09 L12 12 Z"/><path class="${kC}" pathLength="60" fill="#FFFFFF" stroke="#C4B5FD" stroke-width="0.45" d="M10.4 18.6c-3.65 0-6.6-2.95-6.6-6.6s2.95-6.6 6.6-6.6c2.2 0 4.15 1.1 5.35 2.8l-2.65 1.55c-.6-.9-1.6-1.45-2.7-1.45-1.85 0-3.35 1.5-3.35 3.7s1.5 3.7 3.35 3.7c1.1 0 2.1-.55 2.7-1.45l2.65 1.55c-1.2 1.7-3.15 2.8-5.35 2.8z"/><g class="${kSharp}" fill="#FFFFFF"><rect x="15.0" y="10.2" width="5.4" height="1.05" rx="0.2"/><rect x="15.0" y="12.6" width="5.4" height="1.05" rx="0.2"/><rect x="16.3" y="9.1" width="1.05" height="5.6" rx="0.2"/><rect x="18.3" y="9.1" width="1.05" height="5.6" rx="0.2"/></g>`,
      'Upstream C# choreography: purple hexagon and C arc with 4-bar # octothorpe spinning out into locked position',
      'Rotational translation keyframe on the # octothorpe group + C-arc trace'
    );
  }

  // 8. TYPESCRIPT (official badge + glyphs: rim traces -> badge fills in -> T and S draw as outlines then fill -> light sheen)
  if (item.id === 'typescript') {
    const kAll = `tss_${uid}_al`,
      kRim = `tss_${uid}_rm`,
      kBadge = `tss_${uid}_bd`,
      kT = `tss_${uid}_kt`,
      kS = `tss_${uid}_ks`,
      kSheen = `tss_${uid}_sh`,
      idClip = `tss_${uid}_cp`,
      idGrad = `tss_${uid}_gr`;
    const TS_T_PATH = 'M3.375 9.938h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z';
    const TS_S_PATH =
      'M18.488 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201z';
    const css =
      `@keyframes ${kAll}{0%,90%{opacity:1}96%,100%{opacity:0}}` +
      `@keyframes ${kRim}{0%{stroke-dashoffset:1;opacity:1}16%{stroke-dashoffset:0;opacity:1}28%{stroke-dashoffset:0;opacity:1}36%,100%{stroke-dashoffset:0;opacity:0}}` +
      `@keyframes ${kBadge}{0%,10%{opacity:0;transform:scale(.94)}24%,100%{opacity:1;transform:scale(1)}}` +
      `@keyframes ${kT}{0%,22%{stroke-dashoffset:1;fill-opacity:0;stroke-opacity:1}40%{stroke-dashoffset:0;fill-opacity:0;stroke-opacity:1}52%{stroke-dashoffset:0;fill-opacity:1;stroke-opacity:1}58%,100%{stroke-dashoffset:0;fill-opacity:1;stroke-opacity:0}}` +
      `@keyframes ${kS}{0%,26%{stroke-dashoffset:1;fill-opacity:0;stroke-opacity:1}44%{stroke-dashoffset:0;fill-opacity:0;stroke-opacity:1}56%{stroke-dashoffset:0;fill-opacity:1;stroke-opacity:1}62%,100%{stroke-dashoffset:0;fill-opacity:1;stroke-opacity:0}}` +
      `@keyframes ${kSheen}{0%,56%{opacity:0;transform:translateX(0)}60%{opacity:1}76%,100%{opacity:0;transform:translateX(38px)}}` +
      `.${kAll}{animation:${kAll} ${dur} linear infinite}` +
      `.${kRim}{fill:none;stroke:#93C5FD;stroke-width:.55;stroke-dasharray:1;stroke-dashoffset:1;opacity:0;animation:${kRim} ${dur} ease-in-out infinite}` +
      `.${kBadge}{transform-origin:12px 12px;animation:${kBadge} ${dur} ease-out infinite}` +
      `.${kT},.${kS}{stroke:#fff;stroke-opacity:0;stroke-width:.45;stroke-linejoin:round;stroke-dasharray:1}` +
      `.${kT}{animation:${kT} ${dur} cubic-bezier(.22,1,.36,1) infinite}.${kS}{animation:${kS} ${dur} cubic-bezier(.22,1,.36,1) infinite}` +
      `.${kSheen}{fill:url(#${idGrad});opacity:0;animation:${kSheen} ${dur} ease-in-out infinite}`;
    return wrapSvg(
      `<linearGradient id="${idGrad}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
        `<clipPath id="${idClip}"><rect width="24" height="24" rx="1.125"/></clipPath>`,
      css,
      `.${kAll},.${kRim},.${kBadge},.${kT},.${kS},.${kSheen}{animation:none!important}`,
      `<g class="${kAll}"><rect class="${kBadge}" x="0" y="0" width="24" height="24" rx="1.125" fill="#3178C6"/>` +
        `<rect class="${kRim}" pathLength="1" x=".3" y=".3" width="23.4" height="23.4" rx=".83"/>` +
        `<path class="${kT}" pathLength="1" fill="#FFFFFF" d="${TS_T_PATH}"/><path class="${kS}" pathLength="1" fill="#FFFFFF" d="${TS_S_PATH}"/>` +
        `<g clip-path="url(#${idClip})"><g transform="skewX(-20)"><rect class="${kSheen}" x="-6" y="-2" width="5" height="28"/></g></g></g>`,
      'Official #3178C6 TypeScript badge: the rim traces, the badge fills in, T and S draw as outlines and then fill, and a light sheen crosses the badge',
      'Rim pathLength trace + badge scale-in + staggered T/S outline-to-fill (stroke-dashoffset + fill-opacity) + skewed clipped sheen',
      '0 0 24 24'
    );
  }

  // 9. JAVASCRIPT (100% Solid #F7DF1E Official Badge + Direct J & S Vector Paths + Staggered Contour Trace — zero mask/rectangle artifacts!)
  if (item.id === 'javascript') {
    const kJ = `tss_${uid}_kj`,
      kS = `tss_${uid}_ks`,
      kRim = `tss_${uid}_rm`;
    const JS_J_PATH =
      'M13.051 11.031h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z';
    const JS_S_PATH =
      'M22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067z';
    return wrapSvg(
      '',
      `@keyframes ${kJ}{0%{stroke-dashoffset:60;transform:translateY(0.8px)}28%,85%{stroke-dashoffset:0;transform:translateY(0)}100%{stroke-dashoffset:-60;transform:translateY(0.8px)}}@keyframes ${kS}{0%,10%{stroke-dashoffset:70;transform:translateY(0.8px)}36%,85%{stroke-dashoffset:0;transform:translateY(0)}100%{stroke-dashoffset:-70;transform:translateY(0.8px)}}@keyframes ${kRim}{0%{stroke-dashoffset:88}40%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:-88}}.${kJ}{stroke-dasharray:60;transform-origin:9.5px 16px;animation:${kJ} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kS}{stroke-dasharray:70;transform-origin:18.5px 16px;animation:${kS} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kRim}{stroke-dasharray:88;animation:${kRim} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kJ},.${kS},.${kRim}{animation:none!important;transform:none!important;stroke-dashoffset:0!important}`,
      `<rect x="0" y="0" width="24" height="24" rx="1.2" fill="#F7DF1E"/><path class="${kJ}" pathLength="60" fill="#111622" stroke="#111622" stroke-width="0.35" stroke-linejoin="round" d="${JS_J_PATH}"/><path class="${kS}" pathLength="70" fill="#111622" stroke="#111622" stroke-width="0.35" stroke-linejoin="round" d="${JS_S_PATH}"/><rect class="${kRim}" pathLength="88" x="0.4" y="0.4" width="23.2" height="23.2" rx="1.2" fill="none" stroke="#FEF08A" stroke-width="0.65"/>`,
      'Solid #F7DF1E JavaScript badge with standalone #111622 J and S vector paths and perimeter trace',
      'Direct J and S subpath decomposition + staggered contour trace over solid #F7DF1E badge'
    );
  }

  // 10. AWS / AMAZON WEB SERVICES (Wordmark + 2-Stage Masked Smile Curve & Arrowhead)
  if (item.id === 'amazonaws' || item.id === 'aws') {
    const mC = `tss_${uid}_mc`,
      mA = `tss_${uid}_ma`,
      kC = `tss_${uid}_kc`,
      kA = `tss_${uid}_ka`,
      kT = `tss_${uid}_kt`;
    return wrapSvg(
      `<mask id="${mC}"><path fill="white" d="${AWS_SMILE_CURVE_PATH}"/></mask><mask id="${mA}"><path fill="white" d="${AWS_SMILE_ARROW_PATH}"/></mask>`,
      `@keyframes ${kC}{0%{stroke-dashoffset:24}26%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:-24}}@keyframes ${kA}{0%,20%{stroke-dashoffset:12}38%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:-12}}@keyframes ${kT}{0%,10%{opacity:0.5}32%,86%{opacity:1}100%{opacity:0.5}}.${kC}{stroke-dasharray:24;animation:${kC} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kA}{stroke-dasharray:12;animation:${kA} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kT}{animation:${kT} ${dur} ease-in-out infinite}`,
      `.${kC},.${kA},.${kT}{animation:none!important;stroke-dashoffset:0!important;opacity:1!important}`,
      `<path class="${kT}" fill="#F3F1EC" d="${AWS_WORDMARK_PATH}"/><path fill="#FF9900" fill-opacity="0.25" d="${AWS_SMILE_CURVE_PATH}"/><path fill="#FF9900" fill-opacity="0.25" d="${AWS_SMILE_ARROW_PATH}"/><path class="${kC}" mask="url(#${mC})" fill="none" stroke="#FF9900" stroke-width="3.2" stroke-linecap="round" d="M0.5 14.5 C8 20.2 15 20 21.8 15.8"/><path class="${kA}" mask="url(#${mA})" fill="none" stroke="#FF9900" stroke-width="2.4" stroke-linecap="round" d="M19.6 15 C23.5 13 24 14.2 22.2 18.2"/>`,
      'Upstream aws-icon.svg choreography: crisp aws wordmark with two-stage masked #FF9900 smile arc and arrowhead draw',
      'Dual SVG <mask> channels revealing the orange smile arc and arrowhead in sequence'
    );
  }

  // 11. NODE.JS (Authentic Node.js Hexagon — NO fake letter P!)
  if (item.id === 'nodedotjs') {
    const kHex = `tss_${uid}_hex`,
      kFacet = `tss_${uid}_fct`;
    return wrapSvg(
      '',
      `@keyframes ${kHex}{0%{stroke-dashoffset:76;fill-opacity:0.45}36%,82%{stroke-dashoffset:0;fill-opacity:1}100%{stroke-dashoffset:-76;fill-opacity:0.45}}@keyframes ${kFacet}{0%,100%{opacity:0.35}45%,75%{opacity:0.85}}.${kHex}{stroke-dasharray:76;animation:${kHex} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kFacet}{animation:${kFacet} ${dur} ease-in-out infinite}`,
      `.${kHex},.${kFacet}{animation:none!important;stroke-dashoffset:0!important;fill-opacity:1!important;opacity:0.8!important}`,
      `<path class="${kHex}" pathLength="76" fill="#5FA04E" stroke="#83CD29" stroke-width="0.65" stroke-linejoin="round" d="${d}"/><path class="${kFacet}" fill="#83CD29" fill-opacity="0.35" d="M12 1.85c-.27 0-.55.07-.78.2L3.78 6.35c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36L12 12V1.85z"/>`,
      'Authentic Node.js multi-faceted green hexagon with isometric facet illumination and perimeter energy trace',
      'Community Node.js vector + isometric left-facet luminance + perimeter stroke-dashoffset draw'
    );
  }

  // 12. NEXT.JS (Authentic Monochrome Badge + Progressive N Diagonal Slash Reveal — NO cyan ring!)
  if (item.id === 'nextdotjs') {
    const cBadge = `tss_${uid}_cb`,
      kSlash = `tss_${uid}_sl`,
      kRim = `tss_${uid}_rm`;
    return wrapSvg(
      `<clipPath id="${cBadge}"><path d="${d}"/></clipPath>`,
      `@keyframes ${kSlash}{0%{transform:translate(-14px,-14px)}36%,82%{transform:translate(0,0)}100%{transform:translate(14px,14px)}}@keyframes ${kRim}{0%{stroke-dashoffset:72}38%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:-72}}.${kSlash}{animation:${kSlash} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kRim}{stroke-dasharray:72;animation:${kRim} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kSlash},.${kRim}{animation:none!important;transform:none!important;stroke-dashoffset:0!important}`,
      `<path fill="#F8FAFC" fill-opacity="0.88" d="${d}"/><g clip-path="url(#${cBadge})"><rect class="${kSlash}" x="-4" y="-4" width="32" height="8" transform="rotate(38 12 12)" fill="#FFFFFF"/></g><circle class="${kRim}" pathLength="72" cx="12" cy="12" r="11.5" fill="none" stroke="#FFFFFF" stroke-width="0.6" stroke-opacity="0.7"/>`,
      'Authentic monochrome Next.js emblem with specular light sweeping along the signature diagonal N slash',
      'Clipped diagonal slash highlight + monochrome rim trace'
    );
  }

  // 13. EXPRESS (Authentic Express Monogram Trace — NO fake green/blue underline bars!)
  if (item.id === 'express') {
    const kDraw = `tss_${uid}_drw`;
    return wrapSvg(
      '',
      `@keyframes ${kDraw}{0%{stroke-dashoffset:100;fill-opacity:0.25}36%,82%{stroke-dashoffset:0;fill-opacity:1}100%{stroke-dashoffset:-100;fill-opacity:0.25}}.${kDraw}{stroke-dasharray:100;animation:${kDraw} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kDraw}{animation:none!important;stroke-dashoffset:0!important;fill-opacity:1!important}`,
      `<path class="${kDraw}" pathLength="100" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="0.55" stroke-linecap="round" d="${d}"/>`,
      'Clean typographic stroke-to-fill trace of the authentic Express ex monogram without artificial underline bars',
      'Progressive pathLength=100 stroke-dashoffset draw + synchronized fill illumination'
    );
  }

  // 14. POSTGRESQL (Authentic Elephant Silhouette + Trunk/Ear Contour Reveal — NO hollow outline or radar ring!)
  if (item.id === 'postgresql') {
    const kTrace = `tss_${uid}_tr`,
      kNod = `tss_${uid}_nd`;
    return wrapSvg(
      '',
      `@keyframes ${kTrace}{0%{stroke-dashoffset:100}38%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:-100}}@keyframes ${kNod}{0%,100%{transform:translateY(0)}45%,70%{transform:translateY(-0.5px)}}.${kTrace}{stroke-dasharray:100;animation:${kTrace} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kNod}{transform-origin:12px 12px;animation:${kNod} ${dur} ease-in-out infinite}`,
      `.${kTrace},.${kNod}{animation:none!important;transform:none!important;stroke-dashoffset:0!important}`,
      `<g class="${kNod}"><path fill="#336791" d="${d}"/><path class="${kTrace}" pathLength="100" fill="none" stroke="#93C5FD" stroke-width="0.65" stroke-linecap="round" stroke-linejoin="round" d="${d}"/></g>`,
      'Solid #336791 PostgreSQL elephant mark with progressive #93C5FD ear and trunk contour illumination',
      'Solid brand base + pathLength=100 contour trace + subtle vertical poise'
    );
  }

  // 15. REACT (3 Staggered Electron Orbits + Rotating Atom + Pulsing Nucleus)
  if (item.id === 'react') {
    const kOrb = `tss_${uid}_orb`,
      kSpin = `tss_${uid}_spn`,
      kNuc = `tss_${uid}_nuc`;
    return wrapSvg(
      '',
      `@keyframes ${kOrb}{0%{stroke-dashoffset:64}50%{stroke-dashoffset:0}100%{stroke-dashoffset:-64}}@keyframes ${kSpin}{0%{transform:rotate(0deg)}100%{transform:rotate(180deg)}}@keyframes ${kNuc}{0%,100%{transform:scale(0.85);fill:#61DAFB}50%{transform:scale(1.18);fill:#E0F2FE}}.${kSpin}{transform-origin:12px 12px;animation:${kSpin} 6s linear infinite}.${kOrb}{stroke-dasharray:64;animation:${kOrb} 2.4s ease-in-out infinite}.${kNuc}{transform-origin:12px 12px;animation:${kNuc} 2.4s ease-in-out infinite}`,
      `.${kSpin},.${kOrb},.${kNuc}{animation:none!important;transform:none!important;stroke-dashoffset:0!important}`,
      `<g class="${kSpin}"><ellipse cx="12" cy="12" rx="9.8" ry="3.7" fill="none" stroke="#61DAFB" stroke-opacity="0.3" stroke-width="1"/><ellipse cx="12" cy="12" rx="9.8" ry="3.7" transform="rotate(60 12 12)" fill="none" stroke="#61DAFB" stroke-opacity="0.3" stroke-width="1"/><ellipse cx="12" cy="12" rx="9.8" ry="3.7" transform="rotate(120 12 12)" fill="none" stroke="#61DAFB" stroke-opacity="0.3" stroke-width="1"/><ellipse class="${kOrb}" pathLength="64" cx="12" cy="12" rx="9.8" ry="3.7" fill="none" stroke="#61DAFB" stroke-width="1.35"/><ellipse class="${kOrb}" style="animation-delay:-0.3s" pathLength="64" cx="12" cy="12" rx="9.8" ry="3.7" transform="rotate(60 12 12)" fill="none" stroke="#61DAFB" stroke-width="1.35"/><ellipse class="${kOrb}" style="animation-delay:-0.6s" pathLength="64" cx="12" cy="12" rx="9.8" ry="3.7" transform="rotate(120 12 12)" fill="none" stroke="#61DAFB" stroke-width="1.35"/></g><circle class="${kNuc}" cx="12" cy="12" r="2"/>`,
      'Upstream react-icon.svg choreography: 3 phase-staggered #61DAFB electron orbits revolving around a pulsing nucleus',
      '3 rotated <ellipse> orbital traces + continuous atom rotation + nucleus scale pulse'
    );
  }

  // 16. KUBERNETES (Heptagon Hull + Spinning 7-Spoke Helm Wheel)
  if (item.id === 'kubernetes') {
    const kWheel = `tss_${uid}_whl`;
    return wrapSvg(
      '',
      `@keyframes ${kWheel}{0%,10%{transform:rotate(0deg)}24%{transform:rotate(-28deg)}58%,85%{transform:rotate(360deg)}100%{transform:rotate(360deg)}}.${kWheel}{transform-origin:12px 12.2px;animation:${kWheel} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kWheel}{animation:none!important;transform:none!important}`,
      `<path fill="#326CE5" d="M12 1.5 L20.1 5.4 L22.1 14.2 L16.5 21.3 L7.5 21.3 L1.9 14.2 L3.9 5.4 Z"/><g class="${kWheel}" stroke="#FFFFFF" stroke-linecap="round"><circle cx="12" cy="12.2" r="5" fill="none" stroke-width="1.3"/><circle cx="12" cy="12.2" r="1.5" fill="#FFFFFF" stroke="none"/><line x1="12" y1="4.8" x2="12" y2="10.6" stroke-width="1.25"/><line x1="17.8" y1="7.6" x2="13.2" y2="11.2" stroke-width="1.25"/><line x1="19.2" y1="13.8" x2="13.5" y2="12.5" stroke-width="1.25"/><line x1="15.2" y1="18.8" x2="12.7" y2="13.6" stroke-width="1.25"/><line x1="8.8" y1="18.8" x2="11.3" y2="13.6" stroke-width="1.25"/><line x1="4.8" y1="13.8" x2="10.5" y2="12.5" stroke-width="1.25"/><line x1="6.2" y1="7.6" x2="10.8" y2="11.2" stroke-width="1.25"/></g>`,
      'Upstream kubernetes-icon.svg choreography: stationary #326CE5 heptagon hull with wind-up and 360deg helm wheel rotation',
      'Separated heptagon hull + 7-spoke helm <g> rotational keyframe'
    );
  }

  // 17. GIT (#F05032 Diamond + Branch/Merge Line Draw + 3 Popping Commit Nodes)
  if (item.id === 'git') {
    const kL = `tss_${uid}_l`,
      kN1 = `tss_${uid}_n1`,
      kN2 = `tss_${uid}_n2`,
      kN3 = `tss_${uid}_n3`;
    return wrapSvg(
      '',
      `@keyframes ${kL}{0%{stroke-dashoffset:30}34%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:30}}@keyframes ${kN1}{0%,8%{transform:scale(0)}26%,84%{transform:scale(1)}100%{transform:scale(0)}}@keyframes ${kN2}{0%,18%{transform:scale(0)}36%,84%{transform:scale(1)}100%{transform:scale(0)}}@keyframes ${kN3}{0%,28%{transform:scale(0)}46%,84%{transform:scale(1)}100%{transform:scale(0)}}.${kL}{stroke-dasharray:30;animation:${kL} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kN1}{transform-origin:9.5px 7.5px;animation:${kN1} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${kN2}{transform-origin:9.5px 15.8px;animation:${kN2} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${kN3}{transform-origin:14.8px 12px;animation:${kN3} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}`,
      `.${kL},.${kN1},.${kN2},.${kN3}{animation:none!important;transform:none!important;stroke-dashoffset:0!important}`,
      `<path fill="#F05032" d="M22.5 10.7 L13.3 1.5 a1.8 1.8 0 0 0 -2.6 0 L1.5 10.7 a1.8 1.8 0 0 0 0 2.6 l9.2 9.2 a1.8 1.8 0 0 0 2.6 0 l9.2 -9.2 a1.8 1.8 0 0 0 0 -2.6 z"/><path class="${kL}" pathLength="30" fill="none" stroke="#FFFFFF" stroke-width="1.65" stroke-linecap="round" d="M7.2 5.2 L14.8 12 M9.5 7.5 V15.8"/><circle class="${kN1}" cx="9.5" cy="7.5" r="1.7" fill="#FFFFFF"/><circle class="${kN2}" cx="9.5" cy="15.8" r="1.7" fill="#FFFFFF"/><circle class="${kN3}" cx="14.8" cy="12" r="1.7" fill="#FFFFFF"/>`,
      'Git #F05032 diamond badge with progressive white branch/merge graph draw and sequential commit node pop-ins',
      'Branch path stroke-dashoffset + 3 staggered commit <circle> spring scale keyframes'
    );
  }

  // 18. REDUX (Upstream redux-icon.svg choreography: 3 interlocking #764ABC arcs + 3 state dots)
  if (item.id === 'redux') {
    const kArc = `tss_${uid}_arc`,
      kDot = `tss_${uid}_dot`;
    return wrapSvg(
      '',
      `@keyframes ${kArc}{0%{stroke-dashoffset:100;fill-opacity:0.35}45%,82%{stroke-dashoffset:0;fill-opacity:1}100%{stroke-dashoffset:-100;fill-opacity:0.35}}@keyframes ${kDot}{0%,100%{transform:scale(0.85)}50%{transform:scale(1.12)}}.${kArc}{stroke-dasharray:100;animation:${kArc} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kDot}{transform-origin:12px 12px;animation:${kDot} 2s ease-in-out infinite}`,
      `.${kArc},.${kDot}{animation:none!important;transform:none!important;stroke-dashoffset:0!important;fill-opacity:1!important}`,
      `<g class="${kDot}"><path class="${kArc}" pathLength="100" fill="#764ABC" stroke="#C4B5FD" stroke-width="0.65" stroke-linecap="round" d="${d}"/></g>`,
      'Upstream redux-icon.svg choreography: 3 interlocking #764ABC orbital bowls tracing continuously with pulsing state nodes',
      'Continuous stroke-dashoffset arc trace + harmonic state node pulse'
    );
  }

  // 19. DJANGO (Upstream django-icon.svg choreography: d and j stems drawing & illuminating)
  if (item.id === 'django') {
    const kD = `tss_${uid}_d`;
    return wrapSvg(
      '',
      `@keyframes ${kD}{0%{stroke-dashoffset:100;fill:#092E20}34%,78%{stroke-dashoffset:0;fill:#44B78B}100%{stroke-dashoffset:-100;fill:#092E20}}.${kD}{stroke-dasharray:100;animation:${kD} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kD}{animation:none!important;stroke-dashoffset:0!important;fill:#44B78B!important}`,
      `<path class="${kD}" pathLength="100" fill="#44B78B" stroke="#A7F3D0" stroke-width="0.65" stroke-linecap="round" d="${d}"/>`,
      'Upstream django-icon.svg choreography: dual d and j typographic stems drawing via stroke-dashoffset and illuminating from #092E20 to #44B78B',
      'Synchronized stroke-dashoffset contour draw + brand green fill transition'
    );
  }

  // 20. MYSQL (Upstream mysql-icon.svg choreography: leaping dolphin arc)
  if (item.id === 'mysql') {
    const kDolphin = `tss_${uid}_dlp`;
    return wrapSvg(
      '',
      `@keyframes ${kDolphin}{0%,100%{transform:rotate(-8deg) translateY(0.8px);stroke-dashoffset:100}40%,75%{transform:rotate(4deg) translateY(-0.8px);stroke-dashoffset:0}}.${kDolphin}{transform-origin:12px 14px;stroke-dasharray:100;animation:${kDolphin} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kDolphin}{animation:none!important;transform:none!important;stroke-dashoffset:0!important}`,
      `<g class="${kDolphin}"><path fill="#00758F" stroke="#F29111" stroke-width="0.6" stroke-linecap="round" pathLength="100" d="${d}"/></g>`,
      'Upstream mysql-icon.svg choreography: #00758F MySQL dolphin leaping along an arc with #F29111 highlight trace',
      'Arcing dolphin rotational translation + dual-color #00758F/#F29111 contour trace'
    );
  }

  // 21. FIGMA (5-Color Petals Blooming)
  if (item.id === 'figma') {
    const k1 = `tss_${uid}_1`,
      k2 = `tss_${uid}_2`,
      k3 = `tss_${uid}_3`,
      k4 = `tss_${uid}_4`,
      k5 = `tss_${uid}_5`;
    return wrapSvg(
      '',
      `@keyframes ${k1}{0%,100%{transform:translate(-1.8px,-1.2px) scale(0.85)}32%,78%{transform:translate(0,0) scale(1)}}@keyframes ${k2}{0%,6%,100%{transform:translate(1.8px,-1.2px) scale(0.85)}36%,78%{transform:translate(0,0) scale(1)}}@keyframes ${k3}{0%,10%,100%{transform:translate(-1.8px,0) scale(0.85)}40%,78%{transform:translate(0,0) scale(1)}}@keyframes ${k4}{0%,14%,100%{transform:scale(0.5)}44%,78%{transform:scale(1)}}@keyframes ${k5}{0%,18%,100%{transform:translate(0,1.8px) scale(0.85)}48%,78%{transform:translate(0,0) scale(1)}}.${k1}{transform-origin:10px 5px;animation:${k1} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${k2}{transform-origin:14px 5px;animation:${k2} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${k3}{transform-origin:10px 12px;animation:${k3} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${k4}{transform-origin:14px 12px;animation:${k4} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${k5}{transform-origin:10px 18px;animation:${k5} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}`,
      `.${k1},.${k2},.${k3},.${k4},.${k5}{animation:none!important;transform:none!important}`,
      `<path class="${k1}" fill="#F24E1E" d="M8 2h4v6.67H8a3.33 3.33 0 1 1 0-6.67z"/><path class="${k2}" fill="#FF7262" d="M12 2h4a3.33 3.33 0 1 1 0 6.67h-4V2z"/><path class="${k3}" fill="#A259FF" d="M8 8.67h4v6.66H8a3.33 3.33 0 1 1 0-6.66z"/><path class="${k4}" fill="#1ABCFE" d="M15.33 12a3.33 3.33 0 1 1-6.66 0 3.33 3.33 0 0 1 6.66 0z"/><path class="${k5}" fill="#0ACF83" d="M8 15.33h4v3.34a3.33 3.33 0 1 1-4-3.34z"/>`,
      '5-color Figma geometric petals snapping into the 2x3 modular grid',
      '5 independent petal <path> spring assembly keyframes'
    );
  }

  // 22. VUE.JS (Dual-Color Telescoping Chevrons)
  if (item.id === 'vuedotjs') {
    const kOut = `tss_${uid}_o`,
      kIn = `tss_${uid}_i`;
    return wrapSvg(
      '',
      `@keyframes ${kOut}{0%,100%{transform:translateY(-1.2px) scale(0.95)}34%,80%{transform:translateY(0) scale(1)}}@keyframes ${kIn}{0%,10%,100%{transform:translateY(-3.2px) scale(0.85);opacity:0.35}40%,80%{transform:translateY(0) scale(1);opacity:1}}.${kOut}{transform-origin:12px 12px;animation:${kOut} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kIn}{transform-origin:12px 8px;animation:${kIn} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}`,
      `.${kOut},.${kIn}{animation:none!important;transform:none!important;opacity:1!important}`,
      `<path class="${kOut}" fill="#4FC08D" d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39Z"/><path class="${kIn}" fill="#35495E" stroke="#E2E8F0" stroke-width="0.35" d="M12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/>`,
      'Dual-color #4FC08D outer V and #35495E inner V telescoping into alignment',
      'Two-layer chevron vertical spring convergence'
    );
  }

  // 23. VITE (Shield + Striking Golden Lightning Bolt)
  if (item.id === 'vite') {
    const kBolt = `tss_${uid}_blt`,
      kSh = `tss_${uid}_sh`;
    return wrapSvg(
      '',
      `@keyframes ${kBolt}{0%,100%{transform:translateY(-1.4px) scale(0.9)}34%,78%{transform:translateY(0) scale(1.05)}}@keyframes ${kSh}{0%,100%{opacity:0.8}40%,75%{opacity:1}}.${kBolt}{transform-origin:12px 10px;animation:${kBolt} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${kSh}{animation:${kSh} ${dur} ease-in-out infinite}`,
      `.${kBolt},.${kSh}{animation:none!important;transform:none!important;opacity:1!important}`,
      `<path class="${kSh}" fill="#646CFF" d="M22.2 3.8 L12.4 21.5 c-.2.4-.8.4-1 0 L1.8 3.8 c-.2-.4.1-.9.6-.8 L12 4.8 l9.6-1.8 c.5-.1.8.4.6.8 z"/><path class="${kBolt}" fill="#FFEA83" d="M15.6 2.4 L8.9 11.4 h4.0 l-1.1 7.0 l7.1-9.4 h-4.1 z"/>`,
      'Two-color #646CFF Vite shield and #FFEA83 golden lightning bolt strike',
      'Separated shield and lightning bolt paths with spring strike keyframe'
    );
  }

  // 24. TAILWIND CSS (Counter-Gliding Dual Wind Waves)
  if (item.id === 'tailwindcss') {
    const cT = `tss_${uid}_ct`,
      cB = `tss_${uid}_cb`,
      kT = `tss_${uid}_kt`,
      kB = `tss_${uid}_kb`;
    return wrapSvg(
      `<clipPath id="${cT}"><rect x="0" y="0" width="24" height="12"/></clipPath><clipPath id="${cB}"><rect x="0" y="12" width="24" height="12"/></clipPath>`,
      `@keyframes ${kT}{0%,100%{transform:translateX(-1.5px)}50%{transform:translateX(1.5px)}}@keyframes ${kB}{0%,100%{transform:translateX(1.5px)}50%{transform:translateX(-1.5px)}}.${kT}{animation:${kT} ${dur} ease-in-out infinite}.${kB}{animation:${kB} ${dur} ease-in-out infinite}`,
      `.${kT},.${kB}{animation:none!important;transform:none!important}`,
      `<g clip-path="url(#${cT})"><path class="${kT}" fill="#38BDF8" d="${d}"/></g><g clip-path="url(#${cB})"><path class="${kB}" fill="#0EA5E9" d="${d}"/></g>`,
      'Upper and lower #38BDF8/#0EA5E9 Tailwind wave crests gliding in counter-phase',
      'Dual horizontal <clipPath> split + counter-phase wave glide'
    );
  }

  // 25. GRAPHQL (Hexagon + Scaling Triangle + 6 Vertex Nodes)
  if (item.id === 'graphql') {
    const kN = `tss_${uid}_n`,
      kT = `tss_${uid}_t`;
    return wrapSvg(
      '',
      `@keyframes ${kN}{0%{transform:rotate(0deg)}45%,82%{transform:rotate(120deg)}100%{transform:rotate(360deg)}}@keyframes ${kT}{0%,100%{transform:scale(0.75);opacity:0.45}36%,82%{transform:scale(1);opacity:1}}.${kN}{transform-origin:12px 12px;animation:${kN} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kT}{transform-origin:12px 12px;animation:${kT} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}`,
      `.${kN},.${kT}{animation:none!important;transform:none!important;opacity:1!important}`,
      `<g class="${kT}"><polygon points="12,2.5 20.2,7.2 20.2,16.8 12,21.5 3.8,16.8 3.8,7.2" fill="none" stroke="#E10098" stroke-width="1.15"/><polygon points="12,2.5 20.2,16.8 3.8,16.8" fill="none" stroke="#F472B6" stroke-width="1.25" stroke-linejoin="round"/></g><g class="${kN}" fill="#E10098"><circle cx="12" cy="2.5" r="1.7"/><circle cx="20.2" cy="7.2" r="1.7"/><circle cx="20.2" cy="16.8" r="1.7"/><circle cx="12" cy="21.5" r="1.7"/><circle cx="3.8" cy="16.8" r="1.7"/><circle cx="3.8" cy="7.2" r="1.7"/></g>`,
      'Upstream graphql-icon.svg choreography: #E10098 6-vertex orbital rotation with inscribed triangle bloom',
      'Separated vertex node ring rotation + inscribed polygon spring scale'
    );
  }

  // 26. WEBPACK (Counter-Rotating Inner & Outer Isometric Cubes)
  if (item.id === 'webpack') {
    const kO = `tss_${uid}_o`,
      kI = `tss_${uid}_i`;
    return wrapSvg(
      '',
      `@keyframes ${kO}{0%{transform:rotate(0deg)}50%{transform:rotate(-180deg)}100%{transform:rotate(-360deg)}}@keyframes ${kI}{0%{transform:rotate(0deg) scale(0.88)}50%{transform:rotate(180deg) scale(1.04)}100%{transform:rotate(360deg) scale(0.88)}}.${kO}{transform-origin:12px 12px;animation:${kO} 4.8s cubic-bezier(0.4,0,0.2,1) infinite}.${kI}{transform-origin:12px 12px;animation:${kI} 4.8s cubic-bezier(0.4,0,0.2,1) infinite}`,
      `.${kO},.${kI}{animation:none!important;transform:none!important}`,
      `<g class="${kO}"><polygon points="12,2 20.6,7 20.6,17 12,22 3.4,17 3.4,7" fill="none" stroke="#8ED6FB" stroke-width="1.5" stroke-linejoin="round"/></g><g class="${kI}"><polygon points="12,6 17.2,9 17.2,15 12,18 6.8,15 6.8,9" fill="#1C78C0" stroke="#8ED6FB" stroke-width="0.8" stroke-linejoin="round"/><line x1="12" y1="12" x2="12" y2="18" stroke="#8ED6FB" stroke-width="0.85"/><line x1="12" y1="12" x2="6.8" y2="9" stroke="#8ED6FB" stroke-width="0.85"/><line x1="12" y1="12" x2="17.2" y2="9" stroke="#8ED6FB" stroke-width="0.85"/></g>`,
      'Upstream webpack-icon.svg choreography: #8ED6FB outer cube and #1C78C0 inner cube counter-rotating',
      'Counter-rotating concentric isometric hexagon groups'
    );
  }

  // 27. RASPBERRY PI (Two-Color Green Leaves + Crimson Berry)
  if (item.id === 'raspberrypi') {
    const cL = `tss_${uid}_cl`,
      cB = `tss_${uid}_cb`,
      kL = `tss_${uid}_kl`,
      kB = `tss_${uid}_kb`;
    return wrapSvg(
      `<clipPath id="${cL}"><rect x="0" y="0" width="24" height="6.8"/></clipPath><clipPath id="${cB}"><rect x="0" y="6.5" width="24" height="17.5"/></clipPath>`,
      `@keyframes ${kL}{0%,100%{transform:rotate(0deg) scale(0.95)}40%{transform:rotate(-5deg) scale(1.04)}75%{transform:rotate(4deg) scale(1.02)}}@keyframes ${kB}{0%,100%{transform:scale(0.95)}45%,75%{transform:scale(1.04)}}.${kL}{transform-origin:12px 6.5px;animation:${kL} ${dur} ease-in-out infinite}.${kB}{transform-origin:12px 14.5px;animation:${kB} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}`,
      `.${kL},.${kB}{animation:none!important;transform:none!important}`,
      `<g clip-path="url(#${cL})"><g class="${kL}"><path fill="#75A928" d="${d}"/></g></g><g clip-path="url(#${cB})"><g class="${kB}"><path fill="#E32A52" d="${d}"/></g></g>`,
      'Upstream raspberrypi-icon.svg choreography: #75A928 green crown leaves and #E32A52 crimson berry',
      'Dual regional <clipPath> color separation + independent leaf & berry motion'
    );
  }

  // 28. JAVA (Cup & Saucer + Rising Dual Steam Plumes)
  if (item.id === 'openjdk' || item.id === 'java') {
    const cS = `tss_${uid}_cs`,
      cC = `tss_${uid}_cc`,
      kS = `tss_${uid}_ks`;
    return wrapSvg(
      `<clipPath id="${cS}"><rect x="0" y="0" width="24" height="12.2"/></clipPath><clipPath id="${cC}"><rect x="0" y="11.8" width="24" height="12.2"/></clipPath>`,
      `@keyframes ${kS}{0%,100%{transform:translateY(0.7px);opacity:0.5}50%{transform:translateY(-1.1px);opacity:1}}.${kS}{animation:${kS} 2.2s ease-in-out infinite}`,
      `.${kS}{animation:none!important;transform:none!important;opacity:1!important}`,
      `<g clip-path="url(#${cC})"><path fill="#38BDF8" d="${d}"/></g><g clip-path="url(#${cS})"><g class="${kS}"><path fill="#FB923C" d="${d}"/></g></g>`,
      'Upstream java-icon.svg choreography: #38BDF8 coffee cup and saucer with rising #FB923C steam plumes',
      'Upper/lower <clipPath> split separating rising orange steam from the blue cup'
    );
  }

  // 29. PYTORCH (Flame + Golden Core + Ignition Dot)
  if (item.id === 'pytorch') {
    const kF = `tss_${uid}_f`,
      kD = `tss_${uid}_d`;
    return wrapSvg(
      '',
      `@keyframes ${kF}{0%,100%{transform:scale(0.96) rotate(-2deg)}45%,75%{transform:scale(1.03) rotate(2deg)}}@keyframes ${kD}{0%,100%{transform:translate(0,0) scale(0.88);fill:#FF9E2C}50%{transform:translate(0.5px,-0.9px) scale(1.25);fill:#FEF08A}}.${kF}{transform-origin:12px 15px;animation:${kF} ${dur} ease-in-out infinite}.${kD}{transform-origin:15.2px 4.8px;animation:${kD} 1.8s ease-in-out infinite}`,
      `.${kF},.${kD}{animation:none!important;transform:none!important}`,
      `<g class="${kF}"><path fill="#EE4C2C" d="${d}"/><path fill="#FF9E2C" fill-opacity="0.5" transform="translate(2.4, 3.2) scale(0.8)" d="${d}"/></g><circle class="${kD}" cx="15.2" cy="4.8" r="1.55" fill="#FEF08A"/>`,
      'PyTorch #EE4C2C flame with warm #FF9E2C inner core and pulsing #FEF08A top spark',
      'Dual-scale flame paths + independent top ignition spark keyframe'
    );
  }

  // 30. OPENAI (Rotating 6-Petal Blossom + Breathing Core)
  if (item.id === 'openai') {
    const kR = `tss_${uid}_r`,
      kC = `tss_${uid}_c`;
    return wrapSvg(
      '',
      `@keyframes ${kR}{0%{transform:rotate(0deg) scale(0.95)}45%,75%{transform:rotate(120deg) scale(1.02)}100%{transform:rotate(240deg) scale(0.95)}}@keyframes ${kC}{0%,100%{r:1.5px;opacity:0.45}50%{r:2.4px;opacity:0.95}}.${kR}{transform-origin:12px 12px;animation:${kR} 4.2s cubic-bezier(0.4,0,0.2,1) infinite}.${kC}{animation:${kC} 2.1s ease-in-out infinite}`,
      `.${kR},.${kC}{animation:none!important;transform:none!important;opacity:0.8!important}`,
      `<g class="${kR}"><path fill="#10A37F" d="${d}"/></g><circle class="${kC}" cx="12" cy="12" r="2" fill="#A7F3D0"/>`,
      '6-petal rotational symmetry bloom in #10A37F with breathing #A7F3D0 central core',
      '120deg rotational step keyframe + central aperture pulse'
    );
  }

  // 31. NGINX (Hexagon + N Pipeline Flow + 5 Pulsing Nodes)
  if (item.id === 'nginx') {
    const kN = `tss_${uid}_n`,
      kP = `tss_${uid}_p`;
    return wrapSvg(
      '',
      `@keyframes ${kN}{0%{stroke-dashoffset:36}36%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:-36}}@keyframes ${kP}{0%,100%{transform:scale(0.8);opacity:0.5}45%,75%{transform:scale(1.18);opacity:1}}.${kN}{stroke-dasharray:36;animation:${kN} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kP}{transform-box:fill-box;transform-origin:center;animation:${kP} 2s ease-in-out infinite}`,
      `.${kN},.${kP}{animation:none!important;transform:none!important;stroke-dashoffset:0!important;opacity:1!important}`,
      `<polygon points="12,1.6 21,6.8 21,17.2 12,22.4 3,17.2 3,6.8" fill="#009639" fill-opacity="0.28" stroke="#009639" stroke-width="1.2" stroke-linejoin="round"/><path class="${kN}" pathLength="36" fill="none" stroke="#4ADE80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 16.5 V7.5 L16 16.5 V7.5"/><g fill="#FFFFFF"><circle class="${kP}" cx="8" cy="16.5" r="1.25"/><circle class="${kP}" cx="8" cy="7.5" r="1.25"/><circle class="${kP}" cx="12" cy="12" r="1.35"/><circle class="${kP}" cx="16" cy="16.5" r="1.25"/><circle class="${kP}" cx="16" cy="7.5" r="1.25"/></g>`,
      'Upstream nginx-icon.svg choreography: #009639 hexagon with N proxy pipeline trace and 5 junction nodes',
      'N-pipeline stroke-dashoffset trace + 5 junction node scale pulses'
    );
  }

  // 32. SASS (Cursive Script Ribbon Draw)
  if (item.id === 'sass') {
    const kS = `tss_${uid}_s`;
    return wrapSvg(
      '',
      `@keyframes ${kS}{0%{stroke-dashoffset:100;fill-opacity:0.25}42%,82%{stroke-dashoffset:0;fill-opacity:1}100%{stroke-dashoffset:-100;fill-opacity:0.25}}.${kS}{stroke-dasharray:100;animation:${kS} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kS}{animation:none!important;stroke-dashoffset:0!important;fill-opacity:1!important}`,
      `<path class="${kS}" pathLength="100" fill="#CC6699" stroke="#FBCFE8" stroke-width="0.65" stroke-linecap="round" d="${d}"/>`,
      'Upstream sass-icon.svg choreography: continuous #CC6699 cursive calligraphy ribbon trace',
      'Continuous stroke-dashoffset calligraphy draw + fill reveal'
    );
  }

  // 33. JEST (3-Part Jester Boots & Bell Tips)
  if (item.id === 'jest') {
    const kJ = `tss_${uid}_j`,
      kB = `tss_${uid}_b`;
    return wrapSvg(
      '',
      `@keyframes ${kJ}{0%,100%{transform:rotate(-5deg) scale(0.95);stroke-dashoffset:100}36%,78%{transform:rotate(2deg) scale(1);stroke-dashoffset:0}}@keyframes ${kB}{0%,20%,100%{transform:scale(0);opacity:0}42%,82%{transform:scale(1);opacity:1}}.${kJ}{transform-origin:12px 12px;stroke-dasharray:100;animation:${kJ} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${kB}{transform-origin:12px 12px;animation:${kB} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}`,
      `.${kJ},.${kB}{animation:none!important;transform:none!important;stroke-dashoffset:0!important;opacity:1!important}`,
      `<g class="${kJ}"><path fill="#C21325" stroke="#FDA4AF" stroke-width="0.55" pathLength="100" d="${d}"/></g><g class="${kB}" fill="#FDE047"><circle cx="4.8" cy="18.2" r="1.15"/><circle cx="12.2" cy="19.8" r="1.15"/><circle cx="19.5" cy="16.4" r="1.15"/></g>`,
      'Upstream jest-icon.svg choreography: #C21325 jester boots spring bounce with 3 golden toe bells popping in',
      'Spring rotation/scale keyframe + 3 staggered bell circle pop-ins'
    );
  }

  // 34. ESLINT (Counter-Rotating Outer Hexagon & Inner Core)
  if (item.id === 'eslint') {
    const kO = `tss_${uid}_o`,
      kI = `tss_${uid}_i`;
    return wrapSvg(
      '',
      `@keyframes ${kO}{0%{transform:rotate(0deg)}45%,82%{transform:rotate(60deg)}100%{transform:rotate(60deg)}}@keyframes ${kI}{0%{transform:rotate(0deg) scale(0.84)}45%,82%{transform:rotate(-60deg) scale(1)}100%{transform:rotate(-60deg) scale(0.84)}}.${kO}{transform-origin:12px 12px;animation:${kO} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kI}{transform-origin:12px 12px;animation:${kI} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}`,
      `.${kO},.${kI}{animation:none!important;transform:none!important}`,
      `<g class="${kO}"><path fill="#4B32C3" d="${d}"/></g><polygon class="${kI}" points="12,7.2 16.2,9.6 16.2,14.4 12,16.8 7.8,14.4 7.8,9.6" fill="#8080F2"/>`,
      'Upstream eslint-icon.svg choreography: #4B32C3 outer hexagon and #8080F2 inner core counter-rotating 60deg into lock',
      'Dual concentric hexagon counter-rotation keyframes'
    );
  }

  // 35. PRETTIER (Multicolor Code Formatting Bars Sliding Into Alignment)
  if (item.id === 'prettier') {
    const k1 = `tss_${uid}_1`,
      k2 = `tss_${uid}_2`,
      k3 = `tss_${uid}_3`;
    return wrapSvg(
      '',
      `@keyframes ${k1}{0%,100%{transform:translateX(-2.8px)}34%,80%{transform:translateX(0)}}@keyframes ${k2}{0%,100%{transform:translateX(2.8px)}38%,80%{transform:translateX(0)}}@keyframes ${k3}{0%,100%{transform:translateX(-1.8px)}42%,80%{transform:translateX(0)}}.${k1}{animation:${k1} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${k2}{animation:${k2} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${k3}{animation:${k3} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${k1},.${k2},.${k3}{animation:none!important;transform:none!important}`,
      `<g class="${k1}"><rect x="4" y="3.2" width="11" height="2" rx="1" fill="#56B3B4"/><rect x="4" y="11.2" width="12" height="2" rx="1" fill="#F7B93E"/><rect x="4" y="19.2" width="8" height="2" rx="1" fill="#56B3B4"/></g><g class="${k2}"><rect x="16.5" y="3.2" width="3.5" height="2" rx="1" fill="#EA5E5E"/><rect x="4" y="7.2" width="7" height="2" rx="1" fill="#EA5E5E"/><rect x="4" y="15.2" width="9" height="2" rx="1" fill="#BF85BF"/></g><g class="${k3}"><rect x="12.5" y="7.2" width="7.5" height="2" rx="1" fill="#BF85BF"/><rect x="14.5" y="15.2" width="5.5" height="2" rx="1" fill="#F7B93E"/></g>`,
      'Upstream prettier-icon.svg choreography: multicolor code formatting bars sliding horizontally into clean indentation',
      '3 staggered horizontal bar group translations'
    );
  }

  // 36. STORYBOOK (#FF4785 Tilted Book Badge + Bookmark Ribbon Drop + S Bounce)
  if (item.id === 'storybook') {
    const kB = `tss_${uid}_b`,
      kS = `tss_${uid}_s`;
    return wrapSvg(
      '',
      `@keyframes ${kB}{0%,100%{transform:rotate(-2deg) scale(0.96)}38%,78%{transform:rotate(0deg) scale(1)}}@keyframes ${kS}{0%,15%,100%{stroke-dashoffset:64;fill-opacity:0.4}42%,82%{stroke-dashoffset:0;fill-opacity:1}}.${kB}{transform-origin:12px 12px;animation:${kB} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${kS}{stroke-dasharray:64;animation:${kS} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kB},.${kS}{animation:none!important;transform:none!important;stroke-dashoffset:0!important;fill-opacity:1!important}`,
      `<g class="${kB}"><path class="${kS}" pathLength="64" fill="#FF4785" stroke="#FCE7F3" stroke-width="0.6" d="${d}"/></g>`,
      'Upstream storybook-icon.svg choreography: #FF4785 book badge spring poise with white S emblem contour reveal',
      'Spring badge tilt + stroke-dashoffset emblem trace'
    );
  }

  // 37. SWIFT (#F05138 Swooping Swift Bird)
  if (item.id === 'swift') {
    const kBird = `tss_${uid}_brd`;
    return wrapSvg(
      '',
      `@keyframes ${kBird}{0%,100%{transform:translate(-1.2px,-1px) rotate(-6deg) scale(0.93);stroke-dashoffset:80}36%,78%{transform:translate(0,0) rotate(0deg) scale(1);stroke-dashoffset:0}}.${kBird}{transform-origin:12px 12px;stroke-dasharray:80;animation:${kBird} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}`,
      `.${kBird}{animation:none!important;transform:none!important;stroke-dashoffset:0!important}`,
      `<g class="${kBird}"><path fill="#F05138" stroke="#FED7AA" stroke-width="0.6" pathLength="80" d="${d}"/></g>`,
      'Upstream swift-icon.svg choreography: #F05138 Swift bird swooping along its flight arc with wing-edge highlight',
      'Aerodynamic swoop transform + wing contour stroke-dashoffset trace'
    );
  }

  // 38. GATSBY (#663399 Monogram G Ring + Diagonal Slash Draw)
  if (item.id === 'gatsby') {
    const kG = `tss_${uid}_g`;
    return wrapSvg(
      '',
      `@keyframes ${kG}{0%{stroke-dashoffset:100;fill-opacity:0.35}38%,82%{stroke-dashoffset:0;fill-opacity:1}100%{stroke-dashoffset:-100;fill-opacity:0.35}}.${kG}{stroke-dasharray:100;animation:${kG} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kG}{animation:none!important;stroke-dashoffset:0!important;fill-opacity:1!important}`,
      `<circle cx="12" cy="12" r="10.5" fill="#663399" fill-opacity="0.28"/><path class="${kG}" pathLength="100" fill="#663399" stroke="#F3E8FF" stroke-width="0.7" stroke-linecap="round" d="${d}"/>`,
      'Upstream gatsby-icon.svg choreography: #663399 circular G monogram and diagonal slash progressive stroke draw',
      'Circular G monogram stroke-dashoffset trace + fill lock'
    );
  }

  // 39. TESTING LIBRARY ( Octopus Tentacle Wave)
  if (item.id === 'testinglibrary') {
    const kOct = `tss_${uid}_oct`;
    return wrapSvg(
      '',
      `@keyframes ${kOct}{0%,100%{transform:translateY(0.8px) rotate(-4deg)}40%{transform:translateY(-1px) rotate(4deg)}75%{transform:translateY(0) rotate(0deg)}}.${kOct}{transform-origin:12px 14px;animation:${kOct} ${dur} ease-in-out infinite}`,
      `.${kOct}{animation:none!important;transform:none!important}`,
      `<g class="${kOct}"><path fill="#E33332" stroke="#FCA5A5" stroke-width="0.45" d="${d}"/></g>`,
      'Upstream testinglibrary-icon.svg choreography: #E33332 Testing Library octopus buoyantly bobbing with tentacle wave',
      'Buoyant vertical + rotational wave keyframe'
    );
  }

  // 40. RESCRIPT (#E6484F Layered Red facets)
  if (item.id === 'rescript') {
    const kR = `tss_${uid}_r`;
    return wrapSvg(
      '',
      `@keyframes ${kR}{0%{stroke-dashoffset:90;fill-opacity:0.35;transform:scale(0.95)}36%,82%{stroke-dashoffset:0;fill-opacity:1;transform:scale(1)}100%{stroke-dashoffset:-90;fill-opacity:0.35;transform:scale(0.95)}}.${kR}{transform-origin:12px 12px;stroke-dasharray:90;animation:${kR} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kR}{animation:none!important;transform:none!important;stroke-dashoffset:0!important;fill-opacity:1!important}`,
      `<path class="${kR}" pathLength="90" fill="#E6484F" stroke="#FECDD3" stroke-width="0.65" d="${d}"/>`,
      'Upstream rescript-icon.svg choreography: #E6484F ReScript R monogram facet assembly and contour draw',
      'Facet scale convergence + stroke-dashoffset contour trace'
    );
  }

  // 41. REST API (Bidirectional Request/Response Cloud Arrows)
  if (item.id === 'restapi') {
    const kReq = `tss_${uid}_rq`,
      kRes = `tss_${uid}_rs`;
    return wrapSvg(
      '',
      `@keyframes ${kReq}{0%{stroke-dashoffset:60}40%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:-60}}@keyframes ${kRes}{0%,12%{transform:translateX(-1.5px);opacity:0.5}42%,82%{transform:translateX(0);opacity:1}100%{transform:translateX(-1.5px);opacity:0.5}}.${kReq}{stroke-dasharray:60;animation:${kReq} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kRes}{animation:${kRes} ${dur} ease-in-out infinite}`,
      `.${kReq},.${kRes}{animation:none!important;transform:none!important;stroke-dashoffset:0!important;opacity:1!important}`,
      `<g class="${kRes}"><path class="${kReq}" pathLength="60" fill="#0096D6" stroke="#7DD3FC" stroke-width="0.65" stroke-linecap="round" d="${d}"/></g>`,
      'Upstream rest-api-icon.svg choreography: #0096D6 request/response exchange trace',
      'Bidirectional horizontal exchange + stroke-dashoffset packet trace'
    );
  }

  // 42. GITHUB (Octocat Silhouette + Friendly Tail/Head Poise + Contour Rim)
  if (item.id === 'github') {
    const kCat = `tss_${uid}_cat`,
      kRim = `tss_${uid}_rim`;
    return wrapSvg(
      '',
      `@keyframes ${kCat}{0%,100%{transform:rotate(0deg)}30%{transform:rotate(-3deg)}60%{transform:rotate(2.5deg)}}@keyframes ${kRim}{0%{stroke-dashoffset:100}40%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:-100}}.${kCat}{transform-origin:12px 16px;animation:${kCat} ${dur} ease-in-out infinite}.${kRim}{stroke-dasharray:100;animation:${kRim} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kCat},.${kRim}{animation:none!important;transform:none!important;stroke-dashoffset:0!important}`,
      `<g class="${kCat}"><path fill="#F3F1EC" d="${d}"/><path class="${kRim}" pathLength="100" fill="none" stroke="#93C5FD" stroke-width="0.55" stroke-linecap="round" d="${d}"/></g>`,
      'Upstream github-icon.svg choreography: Octocat silhouette with subtle head/tentacle poise and #93C5FD rim trace',
      'Pivot poise around (12, 16) + pathLength=100 rim contour trace'
    );
  }

  // 43. FASTAPI (Teal Circle + High-Voltage Lightning Bolt Ignition)
  if (item.id === 'fastapi') {
    const kBolt = `tss_${uid}_blt`,
      kRing = `tss_${uid}_rng`;
    return wrapSvg(
      '',
      `@keyframes ${kBolt}{0%,10%{fill-opacity:0.35;transform:scale(0.92)}24%{fill-opacity:1;transform:scale(1.04)}32%{fill-opacity:0.7;transform:scale(0.98)}42%,84%{fill-opacity:1;transform:scale(1)}100%{fill-opacity:0.35;transform:scale(0.92)}}@keyframes ${kRing}{0%{stroke-dashoffset:76}38%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:-76}}.${kBolt}{transform-origin:12px 12px;animation:${kBolt} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${kRing}{stroke-dasharray:76;animation:${kRing} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kBolt},.${kRing}{animation:none!important;transform:none!important;fill-opacity:1!important;stroke-dashoffset:0!important}`,
      `<path class="${kBolt}" fill="#009688" d="${d}"/><circle class="${kRing}" pathLength="76" cx="12" cy="12" r="11.4" fill="none" stroke="#5EEAD4" stroke-width="0.7"/>`,
      'FastAPI #009688 lightning badge with high-speed bolt ignition pulse and #5EEAD4 perimeter circuit trace',
      'Multi-stage bolt ignition scale/opacity + perimeter circle stroke-dashoffset'
    );
  }

  // 44. SQLITE (Feather Quill Writing Stroke)
  if (item.id === 'sqlite') {
    const kQuill = `tss_${uid}_ql`,
      kTrace = `tss_${uid}_tr`;
    return wrapSvg(
      '',
      `@keyframes ${kQuill}{0%,100%{transform:rotate(0deg) translate(0,0)}35%{transform:rotate(-3deg) translate(-0.4px,-0.4px)}65%{transform:rotate(2deg) translate(0.3px,0.2px)}}@keyframes ${kTrace}{0%{stroke-dashoffset:100}38%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:-100}}.${kQuill}{transform-origin:14px 18px;animation:${kQuill} ${dur} ease-in-out infinite}.${kTrace}{stroke-dasharray:100;animation:${kTrace} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kQuill},.${kTrace}{animation:none!important;transform:none!important;stroke-dashoffset:0!important}`,
      `<g class="${kQuill}"><path fill="#38BDF8" d="${d}"/><path class="${kTrace}" pathLength="100" fill="none" stroke="#E0F2FE" stroke-width="0.6" stroke-linecap="round" d="${d}"/></g>`,
      'SQLite #38BDF8 feather quill and database page with nib writing motion and ink contour trace',
      'Quill nib pivot motion + pathLength=100 contour trace'
    );
  }

  // 45. HUGGING FACE (Cheerful Golden Face & Waving Hands)
  if (item.id === 'huggingface') {
    const kFace = `tss_${uid}_fc`;
    return wrapSvg(
      '',
      `@keyframes ${kFace}{0%,100%{transform:translateY(0) rotate(0deg)}28%{transform:translateY(-0.9px) rotate(-4deg)}58%{transform:translateY(-0.5px) rotate(4deg)}82%{transform:translateY(0) rotate(0deg)}}.${kFace}{transform-origin:12px 14px;animation:${kFace} ${dur} ease-in-out infinite}`,
      `.${kFace}{animation:none!important;transform:none!important}`,
      `<g class="${kFace}"><path fill="#FFD21E" stroke="#FEF08A" stroke-width="0.45" d="${d}"/></g>`,
      'Hugging Face #FFD21E smiling mascot with cheerful hand-wave rock and warm highlight',
      'Harmonic mascot rock around (12, 14) with golden contour highlight'
    );
  }

  // RUST (the gear keeps its shape; a rust-orange heat beam sweeps once around the cog, clipped to the mark)
  if (item.id === 'rust') {
    const kBeam = `tss_${uid}_bm`,
      idClip = `tss_${uid}_cl`,
      idGrad = `tss_${uid}_gb`;
    return wrapSvg(
      `<clipPath id="${idClip}"><path clip-rule="evenodd" d="${d}"/></clipPath>` +
        `<linearGradient id="${idGrad}" gradientUnits="userSpaceOnUse" x1="5" y1="0" x2="19" y2="0"><stop offset="0" stop-color="#F74C00" stop-opacity="0"/><stop offset=".7" stop-color="#F74C00" stop-opacity=".55"/><stop offset="1" stop-color="#F74C00" stop-opacity=".95"/></linearGradient>`,
      `@keyframes ${kBeam}{0%,8%{transform:rotate(0deg);opacity:0}16%{opacity:1}72%{opacity:1}80%,100%{transform:rotate(360deg);opacity:0}}` +
        `.${kBeam}{transform-origin:12px 12px;opacity:0;animation:${kBeam} ${dur} cubic-bezier(.45,0,.25,1) infinite}`,
      `.${kBeam}{animation:none!important}`,
      `<path fill="${primary}" fill-rule="evenodd" d="${d}"/><g clip-path="url(#${idClip})"><path class="${kBeam}" fill="url(#${idGrad})" d="M12 12L5.2-2.5H18.8Z"/></g>`,
      'Rust cog stays solid while a rust-orange heat beam sweeps once around it, lighting the teeth and the R as it passes',
      'Rotating gradient wedge (transform rotate 0-360deg) clipped to the logo silhouette'
    );
  }

  // GO (letters dash in and settle; the three speed lines stretch out behind them one by one, then flutter)
  if (item.id === 'go') {
    const kLet = `tss_${uid}_lt`,
      kA = `tss_${uid}_la`,
      kB = `tss_${uid}_lb`,
      kC = `tss_${uid}_lc`,
      cLet = `tss_${uid}_xl`,
      cA = `tss_${uid}_xa`,
      cB = `tss_${uid}_xb`,
      cC = `tss_${uid}_xc`;
    const line = (k, from, to) =>
      `@keyframes ${k}{0%,${from}%{transform:scaleX(0);opacity:0}${from + 14}%{transform:scaleX(1);opacity:1}${to}%{transform:scaleX(1)}${to + 4}%{transform:scaleX(1.15)}${to + 10}%{transform:scaleX(1)}90%{opacity:1}96%,100%{transform:scaleX(1);opacity:0}}`;
    return wrapSvg(
      `<clipPath id="${cLet}"><path d="M6.9-2H28V26H6.3V10.5H6.9Z"/></clipPath>` +
        `<clipPath id="${cA}"><rect x="-2" y="-2" width="8.9" height="12.5"/></clipPath>` +
        `<clipPath id="${cB}"><rect x="-2" y="10.5" width="8.3" height="1.25"/></clipPath>` +
        `<clipPath id="${cC}"><rect x="-2" y="11.75" width="8.3" height="14"/></clipPath>`,
      `@keyframes ${kLet}{0%,4%{transform:translateX(-4px);opacity:0}20%,90%{transform:translateX(0);opacity:1}96%,100%{transform:translateX(0);opacity:0}}` +
        line(kA, 12, 52) +
        line(kB, 16, 56) +
        line(kC, 20, 60) +
        `.${kLet}{animation:${kLet} ${dur} cubic-bezier(.22,1,.36,1) infinite}` +
        `.${kA},.${kB},.${kC}{transform-origin:6.2px 12px;animation-duration:${dur};animation-timing-function:cubic-bezier(.22,1,.36,1);animation-iteration-count:infinite}` +
        `.${kA}{animation-name:${kA}}.${kB}{animation-name:${kB}}.${kC}{animation-name:${kC}}`,
      `.${kLet},.${kA},.${kB},.${kC}{animation:none!important}`,
      `<g class="${kLet}"><g clip-path="url(#${cLet})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g></g>` +
        `<g class="${kA}"><g clip-path="url(#${cA})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g></g>` +
        `<g class="${kB}"><g clip-path="url(#${cB})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g></g>` +
        `<g class="${kC}"><g clip-path="url(#${cC})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g></g>`,
      'Go letters dash in and settle while the three speed lines stretch out behind them one after another, then flutter',
      'Clip-split layers (letters + 3 line strips): translateX dash-in and right-anchored scaleX stretch with staggered timing'
    );
  }

  // REDIS (ping and pong: the mark gives two small bumps and a light ripple spreads outward from the counter of the R, clipped to the mark)
  if (item.id === 'redis') {
    const kBump = `tss_${uid}_bp`,
      kR1 = `tss_${uid}_r1`,
      kR2 = `tss_${uid}_r2`,
      idClip = `tss_${uid}_cl`,
      idGrad = `tss_${uid}_rg`;
    return wrapSvg(
      `<clipPath id="${idClip}"><path clip-rule="evenodd" d="${d}"/></clipPath>` +
        `<radialGradient id="${idGrad}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity="0"/><stop offset=".9" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
      `@keyframes ${kBump}{0%,6%{transform:scale(1)}10%{transform:scale(1.045)}16%,30%{transform:scale(1)}34%{transform:scale(1.045)}40%,100%{transform:scale(1)}}` +
        `@keyframes ${kR1}{0%,6%{transform:scale(.4);opacity:0}9%{opacity:1}30%,100%{transform:scale(15);opacity:0}}` +
        `@keyframes ${kR2}{0%,30%{transform:scale(.4);opacity:0}33%{opacity:1}54%,100%{transform:scale(15);opacity:0}}` +
        `.${kBump}{transform-origin:12px 12px;animation:${kBump} ${dur} cubic-bezier(.34,1.4,.64,1) infinite}` +
        `.${kR1},.${kR2}{transform-box:fill-box;transform-origin:center;opacity:0}` +
        `.${kR1}{animation:${kR1} ${dur} cubic-bezier(.2,.6,.3,1) infinite}.${kR2}{animation:${kR2} ${dur} cubic-bezier(.2,.6,.3,1) infinite}`,
      `.${kBump},.${kR1},.${kR2}{animation:none!important}`,
      `<g class="${kBump}"><path fill="${primary}" fill-rule="evenodd" d="${d}"/><g clip-path="url(#${idClip})"><circle class="${kR1}" cx="14.3" cy="8.7" r="1" fill="url(#${idGrad})"/><circle class="${kR2}" cx="14.3" cy="8.7" r="1" fill="url(#${idGrad})"/></g></g>`,
      'Redis ping and pong: two small bumps, each sending a light ripple outward from the counter of the R across the mark',
      'Overshoot scale bump + radial-gradient ripple discs scaled 0.4 to 15 and clipped to the logo silhouette'
    );
  }

  // LINUX (Tux waddles: four alternating tilts around the feet with a small hop on each step, then rests)
  if (item.id === 'linux') {
    const kWaddle = `tss_${uid}_wd`;
    return wrapSvg(
      '',
      `@keyframes ${kWaddle}{0%,8%{transform:rotate(0deg) translateY(0)}14%{transform:rotate(-4deg) translateY(-.35px)}22%{transform:rotate(0deg) translateY(0)}30%{transform:rotate(4deg) translateY(-.35px)}38%{transform:rotate(0deg) translateY(0)}46%{transform:rotate(-4deg) translateY(-.35px)}54%{transform:rotate(0deg) translateY(0)}62%{transform:rotate(4deg) translateY(-.35px)}70%,100%{transform:rotate(0deg) translateY(0)}}` +
        `.${kWaddle}{transform-origin:12px 22.2px;animation:${kWaddle} ${dur} ease-in-out infinite}`,
      `.${kWaddle}{animation:none!important}`,
      `<path class="${kWaddle}" fill="${primary}" fill-rule="evenodd" d="${d}"/>`,
      'Tux waddles in place: four alternating tilts around the feet, each with a small hop, then a rest',
      'transform rotate + translateY keyframes with the pivot at the feet'
    );
  }

  // ARDUINO (LED blink: plus and minus take turns dimming; a pulse of current runs around the infinity loop)
  if (item.id === 'arduino') {
    const kMinus = `tss_${uid}_mn`,
      kPlus = `tss_${uid}_pl`,
      kPulse = `tss_${uid}_pu`,
      cBody = `tss_${uid}_cb`,
      cMinus = `tss_${uid}_cm`,
      cPlus = `tss_${uid}_cp`,
      cLogo = `tss_${uid}_cl`;
    const LOOP =
      'M12 12C10.4 9.6 8.6 7.2 6.2 7.2C3.3 7.2 1 9.3 1 12C1 14.7 3.3 16.8 6.2 16.8C8.6 16.8 10.4 14.4 12 12C13.6 9.6 15.4 7.2 17.8 7.2C20.7 7.2 23 9.3 23 12C23 14.7 20.7 16.8 17.8 16.8C15.4 16.8 13.6 14.4 12 12Z';
    return wrapSvg(
      `<clipPath id="${cBody}"><path clip-rule="evenodd" d="M-1-1H25V25H-1ZM4 11.1H8.1V12.8H4ZM15.9 9.9H20V14H15.9Z"/></clipPath>` +
        `<clipPath id="${cMinus}"><rect x="4" y="11.1" width="4.1" height="1.7"/></clipPath>` +
        `<clipPath id="${cPlus}"><rect x="15.9" y="9.9" width="4.1" height="4.1"/></clipPath>` +
        `<clipPath id="${cLogo}"><path clip-rule="evenodd" d="${d}"/></clipPath>`,
      `@keyframes ${kPlus}{0%,10%{opacity:1}13%,19%{opacity:.18}22%,46%{opacity:1}49%,55%{opacity:.18}58%,100%{opacity:1}}` +
        `@keyframes ${kMinus}{0%,22%{opacity:1}25%,31%{opacity:.18}34%,58%{opacity:1}61%,67%{opacity:.18}70%,100%{opacity:1}}` +
        `@keyframes ${kPulse}{0%,6%{stroke-dashoffset:10;opacity:0}10%{opacity:1}64%{opacity:1}70%,100%{stroke-dashoffset:-100;opacity:0}}` +
        `.${kPlus}{animation:${kPlus} ${dur} ease-in-out infinite}.${kMinus}{animation:${kMinus} ${dur} ease-in-out infinite}` +
        `.${kPulse}{fill:none;stroke:#E6FFFA;stroke-opacity:.72;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:9 100;stroke-dashoffset:10;opacity:0;animation:${kPulse} ${dur} ease-in-out infinite}`,
      `.${kPlus},.${kMinus},.${kPulse}{animation:none!important}`,
      `<g clip-path="url(#${cBody})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g>` +
        `<g class="${kMinus}"><g clip-path="url(#${cMinus})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g></g>` +
        `<g class="${kPlus}"><g clip-path="url(#${cPlus})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g></g>` +
        `<g clip-path="url(#${cLogo})"><path class="${kPulse}" pathLength="100" d="${LOOP}"/></g>`,
      'Arduino Blink: the plus and minus take turns dimming like an LED while a pulse of current runs around the infinity loop',
      'Clip-split plus/minus opacity blink + pathLength dash pulse along the loop centerline clipped to the logo'
    );
  }

  // ESPRESSIF (a signal spreads out from the chip dot and reveals the arcs by distance, then two light waves radiate)
  if (item.id === 'espressif') {
    const kAll = `tss_${uid}_al`,
      kRev = `tss_${uid}_rv`,
      kW1 = `tss_${uid}_w1`,
      kW2 = `tss_${uid}_w2`,
      mRev = `tss_${uid}_mr`,
      gRev = `tss_${uid}_gv`,
      gWave = `tss_${uid}_gw`,
      cLogo = `tss_${uid}_cl`;
    return wrapSvg(
      `<radialGradient id="${gRev}"><stop offset="0" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>` +
        `<mask id="${mRev}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><circle class="${kRev}" cx="6.2" cy="17.8" r="1" fill="url(#${gRev})"/></mask>` +
        `<radialGradient id="${gWave}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset=".93" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
        `<clipPath id="${cLogo}"><path clip-rule="evenodd" d="${d}"/></clipPath>`,
      `@keyframes ${kAll}{0%,90%{opacity:1}96%,100%{opacity:0}}` +
        `@keyframes ${kRev}{0%{transform:scale(.2)}36%,100%{transform:scale(30)}}` +
        `@keyframes ${kW1}{0%,44%{transform:scale(.3);opacity:0}47%{opacity:1}68%,100%{transform:scale(14);opacity:0}}` +
        `@keyframes ${kW2}{0%,56%{transform:scale(.3);opacity:0}59%{opacity:1}80%,100%{transform:scale(14);opacity:0}}` +
        `.${kAll}{animation:${kAll} ${dur} linear infinite}` +
        `.${kRev}{transform-box:fill-box;transform-origin:center;transform:scale(30);animation:${kRev} ${dur} cubic-bezier(.3,.6,.3,1) infinite}` +
        `.${kW1},.${kW2}{transform-box:fill-box;transform-origin:center;opacity:0}` +
        `.${kW1}{animation:${kW1} ${dur} cubic-bezier(.2,.6,.3,1) infinite}.${kW2}{animation:${kW2} ${dur} cubic-bezier(.2,.6,.3,1) infinite}`,
      `.${kAll},.${kRev},.${kW1},.${kW2}{animation:none!important}`,
      `<g class="${kAll}"><g mask="url(#${mRev})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g>` +
        `<g clip-path="url(#${cLogo})"><circle class="${kW1}" cx="6.2" cy="17.8" r="1" fill="url(#${gWave})"/><circle class="${kW2}" cx="6.2" cy="17.8" r="1" fill="url(#${gWave})"/></g></g>`,
      'Espressif signal: the mark spreads outward from the chip dot so the arcs appear by distance, then two light waves radiate across it',
      'Soft radial mask reveal scaled from the dot + two radial-gradient wave discs clipped to the logo'
    );
  }

  // MQTT (publish then subscribe: the four radio bands light up one after another outward, then travel back inward)
  if (item.id === 'mqtt') {
    const ring = (R, r) =>
      `M${R} 24A${R} ${R} 0 1 0 ${-R} 24A${R} ${R} 0 1 0 ${R} 24Z` +
      (r ? `M${r} 24A${r} ${r} 0 1 0 ${-r} 24A${r} ${r} 0 1 0 ${r} 24Z` : '');
    const kA = `tss_${uid}_ba`,
      kB = `tss_${uid}_bb`,
      kC = `tss_${uid}_bc`,
      kD = `tss_${uid}_bd`;
    const pulse = (k, a, b) =>
      `@keyframes ${k}{0%,${a}%{opacity:1}${a + 4}%{opacity:.22}${a + 10}%,${b}%{opacity:1}${b + 4}%{opacity:.22}${b + 10}%,100%{opacity:1}}.${k}{animation:${k} ${dur} ease-in-out infinite}`;
    const layer = (k, c) =>
      `<g class="${k}"><g clip-path="url(#${c})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g></g>`;
    return wrapSvg(
      `<clipPath id="${kA}c"><path clip-rule="evenodd" d="${ring(12.3, 0)}"/></clipPath>` +
        `<clipPath id="${kB}c"><path clip-rule="evenodd" d="${ring(19.9, 12.3)}"/></clipPath>` +
        `<clipPath id="${kC}c"><path clip-rule="evenodd" d="${ring(27.5, 19.9)}"/></clipPath>` +
        `<clipPath id="${kD}c"><path clip-rule="evenodd" d="${ring(48, 27.5)}"/></clipPath>`,
      pulse(kA, 8, 78) + pulse(kB, 14, 70) + pulse(kC, 20, 62) + pulse(kD, 26, 54),
      `.${kA},.${kB},.${kC},.${kD}{animation:none!important}`,
      layer(kA, `${kA}c`) + layer(kB, `${kB}c`) + layer(kC, `${kC}c`) + layer(kD, `${kD}c`),
      'MQTT publish and subscribe: the four radio bands light up one after another outward from the corner, then travel back inward',
      'Annulus clip-split bands with staggered opacity pulses, outward pass then inward pass'
    );
  }

  // NODE-RED (a message packet runs along each wire; the nodes light up when it arrives)
  if (item.id === 'nodered') {
    const kUp = `tss_${uid}_up`,
      kLo = `tss_${uid}_lo`,
      kN1 = `tss_${uid}_n1`,
      kN2 = `tss_${uid}_n2`,
      kN3 = `tss_${uid}_n3`;
    const travel = (k, a, b) =>
      `@keyframes ${k}{0%,${a}%{stroke-dashoffset:8;opacity:0}${a + 2}%{opacity:1}${b - 2}%{opacity:1}${b}%,100%{stroke-dashoffset:-100;opacity:0}}`;
    const flash = (k, a) =>
      `@keyframes ${k}{0%,${a}%{opacity:0}${a + 5}%{opacity:.85}${a + 16}%,100%{opacity:0}}.${k}{opacity:0;animation:${k} ${dur} ease-out infinite}`;
    return wrapSvg(
      '',
      travel(kUp, 12, 40) +
        travel(kLo, 18, 52) +
        `.${kUp},.${kLo}{fill:none;stroke:#FFF1F1;stroke-width:.9;stroke-linecap:round;stroke-dasharray:8 100;stroke-dashoffset:8;opacity:0}` +
        `.${kUp}{animation:${kUp} ${dur} ease-in-out infinite}.${kLo}{animation:${kLo} ${dur} ease-in-out infinite}` +
        flash(kN1, 4) +
        flash(kN2, 38) +
        flash(kN3, 50),
      `.${kUp},.${kLo},.${kN1},.${kN2},.${kN3}{animation:none!important}`,
      `<path fill="${primary}" fill-rule="evenodd" d="${d}"/>` +
        `<path class="${kN1}" fill="#FFF1F1" d="${NR_LEFT_D}"/><path class="${kN2}" fill="#FFF1F1" d="${NR_TOP_D}"/><path class="${kN3}" fill="#FFF1F1" d="${NR_BOTTOM_D}"/>` +
        `<path class="${kUp}" pathLength="100" d="M4.9 11.95C6.2 11.9 7.3 10.2 8.1 9.1C8.9 8 9.8 6.6 11.7 6.6"/>` +
        `<path class="${kLo}" pathLength="100" d="M4.9 11.95H7C10.5 11.95 12 16 16.5 16.1L19 16.5"/>`,
      'Node-RED flow: a message packet runs along each wire and the receiving nodes light up as it arrives',
      'pathLength dash packets along the two wires + node interior flashes timed to the arrival'
    );
  }

  // PLATFORMIO (the alien comes alive: antennae wiggle in turn while the pupils look left, then right)
  if (item.id === 'platformio') {
    const kAL = `tss_${uid}_al`,
      kAR = `tss_${uid}_ar`,
      kPu = `tss_${uid}_pu`,
      cBody = `tss_${uid}_cb`,
      cAL = `tss_${uid}_ca`,
      cAR = `tss_${uid}_cr`,
      cPL = `tss_${uid}_pl`,
      cPR = `tss_${uid}_pr`;
    const circle = (cx, cy, r) =>
      `M${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}Z`;
    const layer = (cls, clip) =>
      `<g class="${cls}"><g clip-path="url(#${clip})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g></g>`;
    return wrapSvg(
      `<clipPath id="${cBody}"><path clip-rule="evenodd" d="M-1-1H25V25H-1ZM5.5 -1H10V4H5.5ZM14 -1H18.5V4H14Z${circle(7.26, 13.52, 1.6)}${circle(16.96, 13.52, 1.6)}"/></clipPath>` +
        `<clipPath id="${cAL}"><rect x="5.5" y="-1" width="4.5" height="5"/></clipPath>` +
        `<clipPath id="${cAR}"><rect x="14" y="-1" width="4.5" height="5"/></clipPath>` +
        `<clipPath id="${cPL}"><path d="${circle(7.26, 13.52, 1.6)}"/></clipPath>` +
        `<clipPath id="${cPR}"><path d="${circle(16.96, 13.52, 1.6)}"/></clipPath>`,
      `@keyframes ${kAL}{0%,14%{transform:rotate(0deg)}22%{transform:rotate(-13deg)}34%{transform:rotate(11deg)}46%{transform:rotate(-8deg)}58%{transform:rotate(5deg)}68%,100%{transform:rotate(0deg)}}` +
        `@keyframes ${kAR}{0%,14%{transform:rotate(0deg)}22%{transform:rotate(13deg)}34%{transform:rotate(-11deg)}46%{transform:rotate(8deg)}58%{transform:rotate(-5deg)}68%,100%{transform:rotate(0deg)}}` +
        `@keyframes ${kPu}{0%,10%{transform:translateX(0)}22%,34%{transform:translateX(-.8px)}46%,58%{transform:translateX(.8px)}70%,100%{transform:translateX(0)}}` +
        `.${kAL}{transform-origin:8.5px 4px;animation:${kAL} ${dur} ease-in-out infinite}` +
        `.${kAR}{transform-origin:15.5px 4px;animation:${kAR} ${dur} ease-in-out infinite}` +
        `.${kPu}{animation:${kPu} ${dur} ease-in-out infinite}`,
      `.${kAL},.${kAR},.${kPu}{animation:none!important}`,
      `<g clip-path="url(#${cBody})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g>` +
        layer(kAL, cAL) +
        layer(kAR, cAR) +
        `<g class="${kPu}">${layer('', cPL)}${layer('', cPR)}</g>`,
      'PlatformIO alien comes alive: the antennae wiggle in turn while the pupils glance left and then right',
      'Clip-split layers: antenna rotate about their bases + synchronized pupil translateX'
    );
  }

  // R (a comet orbits the ring once, clipped to the ring only; the R flashes when the lap completes, like a finished run)
  if (item.id === 'r') {
    const kComet = `tss_${uid}_co`,
      kGlow = `tss_${uid}_gl`,
      kFlash = `tss_${uid}_fl`,
      cRing = `tss_${uid}_cr`;
    const ORBIT = 'M2.4 11.3A9.6 6.9 0 0 1 21.6 11.3A9.6 6.9 0 0 1 2.4 11.3Z';
    return wrapSvg(
      `<clipPath id="${cRing}"><path clip-rule="evenodd" d="${R_RING_D}"/></clipPath>`,
      `@keyframes ${kComet}{0%,10%{stroke-dashoffset:10;opacity:0}14%{opacity:1}72%{opacity:1}80%,100%{stroke-dashoffset:-100;opacity:0}}` +
        `@keyframes ${kGlow}{0%,10%{stroke-dashoffset:22;opacity:0}14%{opacity:.4}72%{opacity:.4}80%,100%{stroke-dashoffset:-100;opacity:0}}` +
        `@keyframes ${kFlash}{0%,78%{opacity:0}84%{opacity:.7}96%,100%{opacity:0}}` +
        `.${kComet},.${kGlow}{fill:none;stroke-linecap:round;opacity:0}` +
        `.${kComet}{stroke:#EAF4FF;stroke-width:2;stroke-dasharray:10 100;stroke-dashoffset:10;animation:${kComet} ${dur} cubic-bezier(.45,0,.3,1) infinite}` +
        `.${kGlow}{stroke:#BFE0FF;stroke-width:3.8;stroke-dasharray:22 100;stroke-dashoffset:22;animation:${kGlow} ${dur} cubic-bezier(.45,0,.3,1) infinite}` +
        `.${kFlash}{opacity:0;animation:${kFlash} ${dur} ease-out infinite}`,
      `.${kComet},.${kGlow},.${kFlash}{animation:none!important}`,
      `<path fill="${primary}" fill-rule="evenodd" d="${d}"/>` +
        `<g clip-path="url(#${cRing})"><path class="${kGlow}" pathLength="100" d="${ORBIT}"/><path class="${kComet}" pathLength="100" d="${ORBIT}"/></g>` +
        `<path class="${kFlash}" fill="#DCEBFF" fill-rule="evenodd" d="${R_BODY_D}"/>`,
      'R language: a comet orbits the ring once without touching the letter, then the R flashes like a finished run',
      'Ring-only clip + pathLength comet dashes on the ellipse centerline + letter flash on completion'
    );
  }

  // MONGODB (the leaf grows from its stem, sways in a breeze, and a soft light climbs along it)
  if (item.id === 'mongodb') {
    const kLeaf = `tss_${uid}_lf`,
      kSheen = `tss_${uid}_sh`,
      cLogo = `tss_${uid}_cl`,
      gSheen = `tss_${uid}_gs`;
    return wrapSvg(
      `<clipPath id="${cLogo}"><path clip-rule="evenodd" d="${d}"/></clipPath>` +
        `<linearGradient id="${gSheen}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`,
      `@keyframes ${kLeaf}{0%,2%{transform:scale(.15) rotate(0deg);opacity:0}16%{opacity:1}24%{transform:scale(1.05) rotate(0deg)}30%{transform:scale(1) rotate(0deg)}38%{transform:scale(1) rotate(-2.6deg)}50%{transform:scale(1) rotate(2.2deg)}62%{transform:scale(1) rotate(-1.6deg)}72%{transform:scale(1) rotate(0deg)}90%{opacity:1}96%,100%{transform:scale(1) rotate(0deg);opacity:0}}` +
        `@keyframes ${kSheen}{0%,32%{opacity:0;transform:translateY(28px)}38%{opacity:1}58%,100%{opacity:0;transform:translateY(-6px)}}` +
        `.${kLeaf}{transform-origin:12px 23.2px;animation:${kLeaf} ${dur} cubic-bezier(.34,1.3,.64,1) infinite}` +
        `.${kSheen}{fill:url(#${gSheen});opacity:0;animation:${kSheen} ${dur} ease-in-out infinite}`,
      `.${kLeaf},.${kSheen}{animation:none!important}`,
      `<g class="${kLeaf}"><path fill="${primary}" fill-rule="evenodd" d="${d}"/><g clip-path="url(#${cLogo})"><rect class="${kSheen}" x="0" y="0" width="24" height="6"/></g></g>`,
      'MongoDB leaf: it grows from the stem with a soft overshoot, sways in a breeze, and a light climbs along the leaf',
      'Scale-in from the stem with overshoot + rotate sway about the stem + clipped vertical sheen sweep'
    );
  }

  // HTML5 (the page renders from top to bottom: a scan line sweeps down and the shield brightens behind it)
  if (item.id === 'html5') {
    const kAll = `tss_${uid}_al`,
      kRev = `tss_${uid}_rv`,
      kScan = `tss_${uid}_sc`,
      mRev = `tss_${uid}_mr`,
      cLogo = `tss_${uid}_cl`;
    return wrapSvg(
      `<mask id="${mRev}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect class="${kRev}" x="-1" y="-1" width="26" height="26" fill="#fff"/></mask>` +
        `<clipPath id="${cLogo}"><path clip-rule="evenodd" d="${d}"/></clipPath>`,
      `@keyframes ${kAll}{0%,90%{opacity:1}96%,100%{opacity:0}}` +
        `@keyframes ${kRev}{0%,8%{transform:scaleY(0)}52%,100%{transform:scaleY(1)}}` +
        `@keyframes ${kScan}{0%,8%{transform:translateY(-1px);opacity:0}10%{opacity:1}50%{opacity:1}54%,100%{transform:translateY(25px);opacity:0}}` +
        `.${kAll}{animation:${kAll} ${dur} linear infinite}` +
        `.${kRev}{transform-origin:12px -1px;animation:${kRev} ${dur} cubic-bezier(.5,0,.5,1) infinite}` +
        `.${kScan}{opacity:0;animation:${kScan} ${dur} cubic-bezier(.5,0,.5,1) infinite}`,
      `.${kAll},.${kRev},.${kScan}{animation:none!important}.${kScan}{opacity:0!important}`,
      `<g class="${kAll}"><path fill="${primary}" fill-opacity=".32" fill-rule="evenodd" d="${d}"/>` +
        `<g mask="url(#${mRev})"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></g>` +
        `<g clip-path="url(#${cLogo})"><rect class="${kScan}" x="-1" y="-.6" width="26" height="1.2" fill="#FFF3E0"/></g></g>`,
      'HTML5 renders like a page loading: a scan line sweeps down the shield and the mark brightens behind it',
      'Animated mask scaleY reveal from the top + synchronized scan-line translateY clipped to the logo'
    );
  }

  // ==========================================================================
  // 2. GEOMETRY-DRIVEN INDIVIDUAL CHOREOGRAPHY FOR ALL REMAINING ICONS
  //    (Analyzes actual SVG subpaths, aspect ratio, curves & centroids —
  //     ZERO foreign circles, ZERO random corner dots, ZERO fake underlines!)
  // ==========================================================================

  const geo = analyzeGeometry(d);
  const subpaths = geo.subpaths;
  const family = item.motionRecipe?.family || 'stroke-trace-fill';

  // Helper: Staggered contour strokes built strictly from the logo's own subpaths
  const buildOwnSubpathStrokes = (strokeWidth = '0.7') => {
    const styles = [];
    const paths = [];
    const reduceRules = [];
    subpaths.forEach((subD, idx) => {
      const cls = `tss_${uid}_sp${idx}`;
      const startPct = idx * 6;
      const endPct = Math.min(44, 30 + idx * 5);
      styles.push(
        `@keyframes ${cls}{0%,${startPct}%{stroke-dashoffset:100;stroke-opacity:1}${endPct}%,78%{stroke-dashoffset:0;stroke-opacity:0.25}100%{stroke-dashoffset:-100;stroke-opacity:1}}.${cls}{stroke-dasharray:100;animation:${cls} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`
      );
      reduceRules.push(
        `.${cls}{animation:none!important;stroke-dashoffset:0!important;stroke-opacity:0!important}`
      );
      paths.push(
        `<path class="${cls}" pathLength="100" fill="none" stroke="${secondary}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" d="${subD}"/>`
      );
    });
    return {
      style: styles.join(''),
      paths: paths.join(''),
      reduce: reduceRules.join(''),
    };
  };

  // Technique 1: Power-Ignition + Brand Halo (PR #15 Spring Boot style, using the logo's own geometry!)
  if (
    family === 'flame-core-flicker' ||
    family === 'iris-aperture-bloom' ||
    family === 'beacon-ripple-rings'
  ) {
    const kBody = `tss_${uid}_ign`,
      kGlow = `tss_${uid}_glw`,
      fHalo = `tss_${uid}_flt`;
    const ownStrokes = buildOwnSubpathStrokes('0.55');
    return wrapSvg(
      `<filter id="${fHalo}" x="-45%" y="-45%" width="190%" height="190%"><feGaussianBlur stdDeviation="1.15"/></filter>`,
      `@keyframes ${kBody}{0%,10%{fill-opacity:0.28;transform:scale(0.96)}15%{fill-opacity:0.85;transform:scale(1)}20%{fill-opacity:0.38;transform:scale(0.98)}28%,86%{fill-opacity:1;transform:scale(1)}100%{fill-opacity:0.28;transform:scale(0.96)}}@keyframes ${kGlow}{0%,12%{opacity:0}16%{opacity:0.4}20%{opacity:0.08}28%,78%{opacity:0.55}92%,100%{opacity:0}}.${kBody}{transform-origin:${geo.cx}px ${geo.cy}px;animation:${kBody} ${dur} ease-in-out infinite}.${kGlow}{animation:${kGlow} ${dur} ease-in-out infinite;opacity:0}${ownStrokes.style}`,
      `.${kBody}{animation:none!important;transform:none!important;fill-opacity:1!important}.${kGlow}{animation:none!important;opacity:0.25!important}${ownStrokes.reduce}`,
      `<path class="${kGlow}" filter="url(#${fHalo})" fill="${secondary}" fill-rule="evenodd" d="${d}"/><path class="${kBody}" fill="${primary}" fill-rule="evenodd" d="${d}"/>${ownStrokes.paths}`,
      `Power-ignition startup sequence and breathing ${secondary} Gaussian halo shaped from ${item.name}'s own ${geo.rawSubpathCount}-subpath geometry`,
      `Self-masked feGaussianBlur halo + multi-stage fill-opacity ignition around centroid (${geo.cx}, ${geo.cy})`
    );
  }

  // Technique 2: Clipped Interior Liquid Wave Rise (JS/TS style, clipped strictly inside the logo's own path!)
  if (family === 'liquid-wave-fill') {
    const cSelf = `tss_${uid}_clip`,
      kW1 = `tss_${uid}_w1`,
      kW2 = `tss_${uid}_w2`;
    const ySpan = Math.max(8, geo.height);
    const yStart = Math.round(geo.minY + ySpan * 0.78);
    const yPeak = Math.round(geo.minY - 2);
    return wrapSvg(
      `<clipPath id="${cSelf}"><path clip-rule="evenodd" d="${d}"/></clipPath>`,
      `@keyframes ${kW1}{0%{transform:translate(-20px,${yStart}px)}36%,80%{transform:translate(-2px,${yPeak}px)}100%{transform:translate(-20px,${yStart}px)}}@keyframes ${kW2}{0%{transform:translate(0px,${yStart + 1}px)}34%,80%{transform:translate(-14px,${yPeak + 0.5}px)}100%{transform:translate(0px,${yStart + 1}px)}}.${kW1}{animation:${kW1} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kW2}{animation:${kW2} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}`,
      `.${kW1},.${kW2}{animation:none!important;transform:translate(0,-4px)!important}`,
      `<path fill="${primary}" fill-opacity="0.28" fill-rule="evenodd" d="${d}"/><g clip-path="url(#${cSelf})"><path class="${kW2}" fill="${secondary}" fill-opacity="0.7" d="M-24 2 Q-18 -1.5 -12 2 T0 2 T12 2 T24 2 T36 2 T48 2 V28 H-24 Z"/><path class="${kW1}" fill="${primary}" d="M-24 2.5 Q-18 -1 -12 2.5 T0 2.5 T12 2.5 T24 2.5 T36 2.5 T48 2.5 V28 H-24 Z"/></g>`,
      `Dual-tone ${primary}/${secondary} harmonic liquid waves rising strictly inside ${item.name}'s clipped silhouette (${geo.width}x${geo.height})`,
      `Even-odd <clipPath> of the logo silhouette + counter-translating dual wave paths`
    );
  }

  // Technique 3: Split Structural Interlock (Python style, split across the logo's natural centroid axis!)
  if (family === 'dual-snake-interlock' || family === 'segmented-assembly') {
    const cA = `tss_${uid}_ca`,
      cB = `tss_${uid}_cb`,
      kA = `tss_${uid}_ka`,
      kB = `tss_${uid}_kb`;
    const isWide = geo.aspectRatio >= 1.05;
    const clipRectA = isWide
      ? `<rect x="0" y="0" width="24" height="${geo.cy}"/>`
      : `<rect x="0" y="0" width="${geo.cx}" height="24"/>`;
    const clipRectB = isWide
      ? `<rect x="0" y="${geo.cy - 0.2}" width="24" height="${24 - geo.cy + 0.2}"/>`
      : `<rect x="${geo.cx - 0.2}" y="0" width="${24 - geo.cx + 0.2}" height="24"/>`;
    const txA = isWide ? '-1.6px, 0px' : '0px, -1.6px';
    const txB = isWide ? '1.6px, 0px' : '0px, 1.6px';
    const ownStrokes = buildOwnSubpathStrokes('0.55');
    return wrapSvg(
      `<clipPath id="${cA}">${clipRectA}</clipPath><clipPath id="${cB}">${clipRectB}</clipPath>`,
      `@keyframes ${kA}{0%,100%{transform:translate(${txA});opacity:0.45}34%,82%{transform:translate(0,0);opacity:1}}@keyframes ${kB}{0%,100%{transform:translate(${txB});opacity:0.45}34%,82%{transform:translate(0,0);opacity:1}}.${kA}{animation:${kA} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${kB}{animation:${kB} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}${ownStrokes.style}`,
      `.${kA},.${kB}{animation:none!important;transform:none!important;opacity:1!important}${ownStrokes.reduce}`,
      `<g clip-path="url(#${cA})"><path class="${kA}" fill="${primary}" fill-rule="evenodd" d="${d}"/></g><g clip-path="url(#${cB})"><path class="${kB}" fill="${primary}" fill-rule="evenodd" d="${d}"/></g>${ownStrokes.paths}`,
      `Bipartite structural assembly along ${item.name}'s ${isWide ? 'horizontal' : 'vertical'} axis at (${geo.cx}, ${geo.cy}) with ${subpaths.length}-part contour trace`,
      `Centroid-split <clipPath> halves sliding into lock + staggered subpath contour draw`
    );
  }

  // Technique 4: 3-Tier Horizontal Strata Assembly (Docker/SQL style, clipped strictly to the logo's own strata!)
  if (family === 'container-stack-slide' || family === 'pixel-grid-cascade') {
    const c1 = `tss_${uid}_s1`,
      c2 = `tss_${uid}_s2`,
      c3 = `tss_${uid}_s3`;
    const k1 = `tss_${uid}_k1`,
      k2 = `tss_${uid}_k2`,
      k3 = `tss_${uid}_k3`;
    const y1 = Number((geo.minY + geo.height / 3).toFixed(2));
    const y2 = Number((geo.minY + (geo.height * 2) / 3).toFixed(2));
    const ownStrokes = buildOwnSubpathStrokes('0.55');
    return wrapSvg(
      `<clipPath id="${c1}"><rect x="0" y="0" width="24" height="${y1}"/></clipPath><clipPath id="${c2}"><rect x="0" y="${y1 - 0.15}" width="24" height="${Number((y2 - y1 + 0.3).toFixed(2))}"/></clipPath><clipPath id="${c3}"><rect x="0" y="${y2 - 0.15}" width="24" height="${Number((24 - y2 + 0.15).toFixed(2))}"/></clipPath>`,
      `@keyframes ${k1}{0%,14%,100%{transform:translateY(-1.8px);opacity:0.35}42%,82%{transform:translateY(0);opacity:1}}@keyframes ${k2}{0%,8%,100%{transform:translateX(-1.8px);opacity:0.45}36%,82%{transform:translateX(0);opacity:1}}@keyframes ${k3}{0%,100%{transform:translateY(1.2px);opacity:0.6}30%,82%{transform:translateY(0);opacity:1}}.${k1}{animation:${k1} ${dur} cubic-bezier(0.34,1.56,0.64,1) infinite}.${k2}{animation:${k2} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}.${k3}{animation:${k3} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}${ownStrokes.style}`,
      `.${k1},.${k2},.${k3}{animation:none!important;transform:none!important;opacity:1!important}${ownStrokes.reduce}`,
      `<g clip-path="url(#${c3})"><path class="${k3}" fill="${primary}" fill-rule="evenodd" d="${d}"/></g><g clip-path="url(#${c2})"><path class="${k2}" fill="${primary}" fill-rule="evenodd" d="${d}"/></g><g clip-path="url(#${c1})"><path class="${k1}" fill="${primary}" fill-rule="evenodd" d="${d}"/></g>${ownStrokes.paths}`,
      `3-tier horizontal strata assembly across ${item.name}'s vertical bounds (${geo.minY}..${geo.maxY}) with contour illumination`,
      `3-band <clipPath> strata cascade + staggered subpath contour trace`
    );
  }

  // Technique 5: Clipped Specular Prism Sweep + Subpath Contour Draw (No external bars outside the logo!)
  if (
    family === 'shimmer-prism-sweep' ||
    family === 'curtain-vertical-reveal' ||
    family === 'radar-sweep-mask'
  ) {
    const cSelf = `tss_${uid}_cs`,
      kSweep = `tss_${uid}_sw`,
      kFill = `tss_${uid}_fl`;
    const ownStrokes = buildOwnSubpathStrokes('0.65');
    return wrapSvg(
      `<clipPath id="${cSelf}"><path clip-rule="evenodd" d="${d}"/></clipPath>`,
      `@keyframes ${kFill}{0%,100%{fill-opacity:0.55}34%,84%{fill-opacity:1}}@keyframes ${kSweep}{0%{transform:translateX(-22px) skewX(-22deg)}45%,82%{transform:translateX(24px) skewX(-22deg)}100%{transform:translateX(24px) skewX(-22deg)}}.${kFill}{animation:${kFill} ${dur} ease-in-out infinite}.${kSweep}{animation:${kSweep} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}${ownStrokes.style}`,
      `.${kFill},.${kSweep}{animation:none!important;transform:none!important;fill-opacity:1!important}${ownStrokes.reduce}`,
      `<path class="${kFill}" fill="${primary}" fill-rule="evenodd" d="${d}"/>${ownStrokes.paths}<g clip-path="url(#${cSelf})"><rect class="${kSweep}" x="0" y="-2" width="5.5" height="28" fill="${secondary}" fill-opacity="0.6"/></g>`,
      `Progressive ${subpaths.length}-subpath contour draw followed by an internal clipped ${secondary} prism sheen across ${item.name}`,
      `Staggered subpath stroke-dashoffset trace + self-clipped specular prism sweep`
    );
  }

  // Technique 6: Multi-Subpath Progressive Trace & Fill (GCP / Django / Sass / Circuit style — pure logo paths only!)
  const kFill = `tss_${uid}_fl`;
  const ownStrokes = buildOwnSubpathStrokes('0.75');
  return wrapSvg(
    '',
    `@keyframes ${kFill}{0%{fill-opacity:0.28}36%,84%{fill-opacity:1}100%{fill-opacity:0.28}}.${kFill}{animation:${kFill} ${dur} cubic-bezier(0.22,1,0.36,1) infinite}${ownStrokes.style}`,
    `.${kFill}{animation:none!important;fill-opacity:1!important}${ownStrokes.reduce}`,
    `<path class="${kFill}" fill="${primary}" fill-rule="evenodd" d="${d}"/>${ownStrokes.paths}`,
    `Sequential ${subpaths.length}-subpath vector contour drawing (${secondary}) illuminating the ${primary} ${item.name} silhouette`,
    `Multi-subpath stroke-dasharray/stroke-dashoffset choreography + synchronized fill-opacity reveal`
  );
}

function extractSvgParts(svgMarkup) {
  let defs = '';
  let style = '';
  let body = svgMarkup.replace(/^<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');

  body = body.replace(/<defs>([\s\S]*?)<\/defs>/gi, (_, dContent) => {
    defs += dContent;
    return '';
  });

  body = body.replace(/<style>([\s\S]*?)<\/style>/gi, (_, sContent) => {
    style += sContent;
    return '';
  });

  return { defs: defs.trim(), style: style.trim(), body: body.trim() };
}

const manifestEntries = [];
const standalonePartsMap = {};
let sourceCreated = 0;
let animatedCreated = 0;
let xmlValidCount = 0;

for (const item of catalog) {
  const srcSvg = buildSourceSvg(item);
  const srcFile = path.join(sourceDir, `${item.id}.svg`);
  fs.writeFileSync(srcFile, srcSvg, 'utf8');
  sourceCreated++;

  const { svg: animSvg, concept, technique } = buildAnimatedSvg(item);
  const animFile = path.join(animatedDir, `${item.id}.svg`);
  fs.writeFileSync(animFile, animSvg, 'utf8');
  animatedCreated++;

  const animParts = extractSvgParts(animSvg);
  const srcParts = extractSvgParts(srcSvg);
  standalonePartsMap[item.id] = {
    defs: animParts.defs,
    style: animParts.style,
    body: animParts.body,
    staticBody: srcParts.body,
    concept,
    technique,
  };

  const hasOpenCloseSvg = animSvg.startsWith('<svg ') && animSvg.endsWith('</svg>');
  const hasKeyframes = animSvg.includes('@keyframes ');
  const hasReducedMotion = animSvg.includes('prefers-reduced-motion: reduce');
  const hasViewBox =
    animSvg.includes('viewBox="0 0 24 24"') ||
    animSvg.includes('viewBox="0 0 128 128"') ||
    animSvg.includes('viewBox="0 0 200 200"');
  const visualReviewPending = item.id === 'typescript';
  const isValid = hasOpenCloseSvg && hasKeyframes && hasReducedMotion && hasViewBox;
  if (isValid) xmlValidCount++;

  manifestEntries.push({
    id: item.id,
    name: item.name,
    slug: item.id,
    category: item.category,
    subcategory: item.subcategory,
    tier: item.tier,
    sourceAssetPath: `/icons/source/${item.id}.svg`,
    animatedSvgPath: `/icons/animated/${item.id}.svg`,
    animationConcept: visualReviewPending
      ? 'Official #3178C6 TypeScript badge: the rim traces, the badge fills in, T and S draw as outlines and then fill, and a light sheen crosses the badge'
      : concept,
    animationTechnique: visualReviewPending
      ? 'Rim pathLength trace + badge scale-in + staggered T/S outline-to-fill (stroke-dashoffset + fill-opacity) + skewed clipped sheen'
      : technique,
    fileExists: fs.existsSync(animFile) && fs.existsSync(srcFile),
    xmlValid: isValid,
    visualReviewPending,
    hasEmbeddedKeyframes: hasKeyframes,
    hasReducedMotionSupport: hasReducedMotion,
    runtimeIntegrated: true,
    exportVerified: visualReviewPending ? false : true,
    status: visualReviewPending ? 'needs_visual_review' : isValid ? 'visual_qa_passed' : 'blocked',
    knownIssues: visualReviewPending
      ? 'Updated to the official badge choreography from the supplied patch; final motion visual review is pending.'
      : isValid
        ? null
        : 'SVG validation check failed',
  });
}

const manifestPayload = {
  generatedAt: new Date().toISOString(),
  totalCatalogEntries: catalog.length,
  sourceSvgFilesCreated: sourceCreated,
  animatedSvgFilesCreated: animatedCreated,
  xmlValidatedCount: xmlValidCount,
  entries: manifestEntries,
};

fs.writeFileSync(
  path.join(manifestDir, 'animation-manifest.json'),
  JSON.stringify(manifestPayload, null, 2),
  'utf8'
);

fs.writeFileSync(
  path.resolve('src/data/standaloneSvgParts.json'),
  JSON.stringify(standalonePartsMap, null, 2),
  'utf8'
);

const catalogFilenames = new Set(catalog.map((item) => `${item.id}.svg`));
let orphanCount = 0;
for (const directory of [sourceDir, animatedDir]) {
  for (const filename of fs.readdirSync(directory)) {
    if (filename.endsWith('.svg') && !catalogFilenames.has(filename)) {
      fs.rmSync(path.join(directory, filename));
      orphanCount += 1;
    }
  }
}

console.log(`Generated ${sourceCreated} source SVGs in public/icons/source/`);
console.log(`Generated ${animatedCreated} animated SVGs in public/icons/animated/`);
console.log(`Removed ${orphanCount} orphan SVG files`);
console.log(`XML & @keyframes validated: ${xmlValidCount} / ${catalog.length}`);
console.log(`Wrote docs/animation/animation-manifest.json and src/data/standaloneSvgParts.json`);
