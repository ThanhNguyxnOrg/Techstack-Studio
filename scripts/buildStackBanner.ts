import { loadNodeStandaloneSvgParts } from '../src/utils/nodeSvgPartsLoader';
import { runCli } from '../src/utils/cliCore';

loadNodeStandaloneSvgParts();
process.exitCode = runCli(process.argv.slice(2));
