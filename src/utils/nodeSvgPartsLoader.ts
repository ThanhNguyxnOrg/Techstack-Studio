import fs from 'node:fs';
import path from 'node:path';
import { registerStandaloneSvgParts, StandaloneSvgPartEntry } from './svgPartsStore';

let loaded = false;

/**
 * Node-only loader used by the banner CLI and unit tests so standaloneSvgParts.json
 * is never pulled into the browser Vite bundle.
 */
export function loadNodeStandaloneSvgParts(): void {
  if (loaded) return;
  const partsPath = path.resolve(process.cwd(), 'src/data/standaloneSvgParts.json');
  const data = JSON.parse(fs.readFileSync(partsPath, 'utf8')) as Record<
    string,
    StandaloneSvgPartEntry
  >;
  registerStandaloneSvgParts(data);
  loaded = true;
}
