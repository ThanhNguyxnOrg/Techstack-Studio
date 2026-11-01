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
// CARGO — the only official mark is raster: rust-lang/cargo ships exactly
// one logo file, doc/book/src/images/Cargo-Logo-Small.png (306x275,
// golden boxes on a wooden pallet). No official vector exists anywhere
// (Simple Icons, Devicon, and the crates.io tree have none), so both
// cargo branches embed that PNG verbatim as a data URI — no redraw, no
// trace. Native 306x275 geometry is scaled into the 128 box (the
// animated template only accepts 24/18/32/128/200 viewBoxes).
const CARGO_PNG_DATA_URI =
  'data:image/png;base64,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';

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

  if (item.id === 'echo') {
    // Official Echo site wordmark, verbatim from echo.labstack.com
    // (logo-dark.svg): three cyan parallelograms plus the "echo"
    // letter paths, white letters for the app's dark cards. The
    // 111x36.7 artwork is scaled into the 128-unit box (same
    // treatment Devicon gives the Fiber wordmark) so it passes the
    // generator's viewBox validation. Catalog svgPath holds the
    // same shapes concatenated as a single-colour fallback; this
    // branch is the true multi-colour mark.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}"><g transform="translate(4,44.16) scale(1.0811)"><g transform="translate(-16,-15.7)"><polygon points="16,16 30,24 30,40 16,32" fill="#00AFD1"/><polygon points="32,24 46,32 46,48 32,40" fill="#4AE1FF"/><polygon points="18,34 32,42 32,52 18,44" fill="#00AFD1" opacity="0.55"/></g><g transform="translate(-8,0)" fill="#FFFFFF"><path d="M52.5,22.3c0.3,2,2,3.4,4.8,3.4c1.5,0,3.4-0.5,4.3-1.5l2.5,2.5c-1.7,1.7-4.4,2.6-6.9,2.6c-5.5,0-8.8-3.4-8.8-8.4c0-4.8,3.3-8.3,8.5-8.3c5.3,0,8.7,3.3,8.1,9.8H52.5z M61.2,19.1c-0.3-2-1.9-3.1-4.1-3.1c-2.1,0-3.9,1-4.5,3.1H61.2z"/><path d="M81.7,26.8c-1.8,1.8-3.8,2.5-6.1,2.5c-4.6,0-8.5-2.8-8.5-8.4c0-5.6,3.9-8.4,8.5-8.4c2.3,0,4,0.6,5.8,2.3l-2.5,2.6c-0.9-0.8-2.1-1.2-3.2-1.2C73,16.3,71,18.2,71,21c0,3,2.1,4.6,4.5,4.6c1.3,0,2.5-0.4,3.5-1.3L81.7,26.8z"/><path d="M87.4,6.4v8.8c1.4-1.8,3.2-2.4,5-2.4c4.5,0,6.5,3,6.5,7.7v8.3H95v-8.3c0-2.9-1.5-4.1-3.6-4.1c-2.3,0-3.9,2-3.9,4.3v8.1h-3.9V6.4H87.4z"/><path d="M118.1,21c0,4.5-3.1,8.2-8.3,8.2c-5.2,0-8.3-3.7-8.3-8.2c0-4.5,3.2-8.2,8.3-8.2S118.1,16.5,118.1,21z M105.5,21c0,2.4,1.5,4.6,4.3,4.6c2.9,0,4.3-2.2,4.3-4.6c0-2.4-1.7-4.7-4.3-4.7C107,16.3,105.5,18.6,105.5,21z"/></g></g></svg>`;
  }

  if (item.id === 'openvino') {
    // Official OpenVINO white wordmark, verbatim from the
    // openvinotoolkit/openvino repo (docs/sphinx_setup/_static/
    // logo.svg): the white variant is the brand's own dark-card
    // artwork, so no colour treatment is invented. The 120x25
    // artwork is scaled into the 128-unit box (same treatment as
    // Echo) so it passes the generator's viewBox validation.
    // Catalog svgPath holds the same shapes concatenated as a
    // single-colour fallback; this branch is the true mark.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}"><g transform="translate(0,50.67) scale(1.0667)"><path fill="#FFFFFF" d="M117.045 0.566335H116.582V0.264099H117.898V0.566335H117.435V1.97881H117.044V0.566335H117.045Z"/><path fill="#FFFFFF" d="M118.188 0.26413H118.7L119.101 1.33112L119.496 0.26413H120V1.97884H119.614V0.77498L119.139 1.97884H119.012L118.535 0.77498V1.97884H118.187V0.26413H118.188Z"/><path fill="#FFFFFF" d="M23.0686 17.0748V24.4231H20.4009V6.05237H23.0686V7.81389C23.9997 6.58052 25.5852 5.80051 27.2714 5.80051C30.568 5.80051 33.5375 8.31711 33.5375 12.3434C33.5375 16.3447 30.4673 18.8862 27.2963 18.8862C25.5598 18.8867 23.9748 18.2324 23.0686 17.0748ZM30.8698 12.3184C30.8698 10.0283 29.1332 8.2418 26.8939 8.2418C24.6037 8.2418 22.918 10.0791 22.918 12.3184C22.918 14.5832 24.6042 16.4205 26.8939 16.4205C29.1337 16.4205 30.8698 14.6086 30.8698 12.3184Z"/><path fill="#FFFFFF" d="M34.778 12.3943C34.778 8.69466 37.6217 5.80103 41.3208 5.80103C45.0453 5.80103 47.7884 8.49368 47.7884 12.2182V13.275H37.3704C37.7225 15.2126 39.2326 16.4963 41.4221 16.4963C43.1332 16.4963 44.4419 15.5901 45.0962 14.2316L47.3106 15.465C46.2034 17.5287 44.2149 18.8878 41.4221 18.8878C37.4457 18.8867 34.778 16.043 34.778 12.3943ZM37.496 10.9848H45.0458C44.6434 9.17294 43.2589 8.16651 41.3213 8.16651C39.4585 8.16651 37.9993 9.32406 37.496 10.9848Z"/><path fill="#FFFFFF" d="M49.409 6.05237H52.0767V7.68821C52.9325 6.53066 54.2916 5.80051 55.9524 5.80051C59.1233 5.80051 61.0609 7.86426 61.0609 11.2866V18.6349H58.3428V11.5135C58.3428 9.44973 57.3109 8.14106 55.2975 8.14106C53.4856 8.14106 52.1016 9.5001 52.1016 11.7145V18.6349H49.409V6.05237Z"/><path fill="#FFFFFF" d="M60.3419 0.264099H63.1856L68.1435 14.5832L73.1009 0.264099H75.9447L69.5275 18.6349H66.7595L60.3419 0.264099Z"/><path fill="#FFFFFF" d="M76.9639 0.264099H79.7069V18.6349H76.9639V0.264099Z"/><path fill="#FFFFFF" d="M82.2078 0.264099H85.3034L94.6147 14.1558V0.264099H97.3323V18.6349H94.4382L84.9508 4.51729V18.6349H82.2078V0.264099Z"/><path fill="#FFFFFF" d="M12.9117 7.96652C12.6675 8.46617 12.1663 8.81369 11.5633 8.81369C10.7172 8.81369 10.0583 8.12629 10.0583 7.28572C10.0583 6.6782 10.4048 6.15208 10.9151 5.9048C10.4587 5.70738 9.95395 5.59747 9.41817 5.59747C7.302 5.59747 5.65497 7.32999 5.65497 9.4319C5.65497 11.5338 7.30251 13.2516 9.41817 13.2516C11.5481 13.2516 13.1956 11.5333 13.1956 9.4319C13.1951 8.91393 13.0938 8.41936 12.9117 7.96652Z"/><path fill="#FFFFFF" d="M0 9.437C0 4.22775 4.20281 0 9.41206 0C14.6468 0 18.8491 4.22775 18.8491 9.437C18.8491 14.6462 14.6462 18.874 9.41206 18.874C4.20281 18.874 0 14.6462 0 9.437ZM16.106 9.437C16.106 5.71247 13.187 2.64228 9.41206 2.64228C5.66261 2.64228 2.74302 5.71247 2.74302 9.437C2.74302 13.1615 5.6621 16.2063 9.41206 16.2063C13.187 16.2068 16.106 13.1615 16.106 9.437Z"/><path fill="#FFFFFF" d="M111.862 7.97924C111.618 8.4789 111.117 8.82642 110.514 8.82642C109.668 8.82642 109.008 8.13901 109.008 7.29845C109.008 6.69092 109.355 6.16481 109.865 5.91752C109.409 5.7201 108.904 5.6102 108.368 5.6102C106.252 5.6102 104.605 7.34272 104.605 9.44463C104.605 11.5465 106.252 13.2648 108.368 13.2648C110.498 13.2648 112.145 11.5465 112.145 9.44463C112.145 8.92666 112.044 8.43158 111.862 7.97924Z"/><path fill="#FFFFFF" d="M98.9503 9.44972C98.9503 4.24047 103.153 0.0127258 108.362 0.0127258C113.597 0.0127258 117.799 4.24047 117.799 9.44972C117.799 14.659 113.596 18.8867 108.362 18.8867C103.153 18.8867 98.9503 14.659 98.9503 9.44972ZM115.056 9.44972C115.056 5.72519 112.137 2.655 108.362 2.655C104.613 2.655 101.693 5.72519 101.693 9.44972C101.693 13.1743 104.612 16.219 108.362 16.219C112.137 16.219 115.056 13.1743 115.056 9.44972Z"/></g></svg>`;
  }

  if (item.id === 'playwright') {
    // Devicon playwright-original, verbatim: two theatre masks (red behind, green front),
    // 128-unit viewBox. The catalog's single-path 24-unit fallback is a green smiley,
    // not the Playwright mark, so it must not be used for this id.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}"><path fill="#2D4552" d="M43.662 70.898c-4.124 1.17-6.829 3.222-8.611 5.272 1.707-1.494 3.993-2.865 7.077-3.739 3.155-.894 5.846-.888 8.069-.459v-1.739c-1.897-.173-4.072-.035-6.536.664ZM34.863 56.28l-15.314 4.035s.279.394.796.92l12.984-3.421s-.184 2.371-1.782 4.492c3.022-2.287 3.316-6.025 3.316-6.025Zm12.819 35.991C26.131 98.076 14.729 73.1 11.277 60.137 9.682 54.153 8.986 49.621 8.8 46.697a4.955 4.955 0 0 1 .011-.794c-1.118.068-1.653.649-1.544 2.328.186 2.923.882 7.454 2.477 13.44 3.45 12.961 14.854 37.937 36.405 32.132 4.691-1.264 8.215-3.565 10.86-6.504-2.438 2.202-5.49 3.937-9.327 4.972Zm4.05-51.276v1.534h8.453c-.173-.543-.348-1.032-.522-1.534h-7.932Z"/><path fill="#2D4552" d="M62.074 53.627c3.802 1.08 5.812 3.745 6.875 6.104l4.239 1.204s-.578-8.255-8.045-10.376c-6.985-1.985-11.284 3.881-11.807 4.64 2.032-1.448 4.999-2.633 8.738-1.572Zm33.741 6.142c-6.992-1.994-11.289 3.884-11.804 4.633 2.034-1.446 4.999-2.632 8.737-1.566 3.796 1.081 5.804 3.743 6.87 6.104l4.245 1.208s-.588-8.257-8.048-10.379Zm-4.211 21.766-35.261-9.858s.382 1.935 1.846 4.441l29.688 8.3c2.444-1.414 3.726-2.883 3.726-2.883Zm-24.446 21.218c-27.92-7.485-24.544-43.059-20.027-59.916 1.86-6.947 3.772-12.11 5.358-15.572-.946-.195-1.73.304-2.504 1.878-1.684 3.415-3.837 8.976-5.921 16.76-4.516 16.857-7.892 52.429 20.027 59.914 13.159 3.525 23.411-1.833 31.053-10.247-7.254 6.57-16.515 10.253-27.986 7.182Z"/><path fill="#E2574C" d="M51.732 83.935v-7.179l-19.945 5.656s1.474-8.563 11.876-11.514c3.155-.894 5.846-.888 8.069-.459V40.995h9.987c-1.087-3.36-2.139-5.947-3.023-7.744-1.461-2.975-2.96-1.003-6.361 1.842-2.396 2.001-8.45 6.271-17.561 8.726-9.111 2.457-16.476 1.805-19.55 1.273-4.357-.752-6.636-1.708-6.422 1.605.186 2.923.882 7.455 2.477 13.44 3.45 12.962 14.854 37.937 36.405 32.132 5.629-1.517 9.603-4.515 12.357-8.336h-8.309v.002Zm-32.185-23.62 15.316-4.035s-.446 5.892-6.188 7.405c-5.743 1.512-9.128-3.371-9.128-3.371Z"/><path fill="#2EAD33" d="M109.372 41.336c-3.981.698-13.532 1.567-25.336-1.596-11.807-3.162-19.64-8.692-22.744-11.292-4.4-3.685-6.335-6.246-8.24-2.372-1.684 3.417-3.837 8.977-5.921 16.762-4.516 16.857-7.892 52.429 20.027 59.914 27.912 7.479 42.772-25.017 47.289-41.875 2.084-7.783 2.998-13.676 3.25-17.476.287-4.305-2.67-3.055-8.324-2.064ZM53.28 55.282s4.4-6.843 11.862-4.722c7.467 2.121 8.045 10.376 8.045 10.376L53.28 55.282Zm18.215 30.706c-13.125-3.845-15.15-14.311-15.15-14.311l35.259 9.858c0-.002-7.117 8.25-20.109 4.453Zm12.466-21.51s4.394-6.838 11.854-4.711c7.46 2.124 8.048 10.379 8.048 10.379l-19.902-5.668Z"/><path fill="#D65348" d="M44.762 78.733 31.787 82.41s1.41-8.029 10.968-11.212l-7.347-27.573-.635.193c-9.111 2.457-16.476 1.805-19.55 1.273-4.357-.751-6.636-1.708-6.422 1.606.186 2.923.882 7.454 2.477 13.44 3.45 12.961 14.854 37.937 36.405 32.132l.635-.199-3.555-13.337ZM19.548 60.315l15.316-4.035s-.446 5.892-6.188 7.405c-5.743 1.512-9.128-3.371-9.128-3.371Z"/><path fill="#1D8D22" d="m72.086 86.132-.594-.144c-13.125-3.844-15.15-14.311-15.15-14.311l18.182 5.082L84.15 39.77l-.116-.031c-11.807-3.162-19.64-8.692-22.744-11.292-4.4-3.685-6.335-6.246-8.24-2.372-1.682 3.417-3.836 8.977-5.92 16.762-4.516 16.857-7.892 52.429 20.027 59.914l.572.129 4.357-16.748Zm-18.807-30.85s4.4-6.843 11.862-4.722c7.467 2.121 8.045 10.376 8.045 10.376l-19.907-5.654Z"/><path fill="#C04B41" d="m45.423 78.544-3.48.988c.822 4.634 2.271 9.082 4.545 13.011.396-.087.788-.163 1.192-.273a25.224 25.224 0 0 0 2.98-1.023c-2.541-3.771-4.222-8.114-5.237-12.702Zm-1.359-32.64c-1.788 6.674-3.388 16.28-2.948 25.915a20.061 20.061 0 0 1 2.546-.923l.644-.144c-.785-10.292.912-20.78 2.825-27.915a139.404 139.404 0 0 1 1.455-5.05 45.171 45.171 0 0 1-2.578 1.53 132.234 132.234 0 0 0-1.944 6.587Z"/></svg>`;
  }
  if (item.id === 'googledataflow') {
    // Google Cloud official Dataflow product icon (cloud.google.com/icons,
    // file titled Icon_32px_Dataflow_Color), verbatim: 8 polygons + 4 node
    // circles in #4285F4 / #669df6 / #aecbfa, 32-unit viewBox. The catalog's
    // old single-path hexagon was an invented placeholder, not this mark,
    // so it must not be used for this id.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="${label}"><polygon fill="#669df6" points="18.39 6.71 18.03 5.46 16.14 5.38 13.86 6.66 15.89 8.65 15.86 10.96 17.21 10.98 17.24 8.67 22.9 12.09 22.88 13.51 25.24 13.54 25.24 10.81 18.39 6.71"/><polygon fill="#aecbfa" points="16.14 5.38 16.14 5.38 16.14 5.38 14.24 5.83 13.86 6.66 6.83 10.56 6.8 13.3 9.18 13.33 9.19 11.9 14.95 8.64 14.92 10.95 16.07 10.96 16.14 5.38"/><polygon fill="#669df6" points="16.14 5.38 16.14 5.38 16.14 5.38 11.59 2.67 9.27 3.93 13.86 6.66 16.14 5.38 16.14 5.38"/><polygon fill="#669df6" points="22.79 20.09 17.05 23.35 17.08 21.05 14.79 21.02 14.76 23.32 15.86 26.62 17.75 26.47 18.14 25.34 25.16 21.43 25.2 18.64 22.81 18.61 22.79 20.09"/><polygon fill="#669df6" points="15.86 26.62 15.86 26.62 15.86 26.62 11.23 29.21 11.17 29.21 8.95 27.89 13.61 25.28 15.86 26.62 15.86 26.62"/><polygon fill="#4285F4" points="18.39 6.71 23.04 4.11 20.82 2.79 20.76 2.79 16.14 5.38 18.39 6.71"/><polygon fill="#4285F4" points="18.14 25.34 22.73 28.07 20.48 29.33 20.41 29.33 15.86 26.62 15.86 26.62 15.86 26.62 15.86 26.62 18.14 25.34"/><polygon fill="#aecbfa" points="15.86 26.62 13.61 25.28 6.76 21.19 6.76 18.52 9.11 18.52 9.09 19.91 14.76 23.33 14.79 21.02 15.93 21.04 15.86 26.62"/><circle fill="#aecbfa" cx="24.16" cy="16.05" r="1.52"/><circle fill="#aecbfa" cx="7.84" cy="15.83" r="1.52"/><circle fill="#aecbfa" cx="16.09" cy="13.32" r="1.52"/><circle fill="#aecbfa" cx="15.96" cy="18.67" r="1.52"/></svg>`;
  }
  if (item.id === 'webgpu') {
    // WebGPU W-triangles, split from the single catalog path into its 5
    // triangle subpaths (verified: split render is visually identical to
    // the single-path render; only shared-edge antialiasing differs).
    // Splitting is what lets the animated version assemble the W triangle
    // by triangle instead of hiding it behind a generic sheen clip.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${label}"><path fill="#005A9C" d="M0 4.784L8.652 19.216L17.304 4.784Z"/><path fill="#005A9C" d="M22.032 4.929L20.07 8.202L24 8.202L22.032 4.93Z"/><path fill="#005A9C" d="M17.572 4.929L13.38 11.922L21.764 11.922Z"/><path fill="#005A9C" d="M20.07 8.504L22.032 11.777L24 8.504Z"/><path fill="#005A9C" d="M13.38 12.224L17.572 19.216L21.764 12.224Z"/></svg>`;
  }
  if (item.id === 'azuresqldatabase') {
    // Azure SQL Database, verbatim Microsoft Azure Architecture Icons
    // set (July 2026, via Microsoft Learn icons page): blue gradient
    // cloud/blob + white SQL letters, viewBox 18. Gradient id namespaced
    // to tss_azuresqldatabase_g so it cannot collide in a shared banner.
    // This supersedes the Devicon tall-cylinder version, which rendered
    // tiny and unreadable at the 48px card size.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" role="img" aria-label="${label}"><defs><linearGradient id="tss_azuresqldatabase_g" x1="9.908" y1="15.943" x2="7.516" y2="2.383" gradientUnits="userSpaceOnUse"><stop offset="0.15" stop-color="#0078d4"/><stop offset="0.8" stop-color="#5ea0ef"/><stop offset="1" stop-color="#83b9f9"/></linearGradient></defs><path d="M14.49,7.15A5.147,5.147,0,0,0,9.24,2.164,5.272,5.272,0,0,0,4.216,5.653,4.869,4.869,0,0,0,0,10.4a4.946,4.946,0,0,0,5.068,4.814H13.82A4.292,4.292,0,0,0,18,11.127,4.105,4.105,0,0,0,14.49,7.15Z" fill="url(#tss_azuresqldatabase_g)"/><path d="M12.9,11.4V8H12v4.13h2.46V11.4ZM5.76,9.73a1.825,1.825,0,0,1-.51-.31.441.441,0,0,1-.12-.32.342.342,0,0,1,.15-.3.683.683,0,0,1,.42-.12,1.62,1.62,0,0,1,1,.29V8.11a2.58,2.58,0,0,0-1-.16,1.641,1.641,0,0,0-1.09.34,1.08,1.08,0,0,0-.42.89c0,.51.32.91,1,1.21a2.907,2.907,0,0,1,.62.36.419.419,0,0,1,.15.32.381.381,0,0,1-.16.31.806.806,0,0,1-.45.11,1.66,1.66,0,0,1-1.09-.42V12a2.173,2.173,0,0,0,1.07.24,1.877,1.877,0,0,0,1.18-.33A1.08,1.08,0,0,0,6.84,11a1.048,1.048,0,0,0-.25-.7A2.425,2.425,0,0,0,5.76,9.73ZM11,11.32A2.191,2.191,0,0,0,11,9a1.808,1.808,0,0,0-.7-.75,2,2,0,0,0-1-.26,2.112,2.112,0,0,0-1.08.27A1.856,1.856,0,0,0,7.49,9a2.465,2.465,0,0,0-.26,1.14,2.256,2.256,0,0,0,.24,1,1.766,1.766,0,0,0,.69.74,2.056,2.056,0,0,0,1,.3l.86,1h1.21L10,12.08A1.79,1.79,0,0,0,11,11.32Zm-1-.25a.941.941,0,0,1-.76.35.916.916,0,0,1-.76-.36,1.523,1.523,0,0,1-.29-1,1.529,1.529,0,0,1,.29-1,1,1,0,0,1,.78-.37.869.869,0,0,1,.75.37,1.619,1.619,0,0,1,.27,1A1.459,1.459,0,0,1,10,11.07Z" fill="#f2f2f2"/></svg>`;
  }
  // Default single-path source: use the catalog viewBox, not a hardcoded
  // 24 box. Every default-path entry except microsoftsqlserver is 24-unit,
  // so this changes only that entry (Devicon 128-unit grid), which the
  // hardcoded box clipped to its top-left 24x24 corner.
  if (item.id === 'freertos') {
    // AWS Architecture icon for FreeRTOS, verbatim (Arch_Amazon-FreeRTOS_64):
    // green gradient tile (#1B660F -> #6CAE3E, diagonal) + white chip/circuit
    // glyph, 80-unit artwork scaled x1.6 into the 128 box. Gradient id
    // namespaced to tss_freertos_g so it cannot collide in a shared banner.
    // This replaces the invented green clock; the product's own wordmark
    // exists only as PNG/font-based files, so no verbatim vector wordmark
    // is available for the catalog.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}"><defs><linearGradient id="tss_freertos_g" x1="0%" y1="100%" x2="100%" y2="0%"><stop stop-color="#1B660F" offset="0%"/><stop stop-color="#6CAE3E" offset="100%"/></linearGradient></defs><g transform="scale(1.6)"><rect x="0" y="0" width="80" height="80" fill="url(#tss_freertos_g)"/><path fill="#FFFFFF" fill-rule="evenodd" d="${d}"/></g></svg>`;
  }
  if (item.id === 'matter') {
    // Matter connectivity standard, verbatim official mark (three
    // inward arc-tipped arrows) via the Wikimedia Commons vector of
    // the official logo: CSA's own site file is only a PNG wrapper,
    // so no CSA-direct vector exists. Symbol only, no 'matter'
    // wordmark — the letters are illegible at the 48px card size
    // (same reasoning as the Azure SQL blob-over-cylinder choice).
    // Native symbol box 74.3x72.6 scaled into the 128 box (the
    // animated template only accepts 24/18/32/128/200 viewBoxes).
    // White fill = darkSafeColor, matching the app's dark cards.
    // This replaces the invented cyan 4-point star.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}"><g transform="translate(0,1.46) scale(1.7228)"><path fill="#FFFFFF" fill-rule="evenodd" d="${d}"/></g></svg>`;
  }
  if (item.id === 'cargo') {
    // Verbatim official PNG (see CARGO_PNG_DATA_URI above), scaled from
    // its native 306x275 box into the 128 box. This replaces the
    // invented yellow hexagon-cube. Raster exception: the catalog
    // integrity test allows a data-URI <image> for cargo only;
    // external image URLs stay banned.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}"><g transform="translate(0,6.4837) scale(0.4183)"><image href="${CARGO_PNG_DATA_URI}" width="306" height="275"/></g></svg>`;
  }

  if (item.id === 'vcpkg') {
    // Official vcpkg mark, verbatim (vcpkg/vcpkg.github.io
    // assets/mark/mark.svg): four gradient swooshes (#FC950B -> #F9C438)
    // forming the cycle. Path data scaled x8 from the native 16 box
    // into the 128 box; gradient vectors scaled x8 likewise so the
    // userSpaceOnUse ramps land exactly as in the original. This
    // replaces the invented blue hexagon-cube fallback (whose Devicon
    // URL 404s). No clipPath, no foreign shapes.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}"><defs><linearGradient id="tss_vcpkg_g0" x1="2.595" y1="62.941" x2="111.016" y2="-3.631" gradientUnits="userSpaceOnUse"><stop stop-color="#FC950B"/><stop offset="0.592076" stop-color="#F9C438"/></linearGradient><linearGradient id="tss_vcpkg_g1" x1="45.142" y1="32.699" x2="2.621" y2="82.919" gradientUnits="userSpaceOnUse"><stop stop-color="#FC950B"/><stop offset="1" stop-color="#F9C438"/></linearGradient><linearGradient id="tss_vcpkg_g2" x1="138.306" y1="79.548" x2="16.770" y2="117.889" gradientUnits="userSpaceOnUse"><stop stop-color="#FC950B"/><stop offset="0.612893" stop-color="#F9C438"/></linearGradient><linearGradient id="tss_vcpkg_g3" x1="112.998" y1="107.652" x2="101.581" y2="16.856" gradientUnits="userSpaceOnUse"><stop stop-color="#FC950B"/><stop offset="1" stop-color="#F9C438"/></linearGradient></defs><path fill="url(#tss_vcpkg_g0)" d="M58.18296 40.42368C31.58112 31.0004 12.56144 43.0024 1.54161 56.81896C1.12394 57.32832 0.32075 57.00992 0.41713 56.34144C1.05969 52.68032 2.5697 45.51736 5.52546 38.95928C17.54128 12.31304 49.5084 -0.64394 68.52808 0.0246C87.548 0.69314 110.3264 13.1408 102.4232 30.71392C95.4512 46.2496 86.0056 50.29264 58.18296 40.42368Z"/><path fill="url(#tss_vcpkg_g1)" d="M38.23552 39.98496C38.23552 39.63472 37.97848 39.3164 37.59296 39.3164C28.75784 39.53928 9.96312 45.39696 0.22836 63.09744C0.19623 63.16112 0.1641 63.2248 0.1641 63.32032C-2.85591 84.4912 36.78976 98.3072 38.23552 39.98496Z"/><path fill="url(#tss_vcpkg_g2)" d="M69.92904 87.576C96.5312 96.9992 115.5504 84.9976 126.5704 71.18096C126.988 70.6716 127.7912 70.98992 127.6944 71.65848C127.052 75.3196 125.5424 82.4824 122.5864 89.0408C110.6024 115.6872 78.63568 128.644 59.616 127.9752C40.59632 127.3064 17.81776 114.8592 25.7212 97.2856C32.6608 81.7824 42.13848 77.73904 69.92904 87.576Z"/><path fill="url(#tss_vcpkg_g3)" d="M89.7 88.56C89.7 88.9104 89.9576 89.2288 90.3424 89.2288C99.1776 89.0064 118.0368 82.8616 127.772 65.12952C127.804 65.06584 127.836 65.00216 127.836 64.90664C130.856 43.76792 91.1456 30.23792 89.7 88.56Z"/></svg>`;
  }

  if (item.id === 'infineon') {
    // Official Infineon logo, verbatim (Wikimedia Commons
    // File:Infineon-Logo.svg): lowercase blue wordmark (#0066B3) +
    // red arc ellipse (#EC1840), native 1016x448.3 lockup scaled into
    // the 128 box (letterboxed, vertically centered). This replaces
    // the invented blue oval + I fallback (whose Devicon URL 404s).
    // No clipPath, no foreign shapes.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}"><g transform="translate(0,35.76) scale(0.12598)"><g transform="translate(-7.07 -358.2)"><g transform="translate(3.539 3.545)"><path fill="#EC1840" d="m305.2 372.9s-23.65 3.864-48.92 10.39c-19.11 4.908-32.32 9.033-37.28 10.6v-0.1566c-7.257 2.245-14.31 4.647-21.25 7.048 7.048 6.944 11.49 16.5 11.85 27.05 5.639-2.454 11.33-4.856 17.18-7.205v-0.0522c6.526-2.35 24.17-8.771 39.37-13.89 18.95-6.422 44.69-14.31 44.69-14.31 74.92-20.68 157.9-32.68 235.2-32.11-89.12-5.326-170.2-0.1566-240.8 12.64m709.3 281.9c-80.2 72.83-262.9 115.3-471.6 115.3-283.5 0-466.7-83.17-479.5-193.2-4.751-41.35 27.83-81.34 81.97-115.5-9.555-7.205-15.77-18.53-16.03-31.33-78.16 40.99-122.4 94.92-122.4 149.7 0 121.2 216.8 224 538.9 219.5 219.1-3.028 385.6-65.52 469.8-142l-1.253-2.454"/><path fill="#0066B3" d="m140 429.3c0-16.34 13.21-29.6 29.55-29.6 16.34 0 29.6 13.26 29.6 29.6s-13.26 29.55-29.6 29.55c-16.34 0-29.55-13.21-29.55-29.55"/><path fill="#0066B3" d="m156.5 651.8v-169.6l27.88-3.707v173.3h-27.88"/><path fill="#0066B3" d="m278.1 651.8v-97.06c0-11.07-0.992-15.61-3.185-18.74-1.984-2.819-5.43-3.655-9.137-3.655-5.378 0-13.47 4.542-20.15 12.74v106.7h-27.72v-105.8c0-17.33-2.245-26.99-3.707-34.93l26.05-6.787c0.731 2.558 3.185 9.607 3.446 17.02 7.101-8.824 20.15-16.19 32.89-16.19 9.868 0 17.7 3.968 22.61 10.23 5.691 7.101 6.631 16.71 6.631 26.37v110.1h-27.72"/><path fill="#0066B3" d="m396.5 472.4c-3.185-2.558-8.354-4.229-13.26-4.229-6.892 0-11.07 6.526-11.07 17.6v22.09h26.05l-5.169 24.43h-20.88v119.5h-28.51v-119.5h-9.555v-24.43h9.555s-0.4699-9.92-0.4699-19c0-21.56 7.101-32.89 13.73-38.58 6.683-5.378 14.25-7.101 21.41-7.101 10.29 0 18.69 2.297 26.05 7.675l-7.884 21.56"/><path fill="#0066B3" d="m419.6 651.8v-143l28.25-3.707v146.7h-28.25zm13.52-164c-10.08 0-18.17-8.197-18.17-18.43 0-10.18 8.354-18.38 18.64-18.38 10.08 0 18.22 8.197 18.22 18.38 0 10.23-8.354 18.43-18.69 18.43"/><path fill="#0066B3" d="m543.6 651.8v-97.06c0-11.07-0.9398-15.61-3.185-18.74-1.932-2.819-5.378-3.655-9.085-3.655-5.43 0-13.52 4.542-20.15 12.74v106.7h-27.78v-105.8c0-17.33-2.193-26.99-3.655-34.93l26.05-6.787c0.731 2.558 3.185 9.607 3.446 17.02 7.101-8.824 20.1-16.19 32.89-16.19 9.816 0 17.7 3.968 22.61 10.23 5.639 7.101 6.631 16.71 6.631 26.37v110.1h-27.78"/><path fill="#0066B3" d="m660 538c-2.715-6.526-7.153-10.49-14.25-10.49-12.53 0-17.96 11.64-18.43 37.17h35.87c0-11.33-0.992-20.99-3.185-26.68zm-32.68 49.65v2.872c0 9.346 0.7309 17.86 4.177 25.27 4.177 8.771 11.28 13.63 19.89 13.63 10.08 0 18.69-5.117 27.31-14.2l11.02 20.68c-12.27 13.37-25.53 19.32-40.78 19.32-32.68 0-51.38-28.09-51.38-75.76 0-24.7 4.229-42.87 13.31-56.49 8.563-12.74 20.36-19 34.62-19 13.52 0 24.33 5.43 31.95 15.35 10.08 13.05 13.99 30.65 13.99 62.13v6.213h-64.12"/><path fill="#0066B3" d="m758.7 529.5c-18.69 0-18.69 34.04-18.69 48.82 0 15.61-0.4699 51.64 19.42 51.64 18.43 0 18.43-36.03 18.43-51.06 0-15.61 0.731-49.39-19.16-49.39zm0 126c-38.32 0-48.4-40.83-48.66-76.02-0.2611-35.5 12.53-75.5 48.92-75.5 28.72 0 49.34 25.84 49.34 74.92 0 36.6-12.01 76.59-49.6 76.59"/><path fill="#0066B3" d="m891.9 651.8v-97.06c0-11.07-0.992-15.61-3.237-18.74-1.932-2.819-5.378-3.655-9.085-3.655-5.378 0-13.52 4.542-20.15 12.74v106.7h-27.72v-105.8c0-17.33-2.245-26.99-3.707-34.93l26.05-6.787c0.731 2.558 3.185 9.607 3.446 17.02 7.101-8.824 20.1-16.19 32.89-16.19 9.816 0 17.7 3.968 22.61 10.23 5.639 7.101 6.631 16.71 6.631 26.37v110.1h-27.72"/></g></g></g></svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${item.svgViewBox || '0 0 24 24'}" role="img" aria-label="${label}"><path fill="${primary}" fill-rule="evenodd" d="${d}"/></svg>`;
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

  // PLAYWRIGHT — Bespoke theatre choreography (8s, approved demo v2).
  // Red mask enters from the left, green mask from the right, they glance
  // toward each other, then bow together. Per-mask transforms use
  // transform-box: view-box with mask-centred origins, so the original
  // path order is preserved. Final and reduced-motion frames are exactly
  // the two-mask static logo: no foreign shapes, no colour change.
  if (item.id === 'playwright') {
    return wrapSvg(
      '',
      `.tss_playwright_r,.tss_playwright_g,.tss_playwright_b{transform-box:view-box}.tss_playwright_r{transform-origin:38px 68px;animation:tss_playwright_r 8s ease-in-out infinite}.tss_playwright_g{transform-origin:88px 62px;animation:tss_playwright_g 8s ease-in-out infinite}.tss_playwright_b{transform-origin:64px 104px;animation:tss_playwright_b 8s ease-in-out infinite}@keyframes tss_playwright_r{0%{transform:translateX(-36px) rotate(-14deg);opacity:0}14%{transform:translateX(0) rotate(0deg);opacity:1}30%{transform:translateX(0) rotate(0deg)}38%{transform:translateX(0) rotate(6deg)}48%,100%{transform:translateX(0) rotate(0deg);opacity:1}}@keyframes tss_playwright_g{0%{transform:translateX(36px) rotate(14deg);opacity:0}14%{transform:translateX(0) rotate(0deg);opacity:1}30%{transform:translateX(0) rotate(0deg)}38%{transform:translateX(0) rotate(-6deg)}48%,100%{transform:translateX(0) rotate(0deg);opacity:1}}@keyframes tss_playwright_b{0%,58%{transform:translateY(0) scale(1,1)}68%{transform:translateY(3px) scale(1,0.93)}78%,100%{transform:translateY(0) scale(1,1)}}`,
      `.tss_playwright_r,.tss_playwright_g,.tss_playwright_b{animation:none!important;transform:none!important;opacity:1!important}`,
      `<g class="tss_playwright_b"><path class="tss_playwright_r" fill="#2D4552" d="M43.662 70.898c-4.124 1.17-6.829 3.222-8.611 5.272 1.707-1.494 3.993-2.865 7.077-3.739 3.155-.894 5.846-.888 8.069-.459v-1.739c-1.897-.173-4.072-.035-6.536.664ZM34.863 56.28l-15.314 4.035s.279.394.796.92l12.984-3.421s-.184 2.371-1.782 4.492c3.022-2.287 3.316-6.025 3.316-6.025Zm12.819 35.991C26.131 98.076 14.729 73.1 11.277 60.137 9.682 54.153 8.986 49.621 8.8 46.697a4.955 4.955 0 0 1 .011-.794c-1.118.068-1.653.649-1.544 2.328.186 2.923.882 7.454 2.477 13.44 3.45 12.961 14.854 37.937 36.405 32.132 4.691-1.264 8.215-3.565 10.86-6.504-2.438 2.202-5.49 3.937-9.327 4.972Zm4.05-51.276v1.534h8.453c-.173-.543-.348-1.032-.522-1.534h-7.932Z"/><path class="tss_playwright_g" fill="#2D4552" d="M62.074 53.627c3.802 1.08 5.812 3.745 6.875 6.104l4.239 1.204s-.578-8.255-8.045-10.376c-6.985-1.985-11.284 3.881-11.807 4.64 2.032-1.448 4.999-2.633 8.738-1.572Zm33.741 6.142c-6.992-1.994-11.289 3.884-11.804 4.633 2.034-1.446 4.999-2.632 8.737-1.566 3.796 1.081 5.804 3.743 6.87 6.104l4.245 1.208s-.588-8.257-8.048-10.379Zm-4.211 21.766-35.261-9.858s.382 1.935 1.846 4.441l29.688 8.3c2.444-1.414 3.726-2.883 3.726-2.883Zm-24.446 21.218c-27.92-7.485-24.544-43.059-20.027-59.916 1.86-6.947 3.772-12.11 5.358-15.572-.946-.195-1.73.304-2.504 1.878-1.684 3.415-3.837 8.976-5.921 16.76-4.516 16.857-7.892 52.429 20.027 59.914 13.159 3.525 23.411-1.833 31.053-10.247-7.254 6.57-16.515 10.253-27.986 7.182Z"/><path class="tss_playwright_r" fill="#E2574C" d="M51.732 83.935v-7.179l-19.945 5.656s1.474-8.563 11.876-11.514c3.155-.894 5.846-.888 8.069-.459V40.995h9.987c-1.087-3.36-2.139-5.947-3.023-7.744-1.461-2.975-2.96-1.003-6.361 1.842-2.396 2.001-8.45 6.271-17.561 8.726-9.111 2.457-16.476 1.805-19.55 1.273-4.357-.752-6.636-1.708-6.422 1.605.186 2.923.882 7.455 2.477 13.44 3.45 12.962 14.854 37.937 36.405 32.132 5.629-1.517 9.603-4.515 12.357-8.336h-8.309v.002Zm-32.185-23.62 15.316-4.035s-.446 5.892-6.188 7.405c-5.743 1.512-9.128-3.371-9.128-3.371Z"/><path class="tss_playwright_g" fill="#2EAD33" d="M109.372 41.336c-3.981.698-13.532 1.567-25.336-1.596-11.807-3.162-19.64-8.692-22.744-11.292-4.4-3.685-6.335-6.246-8.24-2.372-1.684 3.417-3.837 8.977-5.921 16.762-4.516 16.857-7.892 52.429 20.027 59.914 27.912 7.479 42.772-25.017 47.289-41.875 2.084-7.783 2.998-13.676 3.25-17.476.287-4.305-2.67-3.055-8.324-2.064ZM53.28 55.282s4.4-6.843 11.862-4.722c7.467 2.121 8.045 10.376 8.045 10.376L53.28 55.282Zm18.215 30.706c-13.125-3.845-15.15-14.311-15.15-14.311l35.259 9.858c0-.002-7.117 8.25-20.109 4.453Zm12.466-21.51s4.394-6.838 11.854-4.711c7.46 2.124 8.048 10.379 8.048 10.379l-19.902-5.668Z"/><path class="tss_playwright_r" fill="#D65348" d="M44.762 78.733 31.787 82.41s1.41-8.029 10.968-11.212l-7.347-27.573-.635.193c-9.111 2.457-16.476 1.805-19.55 1.273-4.357-.751-6.636-1.708-6.422 1.606.186 2.923.882 7.454 2.477 13.44 3.45 12.961 14.854 37.937 36.405 32.132l.635-.199-3.555-13.337ZM19.548 60.315l15.316-4.035s-.446 5.892-6.188 7.405c-5.743 1.512-9.128-3.371-9.128-3.371Z"/><path class="tss_playwright_g" fill="#1D8D22" d="m72.086 86.132-.594-.144c-13.125-3.844-15.15-14.311-15.15-14.311l18.182 5.082L84.15 39.77l-.116-.031c-11.807-3.162-19.64-8.692-22.744-11.292-4.4-3.685-6.335-6.246-8.24-2.372-1.682 3.417-3.836 8.977-5.92 16.762-4.516 16.857-7.892 52.429 20.027 59.914l.572.129 4.357-16.748Zm-18.807-30.85s4.4-6.843 11.862-4.722c7.467 2.121 8.045 10.376 8.045 10.376l-19.907-5.654Z"/><path class="tss_playwright_r" fill="#C04B41" d="m45.423 78.544-3.48.988c.822 4.634 2.271 9.082 4.545 13.011.396-.087.788-.163 1.192-.273a25.224 25.224 0 0 0 2.98-1.023c-2.541-3.771-4.222-8.114-5.237-12.702Zm-1.359-32.64c-1.788 6.674-3.388 16.28-2.948 25.915a20.061 20.061 0 0 1 2.546-.923l.644-.144c-.785-10.292.912-20.78 2.825-27.915a139.404 139.404 0 0 1 1.455-5.05 45.171 45.171 0 0 1-2.578 1.53 132.234 132.234 0 0 0-1.944 6.587Z"/></g>`,
      'Bespoke 8s theatre choreography: red mask enters from the left and green mask from the right, the masks glance toward each other, then bow together; final and reduced-motion frames are exactly the two-mask static logo',
      'Per-mask CSS transforms (transform-box: view-box, mask-centred origins) + shared bow group; no foreign shapes, no colour change',
      '0 0 128 128'
    );
  }

  // GITLAB v4 — One whole-tanuki arc + settle (replaces the v1 halves).
  // The existing gitlab entry already carries the correct tanuki silhouette
  // (single-orange, an allowed Pajamas single-colour exception); the invented
  // gitlabci mark is removed from the catalog, so this is the one GitLab.
  // One purpose only: a single curved DevOps-loop swing. Anticipation dip,
  // arc left-to-right, overshoot settle, then a long static hold (motion in
  // the first half of the 6s loop, static in the second half). Whole-mark
  // transform only: no clipPath, no opacity fade, no secondary elements, so
  // there is no seam to glitch. Easing is named, never the CSS default:
  // Pajamas ease-out-cubic for the settle, Material standard ease-in-out
  // for the arc travel. Final and reduced-motion frames are exactly the
  // static tanuki: no foreign shapes, no colour change.
  if (item.id === 'gitlab') {
    return wrapSvg(
      '',
      `.tss_gitlab_w{transform-box:view-box;transform-origin:12px 12px;animation:tss_gitlab_w 6s cubic-bezier(0.4,0,0.2,1) infinite}@keyframes tss_gitlab_w{0%{transform:translate(0,0) rotate(0deg) scale(1,1);animation-timing-function:cubic-bezier(0.4,0,0.2,1)}8%{transform:translate(0,1px) rotate(0deg) scale(0.96,0.96);animation-timing-function:cubic-bezier(0.22,0.61,0.36,1)}20%{transform:translate(-3px,-3px) rotate(-6deg) scale(1,1);animation-timing-function:cubic-bezier(0.4,0,0.2,1)}32%{transform:translate(3px,-3px) rotate(6deg) scale(1,1);animation-timing-function:cubic-bezier(0.22,0.61,0.36,1)}44%{transform:translate(0,0) rotate(-2deg) scale(1.03,0.97)}50%,100%{transform:translate(0,0) rotate(0deg) scale(1,1)}}`,
      `.tss_gitlab_w{animation:none!important;transform:none!important}`,
      `<g class="tss_gitlab_w"><path fill="#FC6D26" fill-rule="evenodd" d="m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z"/></g>`,
      'Single whole-tanuki arc: anticipation dip, one curved DevOps-loop swing left-to-right, overshoot settle, then a long static hold; final and reduced-motion frames are exactly the static tanuki',
      'Whole-mark transform only (no clipPath, no opacity, no secondary elements); Pajamas ease-out-cubic + Material standard ease-in-out'
    );
  }

  // GOOGLE DATAFLOW v2 — Data actually flowing through the diagram.
  // The v1 whole-mark sway was generic: it could have been any logo, and
  // at card size it just read as wobbling. This version moves nothing but
  // the diagram's own 4 nodes: left -> top-centre -> right -> bottom-centre,
  // i.e. one trip around the pipeline loop, each node swelling to 1.5x and
  // lighting from pale #aecbfa to primary #4285F4 as the data passes it,
  // then settling back. The 8 bars never move, so the mark never deforms.
  // Motion runs only in the first half of the 6s loop; 50-100% is exactly
  // static, and reduced-motion is exactly the static icon. No clipPath,
  // no foreign shapes, no added dots: only shapes already in the official
  // icon, animated in the order the diagram itself implies. (v2 was the
  // version the user preferred over the continuous v3.)
  if (item.id === 'googledataflow') {
    return wrapSvg(
      '',
      `.tss_googledataflow_n0{transform-box:fill-box;transform-origin:center;animation:tss_googledataflow_n0 6s cubic-bezier(0.22,1,0.36,1) infinite}.tss_googledataflow_n1{transform-box:fill-box;transform-origin:center;animation:tss_googledataflow_n1 6s cubic-bezier(0.22,1,0.36,1) infinite}.tss_googledataflow_n2{transform-box:fill-box;transform-origin:center;animation:tss_googledataflow_n2 6s cubic-bezier(0.22,1,0.36,1) infinite}.tss_googledataflow_n3{transform-box:fill-box;transform-origin:center;animation:tss_googledataflow_n3 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_googledataflow_n0{0%,0%{transform:scale(1);fill:#aecbfa}6%{transform:scale(1.5);fill:#4285F4}12%,100%{transform:scale(1);fill:#aecbfa}}@keyframes tss_googledataflow_n1{0%,12%{transform:scale(1);fill:#aecbfa}18%{transform:scale(1.5);fill:#4285F4}24%,100%{transform:scale(1);fill:#aecbfa}}@keyframes tss_googledataflow_n2{0%,24%{transform:scale(1);fill:#aecbfa}30%{transform:scale(1.5);fill:#4285F4}36%,100%{transform:scale(1);fill:#aecbfa}}@keyframes tss_googledataflow_n3{0%,36%{transform:scale(1);fill:#aecbfa}42%{transform:scale(1.5);fill:#4285F4}48%,100%{transform:scale(1);fill:#aecbfa}}`,
      `.tss_googledataflow_n0{animation:none!important;transform:none!important;fill:#aecbfa!important}.tss_googledataflow_n1{animation:none!important;transform:none!important;fill:#aecbfa!important}.tss_googledataflow_n2{animation:none!important;transform:none!important;fill:#aecbfa!important}.tss_googledataflow_n3{animation:none!important;transform:none!important;fill:#aecbfa!important}`,
      `<polygon fill="#669df6" points="18.39 6.71 18.03 5.46 16.14 5.38 13.86 6.66 15.89 8.65 15.86 10.96 17.21 10.98 17.24 8.67 22.9 12.09 22.88 13.51 25.24 13.54 25.24 10.81 18.39 6.71"/><polygon fill="#aecbfa" points="16.14 5.38 16.14 5.38 16.14 5.38 14.24 5.83 13.86 6.66 6.83 10.56 6.8 13.3 9.18 13.33 9.19 11.9 14.95 8.64 14.92 10.95 16.07 10.96 16.14 5.38"/><polygon fill="#669df6" points="16.14 5.38 16.14 5.38 16.14 5.38 11.59 2.67 9.27 3.93 13.86 6.66 16.14 5.38 16.14 5.38"/><polygon fill="#669df6" points="22.79 20.09 17.05 23.35 17.08 21.05 14.79 21.02 14.76 23.32 15.86 26.62 17.75 26.47 18.14 25.34 25.16 21.43 25.2 18.64 22.81 18.61 22.79 20.09"/><polygon fill="#669df6" points="15.86 26.62 15.86 26.62 15.86 26.62 11.23 29.21 11.17 29.21 8.95 27.89 13.61 25.28 15.86 26.62 15.86 26.62"/><polygon fill="#4285F4" points="18.39 6.71 23.04 4.11 20.82 2.79 20.76 2.79 16.14 5.38 18.39 6.71"/><polygon fill="#4285F4" points="18.14 25.34 22.73 28.07 20.48 29.33 20.41 29.33 15.86 26.62 15.86 26.62 15.86 26.62 15.86 26.62 18.14 25.34"/><polygon fill="#aecbfa" points="15.86 26.62 13.61 25.28 6.76 21.19 6.76 18.52 9.11 18.52 9.09 19.91 14.76 23.33 14.79 21.02 15.93 21.04 15.86 26.62"/><circle class="tss_googledataflow_n0" fill="#aecbfa" cx="15.96" cy="18.67" r="1.52"/><circle class="tss_googledataflow_n1" fill="#aecbfa" cx="7.84" cy="15.83" r="1.52"/><circle class="tss_googledataflow_n2" fill="#aecbfa" cx="24.16" cy="16.05" r="1.52"/><circle class="tss_googledataflow_n3" fill="#aecbfa" cx="16.09" cy="13.32" r="1.52"/>`,
      'Node-by-node flow around the pipeline loop: left, top-centre, right, bottom-centre nodes swell and light in turn, bars static, then a long static hold; final and reduced-motion frames are exactly the static official Dataflow icon',
      "Per-node CSS scale + fill on the icon's own circles only (transform-box: fill-box, centre origin); Material-style ease-out for each pulse, no whole-mark transform",
      '0 0 32 32'
    );
  }

  // WEBGPU — W assembles triangle by triangle (6s, replaces the generic
  // shimmer-prism-sweep template, whose clipped sheen and trace strokes
  // had nothing to do with WebGPU and hid the W behind a clip). The 5
  // triangles of the W appear in path order, each rising 3px and fading
  // in, then the whole W holds exactly static for the second half of the
  // loop — the same hold pattern as the Dataflow v2 the user preferred.
  // No clipPath, no sheen rect, no trace strokes, no foreign shapes:
  // only the W's own triangles. Reduced-motion is exactly the static W.
  if (item.id === 'webgpu') {
    return wrapSvg(
      '',
      `.tss_webgpu_w0{transform-box:fill-box;transform-origin:center;animation:tss_webgpu_w0 6s cubic-bezier(0.22,1,0.36,1) infinite}.tss_webgpu_w1{transform-box:fill-box;transform-origin:center;animation:tss_webgpu_w1 6s cubic-bezier(0.22,1,0.36,1) infinite}.tss_webgpu_w2{transform-box:fill-box;transform-origin:center;animation:tss_webgpu_w2 6s cubic-bezier(0.22,1,0.36,1) infinite}.tss_webgpu_w3{transform-box:fill-box;transform-origin:center;animation:tss_webgpu_w3 6s cubic-bezier(0.22,1,0.36,1) infinite}.tss_webgpu_w4{transform-box:fill-box;transform-origin:center;animation:tss_webgpu_w4 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_webgpu_w0{0%,0%{transform:translateY(3px);opacity:0}8%{transform:translateY(0);opacity:1}50%,100%{transform:translateY(0);opacity:1}}@keyframes tss_webgpu_w1{0%,10%{transform:translateY(3px);opacity:0}18%{transform:translateY(0);opacity:1}50%,100%{transform:translateY(0);opacity:1}}@keyframes tss_webgpu_w2{0%,20%{transform:translateY(3px);opacity:0}28%{transform:translateY(0);opacity:1}50%,100%{transform:translateY(0);opacity:1}}@keyframes tss_webgpu_w3{0%,30%{transform:translateY(3px);opacity:0}38%{transform:translateY(0);opacity:1}50%,100%{transform:translateY(0);opacity:1}}@keyframes tss_webgpu_w4{0%,40%{transform:translateY(3px);opacity:0}48%{transform:translateY(0);opacity:1}50%,100%{transform:translateY(0);opacity:1}}`,
      `.tss_webgpu_w0{animation:none!important;transform:none!important;opacity:1!important}.tss_webgpu_w1{animation:none!important;transform:none!important;opacity:1!important}.tss_webgpu_w2{animation:none!important;transform:none!important;opacity:1!important}.tss_webgpu_w3{animation:none!important;transform:none!important;opacity:1!important}.tss_webgpu_w4{animation:none!important;transform:none!important;opacity:1!important}`,
      `<path class="tss_webgpu_w0" fill="#005A9C" d="M0 4.784L8.652 19.216L17.304 4.784Z"/><path class="tss_webgpu_w1" fill="#005A9C" d="M22.032 4.929L20.07 8.202L24 8.202L22.032 4.93Z"/><path class="tss_webgpu_w2" fill="#005A9C" d="M17.572 4.929L13.38 11.922L21.764 11.922Z"/><path class="tss_webgpu_w3" fill="#005A9C" d="M20.07 8.504L22.032 11.777L24 8.504Z"/><path class="tss_webgpu_w4" fill="#005A9C" d="M13.38 12.224L17.572 19.216L21.764 12.224Z"/>`,
      'W assembles triangle by triangle in path order, then a long static hold; final and reduced-motion frames are exactly the static W',
      'Per-triangle CSS translateY + opacity (transform-box: fill-box, centre origin); Material-style ease-out for each entrance',
      '0 0 24 24'
    );
  }

  // AZURE SQL — blob stands, SQL letters assemble (6s). The blue blob
  // is exactly static from frame 0; only the SQL letters animate, in
  // reading order S -> Q -> L, each rising 1 unit and fading in, then
  // the whole mark holds exactly static for the second half of the loop
  // (the hold pattern the user preferred on Dataflow v2 and WebGPU).
  // No clipPath, no sheen, no trace, no foreign shapes. Reduced-motion
  // is exactly the static mark.
  if (item.id === 'azuresqldatabase') {
    return wrapSvg(
      '',
      `.tss_azuresqldatabase_l0{transform-box:fill-box;transform-origin:center;animation:tss_azuresqldatabase_l0 6s cubic-bezier(0.22,1,0.36,1) infinite}.tss_azuresqldatabase_l1{transform-box:fill-box;transform-origin:center;animation:tss_azuresqldatabase_l1 6s cubic-bezier(0.22,1,0.36,1) infinite}.tss_azuresqldatabase_l2{transform-box:fill-box;transform-origin:center;animation:tss_azuresqldatabase_l2 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_azuresqldatabase_l0{0%,0%{transform:translateY(1px);opacity:0}12%{transform:translateY(0);opacity:1}50%,100%{transform:translateY(0);opacity:1}}@keyframes tss_azuresqldatabase_l1{0%,15%{transform:translateY(1px);opacity:0}27%{transform:translateY(0);opacity:1}50%,100%{transform:translateY(0);opacity:1}}@keyframes tss_azuresqldatabase_l2{0%,30%{transform:translateY(1px);opacity:0}42%{transform:translateY(0);opacity:1}50%,100%{transform:translateY(0);opacity:1}}`,
      `.tss_azuresqldatabase_l0{animation:none!important;transform:none!important;opacity:1!important}.tss_azuresqldatabase_l1{animation:none!important;transform:none!important;opacity:1!important}.tss_azuresqldatabase_l2{animation:none!important;transform:none!important;opacity:1!important}`,
      `<defs><linearGradient id="tss_azuresqldatabase_g" x1="9.908" y1="15.943" x2="7.516" y2="2.383" gradientUnits="userSpaceOnUse"><stop offset="0.15" stop-color="#0078d4"/><stop offset="0.8" stop-color="#5ea0ef"/><stop offset="1" stop-color="#83b9f9"/></linearGradient></defs><path d="M14.49,7.15A5.147,5.147,0,0,0,9.24,2.164,5.272,5.272,0,0,0,4.216,5.653,4.869,4.869,0,0,0,0,10.4a4.946,4.946,0,0,0,5.068,4.814H13.82A4.292,4.292,0,0,0,18,11.127,4.105,4.105,0,0,0,14.49,7.15Z" fill="url(#tss_azuresqldatabase_g)"/><path class="tss_azuresqldatabase_l0" d="M5.76,9.73a1.825,1.825,0,0,1-.51-.31.441.441,0,0,1-.12-.32.342.342,0,0,1,.15-.3.683.683,0,0,1,.42-.12,1.62,1.62,0,0,1,1,.29V8.11a2.58,2.58,0,0,0-1-.16,1.641,1.641,0,0,0-1.09.34,1.08,1.08,0,0,0-.42.89c0,.51.32.91,1,1.21a2.907,2.907,0,0,1,.62.36.419.419,0,0,1,.15.32.381.381,0,0,1-.16.31.806.806,0,0,1-.45.11,1.66,1.66,0,0,1-1.09-.42V12a2.173,2.173,0,0,0,1.07.24,1.877,1.877,0,0,0,1.18-.33A1.08,1.08,0,0,0,6.84,11a1.048,1.048,0,0,0-.25-.7A2.425,2.425,0,0,0,5.76,9.73Z" fill="#f2f2f2"/><path class="tss_azuresqldatabase_l1" d="M11,11.32A2.191,2.191,0,0,0,11,9a1.808,1.808,0,0,0-.7-.75,2,2,0,0,0-1-.26,2.112,2.112,0,0,0-1.08.27A1.856,1.856,0,0,0,7.49,9a2.465,2.465,0,0,0-.26,1.14,2.256,2.256,0,0,0,.24,1,1.766,1.766,0,0,0,.69.74,2.056,2.056,0,0,0,1,.3l.86,1h1.21L10,12.08A1.79,1.79,0,0,0,11,11.32Zm-1-.25a.941.941,0,0,1-.76.35.916.916,0,0,1-.76-.36,1.523,1.523,0,0,1-.29-1,1.529,1.529,0,0,1,.29-1,1,1,0,0,1,.78-.37.869.869,0,0,1,.75.37,1.619,1.619,0,0,1,.27,1A1.459,1.459,0,0,1,10,11.07Z" fill="#f2f2f2"/><path class="tss_azuresqldatabase_l2" d="M12.9,11.4V8H12v4.13h2.46V11.4Z" fill="#f2f2f2"/>`,
      'Blob exactly static; SQL letters assemble S -> Q -> L, then a long static hold; final and reduced-motion frames are exactly the static mark',
      'Per-letter CSS translateY + opacity (transform-box: fill-box, centre origin); Material-style ease-out for each entrance',
      '0 0 18 18'
    );
  }

  // CONDAFORGE — heat glow (6s, user-picked direction C, replaces the
  // forge-strike branch). Forging is heating metal until it glows and
  // letting it cool: only the anvil's own fill changes, light grey to
  // hot orange and back to exactly the static colour, then a static
  // hold for the second half. No transform, no added shapes, no
  // spinning rings — the colour shift stays visible even at 48px
  // because it covers the whole mark. Reduced-motion is exactly the
  // static anvil.
  if (item.id === 'condaforge') {
    return wrapSvg(
      '',
      `.tss_condaforge_heat{animation:tss_condaforge_heat 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_condaforge_heat{0%{fill:#F3F1EC}30%{fill:#FF7A29}50%,100%{fill:#F3F1EC}}`,
      `.tss_condaforge_heat{animation:none!important;fill:#F3F1EC!important}`,
      `<path class="tss_condaforge_heat" fill="#F3F1EC" fill-rule="evenodd" d="${item.svgPath}"/>`,
      'Anvil heated to orange and cooled back to its static colour, then a long static hold; final and reduced-motion frames are exactly the static anvil',
      'Fill-colour keyframes on the catalog path itself (light grey to hot orange to light grey); Material-style ease-out',
      '0 0 24 24'
    );
  }

  // META — one-line draw (6s, user-picked direction A, replaces the
  // endless-flow version). Infinity is one line drawn without lifting
  // the pen: the stroke traces the logo's own path in the first 35%,
  // the fill fades in at 35-50%, then the mark holds exactly static
  // for the second half. No clipPath, no halves, no sheen, no foreign
  // shapes — only the infinity's own path. Reduced-motion is exactly
  // the static infinity.
  if (item.id === 'meta') {
    return wrapSvg(
      '',
      `.tss_meta_draw{animation:tss_meta_draw 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_meta_draw{0%{stroke-dashoffset:100;fill-opacity:0;stroke-opacity:1}35%{stroke-dashoffset:0;fill-opacity:0;stroke-opacity:1}50%,100%{stroke-dashoffset:0;fill-opacity:1;stroke-opacity:0}}`,
      `.tss_meta_draw{animation:none!important;fill-opacity:1!important;stroke-opacity:0!important}`,
      `<path class="tss_meta_draw" fill="#0467DF" stroke="#0467DF" stroke-width="1.6" pathLength="100" stroke-dasharray="100" d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"/>`,
      'Infinity drawn as one continuous line, then filled, then a long static hold; final and reduced-motion frames are exactly the static infinity',
      'Stroke-dashoffset draw on the catalog path itself (pathLength 100) + fill-opacity fade-in; Material-style ease-out',
      '0 0 24 24'
    );
  }

  // PHOENIXFRAMEWORK — 9-piece assembly (6s, user-approved). The
  // catalog Phoenix bird is not one solid shape: its path splits into
  // exactly 9 subpaths (body, wing, tail and head details), each with
  // an in-viewBox start. The pieces assemble in path order, each
  // rising 3px and fading in, staggered 0.25s, then the whole bird
  // holds exactly static for the second half. EXCEPTION, verified
  // by render-diff: subpaths 0 and 1 overlap at the bird's eye, and
  // the original single path's evenodd rule punches that overlap
  // into a transparent eye. Splitting 0 and 1 into separate path
  // elements fills the eye in (each element fills on its own), so
  // 0+1 stay merged in ONE path element and animate as one piece;
  // the assembly is 8 visible steps, and the final frame keeps
  // the eye exactly as the static bird. The split was verified
  // numerically: rejoining the 9 absolute-moveto pieces reproduces
  // the original 120-point sequence with zero error, so the final
  // frame is exactly the static bird. No clipPath, no halves, no
  // sheen, no foreign shapes. Reduced-motion is exactly the static
  // bird. Catalog motionRecipe.family stays flame-core-flicker per
  // the no-new-family-names convention for bespoke branches.
  if (item.id === 'phoenixframework') {
    return wrapSvg(
      '',
      `.tss_phoenixframework_piece{opacity:0;transform-box:fill-box;transform-origin:50% 50%;animation:tss_phoenixframework_asm 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_phoenixframework_asm{0%{opacity:0;transform:translateY(3px)}10%,100%{opacity:1;transform:translateY(0)}}`,
      `.tss_phoenixframework_piece{animation:none!important;opacity:1!important;transform:none!important}`,
      `<path class="tss_phoenixframework_piece" style="animation-delay:0.0s" fill="#FD4F00" fill-rule="evenodd" d="M9.012 15.241L8.824 15.205c-1.34-.248-2.186-1.06-2.588-2.334-.25-.794.204-1.38 1.038-1.416.682-.032 1.15.36 1.562.816.532.588 1.02 1.216 1.542 1.814.754.86 1.64 1.412 2.854 1.24a5.404 5.404 0 0 0 2.86-1.308c.124-.108.26-.2.392-.302l-.084-.098a6.034 6.034 0 0 1-2.12.252c-1.092-.054-2.132-.282-3.064-.882-.848-.548-1.476-1.28-1.774-2.26-.24-.79.252-1.344 1.072-1.23.313.049.606.187.842.398.2.168.39.346.594.51.958.77 2.294.812 3.508-.022-1.996-.01-3.354-1.108-4.548-2.5-.466-.544-.922-1.1-1.4-1.636-.92-1.038-1.944-1.952-3.346-2.264-1.79-.398-3.518-.136-5.176.622A4.214 4.214 0 0 0 0 5.217h.352c.836-.022 1.464.35 1.916 1.034.328.498.482 1.06.6 1.64.176.86.086 1.734.188 2.598.26 2.22 1.394 3.768 3.506 4.56.774.292 1.568.39 2.45.19v.002zM3.674 5.113c-.334.084-.6-.05-.874-.328.47-.118.886-.164 1.332-.18a.562.562 0 0 1-.458.508z"/><path class="tss_phoenixframework_piece" style="animation-delay:0.25s" fill="#FD4F00" fill-rule="evenodd" d="M14.612 18.073c-.03-.212-.212-.306-.356-.42-.634-.492-1.378-.668-2.164-.682a4.08 4.08 0 0 1-1.378-.208c-.204-.076-.43-.174-.426-.436.006-.266.238-.34.448-.404.174-.052.352-.084.548-.13-.5-.32-.988-.364-1.636-.102-1.024.41-2.032.36-3.052-.006-.574-.208-1.086-.534-1.618-.824l-.026.02c.44.722 1.038 1.304 1.71 1.8 1.296.96 2.712 1.53 4.37 1.276a22.8 22.8 0 0 1 1.614-.19c.676-.054 1.32.136 1.966.308v-.002z"/><path class="tss_phoenixframework_piece" style="animation-delay:0.5s" fill="#FD4F00" fill-rule="evenodd" d="M11.488 7.703000000000001c-.036-.026-.07-.09-.144-.024a5.258 5.258 0 0 0 2.284 1.776c1.488.604 3 .708 4.544.174 1.2-.414 2.06-.01 2.508 1.156.066-1.352-.73-2.338-1.996-2.53-.712-.11-1.37.128-2.038.32-1.856.54-3.584.274-5.16-.872h.002z"/><path class="tss_phoenixframework_piece" style="animation-delay:0.75s" fill="#FD4F00" fill-rule="evenodd" d="M20.744 12.975000000000001L21.47 13.039000000000001c-.546-.48-1.212-.52-1.888-.48-1.026.058-1.766.65-2.44 1.356-.594.624-1.13 1.324-2.016 1.574l.02.04c.12.002.24.008.36.002 1.288-.058 2.5-.33 3.464-1.264.306-.294.576-.62.87-.926.226-.258.562-.394.904-.366z"/><path class="tss_phoenixframework_piece" style="animation-delay:1.0s" fill="#FD4F00" fill-rule="evenodd" d="M17.752 11.379000000000001c-.96.084-1.794.48-2.58 1.006-.602.404-1.248.594-1.972.468-.128-.022-.258-.04-.384-.058l-.006.054c.046.024.092.05.14.07.12.048.24.106.364.136 1.396.33 2.732.16 3.936-.618.76-.49 1.546-.582 2.398-.456.086.014.172.028.258.036.08.008.164.088.272 0a3.454 3.454 0 0 0-2.426-.638z"/><path class="tss_phoenixframework_piece" style="animation-delay:1.25s" fill="#FD4F00" fill-rule="evenodd" d="M14.317999999999998 8.119000000000002a2.68 2.68 0 0 0 1.534-.364c-.154.014-.22.014-.282.026a2.296 2.296 0 0 1-1.96-.472l-.646-.5c-.856-.652-1.836-.872-2.91-.852.018.052.02.088.038.106 1.168 1.18 2.52 1.996 4.226 2.054v.002z"/><path class="tss_phoenixframework_piece" style="animation-delay:1.5s" fill="#FD4F00" fill-rule="evenodd" d="M22.769999999999996 14.179000000000002c-.724-.72-1.694-.81-2.59-.186.594.028 1.04.216 1.4.592.128.134.262.26.404.378.548.44 1.474.46 2.016.052-.636-.248-.636-.248-1.23-.838v.002z"/><path class="tss_phoenixframework_piece" style="animation-delay:1.75s" fill="#FD4F00" fill-rule="evenodd" d="M15.571999999999996 19.665000000000003c-.634-1.18-1.7-1.448-2.936-1.368.364.1.708.26 1.02.474.286.2.526.448.764.702.472.504 1.208.812 1.696.708-.224-.14-.546-.514-.546-.514h-.012l.008.006.004.018c.004-.02.006-.016.008-.01h.02l-.028-.012v.01l.01.004s.114.208-.008-.018z"/>`,
      'Phoenix bird assembled from its own 9 pieces in path order, then a long static hold; final and reduced-motion frames are exactly the static bird',
      'Staggered piece assembly on the catalog path itself (rise + fade-in per piece); Material-style ease-out',
      '0 0 24 24'
    );
  }

  // ELIXIR — one-line draw (6s, user-approved). The catalog Elixir
  // drop is a single closed path, so it cannot be split into parts
  // the way Phoenix can. Instead the drop draws itself: a stroke
  // traces the drop outline in the first 35%, the purple fill fades
  // in during 35–50%, then the mark holds exactly static for the
  // second half. Same draw vocabulary as the approved Meta motion,
  // applied to the drop's own path — no clipPath, no fill-rise, no
  // whole-logo movement, no foreign shapes. Reduced-motion is
  // exactly the static drop. Catalog motionRecipe.family stays
  // flame-core-flicker per the no-new-family-names convention for
  // bespoke branches.
  if (item.id === 'elixir') {
    return wrapSvg(
      '',
      `.tss_elixir_draw{animation:tss_elixir_draw 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_elixir_draw{0%{stroke-dashoffset:100;fill-opacity:0;stroke-opacity:1}35%{stroke-dashoffset:0;fill-opacity:0;stroke-opacity:1}50%,100%{stroke-dashoffset:0;fill-opacity:1;stroke-opacity:0}}`,
      `.tss_elixir_draw{animation:none!important;fill-opacity:1!important;stroke-opacity:0!important}`,
      `<path class="tss_elixir_draw" fill="#8847B9" stroke="#8847B9" stroke-width="1.6" pathLength="100" stroke-dasharray="100" fill-rule="evenodd" d="${item.svgPath}"/>`,
      'Elixir drop draws itself along its own outline, then fills; final and reduced-motion frames are exactly the static drop',
      'One-line stroke draw on the catalog path itself (trace, then fill fade-in); Material-style ease-out',
      '0 0 24 24'
    );
  }

  // ECHO — one-line draw (6s, user-approved variant B). The wordmark
  // has 7 elements (3 cyan device parallelograms + 4 white letters);
  // each is traced with a stroke in its own colour in order, then
  // fills, staggered 0.25s, then the whole mark holds exactly static
  // for the second half. The official logo's inner translate groups
  // (device (-16,-15.7), letters (-8,0)) are preserved — dropping
  // them shifts the wordmark right and clips the O past the 128 box
  // (caught from the user's "O mất nét" report on the demo). No
  // clipPath, no foreign shapes. Reduced-motion is exactly the
  // static wordmark. Catalog motionRecipe.family stays
  // data-stream-flow per the no-new-family-names convention for
  // bespoke branches.
  if (item.id === 'echo') {
    return wrapSvg(
      '',
      `.tss_echo_draw{fill-opacity:0;stroke-dashoffset:100;animation:tss_echo_draw 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_echo_draw{0%{stroke-dashoffset:100;fill-opacity:0;stroke-opacity:1}8.3%{stroke-dashoffset:0;fill-opacity:0}16.6%,100%{stroke-dashoffset:0;fill-opacity:1;stroke-opacity:0}}`,
      `.tss_echo_draw{animation:none!important;fill-opacity:1!important;stroke-opacity:0!important}`,
      `<g transform="translate(4,44.16) scale(1.0811)"><g transform="translate(-16,-15.7)"><path class="tss_echo_draw" style="animation-delay:0.0s" fill="#00AFD1" stroke="#00AFD1" stroke-width="5" pathLength="100" stroke-dasharray="100" d="M16,16L30,24L30,40L16,32Z"/><path class="tss_echo_draw" style="animation-delay:0.25s" fill="#4AE1FF" stroke="#4AE1FF" stroke-width="5" pathLength="100" stroke-dasharray="100" d="M32,24L46,32L46,48L32,40Z"/><path class="tss_echo_draw" style="animation-delay:0.5s" fill="#00AFD1" stroke="#00AFD1" stroke-width="5" pathLength="100" stroke-dasharray="100" d="M18,34L32,42L32,52L18,44Z" opacity="0.55"/></g><g transform="translate(-8,0)"><path class="tss_echo_draw" style="animation-delay:0.75s" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" pathLength="100" stroke-dasharray="100" d="M52.5,22.3c0.3,2,2,3.4,4.8,3.4c1.5,0,3.4-0.5,4.3-1.5l2.5,2.5c-1.7,1.7-4.4,2.6-6.9,2.6c-5.5,0-8.8-3.4-8.8-8.4c0-4.8,3.3-8.3,8.5-8.3c5.3,0,8.7,3.3,8.1,9.8H52.5z M61.2,19.1c-0.3-2-1.9-3.1-4.1-3.1c-2.1,0-3.9,1-4.5,3.1H61.2z"/><path class="tss_echo_draw" style="animation-delay:1.0s" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" pathLength="100" stroke-dasharray="100" d="M81.7,26.8c-1.8,1.8-3.8,2.5-6.1,2.5c-4.6,0-8.5-2.8-8.5-8.4c0-5.6,3.9-8.4,8.5-8.4c2.3,0,4,0.6,5.8,2.3l-2.5,2.6c-0.9-0.8-2.1-1.2-3.2-1.2C73,16.3,71,18.2,71,21c0,3,2.1,4.6,4.5,4.6c1.3,0,2.5-0.4,3.5-1.3L81.7,26.8z"/><path class="tss_echo_draw" style="animation-delay:1.25s" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" pathLength="100" stroke-dasharray="100" d="M87.4,6.4v8.8c1.4-1.8,3.2-2.4,5-2.4c4.5,0,6.5,3,6.5,7.7v8.3H95v-8.3c0-2.9-1.5-4.1-3.6-4.1c-2.3,0-3.9,2-3.9,4.3v8.1h-3.9V6.4H87.4z"/><path class="tss_echo_draw" style="animation-delay:1.5s" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" pathLength="100" stroke-dasharray="100" d="M118.1,21c0,4.5-3.1,8.2-8.3,8.2c-5.2,0-8.3-3.7-8.3-8.2c0-4.5,3.2-8.2,8.3-8.2S118.1,16.5,118.1,21z M105.5,21c0,2.4,1.5,4.6,4.3,4.6c2.9,0,4.3-2.2,4.3-4.6c0-2.4-1.7-4.7-4.3-4.7C107,16.3,105.5,18.6,105.5,21z"/></g></g>`,
      'Echo wordmark draws itself element by element (device, then e, c, h, o), then a long static hold; final and reduced-motion frames are exactly the static wordmark',
      'One-line stroke draw on the official wordmark itself (trace, then fill fade-in per element); Material-style ease-out',
      '0 0 128 128'
    );
  }

  // TOKIO — continuous round-trip (6s loop, user-approved after 4
  // rejected variants). The 6 outer task dots run a shared 3s cycle
  // (slide 4 units inward along their spoke, 1s — slide back, 1s —
  // rest, 1s), staggered 0.5s via negative delays so the wave runs
  // from frame 0 with no dead point and loops seamlessly. Unlike
  // every other bespoke motion here, this one is CONTINUOUS by
  // explicit user direction ("phải liên tục theo vòng lặp") — no
  // static second half. Spokes, ring and center dot stay absolutely
  // static. The center (body + ring + center dot, pieces 0+4+5)
  // MUST stay merged in one evenodd path element: splitting them
  // fills the white gap between ring and dot (same bug class as
  // the Phoenix eye). No clipPath, no foreign shapes. Reduced-motion
  // is exactly the static mark. Catalog motionRecipe.family stays
  // orbital-spin per the no-new-family-names convention.
  if (item.id === 'tokio') {
    return wrapSvg(
      '',
      `.tss_tokio_rt{transform-box:fill-box;transform-origin:50% 50%;animation:tss_tokio_rt 3s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_tokio_rt{0%{transform:translate(0,0)}33.33%{transform:translate(var(--tx),var(--ty))}66.67%,100%{transform:translate(0,0)}}`,
      `.tss_tokio_rt{animation:none!important;transform:none!important}`,
      `<path fill="#FFFFFF" fill-rule="evenodd" d="M6.314,1.326L5.623,1.729L5.824,2.074L9.65,8.641L9.719000000000001,8.758000000000001A4.0 4.0 0.0 0 0 8.727,9.746L6.379,8.391L6.0409999999999995,8.197L5.640999999999999,8.889L5.978999999999999,9.084L8.334,10.443999999999999A4.0 4.0 0.0 0 0 8.022,11.642L0.4,11.642L0.0,11.642999999999999L0.0,12.443L8.021,12.443A4.0 4.0 0.0 0 0 8.334000000000001,13.642999999999999L5.9780000000000015,15.001999999999999L5.641000000000002,15.197L6.041000000000002,15.889L6.379000000000002,15.696L8.726000000000003,14.338A4.0 4.0 0.0 0 0 9.560000000000002,15.210999999999999L9.474000000000002,15.358999999999998L5.6480000000000015,21.926L5.448000000000001,22.272L6.138000000000002,22.674L6.340000000000002,22.33L10.166000000000002,15.761999999999999L10.240000000000002,15.634999999999998A4.0 4.0 0.0 0 0 11.600000000000001,16.022L11.600000000000001,19.043L12.400000000000002,19.043L12.400000000000002,16.022A4.0 4.0 0.0 0 0 13.809000000000003,15.608999999999998L13.875000000000004,15.722999999999999L17.701000000000004,22.290999999999997L17.902000000000005,22.636999999999997L18.594000000000005,22.231999999999996L18.393000000000004,21.886999999999997L14.566000000000004,15.319999999999997L14.482000000000005,15.177999999999997A4.0 4.0 0.0 0 0 15.273000000000005,14.337999999999997L17.621000000000006,15.694999999999997L17.959000000000007,15.888999999999998L18.359000000000005,15.196999999999997L18.022000000000006,15.001999999999997L15.666000000000006,13.641999999999998A4.0 4.0 0.0 0 0 15.979000000000006,12.443999999999997L24.0,12.443999999999997L24.0,11.642999999999997L15.979,11.642999999999997A4.0 4.0 0.0 0 0 15.665999999999999,10.442999999999998L18.022,9.083999999999998L18.358999999999998,8.888999999999998L17.959,8.196999999999997L17.621,8.390999999999998L15.273,9.745999999999999A4.0 4.0 0.0 0 0 14.258,8.741999999999999L14.315999999999999,8.640999999999998L18.143,2.073999999999998L18.343,1.728999999999998L17.653,1.325999999999998L17.450999999999997,1.6699999999999982L13.624999999999996,8.237999999999998L13.556999999999997,8.357999999999997A4.0 4.0 0.0 0 0 12.399999999999997,8.063999999999997L12.399999999999997,5.043L11.599999999999996,5.043L11.599999999999996,8.064A4.0 4.0 0.0 0 0 10.417999999999996,8.369L10.341999999999995,8.238999999999999L6.516,1.67ZM12.0,8.888A3.153 3.153 0.0 1 1 12.0,15.195A3.153 3.153 0.0 1 1 12.0,8.888M12.0,11.443A0.6 0.6 0.0 0 0 11.401,12.043A0.6 0.6 0.0 0 0 12.001,12.642A0.6 0.6 0.0 0 0 12.600999999999999,12.042A0.6 0.6 0.0 0 0 12.001,11.442"/><path class="tss_tokio_rt" style="--tx:0px;--ty:4px;animation-delay:-0s" fill="#FFFFFF" fill-rule="evenodd" d="M12.0,3.043A0.6 0.6 0.0 0 0 11.4,3.6430000000000002A0.6 0.6 0.0 0 0 12.0,4.243A0.6 0.6 0.0 0 0 12.6,3.6430000000000002A0.6 0.6 0.0 0 0 12.0,3.043"/><path class="tss_tokio_rt" style="--tx:-3.46px;--ty:2px;animation-delay:-0.5s" fill="#FFFFFF" fill-rule="evenodd" d="M19.198999999999998,7.243A0.6 0.6 0.0 0 0 18.598999999999997,7.843A0.6 0.6 0.0 0 0 19.198999999999998,8.443A0.6 0.6 0.0 0 0 19.801,7.843A0.6 0.6 0.0 0 0 19.198999999999998,7.243"/><path class="tss_tokio_rt" style="--tx:-3.45px;--ty:-2.03px;animation-delay:-1s" fill="#FFFFFF" fill-rule="evenodd" d="M19.2,15.641A0.6 0.6 0.0 0 0 18.599999999999998,16.241A0.6 0.6 0.0 0 0 19.2,16.843A0.6 0.6 0.0 0 0 19.802,16.241A0.6 0.6 0.0 0 0 19.2,15.641"/><path class="tss_tokio_rt" style="--tx:0px;--ty:-4px;animation-delay:-1.5s" fill="#FFFFFF" fill-rule="evenodd" d="M12.0,19.845A0.6 0.6 0.0 0 0 11.401,20.445A0.6 0.6 0.0 0 0 12.001,21.045A0.6 0.6 0.0 0 0 12.600999999999999,20.445A0.6 0.6 0.0 0 0 12.001,19.845"/><path class="tss_tokio_rt" style="--tx:3.44px;--ty:-2.03px;animation-delay:-2s" fill="#FFFFFF" fill-rule="evenodd" d="M4.800999999999999,15.642A0.6 0.6 0.0 0 0 4.199999999999999,16.242A0.6 0.6 0.0 0 0 4.802,16.843A0.6 0.6 0.0 0 0 5.401999999999999,16.241A0.6 0.6 0.0 0 0 4.802,15.641"/><path class="tss_tokio_rt" style="--tx:3.46px;--ty:2px;animation-delay:-2.5s" fill="#FFFFFF" fill-rule="evenodd" d="M4.8,7.243A0.6 0.6 0.0 0 0 4.199,7.843A0.6 0.6 0.0 0 0 4.801,8.443A0.6 0.6 0.0 0 0 5.401,7.843A0.6 0.6 0.0 0 0 4.801,7.243"/>`,
      'Tokio task dots commute continuously along their spokes to the scheduler ring and back, a perpetual round-trip wave; spokes, ring and center dot never move',
      'Continuous staggered round-trip commute of the mark’s own task dots along their spokes (3s cycle, 0.5s stagger, seamless loop); Material-style ease-out',
      '0 0 24 24'
    );
  }

  // OPENVINO — inference-flow letter chase (6s, user-approved).
  // The 8 letter units of the official white wordmark flash the
  // brand purple #6C24F0 in reading order O-p-e-n-V-I-N-O, then
  // all return to white and hold exactly static for the second
  // half — inference flowing through the model. The centering
  // wrapper (translate(0,50.67) scale(1.0667)) is REQUIRED here
  // too: the generic template placed the 120x25 artwork directly
  // into the 128 box with no centering, which shifted the
  // wordmark to the top of the card (caught from the user's
  // "hơi lệch lên trên" report). No clipPath, no foreign shapes.
  // Reduced-motion is exactly the static wordmark. Catalog
  // motionRecipe.family stays circuit-trace-pulse per the
  // no-new-family-names convention for bespoke branches.
  if (item.id === 'openvino') {
    return wrapSvg(
      '',
      `.tss_ov_chase0{animation:tss_ov_chase0 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_ov_chase0{0%{fill:#FFFFFF}0%{fill:#FFFFFF}3.125%{fill:#6C24F0}6.25%,100%{fill:#FFFFFF}}.tss_ov_chase1{animation:tss_ov_chase1 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_ov_chase1{0%{fill:#FFFFFF}6.25%{fill:#FFFFFF}9.375%{fill:#6C24F0}12.5%,100%{fill:#FFFFFF}}.tss_ov_chase2{animation:tss_ov_chase2 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_ov_chase2{0%{fill:#FFFFFF}12.5%{fill:#FFFFFF}15.625%{fill:#6C24F0}18.75%,100%{fill:#FFFFFF}}.tss_ov_chase3{animation:tss_ov_chase3 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_ov_chase3{0%{fill:#FFFFFF}18.75%{fill:#FFFFFF}21.875%{fill:#6C24F0}25%,100%{fill:#FFFFFF}}.tss_ov_chase4{animation:tss_ov_chase4 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_ov_chase4{0%{fill:#FFFFFF}25%{fill:#FFFFFF}28.125%{fill:#6C24F0}31.25%,100%{fill:#FFFFFF}}.tss_ov_chase5{animation:tss_ov_chase5 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_ov_chase5{0%{fill:#FFFFFF}31.25%{fill:#FFFFFF}34.375%{fill:#6C24F0}37.5%,100%{fill:#FFFFFF}}.tss_ov_chase6{animation:tss_ov_chase6 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_ov_chase6{0%{fill:#FFFFFF}37.5%{fill:#FFFFFF}40.625%{fill:#6C24F0}43.75%,100%{fill:#FFFFFF}}.tss_ov_chase7{animation:tss_ov_chase7 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_ov_chase7{0%{fill:#FFFFFF}43.75%{fill:#FFFFFF}46.875%{fill:#6C24F0}50%,100%{fill:#FFFFFF}}`,
      `.tss_ov_chase0,.tss_ov_chase1,.tss_ov_chase2,.tss_ov_chase3,.tss_ov_chase4,.tss_ov_chase5,.tss_ov_chase6,.tss_ov_chase7{animation:none!important;fill:#FFFFFF!important}`,
      `<g transform="translate(0,50.67) scale(1.0667)"><path class="tss_ov_chase0" fill="#FFFFFF" d="M0 9.437C0 4.22775 4.20281 0 9.41206 0C14.6468 0 18.8491 4.22775 18.8491 9.437C18.8491 14.6462 14.6462 18.874 9.41206 18.874C4.20281 18.874 0 14.6462 0 9.437ZM16.106 9.437C16.106 5.71247 13.187 2.64228 9.41206 2.64228C5.66261 2.64228 2.74302 5.71247 2.74302 9.437C2.74302 13.1615 5.6621 16.2063 9.41206 16.2063C13.187 16.2068 16.106 13.1615 16.106 9.437Z"/><path class="tss_ov_chase0" fill="#FFFFFF" d="M12.9117 7.96652C12.6675 8.46617 12.1663 8.81369 11.5633 8.81369C10.7172 8.81369 10.0583 8.12629 10.0583 7.28572C10.0583 6.6782 10.4048 6.15208 10.9151 5.9048C10.4587 5.70738 9.95395 5.59747 9.41817 5.59747C7.302 5.59747 5.65497 7.32999 5.65497 9.4319C5.65497 11.5338 7.30251 13.2516 9.41817 13.2516C11.5481 13.2516 13.1956 11.5333 13.1956 9.4319C13.1951 8.91393 13.0938 8.41936 12.9117 7.96652Z"/><path class="tss_ov_chase1" fill="#FFFFFF" d="M23.0686 17.0748V24.4231H20.4009V6.05237H23.0686V7.81389C23.9997 6.58052 25.5852 5.80051 27.2714 5.80051C30.568 5.80051 33.5375 8.31711 33.5375 12.3434C33.5375 16.3447 30.4673 18.8862 27.2963 18.8862C25.5598 18.8867 23.9748 18.2324 23.0686 17.0748ZM30.8698 12.3184C30.8698 10.0283 29.1332 8.2418 26.8939 8.2418C24.6037 8.2418 22.918 10.0791 22.918 12.3184C22.918 14.5832 24.6042 16.4205 26.8939 16.4205C29.1337 16.4205 30.8698 14.6086 30.8698 12.3184Z"/><path class="tss_ov_chase2" fill="#FFFFFF" d="M34.778 12.3943C34.778 8.69466 37.6217 5.80103 41.3208 5.80103C45.0453 5.80103 47.7884 8.49368 47.7884 12.2182V13.275H37.3704C37.7225 15.2126 39.2326 16.4963 41.4221 16.4963C43.1332 16.4963 44.4419 15.5901 45.0962 14.2316L47.3106 15.465C46.2034 17.5287 44.2149 18.8878 41.4221 18.8878C37.4457 18.8867 34.778 16.043 34.778 12.3943ZM37.496 10.9848H45.0458C44.6434 9.17294 43.2589 8.16651 41.3213 8.16651C39.4585 8.16651 37.9993 9.32406 37.496 10.9848Z"/><path class="tss_ov_chase3" fill="#FFFFFF" d="M49.409 6.05237H52.0767V7.68821C52.9325 6.53066 54.2916 5.80051 55.9524 5.80051C59.1233 5.80051 61.0609 7.86426 61.0609 11.2866V18.6349H58.3428V11.5135C58.3428 9.44973 57.3109 8.14106 55.2975 8.14106C53.4856 8.14106 52.1016 9.5001 52.1016 11.7145V18.6349H49.409V6.05237Z"/><path class="tss_ov_chase4" fill="#FFFFFF" d="M60.3419 0.264099H63.1856L68.1435 14.5832L73.1009 0.264099H75.9447L69.5275 18.6349H66.7595L60.3419 0.264099Z"/><path class="tss_ov_chase5" fill="#FFFFFF" d="M76.9639 0.264099H79.7069V18.6349H76.9639V0.264099Z"/><path class="tss_ov_chase6" fill="#FFFFFF" d="M82.2078 0.264099H85.3034L94.6147 14.1558V0.264099H97.3323V18.6349H94.4382L84.9508 4.51729V18.6349H82.2078V0.264099Z"/><path class="tss_ov_chase7" fill="#FFFFFF" d="M98.9503 9.44972C98.9503 4.24047 103.153 0.0127258 108.362 0.0127258C113.597 0.0127258 117.799 4.24047 117.799 9.44972C117.799 14.659 113.596 18.8867 108.362 18.8867C103.153 18.8867 98.9503 14.659 98.9503 9.44972ZM115.056 9.44972C115.056 5.72519 112.137 2.655 108.362 2.655C104.613 2.655 101.693 5.72519 101.693 9.44972C101.693 13.1743 104.612 16.219 108.362 16.219C112.137 16.219 115.056 13.1743 115.056 9.44972Z"/><path class="tss_ov_chase7" fill="#FFFFFF" d="M111.862 7.97924C111.618 8.4789 111.117 8.82642 110.514 8.82642C109.668 8.82642 109.008 8.13901 109.008 7.29845C109.008 6.69092 109.355 6.16481 109.865 5.91752C109.409 5.7201 108.904 5.6102 108.368 5.6102C106.252 5.6102 104.605 7.34272 104.605 9.44463C104.605 11.5465 106.252 13.2648 108.368 13.2648C110.498 13.2648 112.145 11.5465 112.145 9.44463C112.145 8.92666 112.044 8.43158 111.862 7.97924Z"/><path fill="#FFFFFF" d="M117.045 0.566335H116.582V0.264099H117.898V0.566335H117.435V1.97881H117.044V0.566335H117.045Z"/><path fill="#FFFFFF" d="M118.188 0.26413H118.7L119.101 1.33112L119.496 0.26413H120V1.97884H119.614V0.77498L119.139 1.97884H119.012L118.535 0.77498V1.97884H118.187V0.26413H118.188Z"/></g>`,
      'OpenVINO letters flash brand purple in reading order like inference flowing through the model, then a long static hold; final and reduced-motion frames are exactly the static wordmark',
      'Per-letter purple flash chase across the official wordmark itself (reading order, staggered); Material-style ease-out',
      '0 0 128 128'
    );
  }

  // MICROSOFTSQLSERVER — edge glow (6s, user-picked idea E).
  // The flat red grid itself stays exactly static from frame 0; only
  // an overlaid copy of the SAME path (fill none, stroke #FF7A70,
  // width 2) breathes twice in the first half (stroke-opacity
  // 0 -> 0.85 -> 0 -> 0.85 -> 0), then stays off for a static second
  // half. No clipPath (the kept container-stack-slide bands were
  // rejected because they cut the thin lattice into shearing
  // strips), no path splitting (the 36 subpaths overlap under
  // evenodd, so splitting fills the holes), no foreign shapes.
  // Reduced-motion is exactly the static grid. Catalog
  // motionRecipe.family stays container-stack-slide per the
  // no-new-family-names convention for bespoke branches.
  if (item.id === 'microsoftsqlserver') {
    return wrapSvg(
      '',
      `.tss_microsoftsqlserver_glow{stroke-opacity:0;animation:tss_microsoftsqlserver_glow 6s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_microsoftsqlserver_glow{0%{stroke-opacity:0}10%{stroke-opacity:0.85}20%{stroke-opacity:0}30%{stroke-opacity:0.85}40%,100%{stroke-opacity:0}}`,
      `.tss_microsoftsqlserver_glow{animation:none!important;stroke-opacity:0!important}`,
      `<path fill="${primary}" fill-rule="evenodd" d="${d}"/><path class="tss_microsoftsqlserver_glow" fill="none" stroke="#FF7A70" stroke-width="2" stroke-linejoin="round" d="${d}"/>`,
      'Flat red grid exactly static; a same-path light edge breathes twice, then a long static hold; final and reduced-motion frames are exactly the static grid',
      'Overlaid same-path stroke breathing (opacity only, no movement, no clipping)',
      '0 0 128 128'
    );
  }

  // FREERTOS — sequential 5-group draw (12s, user-approved variant B5).
  // The glyph is chunky filled shapes, not line art, so a single-path
  // trace draws all 10 subpaths in parallel and never reads as a
  // drawing completing (the user's "chưa vẽ xong hết đã hết" report
  // on B4). B5 instead draws 5 groups in order — chip square, pins,
  // arc, 3 nodes, traces — over 0–46% of a 12s loop, then the fill
  // layer solidifies 44–52% while the trace strokes fade to 0 (so
  // the solid frame is exactly the static glyph, no bold outline
  // left over — the "đậm" defect of B/B2). The fill layer is the
  // verbatim single catalog path, never split, so the evenodd holes
  // survive exactly. Solid hold 52–70%, fade 70–84%, invisible
  // 84–100% so the next loop restarts invisibly (seamless infinite
  // loop, the user's "infi" request). Green tile static throughout.
  // No clipPath, no foreign shapes. Reduced-motion is exactly the
  // static glyph. Catalog motionRecipe.family stays orbital-spin
  // per the no-new-family-names convention for bespoke branches.
  if (item.id === 'freertos') {
    return wrapSvg(
      '<defs><linearGradient id="tss_freertos_g" x1="0%" y1="100%" x2="100%" y2="0%"><stop stop-color="#1B660F" offset="0%"/><stop stop-color="#6CAE3E" offset="100%"/></linearGradient></defs>',
      `.tss_freertos_g1{fill:none;stroke:#FFFFFF;stroke-width:1.6;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;stroke-opacity:1;pathLength:100;animation:tss_freertos_g1 12s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_freertos_g1{0%{stroke-dashoffset:100;stroke-opacity:1}10%{stroke-dashoffset:0;stroke-opacity:1}44%{stroke-opacity:1}52%,100%{stroke-dashoffset:0;stroke-opacity:0}}.tss_freertos_g2{fill:none;stroke:#FFFFFF;stroke-width:1.6;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;stroke-opacity:1;pathLength:100;animation:tss_freertos_g2 12s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_freertos_g2{8%{stroke-dashoffset:100;stroke-opacity:1}20%{stroke-dashoffset:0;stroke-opacity:1}44%{stroke-opacity:1}52%,100%{stroke-dashoffset:0;stroke-opacity:0}}.tss_freertos_g3{fill:none;stroke:#FFFFFF;stroke-width:1.6;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;stroke-opacity:1;pathLength:100;animation:tss_freertos_g3 12s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_freertos_g3{18%{stroke-dashoffset:100;stroke-opacity:1}30%{stroke-dashoffset:0;stroke-opacity:1}44%{stroke-opacity:1}52%,100%{stroke-dashoffset:0;stroke-opacity:0}}.tss_freertos_g4{fill:none;stroke:#FFFFFF;stroke-width:1.6;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;stroke-opacity:1;pathLength:100;animation:tss_freertos_g4 12s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_freertos_g4{28%{stroke-dashoffset:100;stroke-opacity:1}38%{stroke-dashoffset:0;stroke-opacity:1}44%{stroke-opacity:1}52%,100%{stroke-dashoffset:0;stroke-opacity:0}}.tss_freertos_g5{fill:none;stroke:#FFFFFF;stroke-width:1.6;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;stroke-opacity:1;pathLength:100;animation:tss_freertos_g5 12s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_freertos_g5{36%{stroke-dashoffset:100;stroke-opacity:1}46%{stroke-dashoffset:0;stroke-opacity:1}44%{stroke-opacity:1}52%,100%{stroke-dashoffset:0;stroke-opacity:0}}.tss_freertos_fill{fill-opacity:0;animation:tss_freertos_fill 12s cubic-bezier(0.22,1,0.36,1) infinite}@keyframes tss_freertos_fill{0%,44%{fill-opacity:0}52%,70%{fill-opacity:1}84%,100%{fill-opacity:0}}`,
      `.tss_freertos_g1,.tss_freertos_g2,.tss_freertos_g3,.tss_freertos_g4,.tss_freertos_g5{animation:none!important;stroke-dashoffset:0!important;stroke-opacity:0!important}.tss_freertos_fill{animation:none!important;fill-opacity:1!important}`,
      `<g transform="scale(1.6)"><rect x="0" y="0" width="80" height="80" fill="url(#tss_freertos_g)"/><path class="tss_freertos_fill" fill="#FFFFFF" fill-rule="evenodd" d="${d}"/><path class="tss_freertos_g1" d="M18,61 L62,61 L62,20 L18,20 L18,61 Z "/><path class="tss_freertos_g2" d="M68,23 L68,21 L64,21 L64,19 C64,18.448 63.552,18 63,18 L17,18 C16.447,18 16,18.448 16,19 L16,21 L12,21 L12,23 L16,23 L16,27 L12,27 L12,29 L16,29 L16,33 L12,33 L12,35 L16,35 L16,39 L12,39 L12,41 L16,41 L16,45 L12,45 L12,47 L16,47 L16,51 L12,51 L12,53 L16,53 L16,57 L12,57 L12,59 L16,59 L16,62 C16,62.553 16.447,63 17,63 L63,63 C63.552,63 64,62.553 64,62 L64,59 L68,59 L68,57 L64,57 L64,53 L68,53 L68,51 L64,51 L64,47 L68,47 L68,45 L64,45 L64,41 L68,41 L68,39 L64,39 L64,35 L68,35 L68,33 L64,33 L64,29 L68,29 L68,27 L64,27 L64,23 L68,23 Z"/><path class="tss_freertos_g3" d="M27.775,44.486 C28.254,45.738 28.91,46.907 29.735,47.932 C29.807,48.033 29.891,48.133 29.967,48.222 C31.314,49.842 33.059,51.11 35,51.903 L35,57 L37,57 L37,52.555 C37.652,52.711 38.318,52.819 39,52.87 L39,57 L41,57 L41,52.87 C41.682,52.819 42.348,52.711 43,52.556 L43,57 L45,57 L45,51.903 C48.307,50.537 50.943,47.806 52.215,44.487 C54.624,44.401 56.559,42.429 56.559,40 C56.559,37.617 54.692,35.68 52.345,35.527 C51.047,31.802 48.172,28.893 44.473,27.546 C44.328,25.195 42.387,23.32 40,23.32 C37.612,23.32 35.672,25.195 35.525,27.547 C31.829,28.895 28.953,31.807 27.656,35.527 C25.308,35.678 23.44,37.616 23.44,40 C23.44,42.425 25.371,44.395 27.775,44.486 L27.775,44.486 Z "/><path class="tss_freertos_g4" d="M40,25.32 C41.38,25.32 42.502,26.443 42.502,27.823 C42.502,29.203 41.38,30.325 40,30.325 C38.62,30.325 37.498,29.203 37.498,27.823 C37.498,26.443 38.62,25.32 40,25.32 L40,25.32 Z M27.943,37.498 C29.323,37.498 30.445,38.621 30.445,40 C30.445,41.38 29.323,42.503 27.943,42.503 C26.563,42.503 25.44,41.38 25.44,40 C25.44,38.621 26.563,37.498 27.943,37.498 L27.943,37.498 Z M54.559,40 C54.559,41.38 53.436,42.503 52.056,42.503 C50.676,42.503 49.554,41.38 49.554,40 C49.554,38.621 50.676,37.498 52.056,37.498 C53.436,37.498 54.559,38.621 54.559,40 L54.559,40 Z "/><path class="tss_freertos_g5" d="M35.847,29.558 C36.402,30.881 37.574,31.878 39,32.205 L39,50.868 C38.322,50.807 37.651,50.68 37,50.495 L37,40 C37,39.448 36.552,39 36,39 L32.324,39 C31.998,37.571 30.996,36.397 29.667,35.844 C30.773,32.975 33,30.709 35.847,29.558 L35.847,29.558 Z M50.334,35.844 C49.005,36.397 48.002,37.571 47.675,39 L44,39 C43.447,39 43,39.448 43,40 L43,50.496 C42.35,50.681 41.679,50.807 41,50.868 L41,32.205 C42.425,31.878 43.598,30.88 44.153,29.556 C47.001,30.706 49.226,32.971 50.334,35.844 L50.334,35.844 Z M45,49.7 L45,41 L47.675,41 C47.993,42.39 48.951,43.533 50.224,44.104 C49.213,46.507 47.343,48.51 45,49.7 L45,49.7 Z M31.496,46.932 C31.448,46.875 31.399,46.82 31.326,46.721 C30.681,45.918 30.159,45.043 29.765,44.109 C31.045,43.54 32.005,42.393 32.324,41 L35,41 L35,49.697 C33.662,49.023 32.461,48.092 31.496,46.932 L31.496,46.932 Z "/></g>`,
      'FreeRTOS chip draws itself in 5 sequential groups (frame, pins, arc, nodes, traces), then holds solid and loops seamlessly; final and reduced-motion frames are exactly the static glyph',
      'Sequential staggered stroke draw on grouped subpaths + verbatim single-path fill layer; Material-style ease-out',
      '0 0 128 128'
    );
  }

  // MATTER — breathing loop (8s, user-approved demo B2). The first
  // assemble-once version finished in 1.5s and then sat static for
  // 4.5s, which read as play-once-then-sit with a snap restart (the
  // user's "chưa có tính lặp lại và hơi nhanh" report). This version
  // breathes continuously: the three arrows slide together and apart
  // on an 8s symmetric ease-in-out cycle, phase-staggered across the
  // loop (top, bottom-left, bottom-right) so the wave runs without
  // pause. The mark stays 100% visible throughout — no fade, no
  // empty frames — and first frame = last frame = exact static mark,
  // so the loop restarts seamlessly. Splitting is safe: the three
  // arrows are disjoint closed loops (verified M...Z each,
  // non-overlapping bboxes), so no evenodd hole can break. No
  // clipPath, no foreign shapes. Reduced-motion is exactly the
  // static mark. Catalog motionRecipe.family stays
  // segmented-assembly per the no-new-family-names convention.
  if (item.id === 'matter') {
    return wrapSvg(
      '',
      `.tss_matter_breathe{animation:tss_matter_breathe 8s ease-in-out infinite}@keyframes tss_matter_breathe{0%,100%{transform:translate(0,0)}50%{transform:translate(var(--tx),var(--ty))}}`,
      `.tss_matter_breathe{animation:none!important;transform:none!important}`,
      `<g transform="translate(0,1.46) scale(1.7228)"><path class="tss_matter_breathe" style="--tx:0px;--ty:-6px;animation-delay:0s" fill="#FFFFFF" d="M37.161,0.000L32.858,2.484L32.858,23.622C28.812,22.891 25.122,21.146 22.054,18.661L14.216,23.183C20.111,29.013 28.216,32.612 37.162,32.612S54.213,29.013 60.108,23.183L52.273,18.661A23.920,23.920 0 0,1 41.466,23.622L41.466,2.484Z"/><path class="tss_matter_breathe" style="--tx:-4px;--ty:4px;animation-delay:-2.67s" fill="#FFFFFF" d="M8.607,32.905L8.607,41.950A23.910,23.910 0 0,1 18.306,48.829L0.000,59.398L0.000,64.365L4.303,66.852L22.609,56.283C23.999,60.151 24.335,64.221 23.717,68.119L31.549,72.645C33.650,64.625 32.716,55.804 28.243,48.058A32.520,32.520 0 0,0 8.607,32.905Z"/><path class="tss_matter_breathe" style="--tx:4px;--ty:4px;animation-delay:-5.33s" fill="#FFFFFF" d="M65.715,32.905C57.719,35.095 50.551,40.311 46.079,48.057S40.672,64.625 42.773,72.644L50.608,68.118A23.900,23.900 0 0,1 51.713,56.282L70.022,66.851L74.325,64.364L74.325,59.397L56.016,48.829A23.920,23.920 0 0,1 65.715,41.950Z"/></g>`,
      'Matter mark breathes: the three arrows slide together and apart in a continuous 8s loop, phase-staggered; first, last and reduced-motion frames are exactly the static mark',
      'Phase-staggered translate loop on the three arrow loops (CSS vars for direction); symmetric ease-in-out',
      '0 0 128 128'
    );
  }

  // CARGO — Light sweep v4: the logo itself NEVER moves. v3's whole-stack
  // drop read as very ugly, so v4 changes style completely: a soft band
  // of light sweeps across the golden crates once per 10s loop, then the
  // exact static logo holds. The band is a gradient polygon clipped to
  // the logo's own silhouette (the v3 stack + pallet clips, same real PNG
  // only, no redrawn shapes, no moving pieces, no vanishing). Light on
  // gold is the natural beautiful motion for golden crates, and it stays
  // fully legible at 48px. First frame = last frame = exact logo (band
  // off-frame at both ends, invisible); reduced-motion = full logo static
  // with the band hidden.
  if (item.id === 'cargo') {
    return wrapSvg(
      `<image id="tss_cargo_img" href="${CARGO_PNG_DATA_URI}" width="306" height="275"/><clipPath id="tss_cargo_clip_stack"><polygon points="209.5,46 152,26 94.5,46 94.5,85 141.5,68.7 141.5,63 199,43 209.5,46.7"/><polygon points="256.5,123 256.5,63 199,43 141.5,63 141.5,68.7 152,65 209.5,85 209.5,110.7 250.8,125"/><polygon points="37.5,131.5 37.5,191.5 95,211.5 100,209.8 100,169 131.8,158 94.5,145 94.5,111.7"/><polygon points="42.5,149 42.5,209 100,229 157.5,209 157.5,192.6 141.5,187 141.5,161.3 152,165 94.5,145 94.5,130.9"/><polygon points="141.5,187 199,207 256.5,187 256.5,127 209.5,110.7 209.5,145 152,165 141.5,161.3"/><polygon points="94.5,85 152,65 209.5,85 209.5,145 152,165 94.5,145"/></clipPath><clipPath id="tss_cargo_clip_pallet"><polygon points="15,185 15,262 292,262 292,185 256.5,185 256.5,187 199,207 141.5,187 157.5,192.6 157.5,209 100,229 42.5,209 42.5,193.2 37.5,191.5 37.5,185"/></clipPath><linearGradient id="tss_cargo_shine_g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="25%" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="75%" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>`,
      '@keyframes tss_cargo_shine{0%{transform:translateX(-160px)}35%{transform:translateX(340px)}100%{transform:translateX(340px)}}.tss_cargo_shine{animation:tss_cargo_shine 10s linear infinite}',
      '.tss_cargo_shine{animation:none!important;opacity:0!important}',
      '<g transform="translate(0,6.4837) scale(0.4183)"><use href="#tss_cargo_img"/><g clip-path="url(#tss_cargo_clip_stack)"><polygon class="tss_cargo_shine" points="-60,-10 190,-10 150,285 -100,285" fill="url(#tss_cargo_shine_g)"/></g><g clip-path="url(#tss_cargo_clip_pallet)"><polygon class="tss_cargo_shine" points="-60,-10 190,-10 150,285 -100,285" fill="url(#tss_cargo_shine_g)"/></g></g>',
      'Light sweep over golden crates: a soft band of light passes across the real logo once per loop, then holds static; the mark itself never moves or vanishes',
      'Real PNG + silhouette clips (stack + pallet regions) + gradient light band sweeping once per 10s loop; no redrawn shapes, no moving pieces',
      '0 0 128 128'
    );
  }

  // VCPKG — cycle assembly (8s): the four gradient swooshes fly in
  // one by one clockwise around the cycle (top, right, bottom, left),
  // then the exact static mark holds for the second half. No clipPath,
  // no foreign shapes; reduced-motion is exactly the static mark.
  // Catalog motionRecipe.family stays segmented-assembly per the
  // no-new-family-names convention.
  if (item.id === 'vcpkg') {
    return wrapSvg(
      `<linearGradient id="tss_vcpkg_g0" x1="2.595" y1="62.941" x2="111.016" y2="-3.631" gradientUnits="userSpaceOnUse"><stop stop-color="#FC950B"/><stop offset="0.592076" stop-color="#F9C438"/></linearGradient><linearGradient id="tss_vcpkg_g1" x1="45.142" y1="32.699" x2="2.621" y2="82.919" gradientUnits="userSpaceOnUse"><stop stop-color="#FC950B"/><stop offset="1" stop-color="#F9C438"/></linearGradient><linearGradient id="tss_vcpkg_g2" x1="138.306" y1="79.548" x2="16.770" y2="117.889" gradientUnits="userSpaceOnUse"><stop stop-color="#FC950B"/><stop offset="0.612893" stop-color="#F9C438"/></linearGradient><linearGradient id="tss_vcpkg_g3" x1="112.998" y1="107.652" x2="101.581" y2="16.856" gradientUnits="userSpaceOnUse"><stop stop-color="#FC950B"/><stop offset="1" stop-color="#F9C438"/></linearGradient>`,
      `@keyframes tss_vcpkg_in_top{0%{opacity:0;transform:translate(0,-10px)}8%,100%{opacity:1;transform:translate(0,0)}}@keyframes tss_vcpkg_in_right{0%,12%{opacity:0;transform:translate(10px,0)}20%,100%{opacity:1;transform:translate(0,0)}}@keyframes tss_vcpkg_in_bottom{0%,24%{opacity:0;transform:translate(0,10px)}32%,100%{opacity:1;transform:translate(0,0)}}@keyframes tss_vcpkg_in_left{0%,36%{opacity:0;transform:translate(-10px,0)}44%,100%{opacity:1;transform:translate(0,0)}}.tss_vcpkg_in_top{animation:tss_vcpkg_in_top 8s ease-out infinite}.tss_vcpkg_in_right{animation:tss_vcpkg_in_right 8s ease-out infinite}.tss_vcpkg_in_bottom{animation:tss_vcpkg_in_bottom 8s ease-out infinite}.tss_vcpkg_in_left{animation:tss_vcpkg_in_left 8s ease-out infinite}`,
      `.tss_vcpkg_in_top,.tss_vcpkg_in_right,.tss_vcpkg_in_bottom,.tss_vcpkg_in_left{animation:none!important;opacity:1!important;transform:none!important}`,
      `<path class="tss_vcpkg_in_top" fill="url(#tss_vcpkg_g0)" d="M58.18296 40.42368C31.58112 31.0004 12.56144 43.0024 1.54161 56.81896C1.12394 57.32832 0.32075 57.00992 0.41713 56.34144C1.05969 52.68032 2.5697 45.51736 5.52546 38.95928C17.54128 12.31304 49.5084 -0.64394 68.52808 0.0246C87.548 0.69314 110.3264 13.1408 102.4232 30.71392C95.4512 46.2496 86.0056 50.29264 58.18296 40.42368Z"/><path class="tss_vcpkg_in_left" fill="url(#tss_vcpkg_g1)" d="M38.23552 39.98496C38.23552 39.63472 37.97848 39.3164 37.59296 39.3164C28.75784 39.53928 9.96312 45.39696 0.22836 63.09744C0.19623 63.16112 0.1641 63.2248 0.1641 63.32032C-2.85591 84.4912 36.78976 98.3072 38.23552 39.98496Z"/><path class="tss_vcpkg_in_bottom" fill="url(#tss_vcpkg_g2)" d="M69.92904 87.576C96.5312 96.9992 115.5504 84.9976 126.5704 71.18096C126.988 70.6716 127.7912 70.98992 127.6944 71.65848C127.052 75.3196 125.5424 82.4824 122.5864 89.0408C110.6024 115.6872 78.63568 128.644 59.616 127.9752C40.59632 127.3064 17.81776 114.8592 25.7212 97.2856C32.6608 81.7824 42.13848 77.73904 69.92904 87.576Z"/><path class="tss_vcpkg_in_right" fill="url(#tss_vcpkg_g3)" d="M89.7 88.56C89.7 88.9104 89.9576 89.2288 90.3424 89.2288C99.1776 89.0064 118.0368 82.8616 127.772 65.12952C127.804 65.06584 127.836 65.00216 127.836 64.90664C130.856 43.76792 91.1456 30.23792 89.7 88.56Z"/>`,
      'Cycle assembly: the four gradient swooshes fly in clockwise around the cycle, then the exact static mark holds',
      'Four staggered translate+fade entrances (top, right, bottom, left) baked into 8s keyframe windows; static second half',
      '0 0 128 128'
    );
  }

  // INFINEON — wordmark assembly (8s): the lowercase letters fade
  // in left to right, then the red arc sweeps in to complete the
  // mark; the exact static logo holds for the second half. No
  // clipPath, no foreign shapes; reduced-motion is exactly the
  // static mark. Catalog motionRecipe.family stays orbital-spin
  // per the no-new-family-names convention.
  if (item.id === 'infineon') {
    return wrapSvg(
      ``,
      `@keyframes tss_infineon_in_l0{0%,0%{opacity:0;transform:translateY(3px)}6%,100%{opacity:1;transform:translateY(0)}}@keyframes tss_infineon_in_l1{0%,6%{opacity:0;transform:translateY(3px)}12%,100%{opacity:1;transform:translateY(0)}}@keyframes tss_infineon_in_l2{0%,12%{opacity:0;transform:translateY(3px)}18%,100%{opacity:1;transform:translateY(0)}}@keyframes tss_infineon_in_l3{0%,18%{opacity:0;transform:translateY(3px)}24%,100%{opacity:1;transform:translateY(0)}}@keyframes tss_infineon_in_l4{0%,24%{opacity:0;transform:translateY(3px)}30%,100%{opacity:1;transform:translateY(0)}}@keyframes tss_infineon_in_l5{0%,30%{opacity:0;transform:translateY(3px)}36%,100%{opacity:1;transform:translateY(0)}}@keyframes tss_infineon_in_l6{0%,36%{opacity:0;transform:translateY(3px)}42%,100%{opacity:1;transform:translateY(0)}}@keyframes tss_infineon_in_l7{0%,42%{opacity:0;transform:translateY(3px)}48%,100%{opacity:1;transform:translateY(0)}}@keyframes tss_infineon_in_arc{0%,48%{opacity:0;transform:translate(-6px,0)}58%,100%{opacity:1;transform:translate(0,0)}}.tss_infineon_in_l0{animation:tss_infineon_in_l0 8s ease-out infinite}.tss_infineon_in_l1{animation:tss_infineon_in_l1 8s ease-out infinite}.tss_infineon_in_l2{animation:tss_infineon_in_l2 8s ease-out infinite}.tss_infineon_in_l3{animation:tss_infineon_in_l3 8s ease-out infinite}.tss_infineon_in_l4{animation:tss_infineon_in_l4 8s ease-out infinite}.tss_infineon_in_l5{animation:tss_infineon_in_l5 8s ease-out infinite}.tss_infineon_in_l6{animation:tss_infineon_in_l6 8s ease-out infinite}.tss_infineon_in_l7{animation:tss_infineon_in_l7 8s ease-out infinite}.tss_infineon_in_arc{animation:tss_infineon_in_arc 8s ease-out infinite}`,
      `.tss_infineon_in_l0,.tss_infineon_in_l1,.tss_infineon_in_l2,.tss_infineon_in_l3,.tss_infineon_in_l4,.tss_infineon_in_l5,.tss_infineon_in_l6,.tss_infineon_in_l7,.tss_infineon_in_arc{animation:none!important;opacity:1!important;transform:none!important}`,
      `<g transform="translate(0,35.76) scale(0.12598)"><g transform="translate(-7.07 -358.2)"><g transform="translate(3.539 3.545)"><path class="tss_infineon_in_arc" fill="#EC1840" d="m305.2 372.9s-23.65 3.864-48.92 10.39c-19.11 4.908-32.32 9.033-37.28 10.6v-0.1566c-7.257 2.245-14.31 4.647-21.25 7.048 7.048 6.944 11.49 16.5 11.85 27.05 5.639-2.454 11.33-4.856 17.18-7.205v-0.0522c6.526-2.35 24.17-8.771 39.37-13.89 18.95-6.422 44.69-14.31 44.69-14.31 74.92-20.68 157.9-32.68 235.2-32.11-89.12-5.326-170.2-0.1566-240.8 12.64m709.3 281.9c-80.2 72.83-262.9 115.3-471.6 115.3-283.5 0-466.7-83.17-479.5-193.2-4.751-41.35 27.83-81.34 81.97-115.5-9.555-7.205-15.77-18.53-16.03-31.33-78.16 40.99-122.4 94.92-122.4 149.7 0 121.2 216.8 224 538.9 219.5 219.1-3.028 385.6-65.52 469.8-142l-1.253-2.454"/><path class="tss_infineon_in_l0" fill="#0066B3" d="m140 429.3c0-16.34 13.21-29.6 29.55-29.6 16.34 0 29.6 13.26 29.6 29.6s-13.26 29.55-29.6 29.55c-16.34 0-29.55-13.21-29.55-29.55"/><path class="tss_infineon_in_l0" fill="#0066B3" d="m156.5 651.8v-169.6l27.88-3.707v173.3h-27.88"/><path class="tss_infineon_in_l1" fill="#0066B3" d="m278.1 651.8v-97.06c0-11.07-0.992-15.61-3.185-18.74-1.984-2.819-5.43-3.655-9.137-3.655-5.378 0-13.47 4.542-20.15 12.74v106.7h-27.72v-105.8c0-17.33-2.245-26.99-3.707-34.93l26.05-6.787c0.731 2.558 3.185 9.607 3.446 17.02 7.101-8.824 20.15-16.19 32.89-16.19 9.868 0 17.7 3.968 22.61 10.23 5.691 7.101 6.631 16.71 6.631 26.37v110.1h-27.72"/><path class="tss_infineon_in_l2" fill="#0066B3" d="m396.5 472.4c-3.185-2.558-8.354-4.229-13.26-4.229-6.892 0-11.07 6.526-11.07 17.6v22.09h26.05l-5.169 24.43h-20.88v119.5h-28.51v-119.5h-9.555v-24.43h9.555s-0.4699-9.92-0.4699-19c0-21.56 7.101-32.89 13.73-38.58 6.683-5.378 14.25-7.101 21.41-7.101 10.29 0 18.69 2.297 26.05 7.675l-7.884 21.56"/><path class="tss_infineon_in_l3" fill="#0066B3" d="m419.6 651.8v-143l28.25-3.707v146.7h-28.25zm13.52-164c-10.08 0-18.17-8.197-18.17-18.43 0-10.18 8.354-18.38 18.64-18.38 10.08 0 18.22 8.197 18.22 18.38 0 10.23-8.354 18.43-18.69 18.43"/><path class="tss_infineon_in_l4" fill="#0066B3" d="m543.6 651.8v-97.06c0-11.07-0.9398-15.61-3.185-18.74-1.932-2.819-5.378-3.655-9.085-3.655-5.43 0-13.52 4.542-20.15 12.74v106.7h-27.78v-105.8c0-17.33-2.193-26.99-3.655-34.93l26.05-6.787c0.731 2.558 3.185 9.607 3.446 17.02 7.101-8.824 20.1-16.19 32.89-16.19 9.816 0 17.7 3.968 22.61 10.23 5.639 7.101 6.631 16.71 6.631 26.37v110.1h-27.78"/><path class="tss_infineon_in_l5" fill="#0066B3" d="m660 538c-2.715-6.526-7.153-10.49-14.25-10.49-12.53 0-17.96 11.64-18.43 37.17h35.87c0-11.33-0.992-20.99-3.185-26.68zm-32.68 49.65v2.872c0 9.346 0.7309 17.86 4.177 25.27 4.177 8.771 11.28 13.63 19.89 13.63 10.08 0 18.69-5.117 27.31-14.2l11.02 20.68c-12.27 13.37-25.53 19.32-40.78 19.32-32.68 0-51.38-28.09-51.38-75.76 0-24.7 4.229-42.87 13.31-56.49 8.563-12.74 20.36-19 34.62-19 13.52 0 24.33 5.43 31.95 15.35 10.08 13.05 13.99 30.65 13.99 62.13v6.213h-64.12"/><path class="tss_infineon_in_l6" fill="#0066B3" d="m758.7 529.5c-18.69 0-18.69 34.04-18.69 48.82 0 15.61-0.4699 51.64 19.42 51.64 18.43 0 18.43-36.03 18.43-51.06 0-15.61 0.731-49.39-19.16-49.39zm0 126c-38.32 0-48.4-40.83-48.66-76.02-0.2611-35.5 12.53-75.5 48.92-75.5 28.72 0 49.34 25.84 49.34 74.92 0 36.6-12.01 76.59-49.6 76.59"/><path class="tss_infineon_in_l7" fill="#0066B3" d="m891.9 651.8v-97.06c0-11.07-0.992-15.61-3.237-18.74-1.932-2.819-5.378-3.655-9.085-3.655-5.378 0-13.52 4.542-20.15 12.74v106.7h-27.72v-105.8c0-17.33-2.245-26.99-3.707-34.93l26.05-6.787c0.731 2.558 3.185 9.607 3.446 17.02 7.101-8.824 20.1-16.19 32.89-16.19 9.816 0 17.7 3.968 22.61 10.23 5.639 7.101 6.631 16.71 6.631 26.37v110.1h-27.72"/></g></g></g>`,
      'Wordmark assembly: the lowercase letters fade in left to right, then the red arc sweeps in to complete the mark; exact static hold in the second half',
      'Nine staggered opacity+translate entrances baked into 8s keyframe windows (letters, then arc); static second half',
      '0 0 128 128'
    );
  }

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
    // Clip bands must span the real viewBox, not a hardcoded 24 box:
    // for 24-unit entries this is byte-identical; for the 128-unit
    // microsoftsqlserver grid the old math produced a 24-wide sliver
    // and a negative third-band height.
    const vbParts = (item.svgViewBox || '0 0 24 24').split(' ');
    const boxW = Number(vbParts[2]);
    const boxH = Number(vbParts[3]);
    const ownStrokes = buildOwnSubpathStrokes('0.55');
    return wrapSvg(
      `<clipPath id="${c1}"><rect x="0" y="0" width="${boxW}" height="${y1}"/></clipPath><clipPath id="${c2}"><rect x="0" y="${y1 - 0.15}" width="${boxW}" height="${Number((y2 - y1 + 0.3).toFixed(2))}"/></clipPath><clipPath id="${c3}"><rect x="0" y="${y2 - 0.15}" width="${boxW}" height="${Number((boxH - y2 + 0.15).toFixed(2))}"/></clipPath>`,
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
    animSvg.includes('viewBox="0 0 18 18"') ||
    animSvg.includes('viewBox="0 0 32 32"') ||
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
