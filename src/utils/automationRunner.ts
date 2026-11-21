import fs from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_CUSTOMIZATION_SETTINGS,
  GITHUB_PAGES_URL,
  STUDIO_PRESETS,
  TECH_CATALOG,
} from '../data/catalog';
import {
  CustomizationSettings,
  ExportFormat,
  PresentationStyle,
  PreviewTheme,
  TechItem,
} from '../types/stack';
import { scanProjectDirectory } from './projectScanner';
import { patchReadmeContent } from './readmePatcher';
import {
  generateExportOutput,
  resolveSelectedItems,
  sanitizeSettings,
  writeShareUrlParams,
} from './studioLogic';

export type AutomationFormat = ExportFormat | 'json';

export interface AutomationBuildOptions {
  ids?: string[];
  detectPath?: string;
  format?: AutomationFormat;
  outPath?: string;
  readmePath?: string;
  dryRun?: boolean;
  animate?: boolean;
  theme?: PreviewTheme;
  style?: PresentationStyle;
  preset?: string;
  cols?: number;
  speed?: number;
  showLabels?: boolean;
  showInnerPlate?: boolean;
  headerTitle?: string;
  showCategoryGrouping?: boolean;
  heading?: string;
}

export interface AutomationBuildResult {
  ids: string[];
  unknownIds: string[];
  matchedFiles: string[];
  settings: CustomizationSettings;
  format: AutomationFormat;
  output: string;
  shareUrl: string;
  writtenOutPath?: string;
  patchedReadmePath?: string;
  readmeChanged?: boolean;
  readmeMode?: 'updated' | 'appended';
}

export function buildShareUrl(
  ids: string[],
  settings: CustomizationSettings,
  baseUrl: string = GITHUB_PAGES_URL
): string {
  const url = new URL(baseUrl);
  writeShareUrlParams(url.searchParams, ids, settings);
  return url.toString();
}

export function buildLookupMap(catalog: TechItem[] = TECH_CATALOG): Map<string, TechItem> {
  const map = new Map<string, TechItem>();
  for (const item of catalog) {
    map.set(item.id.toLowerCase(), item);
    for (const alias of item.aliases || []) {
      const key = String(alias).toLowerCase().trim();
      if (key && !map.has(key)) map.set(key, item);
    }
  }
  return map;
}

export function resolveCanonicalIds(
  requested: string[],
  catalog: TechItem[] = TECH_CATALOG
): { items: TechItem[]; unknownIds: string[] } {
  const lookup = buildLookupMap(catalog);
  const items: TechItem[] = [];
  const unknownIds: string[] = [];

  for (const raw of requested) {
    const key = raw.trim().toLowerCase();
    if (!key) continue;
    const direct = lookup.get(key) || resolveSelectedItems([key])[0];
    if (!direct) {
      unknownIds.push(raw.trim());
      continue;
    }
    if (!items.some((existing) => existing.id === direct.id)) {
      items.push(direct);
    }
  }

  return { items, unknownIds };
}

export function resolveAutomationSettings(options: AutomationBuildOptions): CustomizationSettings {
  let base: Partial<CustomizationSettings> = { ...DEFAULT_CUSTOMIZATION_SETTINGS };

  if (options.preset) {
    const preset = STUDIO_PRESETS.find((p) => p.id === options.preset);
    if (!preset) {
      const valid = STUDIO_PRESETS.map((p) => p.id).join(', ');
      throw new Error(`Unknown preset "${options.preset}". Valid presets: ${valid}`);
    }
    base = { ...base, ...preset.settings };
  }

  if (options.animate !== undefined) base.animateSvgLogos = options.animate;
  if (options.theme !== undefined) base.theme = options.theme;
  if (options.style !== undefined) base.presentationStyle = options.style;
  if (options.cols !== undefined && Number.isFinite(options.cols)) {
    base.itemsPerRow = Math.max(0, Math.min(12, Math.round(options.cols)));
  }
  if (options.speed !== undefined && Number.isFinite(options.speed)) {
    base.animationSpeedMultiplier = options.speed;
  }
  if (options.showLabels !== undefined) base.showLabels = options.showLabels;
  if (options.showInnerPlate !== undefined) base.showInnerPlate = options.showInnerPlate;
  if (options.showCategoryGrouping !== undefined) {
    base.showCategoryGrouping = options.showCategoryGrouping;
  }
  if (options.headerTitle !== undefined) {
    base.showHeader = options.headerTitle.trim().length > 0;
    base.headerTitle = options.headerTitle;
  }

  return sanitizeSettings(base);
}

/**
 * Shared automation entry point used by the local CLI, npm CLI, and MCP tools.
 * Caller is responsible for registering standalone SVG parts before invoking
 * when format is 'svg' or 'html'.
 */
export function runAutomationBuild(
  options: AutomationBuildOptions,
  catalog: TechItem[] = TECH_CATALOG
): AutomationBuildResult {
  const matchedFiles: string[] = [];
  const combinedRequested: string[] = [...(options.ids || [])];

  if (options.detectPath) {
    const scanned = scanProjectDirectory(options.detectPath, catalog);
    matchedFiles.push(...scanned.matchedFiles);
    combinedRequested.push(...scanned.ids);
  }

  const { items, unknownIds } = resolveCanonicalIds(combinedRequested, catalog);
  if (items.length === 0) {
    throw new Error('No technologies resolved. Pass --ids=... or --detect <path>.');
  }

  const ids = items.map((item) => item.id);
  const settings = resolveAutomationSettings(options);
  const format: AutomationFormat = options.format || 'svg';
  const shareUrl = buildShareUrl(ids, settings);

  const output =
    format === 'json'
      ? JSON.stringify(
          {
            ids,
            unknownIds,
            matchedFiles,
            settings,
            shareUrl,
            markdown: generateExportOutput('markdown', items, settings),
          },
          null,
          2
        )
      : generateExportOutput(format, items, settings);

  const result: AutomationBuildResult = {
    ids,
    unknownIds,
    matchedFiles,
    settings,
    format,
    output,
    shareUrl,
  };

  if (options.outPath && !options.dryRun) {
    const resolvedOut = path.resolve(options.outPath);
    fs.mkdirSync(path.dirname(resolvedOut), { recursive: true });
    fs.writeFileSync(resolvedOut, output, 'utf8');
    result.writtenOutPath = resolvedOut;
  }

  if (options.readmePath) {
    const resolvedReadme = path.resolve(options.readmePath);
    const existing = fs.existsSync(resolvedReadme) ? fs.readFileSync(resolvedReadme, 'utf8') : '';

    let block: string;
    if (format === 'svg' && options.outPath) {
      const rel = path
        .relative(path.dirname(resolvedReadme), path.resolve(options.outPath))
        .replace(/\\/g, '/');
      const src = rel.startsWith('.') ? rel : `./${rel}`;
      block = `<p align="center">\n  <a href="${shareUrl}"><img src="${src}" alt="Tech Stack" /></a>\n</p>`;
    } else if (format === 'markdown') {
      block = output;
    } else {
      block = generateExportOutput('markdown', items, settings);
    }

    const patched = patchReadmeContent(existing, block, { heading: options.heading });
    result.patchedReadmePath = resolvedReadme;
    result.readmeChanged = patched.changed;
    result.readmeMode = patched.mode;

    if (!options.dryRun && patched.changed) {
      fs.mkdirSync(path.dirname(resolvedReadme), { recursive: true });
      fs.writeFileSync(resolvedReadme, patched.content, 'utf8');
    }
  }

  return result;
}
