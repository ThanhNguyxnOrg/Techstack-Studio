import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const root = process.cwd();
const cliRoot = path.join(root, 'packages', 'cli');
const distDir = path.join(cliRoot, 'dist');
const dataDir = path.join(cliRoot, 'data');

fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

await build({
  entryPoints: [path.join(cliRoot, 'src', 'cli.ts')],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: path.join(distDir, 'cli.js'),
  banner: {
    js: '#!/usr/bin/env node\n',
  },
  minify: true,
});

fs.copyFileSync(
  path.join(root, 'src', 'data', 'standaloneSvgParts.json'),
  path.join(dataDir, 'standaloneSvgParts.json')
);
if (fs.existsSync(path.join(root, 'public', 'llms.txt'))) {
  fs.copyFileSync(path.join(root, 'public', 'llms.txt'), path.join(dataDir, 'llms.txt'));
}

const sizeKb = (fs.statSync(path.join(distDir, 'cli.js')).size / 1024).toFixed(1);
console.log(`Built packages/cli/dist/cli.js (${sizeKb} kB) and synced data/`);
