import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://thanhnguyxnorg.github.io/Techstack-Studio';

const catalogPath = path.resolve('src/data/generatedCatalog.json');
const manifestPath = path.resolve('docs/animation/animation-manifest.json');
const partsPath = path.resolve('src/data/standaloneSvgParts.json');

if (!fs.existsSync(catalogPath) || !fs.existsSync(manifestPath)) {
  console.error('Run `npm run generate` first: catalog or manifest is missing.');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const parts = fs.existsSync(partsPath) ? JSON.parse(fs.readFileSync(partsPath, 'utf8')) : {};

const animations = new Map((manifest.entries || []).map((entry) => [entry.id, entry]));

const icons = catalog
  .map((item) => {
    const part = parts[item.id] || {};
    const motion = animations.get(item.id) || {};
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      role: item.role,
      docsUrl: item.docsUrl,
      monogram: item.monogram,
      brandColor: item.brandColor,
      svg: `icons/animated/${item.id}.svg`,
      sourceSvg: `icons/source/${item.id}.svg`,
      concept: part.concept || motion.animationConcept || null,
      technique: part.technique || motion.animationTechnique || null,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

const catalogPayload = {
  site: SITE,
  count: icons.length,
  note: 'Icon paths are relative to the site root (append to site, or to the repository path when reading from disk).',
  icons,
};

fs.writeFileSync('public/catalog.json', JSON.stringify(catalogPayload, null, 1) + '\n', 'utf8');

const motionIndex = {};
for (const icon of icons) {
  motionIndex[icon.id] = {
    concept: icon.concept,
    technique: icon.technique,
    status: animations.get(icon.id)?.status || null,
  };
}

fs.writeFileSync(
  'public/icons/manifest.json',
  JSON.stringify(
    {
      site: SITE,
      count: icons.length,
      generatedAt: new Date().toISOString(),
      icons: motionIndex,
    },
    null,
    1
  ) + '\n',
  'utf8'
);

const sampleIds = ['javascript', 'typescript', 'react', 'nodejs', 'postgresql'];
const sampleTable = sampleIds
  .map((id) => {
    const icon = icons.find((entry) => entry.id === id);
    if (!icon) return '';
    return `<td align="center" width="92"><a href="${icon.docsUrl}" target="_blank" rel="noreferrer"><img src="${SITE}/${icon.svg}" alt="${icon.name}" width="48" height="48" /><br /><sub><b>${icon.name}</b></sub></a></td>`;
  })
  .filter(Boolean)
  .join('\n  ');

const llms = `# Tech Stack Studio

Animated SVG technology stack builder. 542 verified logos, each with its own
motion. Public site: ${SITE}
Repository: https://github.com/ThanhNguyxnOrg/Techstack-Studio

## What you can generate

1. A README table of animated icon links (markdown).
2. A single animated SVG banner containing several logos.
3. A standalone HTML page with the same banner.

## Machine-readable data

- ${SITE}/catalog.json — every icon: id, name, category, subcategory, role,
  docsUrl, monogram, brandColor, svg, sourceSvg, concept, technique.
- ${SITE}/icons/manifest.json — id → motion concept/technique/status.
- ${SITE}/icons/animated/<id>.svg — the animated icon.
- ${SITE}/icons/source/<id>.svg — the static icon.

Icon paths in catalog.json are relative to the site root. Ids are lowercase and
punctuation-free: next.js → nextdotjs, vue → vuedotjs, three.js → threedotjs,
socket.io → socketdotio, aws → amazonaws. Use catalog.json instead of guessing.

## Share link

${SITE}/?stack=react,nodejs,postgresql opens the builder with that stack.

## Build a banner without the UI

\`\`\`bash
npm run stack -- --ids=react,nodejs,postgresql --out=stack.svg
\`\`\`

Formats: svg (default), md (README table), html (standalone page). Inside the repo
alternatively: npx tsx scripts/buildStackBanner.ts --ids=...
Add --theme=light --cols=5 --speed=1.5 when needed.

## Paste-ready README snippet

\`\`\`html
<table>
  <tr>
  ${sampleTable}
  </tr>
</table>
\`\`\`

Each icon carries its own animation and a prefers-reduced-motion fallback, so a
static screenshot still looks correct.
`;

fs.writeFileSync('public/llms.txt', llms, 'utf8');

console.log(`agent artifacts: catalog.json (${icons.length}), icons/manifest.json, llms.txt`);
