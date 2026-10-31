import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { TECH_CATALOG, TECH_CATEGORIES } from '../data/catalog';
import { ALL_SVG_MOTION_FAMILIES } from '../types/stack';
import standaloneSvgPartsJson from '../data/standaloneSvgParts.json';

const PUBLIC_ICONS = path.resolve(process.cwd(), 'public', 'icons');
const SOURCE_DIR = path.join(PUBLIC_ICONS, 'source');
const ANIMATED_DIR = path.join(PUBLIC_ICONS, 'animated');
const REFERENCE_DIR = path.join(PUBLIC_ICONS, 'reference');

function svgFiles(directory: string): string[] {
  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith('.svg'))
    .sort();
}

function readSvg(directory: string, id: string): string {
  return fs.readFileSync(path.join(directory, `${id}.svg`), 'utf8');
}

const CUSTOM_SOURCE_LOGO_SIGNATURES: Record<string, readonly string[]> = {
  googlecloud: ['#EA4335', '#4285F4', '#34A853', '#FBBC05'],
  python: ['#387EB8', '#FFE052'],
  typescript: ['#3178C6', 'M3.375 9.938'],
  javascript: ['#F7DF1E', '#111622'],
  amazonaws: ['#F3F1EC', '#FF9900'],
  springboot: ['#6DB33F', '#FFFFFF'],
  c: ['#283593', '#5C6BC0', '#FFFFFF'],
  cpp: ['#659ad2', '#00599c', '#004482'],
  csharp: ['#512BD4', '#6D28D9'],
  playwright: ['#E2574C', '#2EAD33'],
  googledataflow: ['#4285F4', '#669df6', '#aecbfa'],
  webgpu: ['#005A9C', 'M0 4.784'],
};

function assertSafeSvg(markup: string, id: string): void {
  assert.ok(markup.startsWith('<svg '), `${id}: SVG must start with an <svg> element`);
  assert.ok(markup.trimEnd().endsWith('</svg>'), `${id}: SVG must close`);
  assert.ok(markup.includes('viewBox="'), `${id}: SVG must declare a viewBox`);
  assert.ok(!/<script[\s>]/i.test(markup), `${id}: SVG must not contain scripts`);
  assert.ok(!/<foreignObject[\s>]/i.test(markup), `${id}: SVG must not contain foreignObject`);
  assert.ok(!/<image[\s>]/i.test(markup), `${id}: SVG must not contain raster images`);
  assert.ok(!/\son[a-z]+\s*=/i.test(markup), `${id}: SVG must not contain inline event handlers`);
  assert.ok(!/javascript:/i.test(markup), `${id}: SVG must not contain javascript: URLs`);
  assert.ok(
    !/(?:href|src)\s*=\s*["']https?:/i.test(markup),
    `${id}: SVG must not reference external runtime assets`
  );
}

test('catalog and generated asset coverage stay in lockstep', () => {
  assert.equal(TECH_CATALOG.length, 553, 'Expected exactly 553 catalog entries');
  assert.equal(TECH_CATEGORIES.length, 8, 'Expected exactly 8 categories');
  assert.equal(ALL_SVG_MOTION_FAMILIES.length, 18, 'Expected exactly 18 motion families');

  const ids = new Set(TECH_CATALOG.map((item) => item.id));
  assert.equal(ids.size, TECH_CATALOG.length, 'Catalog IDs must be unique');

  for (const category of TECH_CATEGORIES) {
    assert.ok(
      TECH_CATALOG.some((item) => item.category === category),
      `Category "${category}" must contain at least one technology`
    );
  }

  for (const family of ALL_SVG_MOTION_FAMILIES) {
    assert.ok(
      TECH_CATALOG.some((item) => item.motionRecipe.family === family),
      `Motion family "${family}" must be used`
    );
  }

  const sourceFiles = svgFiles(SOURCE_DIR);
  const animatedFiles = svgFiles(ANIMATED_DIR);
  const expectedFiles = [...ids].map((id) => `${id}.svg`).sort();

  assert.deepEqual(sourceFiles, expectedFiles, 'Source SVG files must match the catalog exactly');
  assert.deepEqual(
    animatedFiles,
    expectedFiles,
    'Animated SVG files must match the catalog exactly'
  );
  assert.equal(svgFiles(REFERENCE_DIR).length, 29, 'Expected 29 upstream reference SVGs');
});

test('every catalog item exposes complete, self-contained source and animated SVGs', () => {
  const parts = standaloneSvgPartsJson as Record<
    string,
    { defs: string; style: string; body: string; staticBody: string }
  >;
  const partIds = Object.keys(parts).sort();
  const catalogIds = TECH_CATALOG.map((item) => item.id).sort();

  assert.deepEqual(partIds, catalogIds, 'standaloneSvgParts.json must cover the catalog exactly');

  for (const item of TECH_CATALOG) {
    assert.match(item.id, /^[a-z0-9_]+$/, `Unsafe catalog id: ${item.id}`);
    assert.ok(item.verified, `${item.id}: catalog entry must be verified`);
    assert.ok(item.sourceSvgPath?.endsWith(`/${item.id}.svg`), `${item.id}: source path mismatch`);
    assert.ok(
      item.animatedSvgPath?.endsWith(`/${item.id}.svg`),
      `${item.id}: animated path mismatch`
    );

    const source = readSvg(SOURCE_DIR, item.id);
    const animated = readSvg(ANIMATED_DIR, item.id);

    assertSafeSvg(source, item.id);
    assertSafeSvg(animated, item.id);

    assert.ok(source.includes('role="img"'), `${item.id}: source SVG needs an image role`);

    const customSignatures = CUSTOM_SOURCE_LOGO_SIGNATURES[item.id];
    if (customSignatures) {
      for (const signature of customSignatures) {
        assert.ok(
          source.toLowerCase().includes(signature.toLowerCase()),
          `${item.id}: source logo is missing expected brand signature ${signature}`
        );
      }
    } else {
      const canonicalGlyph = `<path fill="${item.darkSafeColor}" fill-rule="evenodd" d="${item.svgPath}"/>`;
      assert.ok(
        source.includes(canonicalGlyph),
        `${item.id}: static SVG must preserve the canonical catalog glyph path`
      );
    }

    if (item.id === 'typescript') {
      assert.ok(
        animated.includes('viewBox="0 0 24 24"'),
        'TypeScript animation must use the patched 24px badge coordinate system'
      );
      assert.ok(
        animated.includes('M3.375 9.938'),
        'TypeScript animation must preserve the patched T glyph geometry'
      );
      assert.ok(
        animated.includes('@keyframes tss_typescript_al'),
        'TypeScript animation must include the patched badge choreography'
      );
      assert.ok(
        animated.includes('translateX(38px)'),
        'TypeScript animation must include the patched clipped sheen sweep'
      );
    }
    assert.ok(animated.includes('@keyframes '), `${item.id}: animated SVG needs keyframes`);
    assert.ok(
      /prefers-reduced-motion\s*:\s*reduce/.test(animated),
      `${item.id}: animated SVG needs reduced-motion support`
    );
    assert.ok(parts[item.id].body.length > 0, `${item.id}: animated body is empty`);
    assert.ok(parts[item.id].staticBody.length > 0, `${item.id}: static body is empty`);
  }
});

test('the replaced DuckDB/Delta entry is gone and Apache Doris is authentic', () => {
  assert.equal(
    TECH_CATALOG.some((item) => item.id === 'duckdb_motherduck'),
    false,
    'Bogus duckdb_motherduck entry must not return'
  );

  const doris = TECH_CATALOG.find((item) => item.id === 'apachedoris');
  assert.ok(doris, 'Apache Doris must be present');
  assert.equal(doris.name, 'Apache Doris');
  assert.equal(doris.docsUrl, 'https://doris.apache.org/');
  assert.equal(doris.provenance, 'Community icon set');
  assert.equal(doris.license, 'Community-sourced · see ATTRIBUTION.md');
  assert.equal(doris.category, 'AI and machine learning');
  assert.equal(doris.subcategory, 'Data Warehouses & Lakehouse');
});
