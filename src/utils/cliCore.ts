import { parseArgs } from 'node:util';
import storyConceptsJson from '../data/storyConcepts.json';
import { GITHUB_PAGES_URL, TECH_CATALOG } from '../data/catalog';
import { PresentationStyle, PreviewTheme, TechCategory } from '../types/stack';
import { AutomationBuildOptions, AutomationFormat, runAutomationBuild } from './automationRunner';
import { scanProjectDirectory } from './projectScanner';
import { filterCatalog } from './studioLogic';

const STORY_CONCEPTS = storyConceptsJson as Record<string, string>;

const HELP_TEXT = `Tech Stack Studio CLI — 542 animated & static SVG tech logos

Usage:
  techstack-studio [build] [options]
  techstack-studio search <query> [--category=<cat>] [--limit=10] [--json]
  techstack-studio detect [dir-or-file] [--json]
  techstack-studio mcp [--root=<dir>]

Build options:
  --ids=<a,b,c>           Comma-separated icon IDs or aliases (e.g. react,nodejs,pg)
  --detect[=<path>]       Auto-detect stack from a project directory or manifest file
  --format=<fmt>          svg (default) | md | html | json
  --out=<file>            Write generated output to a file
  --readme=<file>         Idempotently patch README between <!-- techstack-studio:start/end -->
  --dry-run               Preview actions without writing files
  --share-url             Print only the pre-configured Studio share URL
  --animate=<true|false>  Animated (true, default) or static SVGs (false)
  --theme=<dark|light>    Banner theme (default: dark)
  --style=<style>         tiles | minimal | cards | pills
  --preset=<id>           dark-tiles | logos-only | readme-compact | light-cards
  --cols=<1..12>          Fixed columns per row (0 = auto)
  --speed=<0.5|1|1.5>     Animation speed multiplier
  --labels=<true|false>   Show technology names under icons
  --plate=<true|false>    Show dark inner icon plate
  --header=<title>        Optional heading above the stack
  --group=<true|false>    Group icons by category
  --json                  Emit machine-readable JSON summary
  -h, --help              Show this help
`;

function parseBool(value: string | boolean | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  const lower = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(lower)) return true;
  if (['false', '0', 'no', 'off'].includes(lower)) return false;
  return undefined;
}

export function runCli(argv: string[]): number {
  if (argv.includes('-h') || argv.includes('--help')) {
    console.log(HELP_TEXT);
    return 0;
  }

  const first = argv[0];
  const subcommand = first && !first.startsWith('-') ? first.toLowerCase() : 'build';
  const rest = subcommand === first?.toLowerCase() ? argv.slice(1) : argv;

  if (subcommand === 'search') {
    const { values, positionals } = parseArgs({
      args: rest,
      allowPositionals: true,
      options: {
        category: { type: 'string' },
        limit: { type: 'string' },
        json: { type: 'boolean', default: false },
      },
    });
    const query = positionals.join(' ').trim();
    const category = (values.category || 'all') as TechCategory | 'all';
    const limit = Math.max(1, Math.min(100, Number(values.limit || '15') || 15));
    const matches = filterCatalog(TECH_CATALOG, query, category).slice(0, limit);
    const records = matches.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      aliases: item.aliases,
      animatedUrl: `${GITHUB_PAGES_URL.replace(/\/$/, '')}/icons/animated/${item.id}.svg`,
      staticUrl: `${GITHUB_PAGES_URL.replace(/\/$/, '')}/icons/source/${item.id}.svg`,
      docsUrl: item.docsUrl,
      story: STORY_CONCEPTS[item.id] || item.role,
    }));

    if (values.json) {
      console.log(JSON.stringify({ count: records.length, icons: records }, null, 2));
    } else {
      for (const r of records) {
        console.log(`${r.id.padEnd(20)} ${r.name.padEnd(22)} ${r.category}`);
      }
    }
    return 0;
  }

  if (subcommand === 'detect') {
    const { values, positionals } = parseArgs({
      args: rest,
      allowPositionals: true,
      options: {
        json: { type: 'boolean', default: false },
      },
    });
    const target = positionals[0] || '.';
    const result = scanProjectDirectory(target, TECH_CATALOG);
    if (values.json) {
      console.log(JSON.stringify(result, null, 2));
    } else if (result.ids.length === 0) {
      console.error(`No matching technologies detected in ${target}`);
      return 1;
    } else {
      console.log(result.ids.join(','));
    }
    return 0;
  }

  if (subcommand !== 'build') {
    console.error(`Unknown subcommand "${subcommand}". Run with --help for usage.`);
    return 1;
  }

  const { values } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: {
      ids: { type: 'string' },
      detect: { type: 'string' },
      format: { type: 'string' },
      out: { type: 'string' },
      readme: { type: 'string' },
      'dry-run': { type: 'boolean', default: false },
      'share-url': { type: 'boolean', default: false },
      animate: { type: 'string' },
      theme: { type: 'string' },
      style: { type: 'string' },
      preset: { type: 'string' },
      cols: { type: 'string' },
      speed: { type: 'string' },
      labels: { type: 'string' },
      plate: { type: 'string' },
      header: { type: 'string' },
      group: { type: 'string' },
      heading: { type: 'string' },
      json: { type: 'boolean', default: false },
    },
  });

  if (!values.ids && !values.detect) {
    console.error(HELP_TEXT);
    return 1;
  }

  const rawFormat = (values.format || (values.readme && !values.out ? 'md' : 'svg')).toLowerCase();
  const formatMap: Record<string, AutomationFormat> = {
    svg: 'svg',
    md: 'markdown',
    markdown: 'markdown',
    html: 'html',
    json: 'json',
  };
  const format = formatMap[rawFormat];
  if (!format) {
    console.error(`Unknown format "${rawFormat}". Use svg, md, html, or json.`);
    return 1;
  }

  const options: AutomationBuildOptions = {
    ids: values.ids
      ? values.ids
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined,
    detectPath: values.detect,
    format,
    outPath: values.out,
    readmePath: values.readme,
    dryRun: Boolean(values['dry-run']),
    animate: parseBool(values.animate),
    theme: values.theme as PreviewTheme | undefined,
    style: values.style as PresentationStyle | undefined,
    preset: values.preset,
    cols: values.cols !== undefined ? Number(values.cols) : undefined,
    speed: values.speed !== undefined ? Number(values.speed) : undefined,
    showLabels: parseBool(values.labels),
    showInnerPlate: parseBool(values.plate),
    headerTitle: values.header,
    showCategoryGrouping: parseBool(values.group),
    heading: values.heading,
  };

  try {
    const res = runAutomationBuild(options);

    if (res.unknownIds.length > 0 && !values.json && !values['share-url']) {
      console.warn(`Skipping unknown ids: ${res.unknownIds.join(', ')}`);
    }

    if (values['share-url']) {
      console.log(res.shareUrl);
      return 0;
    }

    if (values.json) {
      console.log(
        JSON.stringify(
          {
            ids: res.ids,
            unknownIds: res.unknownIds,
            matchedFiles: res.matchedFiles,
            format: res.format,
            shareUrl: res.shareUrl,
            writtenOutPath: res.writtenOutPath || null,
            patchedReadmePath: res.patchedReadmePath || null,
            readmeChanged: res.readmeChanged ?? false,
            readmeMode: res.readmeMode || null,
          },
          null,
          2
        )
      );
      return 0;
    }

    if (!values.out && !values.readme) {
      process.stdout.write(res.output + (res.output.endsWith('\n') ? '' : '\n'));
      return 0;
    }

    if (res.writtenOutPath) {
      console.log(
        `wrote ${values.out} (${res.output.length} bytes, ${res.ids.length} icons: ${res.ids.join(', ')})`
      );
    }
    if (res.patchedReadmePath) {
      const verb = values['dry-run']
        ? 'would update'
        : res.readmeChanged
          ? res.readmeMode
          : 'unchanged';
      console.log(`readme ${verb}: ${values.readme} (${res.ids.length} icons)`);
    }
    return 0;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return 1;
  }
}
