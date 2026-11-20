import test from 'node:test';
import assert from 'node:assert/strict';
import { loadNodeStandaloneSvgParts } from './nodeSvgPartsLoader';

loadNodeStandaloneSvgParts();
import {
  DEFAULT_CUSTOMIZATION_SETTINGS,
  GITHUB_PAGES_URL,
  TECH_BY_ID,
  TECH_CATALOG,
  TECH_CATEGORIES,
} from '../data/catalog';
import { ALL_SVG_MOTION_FAMILIES } from '../types/stack';
import {
  addTechToStack,
  removeTechFromStack,
  toggleTechInStack,
  moveTechInStack,
  reorderTechInStack,
  filterCatalog,
  sortCatalogItems,
  validateCatalogManifest,
  resolveSelectedItems,
  sanitizeSettings,
  parsePersistedState,
  parseShareUrlParams,
  serializePersistedState,
  writeShareUrlParams,
  escapeHtml,
  generateReadmeMarkdown,
  generateStandaloneHtml,
  generateStandaloneSvg,
  generateAnimatedSingleIconSvg,
} from './studioLogic';
import { detectStackFromFileContent } from './stackDetector';

const REPRESENTATIVE_BENCHMARK_IDS = [
  'javascript',
  'python',
  'googlecloud',
  'react',
  'typescript',
  'github',
  'docker',
  'postgresql',
  'amazonaws',
  'kubernetes',
];

test('catalog manifest has >= 400 verified authentic technologies across all 8 categories and passes strict validation', () => {
  const report = validateCatalogManifest(TECH_CATALOG);
  assert.equal(report.valid, true, `Validation errors: ${report.errors.join('; ')}`);
  assert.ok(
    report.verifiedCount >= 400,
    `Expected >= 400 verified technologies, got ${report.verifiedCount}`
  );
  assert.equal(
    report.tierACount,
    49,
    `Expected exactly 49 Tier A technologies, got ${report.tierACount}`
  );
  assert.equal(
    report.distinctMotionFamilies,
    ALL_SVG_MOTION_FAMILIES.length,
    `Expected all ${ALL_SVG_MOTION_FAMILIES.length} motion families to be used`
  );

  for (const category of TECH_CATEGORIES) {
    const count = TECH_CATALOG.filter((i) => i.category === category && i.verified).length;
    assert.ok(count >= 35, `Expected category "${category}" to have >= 35 items, got ${count}`);
  }
});

test('all 10 representative benchmark icons resolve with 4-color GCP choreography and synchronized 4.80s timing', () => {
  const resolved = resolveSelectedItems(REPRESENTATIVE_BENCHMARK_IDS);
  assert.equal(resolved.length, 10, 'Expected all 10 representative benchmark icons to resolve');

  const gcp = TECH_BY_ID['googlecloud'];
  assert.ok(gcp, 'Expected googlecloud in catalog');

  const gcpSvg = generateAnimatedSingleIconSvg(gcp, {
    size: 48,
    theme: 'dark',
    animate: true,
    speedMultiplier: 1,
    showPlate: true,
  });
  assert.ok(
    gcpSvg.includes('#EA4335') &&
      gcpSvg.includes('#4285F4') &&
      gcpSvg.includes('#34A853') &&
      gcpSvg.includes('#FBBC05')
  );
  assert.ok(gcpSvg.includes('@keyframes'));
  assert.ok(gcpSvg.includes('4.80s'));
  assert.ok(
    gcpSvg.includes('#131822'),
    'Expected unified #131822 icon plate when showPlate is true'
  );
});

test('TypeScript preview and export use the official badge geometry and story choreography', () => {
  const ts = TECH_BY_ID['typescript'];
  assert.ok(ts, 'Expected typescript in catalog');

  const staticSvg = generateAnimatedSingleIconSvg(ts, {
    size: 48,
    theme: 'dark',
    animate: false,
    speedMultiplier: 1,
    showPlate: false,
  });
  const animatedSvg = generateAnimatedSingleIconSvg(ts, {
    size: 48,
    theme: 'dark',
    animate: true,
    speedMultiplier: 1,
    showPlate: false,
  });

  assert.ok(staticSvg.includes('viewBox="0 0 24 24"'), 'Expected normalized TypeScript viewBox');
  assert.ok(staticSvg.includes('M3.375 9.938'), 'Expected the official T glyph geometry');
  assert.ok(staticSvg.includes('fill="#3178C6"'), 'Expected official TypeScript brand blue');
  assert.ok(staticSvg.includes('rx="1.125"'), 'Expected the official badge corner radius');
  assert.ok(!staticSvg.includes('@keyframes'), 'Static TypeScript logo must remain still');
  assert.ok(animatedSvg.includes('M3.375 9.938'), 'Animated logo must preserve the official glyph');
  assert.ok(
    animatedSvg.includes('@keyframes tss_typescript_'),
    'Expected scoped badge and glyph choreography'
  );
  assert.ok(animatedSvg.includes('clipPath'), 'Expected the clipped sheen sweep');
  assert.ok(
    /prefers-reduced-motion\s*:\s*reduce/.test(animatedSvg),
    'Expected reduced-motion support'
  );
  assert.ok(!animatedSvg.includes('M 88 118'), 'Should not use the old rounded custom T path');
  assert.ok(!animatedSvg.includes('M 164 124'), 'Should not use the old rounded custom S path');
  assert.ok(
    !animatedSvg.includes('#131822'),
    'Expected no inner plate rect when showPlate is false'
  );

  const bannerSvg = generateStandaloneSvg([ts], {
    ...DEFAULT_CUSTOMIZATION_SETTINGS,
    animateSvgLogos: false,
  });
  assert.ok(
    bannerSvg.includes('scale(1.7600)'),
    'Standalone SVG banner must scale the normalized 24-unit TypeScript badge to the icon box'
  );
});

test('Playwright banner uses normalized 24-unit artwork viewBox preserving both masks', () => {
  const pw = TECH_BY_ID['playwright'];
  assert.ok(pw, 'Expected playwright in catalog');

  const staticSvg = generateAnimatedSingleIconSvg(pw, {
    size: 48,
    theme: 'dark',
    animate: false,
    speedMultiplier: 1,
    showPlate: false,
  });
  assert.ok(
    staticSvg.includes('viewBox="0 0 24 24"'),
    'Expected unified 24-unit viewBox with normalized matrix transform'
  );
  assert.ok(staticSvg.includes('#E2574C'), 'Expected the red theatre mask');
  assert.ok(staticSvg.includes('#2EAD33'), 'Expected the green theatre mask');
});

test('Google Dataflow banner uses normalized 24-unit artwork viewBox preserving brand blues', () => {
  const df = TECH_BY_ID['googledataflow'];
  assert.ok(df, 'Expected googledataflow in catalog');

  const staticSvg = generateAnimatedSingleIconSvg(df, {
    size: 48,
    theme: 'dark',
    animate: false,
    speedMultiplier: 1,
    showPlate: false,
  });
  assert.ok(
    staticSvg.includes('viewBox="0 0 24 24"'),
    'Expected unified 24-unit viewBox with normalized matrix transform'
  );
  assert.ok(staticSvg.includes('#4285F4'), 'Expected the Dataflow primary blue');
  assert.ok(staticSvg.includes('#669df6'), 'Expected the Dataflow mid blue');
  assert.ok(staticSvg.includes('#aecbfa'), 'Expected the Dataflow light blue');
});

test('normalized C++ artwork scales to the icon box in SVG banners', () => {
  const cpp = TECH_BY_ID['cpp'];
  assert.ok(cpp, 'Expected cpp in catalog');

  const bannerSvg = generateStandaloneSvg([cpp], {
    ...DEFAULT_CUSTOMIZATION_SETTINGS,
    animateSvgLogos: false,
  });
  assert.ok(
    bannerSvg.includes('scale(1.7600)'),
    'Standalone SVG banner must scale the normalized 24-unit C++ badge to the icon box'
  );
});

test('selection and duplicate prevention work accurately', () => {
  const initial = ['typescript', 'react'];
  const afterDuplicate = addTechToStack(initial, 'react');
  assert.deepEqual(afterDuplicate, ['typescript', 'react']);

  const afterAdd = addTechToStack(initial, 'arduino');
  assert.deepEqual(afterAdd, ['typescript', 'react', 'arduino']);

  const afterUnknown = addTechToStack(afterAdd, 'non-existent-tech');
  assert.deepEqual(afterUnknown, ['typescript', 'react', 'arduino']);

  const afterRemove = removeTechFromStack(afterAdd, 'typescript');
  assert.deepEqual(afterRemove, ['react', 'arduino']);

  const toggledOff = toggleTechInStack(afterRemove, 'react');
  assert.deepEqual(toggledOff, ['arduino']);
  const toggledOn = toggleTechInStack(toggledOff, 'pytorch');
  assert.deepEqual(toggledOn, ['arduino', 'pytorch']);
});

test('ordering transitions move items left, right, first, and last safely', () => {
  const stack = ['cpp', 'python', 'typescript', 'docker'];

  assert.deepEqual(moveTechInStack(stack, 'python', 'left'), [
    'python',
    'cpp',
    'typescript',
    'docker',
  ]);
  assert.deepEqual(moveTechInStack(stack, 'cpp', 'left'), stack);
  assert.deepEqual(moveTechInStack(stack, 'typescript', 'right'), [
    'cpp',
    'python',
    'docker',
    'typescript',
  ]);
  assert.deepEqual(moveTechInStack(stack, 'docker', 'first'), [
    'docker',
    'cpp',
    'python',
    'typescript',
  ]);
  assert.deepEqual(moveTechInStack(stack, 'cpp', 'last'), [
    'python',
    'typescript',
    'docker',
    'cpp',
  ]);
});

test('drag reordering moves the source technology to the target position without losing or duplicating IDs', () => {
  const stack = ['typescript', 'react', 'python', 'googlecloud'];

  assert.deepEqual(reorderTechInStack(stack, 'typescript', 'googlecloud'), [
    'react',
    'python',
    'googlecloud',
    'typescript',
  ]);
  assert.deepEqual(reorderTechInStack(stack, 'googlecloud', 'react'), [
    'typescript',
    'googlecloud',
    'react',
    'python',
  ]);
  assert.deepEqual(reorderTechInStack(stack, 'react', 'react'), stack);
  assert.deepEqual(reorderTechInStack(stack, 'unknown', 'react'), stack);
  assert.deepEqual(reorderTechInStack(stack, 'react', 'unknown'), stack);
});

test('Google Cloud uses a concise display name while retaining canonical GCP lookup', () => {
  assert.equal(TECH_BY_ID['googlecloud']?.name, 'Google Cloud');
  assert.equal(TECH_BY_ID.gcp?.id, 'googlecloud');
});

test('catalog search matches canonical names, subcategories, and community aliases (k8s, pg, ts, gha, rpi)', () => {
  const k8s = filterCatalog(TECH_CATALOG, 'k8s', 'all');
  assert.ok(k8s.some((item) => item.id === 'kubernetes'));

  const pg = filterCatalog(TECH_CATALOG, 'postgres', 'Databases');
  assert.ok(pg.some((item) => item.id === 'postgresql'));

  const gha = filterCatalog(TECH_CATALOG, 'gha', 'Cloud and DevOps');
  assert.ok(gha.some((item) => item.id === 'githubactions'));

  const rpi = filterCatalog(TECH_CATALOG, 'rpi', 'Embedded development');
  assert.ok(rpi.some((item) => item.id === 'raspberrypi'));

  const noMatch = filterCatalog(TECH_CATALOG, 'zzzz-unknown-query-999', 'all');
  assert.equal(noMatch.length, 0);
});

test('community-first sorting supports popularity, alphabetical, and subcategory modes', () => {
  const langs = filterCatalog(TECH_CATALOG, '', 'Programming languages');

  const byPop = sortCatalogItems(langs, 'popularity');
  assert.ok(byPop[0].categoryRank <= byPop[1].categoryRank);

  const byAlpha = sortCatalogItems(langs, 'alphabetical');
  assert.ok(byAlpha[0].name.localeCompare(byAlpha[1].name) <= 0);

  const bySub = sortCatalogItems(langs, 'subcategory');
  assert.ok(bySub.length === langs.length);
});

test('SVG logo animation generator embeds @keyframes when active and omits @keyframes in reduced-motion / static mode', () => {
  const py = resolveSelectedItems(['python'])[0];
  assert.ok(py);

  const animatedSvg = generateAnimatedSingleIconSvg(py, {
    size: 64,
    theme: 'dark',
    animate: true,
    speedMultiplier: 1,
  });
  assert.ok(animatedSvg.includes('@keyframes'), 'Expected animated SVG to include @keyframes');
  assert.ok(animatedSvg.includes('<svg'), 'Expected valid <svg> wrapper');

  const staticSvg = generateAnimatedSingleIconSvg(py, {
    size: 64,
    theme: 'dark',
    animate: false,
    speedMultiplier: 1,
  });
  assert.ok(
    !staticSvg.includes('@keyframes'),
    'Expected static/reduced-motion SVG to omit @keyframes'
  );
});

test('HTML escaping neutralizes XSS characters in user-controlled strings', () => {
  const malicious = `<script>alert("xss" & 'inject')</script>`;
  const escaped = escapeHtml(malicious);
  assert.equal(
    escaped,
    '&lt;script&gt;alert(&quot;xss&quot; &amp; &#39;inject&#39;)&lt;/script&gt;'
  );
  assert.ok(!escaped.includes('<script>'));
});

test('persistence round-trip and malformed state recovery work safely', () => {
  const validState = {
    version: 1 as const,
    selectedIds: ['typescript', 'rust', 'arduino'],
    settings: sanitizeSettings({
      ...DEFAULT_CUSTOMIZATION_SETTINGS,
      iconSize: 48,
      alignment: 'center',
      showInnerPlate: true,
    }),
  };

  const json = serializePersistedState(validState);
  const restored = parsePersistedState(json);
  assert.deepEqual(restored.selectedIds, ['typescript', 'rust', 'arduino']);
  assert.equal(restored.settings.iconSize, 48);
  assert.equal(restored.settings.alignment, 'center');
  assert.equal(restored.settings.showInnerPlate, true);

  const malformed = parsePersistedState('{not-valid-json');
  assert.deepEqual(malformed.selectedIds, []);
});

test('README Markdown, HTML, and Animated SVG exports reflect selected items, showLabels, showInnerPlate, and ThanhNguyxnOrg/Techstack-Studio URLs', () => {
  const items = resolveSelectedItems(['typescript', 'python', 'googlecloud']);
  const settings = sanitizeSettings({
    ...DEFAULT_CUSTOMIZATION_SETTINGS,
    iconSize: 52,
    alignment: 'center',
    showHeader: true,
    headerTitle: 'My Stack <2026>',
    showLabels: false,
    showInnerPlate: false,
  });

  const md = generateReadmeMarkdown(items, settings);
  assert.ok(md.includes('width="52"'));
  assert.ok(md.includes('align="center"'));
  assert.ok(md.includes('My Stack &lt;2026&gt;'));
  assert.ok(md.includes(`${GITHUB_PAGES_URL}/icons/animated/typescript.svg`));
  assert.ok(md.includes(`${GITHUB_PAGES_URL}/icons/animated/googlecloud.svg`));

  const html = generateStandaloneHtml(items, settings);
  assert.ok(html.includes('My Stack &lt;2026&gt;'));
  assert.ok(html.includes('@keyframes'));
  assert.ok(
    !html.includes('>TypeScript<'),
    'Expected labels to be omitted when showLabels is false'
  );

  const svg = generateStandaloneSvg(items, settings);
  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.includes('@keyframes'));
  assert.ok(
    !svg.includes('>TypeScript</text>'),
    'Expected SVG text labels to be omitted when showLabels is false'
  );
});

test('search finds entries by their legacy vendor-prefixed and suffixed names', () => {
  const cases: [string, string][] = [
    ['HashiCorp Vault', 'vault'],
    ['HashiCorp Consul', 'consul'],
    ['HashiCorp Nomad', 'nomad'],
    ['HashiCorp Packer', 'packer'],
    ['Microsoft SQL Server', 'microsoftsqlserver'],
    ['Red Hat OpenShift', 'openshift'],
    ['Qualcomm Snapdragon', 'qualcomm'],
    ['Amazon DynamoDB', 'amazondynamodb'],
    ['Microsoft Azure', 'azure'],
    ['Google Gemini', 'googlegemini'],
    ['Google Dataflow', 'googledataflow'],
    ['Autodesk EAGLE', 'autodeskeagle'],
    ['Seeed Studio', 'seeedstudio'],
    ['JetBrains Rider', 'rider'],
    ['Aqua Trivy', 'trivy'],
    ['Perforce Helix Core', 'perforce'],
    ['QMK Firmware', 'qmk'],
    ['PX4 Autopilot', 'px4'],
    ['Zephyr RTOS', 'zephyr'],
    ['Serverless Framework', 'serverless'],
    ['Spring Framework', 'spring'],
    ['Oracle Database', 'oracle'],
    ['Eclipse IDE', 'eclipseide'],
    ['Godot Engine', 'godotengine'],
    ['Unreal Engine', 'unrealengine'],
  ];

  for (const [query, id] of cases) {
    const [first] = filterCatalog(TECH_CATALOG, query, 'all');
    assert.equal(first?.id, id);
  }
});

test('search tolerates partial names and a single typo', () => {
  const firstMatch: [string, string][] = [
    ['vault', 'vault'],
    ['azure', 'azure'],
    ['spring', 'spring'],
    ['openshift', 'openshift'],
    ['sql server', 'microsoftsqlserver'],
    ['microsoft sql server', 'microsoftsqlserver'],
    ['snapdragon', 'qualcomm'],
    ['autopilot', 'px4'],
    ['red hat', 'redhat'],
    ['vualt', 'vault'],
    ['valut', 'vault'],
    ['reactt', 'react'],
    ['typecript', 'typescript'],
    ['kubernets', 'kubernetes'],
    ['javscript', 'javascript'],
    ['postgress', 'postgresql'],
    ['dockerr', 'docker'],
    ['pyton', 'python'],
  ];

  for (const [query, id] of firstMatch) {
    const [first] = filterCatalog(TECH_CATALOG, query, 'all');
    assert.equal(first?.id, id);
  }

  const hashicorp = filterCatalog(TECH_CATALOG, 'hashicorp', 'all').map((item) => item.id);
  for (const id of ['consul', 'nomad', 'packer', 'vault']) {
    assert.ok(hashicorp.includes(id));
  }
});

test('every alias resolves to its own entry, with no exceptions left', () => {
  // Terms genuinely claimed by two catalog entries; the first result is whichever
  // entry owns the name, and both stay in the list.
  const shared = new Set<string>([]);
  const misranked: string[] = [];

  for (const item of TECH_CATALOG) {
    for (const alias of item.aliases) {
      if (!alias || alias.length < 2 || shared.has(alias)) continue;
      const [first] = filterCatalog(TECH_CATALOG, alias, 'all');
      if (first?.id !== item.id) {
        misranked.push(`${alias} -> ${first?.id} (expected ${item.id})`);
      }
    }
  }

  assert.deepEqual(misranked, []);
});

test('shareable URL query parameters round-trip stack and non-default style settings', () => {
  const params = new URLSearchParams();
  writeShareUrlParams(params, ['react', 'typescript', 'postgresql'], {
    ...DEFAULT_CUSTOMIZATION_SETTINGS,
    theme: 'light',
    presentationStyle: 'cards',
    itemsPerRow: 5,
    animationSpeedMultiplier: 1.5,
    showLabels: false,
  });

  const parsed = parseShareUrlParams('?' + params.toString());
  assert.ok(parsed);
  assert.deepEqual(parsed.selectedIds, ['react', 'typescript', 'postgresql']);
  assert.equal(parsed.settings.theme, 'light');
  assert.equal(parsed.settings.presentationStyle, 'cards');
  assert.equal(parsed.settings.itemsPerRow, 5);
  assert.equal(parsed.settings.animationSpeedMultiplier, 1.5);
  assert.equal(parsed.settings.showLabels, false);
  assert.equal(parseShareUrlParams('?theme=light'), null);
});

test('auto-detector extracts canonical stack IDs from package.json, Dockerfile, and requirements.txt', () => {
  const pkg = JSON.stringify({
    dependencies: { react: '^19.0.0', next: '^15.0.0', tailwindcss: '^4.0.0', pg: '^8.0.0' },
    devDependencies: { typescript: '^5.7.0', vitest: '^3.0.0' },
  });
  const fromPkg = detectStackFromFileContent(pkg, TECH_CATALOG, 'package.json');
  for (const id of ['react', 'nextdotjs', 'tailwindcss', 'postgresql', 'typescript', 'vitest']) {
    assert.ok(fromPkg.includes(id), `Expected ${id} from package.json`);
  }

  const dockerfile = 'FROM node:22-alpine\nFROM nginx:1.27\n';
  const fromDocker = detectStackFromFileContent(dockerfile, TECH_CATALOG, 'Dockerfile');
  for (const id of ['docker', 'nodedotjs', 'nginx']) {
    assert.ok(fromDocker.includes(id), `Expected ${id} from Dockerfile`);
  }

  const reqs = 'fastapi==0.115.0\ntorch>=2.4\nredis\npsycopg2-binary\n';
  const fromPy = detectStackFromFileContent(reqs, TECH_CATALOG, 'requirements.txt');
  for (const id of ['python', 'fastapi', 'pytorch', 'redis', 'postgresql']) {
    assert.ok(fromPy.includes(id), `Expected ${id} from requirements.txt`);
  }
});
