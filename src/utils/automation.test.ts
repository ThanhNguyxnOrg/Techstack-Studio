import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadNodeStandaloneSvgParts } from './nodeSvgPartsLoader';
import { patchReadmeContent, TECHSTACK_MARKER_END, TECHSTACK_MARKER_START } from './readmePatcher';
import { scanProjectDirectory } from './projectScanner';
import { buildShareUrl, runAutomationBuild } from './automationRunner';
import { DEFAULT_CUSTOMIZATION_SETTINGS, TECH_CATALOG } from '../data/catalog';

loadNodeStandaloneSvgParts();

test('patchReadmeContent appends managed Tech Stack section when markers are absent', () => {
  const initial = '# My Project\n\nHello world.\n';
  const res = patchReadmeContent(initial, '<table><tr><td>React</td></tr></table>');
  assert.equal(res.mode, 'appended');
  assert.equal(res.changed, true);
  assert.ok(res.content.includes('## Tech Stack'));
  assert.ok(res.content.includes(TECHSTACK_MARKER_START));
  assert.ok(res.content.includes(TECHSTACK_MARKER_END));
  assert.ok(res.content.startsWith('# My Project'));
});

test('patchReadmeContent updates idempotently between markers and preserves surrounding content', () => {
  const initial = `# Header\n\n${TECHSTACK_MARKER_START}\nOLD\n${TECHSTACK_MARKER_END}\n\n## Footer\n`;
  const first = patchReadmeContent(initial, 'NEW_BLOCK');
  assert.equal(first.mode, 'updated');
  assert.equal(first.changed, true);
  assert.ok(first.content.includes('# Header'));
  assert.ok(first.content.includes('NEW_BLOCK'));
  assert.ok(!first.content.includes('OLD'));
  assert.ok(first.content.includes('## Footer'));

  const second = patchReadmeContent(first.content, 'NEW_BLOCK');
  assert.equal(second.mode, 'updated');
  assert.equal(second.changed, false);
  assert.equal(second.content, first.content);
});

test('patchReadmeContent throws on unbalanced markers instead of corrupting README', () => {
  assert.throws(
    () => patchReadmeContent(`# Title\n${TECHSTACK_MARKER_START}\nstuff`, 'BLOCK'),
    /without matching/
  );
  assert.throws(
    () => patchReadmeContent(`# Title\n${TECHSTACK_MARKER_END}\nstuff`, 'BLOCK'),
    /without matching/
  );
});

test('scanProjectDirectory detects stack from package.json and Dockerfile and handles empty dirs', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tss-scan-'));
  try {
    const empty = scanProjectDirectory(tmp, TECH_CATALOG);
    assert.deepEqual(empty.ids, []);
    assert.deepEqual(empty.matchedFiles, []);

    fs.writeFileSync(
      path.join(tmp, 'package.json'),
      JSON.stringify({ dependencies: { react: '^19.0.0', prisma: '^6.0.0' } }),
      'utf8'
    );
    fs.writeFileSync(path.join(tmp, 'Dockerfile'), 'FROM node:22-alpine\n', 'utf8');

    const scanned = scanProjectDirectory(tmp, TECH_CATALOG);
    assert.ok(scanned.ids.includes('react'));
    assert.ok(scanned.ids.includes('prisma'));
    assert.ok(scanned.ids.includes('docker'));
    assert.ok(scanned.ids.includes('nodedotjs'));
    assert.ok(scanned.matchedFiles.includes('package.json'));
    assert.ok(scanned.matchedFiles.includes('Dockerfile'));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('runAutomationBuild resolves aliases, supports static mode, validates presets, and emits POSIX SVG links', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tss-run-'));
  try {
    const svgOut = path.join(tmp, 'docs', 'assets', 'stack.svg');
    const readme = path.join(tmp, 'README.md');
    fs.writeFileSync(readme, '# Demo\n', 'utf8');

    const res = runAutomationBuild({
      ids: ['nodejs', 'k8s', 'react'],
      format: 'svg',
      outPath: svgOut,
      readmePath: readme,
      animate: false,
      preset: 'light-cards',
    });

    assert.deepEqual(res.ids, ['nodedotjs', 'kubernetes', 'react']);
    assert.equal(res.settings.animateSvgLogos, false);
    assert.equal(res.settings.theme, 'light');
    assert.equal(res.settings.presentationStyle, 'cards');
    assert.ok(fs.existsSync(svgOut));
    assert.ok(!fs.readFileSync(svgOut, 'utf8').includes('@keyframes'));

    const patchedReadme = fs.readFileSync(readme, 'utf8');
    assert.ok(patchedReadme.includes('src="./docs/assets/stack.svg"'));
    assert.ok(res.shareUrl.includes('stack=nodedotjs%2Ckubernetes%2Creact'));
    assert.ok(res.shareUrl.includes('anim=0'));

    assert.throws(
      () => runAutomationBuild({ ids: ['react'], preset: 'nonexistent-preset' }),
      /Unknown preset/
    );
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('buildShareUrl omits default settings and encodes non-default overrides', () => {
  const plain = buildShareUrl(['react', 'docker'], DEFAULT_CUSTOMIZATION_SETTINGS);
  assert.ok(plain.includes('stack=react%2Cdocker'));
  assert.ok(!plain.includes('theme='));
  assert.ok(!plain.includes('anim='));
});
