// Story registry: one file per catalog category, merged here.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

export async function loadStories() {
  const all = {};
  for (const file of fs.readdirSync(dir).sort()) {
    if (file === 'index.mjs' || !file.endsWith('.mjs')) continue;
    const mod = await import(pathToFileURL(path.join(dir, file)).href + `?t=${Date.now()}`);
    for (const [id, spec] of Object.entries(mod.default || {})) {
      if (all[id]) throw new Error(`Story for ${id} defined twice (${file})`);
      all[id] = spec;
    }
  }
  return all;
}
