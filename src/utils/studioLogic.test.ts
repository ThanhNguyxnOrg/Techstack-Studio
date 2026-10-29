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

test('TypeScript and JavaScript standalone SVGs use direct T, J, and S vector paths over solid brand squares without horizontal bleed lines', () => {
  const ts = TECH_BY_ID['typescript'];
  assert.ok(ts, 'Expected typescript in catalog');

  const tsSvg = generateAnimatedSingleIconSvg(ts, {
    size: 48,
    theme: 'dark',
    animate: true,
    speedMultiplier: 1,
    showPlate: false,
  });
  assert.ok(tsSvg.includes('M 88 118'), 'Expected TypeScript SVG to include standalone T path');
  assert.ok(tsSvg.includes('M 164 124'), 'Expected TypeScript SVG to include standalone S path');
  assert.ok(!tsSvg.includes('<mask'), 'Expected no mask rectangle bleed on TypeScript SVG');
  assert.ok(!tsSvg.includes('#131822'), 'Expected no inner plate rect when showPlate is false');
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
