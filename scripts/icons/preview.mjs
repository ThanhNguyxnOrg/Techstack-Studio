// Preview tools for authoring stories.
//
//   node scripts/icons/preview.mjs inspect docker git      -> .preview/inspect.html (numbered parts)
//   node scripts/icons/preview.mjs frames docker git       -> .preview/frames.html  (live + timeline frames)
//   node scripts/icons/preview.mjs sheet [category|all]    -> .preview/sheet.html   (live grid of built files)

import fs from 'node:fs';
import path from 'node:path';
import { loadArt, staticSvg } from './art.mjs';
import { buildIcon, T } from './engine.mjs';
import { loadStories } from './stories/index.mjs';

const catalog = JSON.parse(fs.readFileSync('src/data/generatedCatalog.json', 'utf8'));
const byId = Object.fromEntries(catalog.map((c) => [c.id, c]));
const outDir = path.resolve('.preview');
fs.mkdirSync(outDir, { recursive: true });

const [mode = 'frames', ...rest] = process.argv.slice(2);
const stories = await loadStories();
const ids = rest.length ? rest : Object.keys(stories);

const page = (
  title,
  body,
  extraCss = ''
) => `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>
body{margin:0;background:#0b0f17;color:#9aa4b2;font:11px/1.4 ui-monospace,Consolas,monospace}
.row{display:flex;gap:6px;align-items:center;padding:6px 10px;border-bottom:1px solid #1b2230}
.name{width:120px;color:#e6edf3}
.tile{background:#131822;border:1px solid #242e3e;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2px}
.tile svg{display:block}
.cap{font-size:9px;color:#6b7686}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:6px;padding:10px}
.light .tile{background:#f6f8fa;border-color:#d0d7de}
${extraCss}</style></head><body>${body}</body></html>`;

if (mode === 'inspect') {
  const blocks = ids.map((id) => {
    const art = loadArt(id, { split: stories[id]?.split, frame: stories[id]?.frame });
    const svg = staticSvg(art, id).replace('<svg ', '<svg width="320" height="320" ');
    const labels = art.parts
      .map(
        (p) =>
          `<text x="${p.center[0].toFixed(2)}" y="${p.center[1].toFixed(2)}" font-size="1.1" text-anchor="middle" dominant-baseline="middle" fill="#fff" stroke="#000" stroke-width=".25" paint-order="stroke">${p.i}</text>` +
          (p.box
            ? `<rect x="${p.box.minX}" y="${p.box.minY}" width="${p.box.width}" height="${p.box.height}" fill="none" stroke="#ff0" stroke-width=".05" opacity=".5"/>`
            : '')
      )
      .join('');
    const annotated = svg.replace(/<\/svg>$/, `${labels}</svg>`);
    const table = art.parts
      .map(
        (p) =>
          `${String(p.i).padStart(3)} ${p.tag.padEnd(7)} fill=${String(p.fill).slice(0, 22).padEnd(22)} box=${p.box ? [p.box.minX, p.box.minY, p.box.width, p.box.height].map((v) => v.toFixed(1)).join(',') : '-'} area=${p.area24.toFixed(1)}`
      )
      .join('\n');
    return `<div class="row"><div class="name">${id}</div><div class="tile">${annotated}</div><pre>${table}</pre></div>`;
  });
  fs.writeFileSync(path.join(outDir, 'inspect.html'), page('inspect', blocks.join('')));
  for (const id of ids) {
    const art = loadArt(id, { split: stories[id]?.split });
    console.log(`\n# ${id}: ${art.parts.length} parts`);
    for (const p of art.parts)
      console.log(
        `${String(p.i).padStart(3)} ${p.tag.padEnd(7)} ${String(p.fill).slice(0, 24).padEnd(24)} c=(${p.center.map((v) => v.toFixed(1)).join(',')}) ${p.box ? `${p.box.width.toFixed(1)}x${p.box.height.toFixed(1)}` : ''} a=${p.area24.toFixed(1)}`
      );
  }
} else if (mode === 'frames') {
  const times = [0, 0.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2, 4.8, 5.4];
  const css = times
    .map(
      (t, i) => `.f${i} *{animation-delay:-${t}s!important;animation-play-state:paused!important}`
    )
    .join('');
  const rows = ids.map((id) => {
    const item = byId[id];
    if (!item) return `<div class="row">${id}: not in catalog</div>`;
    let built;
    try {
      built = buildIcon(item, stories[id] || { story: 'static', tracks: [] });
    } catch (e) {
      return `<div class="row"><div class="name">${id}</div><pre style="color:#f88">${e.stack}</pre></div>`;
    }
    const sized = (s, px) => s.replace('<svg ', `<svg width="${px}" height="${px}" `);
    const cells = [
      `<div class="tile" style="width:110px;height:110px">${sized(built.animatedSvg, 72)}<span class="cap">live</span></div>`,
      `<div class="tile" style="width:110px;height:110px">${sized(built.animatedSvg, 32)}<span class="cap">32px</span></div>`,
      ...times.map(
        (t, i) =>
          `<div class="tile f${i}" style="width:84px;height:96px">${sized(built.animatedSvg, 64)}<span class="cap">${t}s</span></div>`
      ),
      `<div class="tile" style="width:84px;height:96px">${sized(built.sourceSvg, 64)}<span class="cap">static</span></div>`,
    ];
    return `<div class="row"><div class="name">${id}<br><span class="cap">${(built.concept || '').slice(0, 140)}</span></div>${cells.join('')}</div>`;
  });
  fs.writeFileSync(path.join(outDir, 'frames.html'), page('frames', rows.join(''), css));
  console.log(`wrote .preview/frames.html (${ids.length} icons, T=${T}s)`);
} else if (mode === 'sheet') {
  const filter = rest[0] && rest[0] !== 'all' ? rest[0].toLowerCase() : null;
  const list = catalog.filter(
    (c) => !filter || c.category.toLowerCase().includes(filter) || c.id === filter
  );
  const kind = rest.includes('--source') ? 'source' : 'animated';
  const cells = list
    .map((c) => {
      const svg = fs
        .readFileSync(`public/icons/${kind}/${c.id}.svg`, 'utf8')
        .replace('<svg ', '<svg width="48" height="48" ');
      return `<div class="tile" style="height:84px">${svg}<span class="cap">${c.id}</span></div>`;
    })
    .join('');
  fs.writeFileSync(
    path.join(outDir, 'sheet.html'),
    page('sheet', `<div class="grid">${cells}</div>`)
  );
  console.log(`wrote .preview/sheet.html (${list.length})`);
}
