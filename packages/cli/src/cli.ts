import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { runCli } from '../../../src/utils/cliCore';
import {
  registerStandaloneSvgParts,
  StandaloneSvgPartEntry,
} from '../../../src/utils/svgPartsStore';
import { startMcpServer } from './mcp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', 'data');
const partsFile = path.join(dataDir, 'standaloneSvgParts.json');
const llmsGuideFile = path.join(dataDir, 'llms.txt');

if (fs.existsSync(partsFile)) {
  const parts = JSON.parse(fs.readFileSync(partsFile, 'utf8')) as Record<
    string,
    StandaloneSvgPartEntry
  >;
  registerStandaloneSvgParts(parts);
}

const argv = process.argv.slice(2);
if (argv[0] === 'mcp') {
  const { values } = parseArgs({
    args: argv.slice(1),
    allowPositionals: true,
    options: {
      root: { type: 'string' },
    },
  });
  const rootDir = values.root || process.env.TECHSTACK_STUDIO_ROOT || undefined;
  startMcpServer({ rootDir, llmsGuidePath: llmsGuideFile });
} else {
  process.exitCode = runCli(argv);
}
