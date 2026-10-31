import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CUSTOMIZATION_SETTINGS,
  DEFAULT_STARTER_STACK_IDS,
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
  serializePersistedState,
  escapeHtml,
  generateReadmeMarkdown,
  generateStandaloneHtml,
  generateStandaloneSvg,
  generateAnimatedSingleIconSvg,
} from './studioLogic';

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
    50,
    `Expected exactly 50 Tier A technologies, got ${report.tierACount}`
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

test('all 10 representative benchmark icons resolve with 4-color GCP clipPath choreography and synchronized 3.60s timing', () => {
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
  assert.ok(gcpSvg.includes('clipPath'));
  assert.ok(gcpSvg.includes('3.60s'));
  assert.ok(
    gcpSvg.includes('#131822'),
    'Expected unified #131822 icon plate when showPlate is true'
  );
});

test('TypeScript preview and export use the patched official badge geometry and choreography', () => {
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
  assert.ok(staticSvg.includes('M3.375 9.938'), 'Expected the patched official T glyph geometry');
  assert.ok(staticSvg.includes('fill="#3178C6"'), 'Expected official TypeScript brand blue');
  assert.ok(staticSvg.includes('rx="1.125"'), 'Expected the official badge corner radius');
  assert.ok(!staticSvg.includes('@keyframes'), 'Static TypeScript logo must remain still');
  assert.ok(
    animatedSvg.includes('M3.375 9.938'),
    'Animated logo must preserve the patched official glyph'
  );
  assert.ok(
    animatedSvg.includes('@keyframes tss_typescript_al'),
    'Expected the patched badge and glyph choreography'
  );
  assert.ok(animatedSvg.includes('translateX(38px)'), 'Expected the patched clipped sheen sweep');
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

test('Playwright banner uses its 128-unit artwork viewBox, not the historical 24', () => {
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
    staticSvg.includes('viewBox="0 0 128 128"'),
    'Expected 128-unit viewBox so the two masks are not clipped'
  );
  assert.ok(staticSvg.includes('#E2574C'), 'Expected the red theatre mask');
  assert.ok(staticSvg.includes('#2EAD33'), 'Expected the green theatre mask');
});

test('Google Dataflow banner uses its 32-unit official artwork viewBox, not the historical 24', () => {
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
    staticSvg.includes('viewBox="0 0 32 32"'),
    'Expected 32-unit viewBox so the official Dataflow diagram is not clipped'
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
  assert.deepEqual(malformed.selectedIds, DEFAULT_STARTER_STACK_IDS);
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
