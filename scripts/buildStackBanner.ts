import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_CUSTOMIZATION_SETTINGS, TECH_CATALOG } from '../src/data/catalog';
import { generateExportOutput } from '../src/utils/studioLogic';
import type { CustomizationSettings, ExportFormat, TechItem } from '../src/types/stack';

const lookup = new Map<string, TechItem>();
for (const item of TECH_CATALOG) {
  lookup.set(item.id.toLowerCase(), item);
  for (const alias of item.aliases || []) lookup.set(String(alias).toLowerCase(), item);
}

const args = process.argv.slice(2);
const flag = (name: string, fallback?: string) => {
  const prefix = `--${name}=`;
  const inline = args.find((value) => value.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(`--${name}`);
  if (index >= 0 && args[index + 1]) return args[index + 1];
  return fallback;
};

const idsArg = flag('ids', '');
const out = flag('out', 'stack.svg');
const formatArg = (flag('format', 'svg') || 'svg').toLowerCase();
const format: ExportFormat =
  formatArg === 'md' || formatArg === 'markdown'
    ? 'markdown'
    : formatArg === 'html'
      ? 'html'
      : 'svg';
const theme = (flag('theme', 'dark') || 'dark') as CustomizationSettings['theme'];
const cols = Number(flag('cols', '0'));
const speed = Number(flag('speed', '1'));

if (!idsArg.trim()) {
  console.error(
    'Usage: npm run stack -- --ids=react,nodejs,postgresql [--out=stack.svg] [--format=svg|md|html] [--theme=dark|light] [--cols=5] [--speed=1.5]'
  );
  process.exit(1);
}

if (!['svg', 'md', 'markdown', 'html'].includes(formatArg)) {
  console.error(`Unknown format "${formatArg}". Use svg, md or html.`);
  process.exit(1);
}

const requested = idsArg
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const selected: TechItem[] = [];
const unknown: string[] = [];

for (const id of requested) {
  const item = lookup.get(id.toLowerCase());
  if (!item) {
    unknown.push(id);
    continue;
  }
  if (!selected.some((existing) => existing.id === item.id)) selected.push(item);
}

if (unknown.length) {
  console.warn(`Skipping unknown ids: ${unknown.join(', ')}`);
}

if (!selected.length) {
  console.error('No known ids given; nothing to build.');
  process.exit(1);
}

const settings: CustomizationSettings = {
  ...DEFAULT_CUSTOMIZATION_SETTINGS,
  theme,
  itemsPerRow: Number.isFinite(cols) && cols > 0 ? Math.min(12, Math.max(1, cols)) : 0,
  animationSpeedMultiplier: Number.isFinite(speed) && speed > 0 ? speed : 1,
};

const output = generateExportOutput(format, selected, settings);
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, output, 'utf8');

console.log(
  `wrote ${out} (${output.length} bytes, ${selected.length} icons: ${selected
    .map((item) => item.id)
    .join(', ')})`
);
