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
      aliases: item.aliases || [],
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

542 verified pure-vector SVG technology logos (both animated and static, unified 24x24 frame, zero raster) for GitHub READMEs, developer profiles, portfolios, and AI agents.
Public site: ${SITE}
Repository: https://github.com/ThanhNguyxnOrg/Techstack-Studio

## Animated or static? Both are hosted directly
- Animated SVG: ${SITE}/icons/animated/<id>.svg (4.8s seamless loop with prefers-reduced-motion fallback)
- Static SVG:   ${SITE}/icons/source/<id>.svg (crisp non-animated vector)

## Machine-readable endpoints
- ${SITE}/catalog.json — all 542 icons (id, name, category, role, docsUrl, aliases, svg, sourceSvg, concept)
- ${SITE}/icons/manifest.json — id → motion story concept/technique/status
- ${SITE}/llms-full.txt — complete reference (MCP server config, CLI flags, browser API, CI recipes)

Ids are lowercase and punctuation-free (next.js → nextdotjs, vue → vuedotjs, nodejs → nodedotjs, k8s → kubernetes, postgres → postgresql, aws → amazonaws). Always resolve via catalog.json aliases rather than guessing.

## Hand off to a human (pre-filled live Studio link)
${SITE}/?stack=react,nodedotjs,postgresql&theme=dark&style=tiles&cols=5&speed=1&anim=1

Supported query params:
- stack: comma-separated canonical IDs or aliases
- theme: dark | light
- style: tiles | minimal | cards | pills
- cols: 1..12 (omit for auto)
- speed: 0.5 | 1 | 1.5
- anim: 0 (static) | omit for animated
- labels: 0 (hide labels) | plate: 0 (hide inner plate)

## Use via CLI or MCP (zero-clone)
\`\`\`bash
# Auto-detect stack and idempotently patch README.md between markers
npx techstack-studio --detect . --readme README.md

# Static icons only, or single SVG banner
npx techstack-studio --ids=react,docker,postgresql --animate=false --out=tech-stack.svg

# Print a pre-filled Studio URL for the user
npx techstack-studio --ids=react,docker --theme=light --share-url

# Start stdio MCP server (search_icons, detect_stack, build_readme_snippet, build_svg_banner, patch_readme, build_share_url)
npx techstack-studio mcp
\`\`\`

## Browser control API (on the live page)
\`window.techStackStudio\` exposes: \`getState()\`, \`search(q)\`, \`setStack(ids)\`, \`add(ids)\`, \`remove(ids)\`, \`setSettings(partial)\`, \`applyPreset(id)\`, \`detectFromText(text)\`, \`getShareUrl()\`, \`exportOutput('markdown'|'svg'|'html')\`.

## Paste-ready README snippet (animated; swap /animated/ for /source/ for static)
\`\`\`html
<table>
  <tr>
  ${sampleTable}
  </tr>
</table>
\`\`\`
`;

const categoryCounts = new Map();
for (const icon of icons) {
  categoryCounts.set(icon.category, (categoryCounts.get(icon.category) || 0) + 1);
}
const categorySummary = [...categoryCounts.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([cat, count]) => `- ${cat}: ${count} icons`)
  .join('\n');

const llmsFull = `${llms}
---

## Catalog overview (${icons.length} icons across ${categoryCounts.size} categories)
${categorySummary}

## MCP Server Configuration
Add to Claude Desktop, Cursor, Antigravity, Windsurf, or VS Code MCP settings:

\`\`\`json
{
  "mcpServers": {
    "techstack-studio": {
      "command": "npx",
      "args": ["-y", "techstack-studio", "mcp"]
    }
  }
}
\`\`\`

Optional workspace root restriction:
\`"args": ["-y", "techstack-studio", "mcp", "--root", "/path/to/repo"]\`

### MCP Tools
1. \`search_icons({ query, category?, limit? })\` — search 542 icons with aliases, animated/static URLs, and motion stories.
2. \`detect_stack({ path?, content?, filename? })\` — auto-detect stack from package.json, Dockerfile, requirements.txt, pyproject.toml, Cargo.toml, go.mod, composer.json, Gemfile, etc.
3. \`build_readme_snippet({ ids, animate?, cols?, showLabels?, linkDocs?, alignment? })\` — generate README Markdown/HTML.
4. \`build_svg_banner({ ids, animate?, theme?, style?, preset?, cols?, speed?, showLabels?, showInnerPlate?, headerTitle?, outPath? })\` — generate one self-contained animated or static SVG banner.
5. \`patch_readme({ readmePath, ids?, detectPath?, format?, svgOutPath?, animate?, theme?, style?, preset?, cols?, speed?, dryRun? })\` — idempotently update between \`<!-- techstack-studio:start -->\` and \`<!-- techstack-studio:end -->\`.
6. \`build_share_url({ ids, animate?, theme?, style?, preset?, cols?, speed?, showLabels?, showInnerPlate? })\` — build a pre-filled live Studio link.

## Presets
- \`dark-tiles\` — Dark theme, tiles, animated
- \`logos-only\` — Minimal frame, no labels, animated
- \`readme-compact\` — Compact grid tailored for GitHub READMEs
- \`light-cards\` — Light theme, cards

## CI Automation Snippets (runs independently via npm, works on GitHub & GitLab)

### GitHub Actions (in user's own workflow)
\`\`\`yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22
- run: npx -y techstack-studio --detect . --readme README.md
\`\`\`

### GitLab CI (.gitlab-ci.yml)
\`\`\`yaml
update-techstack:
  image: node:22
  script:
    - npx -y techstack-studio --detect . --readme README.md
\`\`\`
`;

fs.writeFileSync('public/llms.txt', llms, 'utf8');
fs.writeFileSync('public/llms-full.txt', llmsFull, 'utf8');

console.log(
  `agent artifacts: catalog.json (${icons.length}), icons/manifest.json, llms.txt, llms-full.txt`
);
