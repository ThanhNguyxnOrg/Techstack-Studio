import {
  DEFAULT_CUSTOMIZATION_SETTINGS,
  DEFAULT_STARTER_STACK_IDS,
  TECH_BY_ID,
  TECH_CATEGORIES,
} from '../data/catalog';
import standaloneSvgPartsJson from '../data/standaloneSvgParts.json';
import {
  ALL_SVG_MOTION_FAMILIES,
  CatalogSortMode,
  CustomizationSettings,
  ExportFormat,
  ManifestValidationResult,
  PersistedStudioState,
  PresentationStyle,
  PreviewTheme,
  StackAlignment,
  SvgMotionFamily,
  TechCategory,
  TechItem,
  WebAnimationStyle,
} from '../types/stack';
import { scopeStandaloneSvgParts } from './svgAssetLoader';

export const STORAGE_KEY = 'tech_stack_studio_state_v3';

interface StandaloneSvgPartEntry {
  defs: string;
  style: string;
  body: string;
  staticBody: string;
  concept: string;
  technique: string;
}

const STANDALONE_SVG_PARTS = standaloneSvgPartsJson as Record<string, StandaloneSvgPartEntry>;

/**
 * Escapes HTML & XML special characters to prevent injection in generated Markdown, HTML, and SVG.
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates the entire technology catalog manifest for authenticity, uniqueness,
 * SVG path completeness, provenance, license, and motion family coverage.
 */
export function validateCatalogManifest(catalog: readonly TechItem[]): ManifestValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const motionFamiliesUsed = new Set<SvgMotionFamily>();
  let verifiedCount = 0;
  let tierACount = 0;
  let tierBCount = 0;
  let tierCCount = 0;

  for (const item of catalog) {
    if (!item.id || seenIds.has(item.id)) {
      errors.push(`Duplicate or missing id: ${item.id}`);
    }
    seenIds.add(item.id);

    if (!item.name || !item.svgPath || item.svgPath.trim().length < 8) {
      errors.push(`Invalid or empty SVG path for ${item.id}`);
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(item.brandColor)) {
      errors.push(`Invalid brandColor "${item.brandColor}" for ${item.id}`);
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(item.darkSafeColor)) {
      errors.push(`Invalid darkSafeColor "${item.darkSafeColor}" for ${item.id}`);
    }

    if (!item.provenance || !item.license || !item.evidenceSource) {
      errors.push(`Missing provenance/license/evidence metadata for ${item.id}`);
    }

    if (!item.motionRecipe || !ALL_SVG_MOTION_FAMILIES.includes(item.motionRecipe.family)) {
      errors.push(`Invalid motion family for ${item.id}`);
    } else {
      motionFamiliesUsed.add(item.motionRecipe.family);
    }

    if (item.verified) {
      verifiedCount += 1;
    }

    if (item.tier === 'A') tierACount += 1;
    else if (item.tier === 'B') tierBCount += 1;
    else if (item.tier === 'C') tierCCount += 1;
  }

  return {
    valid: errors.length === 0,
    totalCount: catalog.length,
    verifiedCount,
    tierACount,
    tierBCount,
    tierCCount,
    distinctMotionFamilies: motionFamiliesUsed.size,
    errors,
  };
}

/**
 * Resolves any legacy ID or canonical ID into the canonical catalog ID if available.
 */
function resolveCanonicalId(techId: string): string | null {
  if (!techId) return null;
  const item = TECH_BY_ID[techId];
  return item ? item.id : null;
}

/**
 * Adds a technology ID to the selected stack if it exists in the catalog and is not already selected.
 */
export function addTechToStack(stack: readonly string[], techId: string): string[] {
  const canonicalId = resolveCanonicalId(techId);
  if (!canonicalId) {
    return [...stack];
  }
  const existingCanonical = stack.map((id) => resolveCanonicalId(id) ?? id);
  if (existingCanonical.includes(canonicalId) || stack.includes(techId)) {
    return [...stack];
  }
  return [...stack, canonicalId];
}

/**
 * Removes a technology ID from the selected stack.
 */
export function removeTechFromStack(stack: readonly string[], techId: string): string[] {
  const canonicalId = resolveCanonicalId(techId) ?? techId;
  return stack.filter((id) => id !== techId && (resolveCanonicalId(id) ?? id) !== canonicalId);
}

/**
 * Toggles a technology ID in the selected stack.
 */
export function toggleTechInStack(stack: readonly string[], techId: string): string[] {
  const canonicalId = resolveCanonicalId(techId) ?? techId;
  const isPresent = stack.some(
    (id) => id === techId || (resolveCanonicalId(id) ?? id) === canonicalId
  );
  if (isPresent) {
    return removeTechFromStack(stack, techId);
  }
  return addTechToStack(stack, techId);
}

/**
 * Moves a selected technology item within the ordered stack.
 */
export function moveTechInStack(
  stack: readonly string[],
  techId: string,
  direction: 'left' | 'right' | 'first' | 'last'
): string[] {
  const canonicalId = resolveCanonicalId(techId) ?? techId;
  const index = stack.findIndex(
    (id) => id === techId || (resolveCanonicalId(id) ?? id) === canonicalId
  );
  if (index === -1 || stack.length <= 1) {
    return [...stack];
  }

  const next = [...stack];
  if (direction === 'left') {
    if (index === 0) return next;
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    return next;
  }

  if (direction === 'right') {
    if (index === next.length - 1) return next;
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    return next;
  }

  if (direction === 'first') {
    if (index === 0) return next;
    const [item] = next.splice(index, 1);
    next.unshift(item);
    return next;
  }

  if (direction === 'last') {
    if (index === next.length - 1) return next;
    const [item] = next.splice(index, 1);
    next.push(item);
    return next;
  }

  return next;
}

/**
 * Reorders a selected technology to the drop target's position.
 * IDs stay canonical and unknown IDs are ignored.
 */
export function reorderTechInStack(
  stack: readonly string[],
  sourceId: string,
  targetId: string
): string[] {
  const sourceCanonical = resolveCanonicalId(sourceId) ?? sourceId;
  const targetCanonical = resolveCanonicalId(targetId) ?? targetId;
  const sourceIndex = stack.findIndex((id) => (resolveCanonicalId(id) ?? id) === sourceCanonical);
  const targetIndex = stack.findIndex((id) => (resolveCanonicalId(id) ?? id) === targetCanonical);

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return [...stack];

  const next = [...stack];
  const [source] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, source);
  return next;
}

/**
 * Filters the technology catalog by search query, category, and optional subcategory.
 * Matches canonical names, IDs, roles, categories, subcategories, and community aliases.
 */
export function filterCatalog(
  catalog: readonly TechItem[],
  query: string,
  category: TechCategory | 'all',
  subcategory: string = 'all'
): TechItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  return catalog.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;

    const matchesSubcategory =
      !subcategory || subcategory === 'all' || item.subcategory === subcategory;
    if (!matchesSubcategory) return false;

    if (!normalizedQuery) return true;

    const aliasMatch =
      Array.isArray(item.aliases) &&
      item.aliases.some((alias) => alias.toLowerCase().includes(normalizedQuery));

    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.id.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery) ||
      (item.subcategory && item.subcategory.toLowerCase().includes(normalizedQuery)) ||
      item.role.toLowerCase().includes(normalizedQuery) ||
      item.monogram.toLowerCase().includes(normalizedQuery) ||
      aliasMatch
    );
  });
}

const TIER_WEIGHT: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
};

/**
 * Sorts filtered catalog items by Community Popularity (default), Alphabetical (A-Z), or Subcategory.
 */
export function sortCatalogItems(
  items: readonly TechItem[],
  mode: CatalogSortMode = 'popularity'
): TechItem[] {
  const copy = [...items];

  if (mode === 'alphabetical') {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (mode === 'subcategory') {
    return copy.sort((a, b) => {
      const subCmp = (a.subcategory || '').localeCompare(b.subcategory || '');
      if (subCmp !== 0) return subCmp;
      return a.categoryRank - b.categoryRank;
    });
  }

  return copy.sort((a, b) => {
    if (a.category === b.category) {
      return a.categoryRank - b.categoryRank;
    }
    const tierDiff = (TIER_WEIGHT[a.tier] ?? 3) - (TIER_WEIGHT[b.tier] ?? 3);
    if (tierDiff !== 0) return tierDiff;
    if (a.categoryRank !== b.categoryRank) return a.categoryRank - b.categoryRank;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Resolves an array of tech IDs into full TechItem objects, dropping unknown or duplicate IDs.
 */
export function resolveSelectedItems(selectedIds: readonly string[]): TechItem[] {
  const seen = new Set<string>();
  const resolved: TechItem[] = [];

  for (const id of selectedIds) {
    if (typeof id !== 'string') continue;
    const item = TECH_BY_ID[id];
    if (item && !seen.has(item.id)) {
      seen.add(item.id);
      resolved.push(item);
    }
  }

  return resolved;
}

/**
 * Clamps a numeric setting within [min, max], returning fallback if NaN.
 */
function clampNumber(val: unknown, min: number, max: number, fallback: number): number {
  if (typeof val !== 'number' || Number.isNaN(val)) return fallback;
  return Math.min(max, Math.max(min, Math.round(val)));
}

/**
 * Validates and normalizes customization settings, falling back safely for invalid fields.
 */
export function sanitizeSettings(raw: unknown): CustomizationSettings {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_CUSTOMIZATION_SETTINGS };
  }

  const candidate = raw as Partial<Record<keyof CustomizationSettings, unknown>>;

  const validThemes: PreviewTheme[] = ['dark', 'light'];
  const validAlignments: StackAlignment[] = ['left', 'center', 'right'];
  const validStyles: PresentationStyle[] = ['tiles', 'minimal', 'cards', 'pills'];
  const validAnimations: WebAnimationStyle[] = ['none', 'float', 'pulse', 'wave'];

  const theme: PreviewTheme = validThemes.includes(candidate.theme as PreviewTheme)
    ? (candidate.theme as PreviewTheme)
    : DEFAULT_CUSTOMIZATION_SETTINGS.theme;

  const alignment: StackAlignment = validAlignments.includes(candidate.alignment as StackAlignment)
    ? (candidate.alignment as StackAlignment)
    : DEFAULT_CUSTOMIZATION_SETTINGS.alignment;

  const presentationStyle: PresentationStyle = validStyles.includes(
    candidate.presentationStyle as PresentationStyle
  )
    ? (candidate.presentationStyle as PresentationStyle)
    : DEFAULT_CUSTOMIZATION_SETTINGS.presentationStyle;

  const animationStyle: WebAnimationStyle = validAnimations.includes(
    candidate.animationStyle as WebAnimationStyle
  )
    ? (candidate.animationStyle as WebAnimationStyle)
    : DEFAULT_CUSTOMIZATION_SETTINGS.animationStyle;

  const iconSize = clampNumber(candidate.iconSize, 28, 72, DEFAULT_CUSTOMIZATION_SETTINGS.iconSize);
  const spacing = clampNumber(candidate.spacing, 6, 32, DEFAULT_CUSTOMIZATION_SETTINGS.spacing);
  const rawPerRow = clampNumber(
    candidate.itemsPerRow,
    0,
    12,
    DEFAULT_CUSTOMIZATION_SETTINGS.itemsPerRow
  );
  const itemsPerRow = rawPerRow > 0 && rawPerRow < 3 ? 3 : rawPerRow;

  const showLabels =
    typeof candidate.showLabels === 'boolean'
      ? candidate.showLabels
      : DEFAULT_CUSTOMIZATION_SETTINGS.showLabels;

  const showInnerPlate =
    typeof candidate.showInnerPlate === 'boolean'
      ? candidate.showInnerPlate
      : Boolean(DEFAULT_CUSTOMIZATION_SETTINGS.showInnerPlate);

  const animateSvgLogos =
    typeof candidate.animateSvgLogos === 'boolean'
      ? candidate.animateSvgLogos
      : DEFAULT_CUSTOMIZATION_SETTINGS.animateSvgLogos;

  const animationSpeedMultiplier =
    typeof candidate.animationSpeedMultiplier === 'number' &&
    [0.5, 1, 1.5].includes(candidate.animationSpeedMultiplier)
      ? candidate.animationSpeedMultiplier
      : DEFAULT_CUSTOMIZATION_SETTINGS.animationSpeedMultiplier;

  const assetBaseUrl =
    typeof candidate.assetBaseUrl === 'string' && candidate.assetBaseUrl.trim().length > 0
      ? candidate.assetBaseUrl.trim().replace(/\/+$/, '').slice(0, 160)
      : DEFAULT_CUSTOMIZATION_SETTINGS.assetBaseUrl ||
        'https://thanhnguyxnorg.github.io/Techstack-Studio';

  const showHeader =
    typeof candidate.showHeader === 'boolean'
      ? candidate.showHeader
      : DEFAULT_CUSTOMIZATION_SETTINGS.showHeader;

  const showCategoryGrouping =
    typeof candidate.showCategoryGrouping === 'boolean'
      ? candidate.showCategoryGrouping
      : DEFAULT_CUSTOMIZATION_SETTINGS.showCategoryGrouping;

  const linkIconsToDocs =
    typeof candidate.linkIconsToDocs === 'boolean'
      ? candidate.linkIconsToDocs
      : DEFAULT_CUSTOMIZATION_SETTINGS.linkIconsToDocs;

  const headerTitle =
    typeof candidate.headerTitle === 'string'
      ? candidate.headerTitle.slice(0, 90)
      : DEFAULT_CUSTOMIZATION_SETTINGS.headerTitle;

  const headerSubtitle =
    typeof candidate.headerSubtitle === 'string'
      ? candidate.headerSubtitle.slice(0, 140)
      : DEFAULT_CUSTOMIZATION_SETTINGS.headerSubtitle;

  return {
    theme,
    iconSize,
    spacing,
    alignment,
    itemsPerRow,
    showLabels,
    showInnerPlate,
    presentationStyle,
    animationStyle,
    animateSvgLogos,
    animationSpeedMultiplier,
    assetBaseUrl,
    showHeader,
    headerTitle,
    headerSubtitle,
    showCategoryGrouping,
    linkIconsToDocs,
  };
}

/**
 * Parses and validates persisted LocalStorage JSON safely.
 */
export function parsePersistedState(rawJson: string | null): PersistedStudioState {
  const fallback: PersistedStudioState = {
    version: 1,
    selectedIds: [...DEFAULT_STARTER_STACK_IDS],
    settings: { ...DEFAULT_CUSTOMIZATION_SETTINGS },
  };

  if (!rawJson || typeof rawJson !== 'string') {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return fallback;
    }

    const settings = sanitizeSettings(parsed.settings);
    let selectedIds: string[] = [...DEFAULT_STARTER_STACK_IDS];

    if (Array.isArray(parsed.selectedIds)) {
      const seen = new Set<string>();
      const validIds: string[] = [];
      for (const id of parsed.selectedIds) {
        if (typeof id === 'string') {
          const item = TECH_BY_ID[id];
          if (item && !seen.has(item.id)) {
            seen.add(item.id);
            validIds.push(item.id);
          }
        }
      }
      selectedIds = validIds;
    }

    return {
      version: 1,
      selectedIds,
      settings,
    };
  } catch {
    return fallback;
  }
}

/**
 * Serializes studio state into JSON for LocalStorage persistence.
 */
export function serializePersistedState(state: PersistedStudioState): string {
  const cleanIds = resolveSelectedItems(state.selectedIds).map((item) => item.id);
  const cleanSettings = sanitizeSettings(state.settings);
  return JSON.stringify({
    version: 1,
    selectedIds: cleanIds,
    settings: cleanSettings,
  });
}

/**
 * Returns the canonical SVG `<defs>`, `<style>`, and inner body markup for a technology item,
 * sourced directly from its standalone `public/icons/animated/{id}.svg` and `public/icons/source/{id}.svg` files.
 */
export function buildInternalSvgAnimationMarkup(
  item: TechItem,
  uid: string,
  options: {
    theme?: PreviewTheme;
    animate?: boolean;
    speedMultiplier?: number;
  } = {}
): { defs: string; style: string; body: string } {
  const animate = options.animate ?? true;
  const speed =
    options.speedMultiplier && options.speedMultiplier > 0 ? options.speedMultiplier : 1;

  // Keep TypeScript on the official Microsoft glyph; use the restored a93 sheen only in animated mode.
  if (item.id === 'typescript') {
    const officialMark =
      '<g transform="scale(.046875)"><rect width="512" height="512" rx="50" fill="#3178c6"/><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="m316.939 407.424v50.061c8.138 4.172 17.763 7.3 28.875 9.386s22.823 3.129 35.135 3.129c11.999 0 23.397-1.147 34.196-3.442 10.799-2.294 20.268-6.075 28.406-11.342 8.138-5.266 14.581-12.15 19.328-20.65s7.121-19.007 7.121-31.522c0-9.074-1.356-17.026-4.069-23.857s-6.625-12.906-11.738-18.225c-5.112-5.319-11.242-10.091-18.389-14.315s-15.207-8.213-24.18-11.967c-6.573-2.712-12.468-5.345-17.685-7.9-5.217-2.556-9.651-5.163-13.303-7.822-3.652-2.66-6.469-5.476-8.451-8.448-1.982-2.973-2.974-6.336-2.974-10.091 0-3.441.887-6.544 2.661-9.308s4.278-5.136 7.512-7.118c3.235-1.981 7.199-3.52 11.894-4.615 4.696-1.095 9.912-1.642 15.651-1.642 4.173 0 8.581.313 13.224.938 4.643.626 9.312 1.591 14.008 2.894 4.695 1.304 9.259 2.947 13.694 4.928 4.434 1.982 8.529 4.276 12.285 6.884v-46.776c-7.616-2.92-15.937-5.084-24.962-6.492s-19.381-2.112-31.066-2.112c-11.895 0-23.163 1.278-33.805 3.833s-20.006 6.544-28.093 11.967c-8.086 5.424-14.476 12.333-19.171 20.729-4.695 8.395-7.043 18.433-7.043 30.114 0 14.914 4.304 27.638 12.912 38.172 8.607 10.533 21.675 19.45 39.204 26.751 6.886 2.816 13.303 5.579 19.25 8.291s11.086 5.528 15.415 8.448c4.33 2.92 7.747 6.101 10.252 9.543 2.504 3.441 3.756 7.352 3.756 11.733 0 3.233-.783 6.231-2.348 8.995s-3.939 5.162-7.121 7.196-7.147 3.624-11.894 4.771c-4.748 1.148-10.303 1.721-16.668 1.721-10.851 0-21.597-1.903-32.24-5.71-10.642-3.806-20.502-9.516-29.579-17.13zm-84.159-123.342h64.22v-41.082h-179v41.082h63.906v182.918h50.874z"/></g>';
    if (!animate) {
      return { defs: '', style: '', body: officialMark };
    }

    const kSheen = `tss_${uid}_shine`;
    const cSheen = `tss_${uid}_clip`;
    const gSheen = `tss_${uid}_sheen`;
    const defs =
      `<clipPath id="${cSheen}"><rect width="24" height="24" rx="2.34375"/></clipPath>` +
      `<linearGradient id="${gSheen}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
    const style = `@keyframes ${kSheen}{0%,20%{transform:translateX(-30px);opacity:0}32%{opacity:.8}68%,100%{transform:translateX(30px);opacity:0}}.${kSheen}{animation:${kSheen} ${(4.8 / speed).toFixed(2)}s cubic-bezier(.22,1,.36,1) infinite}@media(prefers-reduced-motion:reduce){.${kSheen}{animation:none!important;opacity:0!important}}`;
    const body =
      officialMark +
      `<g clip-path="url(#${cSheen})"><rect class="${kSheen}" x="-5" y="0" width="34" height="24" fill="url(#${gSheen})" transform="skewX(-20)"/></g>`;
    return { defs, style, body };
  }

  const entry = STANDALONE_SVG_PARTS[item.id];
  if (!entry) {
    return {
      defs: '',
      style: '',
      body: `<path fill="${item.darkSafeColor}" fill-rule="evenodd" d="${item.svgPath}"/>`,
    };
  }

  if (!animate) {
    return {
      defs: '',
      style: '',
      body: entry.staticBody,
    };
  }

  return scopeStandaloneSvgParts(
    {
      defs: entry.defs,
      style: entry.style,
      body: entry.body,
    },
    item,
    uid,
    speed
  );
}

/**
 * Generates a standalone animated (or static) SVG document for a single technology icon,
 * enclosed in a unified dark obsidian icon plate (#131822) so brand colors never clash with any background.
 */
export function generateAnimatedSingleIconSvg(
  item: TechItem,
  options: {
    size?: number;
    theme?: PreviewTheme;
    animate?: boolean;
    speedMultiplier?: number;
    showPlate?: boolean;
  } = {}
): string {
  const size = options.size ?? 48;
  const theme = options.theme ?? 'dark';
  const animate = options.animate ?? true;
  const speedMultiplier = options.speedMultiplier ?? 1;
  const showPlate = options.showPlate ?? true;
  const uid = item.id.replace(/[^a-zA-Z0-9]/g, '');

  const parts = buildInternalSvgAnimationMarkup(item, uid, {
    theme,
    animate,
    speedMultiplier,
  });

  const defsBlock = parts.defs ? `<defs>${parts.defs}</defs>` : '';
  const styleBlock = parts.style ? `<style>${parts.style}</style>` : '';
  const viewBox = item.svgViewBox || '0 0 24 24';
  const vbParts = viewBox.split(/\s+/).map(Number);
  const vbWidth = Number.isFinite(vbParts[2]) && vbParts[2] > 0 ? vbParts[2] : 24;
  const vbHeight = Number.isFinite(vbParts[3]) && vbParts[3] > 0 ? vbParts[3] : vbWidth;

  if (!showPlate) {
    const pad = vbWidth * 0.05;
    const scale = 0.9;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" role="img" aria-label="${escapeHtml(item.name)}">${defsBlock}${styleBlock}<g transform="translate(${pad.toFixed(2)}, ${pad.toFixed(2)}) scale(${scale})">${parts.body}</g></svg>`;
  }

  const platePad = vbWidth * 0.125;
  const plateScale = 0.75;
  const rx = (vbWidth * 0.1875).toFixed(1);
  const strokeW = (vbWidth / 30).toFixed(1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" role="img" aria-label="${escapeHtml(item.name)}">${defsBlock}${styleBlock}<rect x="${(vbWidth * 0.02).toFixed(1)}" y="${(vbHeight * 0.02).toFixed(1)}" width="${(vbWidth * 0.96).toFixed(1)}" height="${(vbHeight * 0.96).toFixed(1)}" rx="${rx}" fill="#131822" stroke="#242E3E" stroke-width="${strokeW}"/><g transform="translate(${platePad.toFixed(2)}, ${platePad.toFixed(2)}) scale(${plateScale})">${parts.body}</g></svg>`;
}

/**
 * Generates a deterministic data-URI SVG fallback icon for any technology item.
 */
export function createFallbackSvgDataUri(
  item: TechItem,
  size: number,
  theme: PreviewTheme = 'dark'
): string {
  const svg = generateAnimatedSingleIconSvg(item, {
    size,
    theme,
    animate: true,
    speedMultiplier: 1,
  });
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Groups items into rows when `itemsPerRow > 0`, or returns a single group when auto-wrapping.
 */
export function chunkItems<T>(items: readonly T[], itemsPerRow: number): T[][] {
  if (itemsPerRow <= 0 || items.length === 0) {
    return [[...items]];
  }
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += itemsPerRow) {
    chunks.push(items.slice(i, i + itemsPerRow));
  }
  return chunks;
}

/**
 * Groups items by their category while preserving catalog category order.
 */
export function groupItemsByCategory(
  items: readonly TechItem[]
): Array<{ category: TechCategory; items: TechItem[] }> {
  const grouped: Array<{ category: TechCategory; items: TechItem[] }> = [];
  for (const category of TECH_CATEGORIES) {
    const matching = items.filter((item) => item.category === category);
    if (matching.length > 0) {
      grouped.push({ category, items: matching });
    }
  }
  return grouped;
}

/**
 * Resolves the external image URL for GitHub README Markdown exports.
 */
export function getReadmeExportIconUrl(item: TechItem, settings: CustomizationSettings): string {
  const base = (
    settings.assetBaseUrl || 'https://thanhnguyxnorg.github.io/Techstack-Studio'
  ).replace(/\/+$/, '');
  const assetPath =
    settings.animateSvgLogos === false
      ? item.sourceSvgPath || `/icons/source/${item.id}.svg`
      : item.animatedSvgPath || `/icons/animated/${item.id}.svg`;

  return `${base}/${assetPath.replace(/^\/+/, '')}`;
}

/**
 * Generates GitHub README-compatible Markdown (using GitHub-sanitized HTML & img tags).
 */
export function generateReadmeMarkdown(
  items: readonly TechItem[],
  rawSettings: CustomizationSettings
): string {
  const settings = sanitizeSettings(rawSettings);
  const lines: string[] = [];

  if (items.length === 0) {
    return '<!-- Select technologies to generate README Markdown -->';
  }

  lines.push(
    '<!-- Generated with Tech Stack Studio (https://github.com/ThanhNguyxnOrg/Techstack-Studio) -->'
  );

  if (settings.showHeader && settings.headerTitle.trim()) {
    lines.push(`### ${escapeHtml(settings.headerTitle.trim())}`);
    if (settings.headerSubtitle.trim()) {
      lines.push(`_${escapeHtml(settings.headerSubtitle.trim())}_`);
    }
    lines.push('');
  }

  const renderGroup = (groupItems: readonly TechItem[]) => {
    if (settings.showLabels) {
      const rows = chunkItems(groupItems, settings.itemsPerRow > 0 ? settings.itemsPerRow : 6);
      lines.push(`<div align="${settings.alignment}">`);
      lines.push('  <table>');
      for (const row of rows) {
        lines.push('    <tr>');
        for (const item of row) {
          const escapedName = escapeHtml(item.name);
          const escapedUrl = escapeHtml(getReadmeExportIconUrl(item, settings));
          const escapedDocs = escapeHtml(item.docsUrl);
          const imgTag = `<img src="${escapedUrl}" alt="${escapedName}" width="${settings.iconSize}" height="${settings.iconSize}" />`;
          const cellInner = settings.linkIconsToDocs
            ? `<a href="${escapedDocs}" target="_blank" rel="noreferrer">${imgTag}<br /><sub><b>${escapedName}</b></sub></a>`
            : `${imgTag}<br /><sub><b>${escapedName}</b></sub>`;
          lines.push(
            `      <td align="center" width="${settings.iconSize + 44}">${cellInner}</td>`
          );
        }
        lines.push('    </tr>');
      }
      lines.push('  </table>');
      lines.push('</div>');
      return;
    }

    const rows = chunkItems(groupItems, settings.itemsPerRow);
    lines.push(`<p align="${settings.alignment}">`);
    rows.forEach((row, rowIndex) => {
      for (const item of row) {
        const escapedName = escapeHtml(item.name);
        const escapedUrl = escapeHtml(getReadmeExportIconUrl(item, settings));
        const escapedDocs = escapeHtml(item.docsUrl);
        const imgTag = `<img src="${escapedUrl}" alt="${escapedName}" width="${settings.iconSize}" height="${settings.iconSize}" />`;
        const wrapped = settings.linkIconsToDocs
          ? `<a href="${escapedDocs}" target="_blank" rel="noreferrer">${imgTag}</a>`
          : imgTag;
        lines.push(`  ${wrapped}`);
      }
      if (rowIndex < rows.length - 1) {
        lines.push('  <br />');
      }
    });
    lines.push('</p>');
  };

  if (settings.showCategoryGrouping) {
    const groups = groupItemsByCategory(items);
    groups.forEach((group, idx) => {
      lines.push(`#### ${escapeHtml(group.category)}`);
      renderGroup(group.items);
      if (idx < groups.length - 1) {
        lines.push('');
      }
    });
  } else {
    renderGroup(items);
  }

  return lines.join('\n');
}

/**
 * Generates a self-contained HTML snippet with embedded animated SVG logos.
 */
export function generateStandaloneHtml(
  items: readonly TechItem[],
  rawSettings: CustomizationSettings
): string {
  const settings = sanitizeSettings(rawSettings);

  if (items.length === 0) {
    return '<!-- Select technologies to generate standalone HTML -->';
  }

  const isDark = settings.theme === 'dark';
  const bg = isDark ? '#0B0D10' : '#F8FAFC';
  const cardBg = isDark ? '#12161C' : '#FFFFFF';
  const border = isDark ? '#1F2631' : '#E2E8F0';
  const textPrimary = isDark ? '#F3F1EC' : '#0F172A';
  const textSecondary = isDark ? '#94A0B0' : '#475569';
  const justifyMap: Record<StackAlignment, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  const lines: string[] = [];
  lines.push(
    '<!-- Generated with Tech Stack Studio (https://github.com/ThanhNguyxnOrg/Techstack-Studio) -->'
  );
  lines.push(
    `<section class="tss-stack" style="background:${bg};color:${textPrimary};padding:24px;border-radius:12px;border:1px solid ${border};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;">`
  );

  if (settings.showHeader && settings.headerTitle.trim()) {
    lines.push(`  <header style="text-align:${settings.alignment};margin-bottom:18px;">`);
    lines.push(
      `    <h3 style="margin:0;font-size:18px;font-weight:700;letter-spacing:-0.02em;">${escapeHtml(settings.headerTitle.trim())}</h3>`
    );
    if (settings.headerSubtitle.trim()) {
      lines.push(
        `    <p style="margin:4px 0 0;font-size:13px;color:${textSecondary};">${escapeHtml(settings.headerSubtitle.trim())}</p>`
      );
    }
    lines.push('  </header>');
  }

  const gridStyle =
    settings.itemsPerRow > 0
      ? `display: grid; grid-template-columns: repeat(${settings.itemsPerRow}, minmax(0, 1fr)); gap: ${settings.spacing}px; justify-items: ${settings.alignment};`
      : `display: flex; flex-wrap: wrap; gap: ${settings.spacing}px; justify-content: ${justifyMap[settings.alignment]};`;

  lines.push(`  <div style="${gridStyle}">`);

  for (const item of items) {
    const escapedName = escapeHtml(item.name);
    const escapedDocs = escapeHtml(item.docsUrl);
    const itemPadding = settings.presentationStyle === 'minimal' ? '4px' : '10px 14px';
    const itemBg = settings.presentationStyle === 'minimal' ? 'transparent' : cardBg;
    const itemBorder = settings.presentationStyle === 'minimal' ? 'none' : `1px solid ${border}`;
    const itemRadius = settings.presentationStyle === 'pills' ? '999px' : '10px';

    const inlineSvg = generateAnimatedSingleIconSvg(item, {
      size: settings.iconSize,
      theme: settings.theme,
      animate: settings.animateSvgLogos,
      speedMultiplier: settings.animationSpeedMultiplier,
      showPlate: Boolean(settings.showInnerPlate),
    });
    const labelHtml = settings.showLabels
      ? `<span style="font-size:12px;font-weight:600;color:${textPrimary};margin-top:6px;">${escapedName}</span>`
      : '';

    const tagOpen = settings.linkIconsToDocs
      ? `<a href="${escapedDocs}" target="_blank" rel="noreferrer" style="display:inline-flex;flex-direction:column;align-items:center;text-decoration:none;padding:${itemPadding};background:${itemBg};border:${itemBorder};border-radius:${itemRadius};">`
      : `<div style="display:inline-flex;flex-direction:column;align-items:center;padding:${itemPadding};background:${itemBg};border:${itemBorder};border-radius:${itemRadius};">`;
    const tagClose = settings.linkIconsToDocs ? '</a>' : '</div>';

    lines.push(`    ${tagOpen}${inlineSvg}${labelHtml}${tagClose}`);
  }

  lines.push('  </div>');
  lines.push('</section>');
  return lines.join('\n');
}

/**
 * Generates a self-contained, dependency-free SVG vector banner for the selected stack.
 * Matches the Live Preview settings (showLabels, showInnerPlate, presentationStyle, showHeader) 1:1.
 */
export function generateStandaloneSvg(
  items: readonly TechItem[],
  rawSettings: CustomizationSettings
): string {
  const settings = sanitizeSettings(rawSettings);
  const isDark = settings.theme === 'dark';
  const bg = isDark ? '#0B0D10' : '#F8FAFC';
  const tileBg = isDark ? '#111622' : '#FFFFFF';
  const tileStroke = isDark ? '#1E2636' : '#CBD5E1';
  const textPrimary = isDark ? '#F3F1EC' : '#0F172A';
  const textSecondary = isDark ? '#94A0B0' : '#475569';

  const cols =
    settings.itemsPerRow > 0
      ? Math.min(settings.itemsPerRow, Math.max(1, items.length))
      : Math.min(6, Math.max(1, items.length));
  const rows = Math.max(1, Math.ceil(items.length / cols));

  const isMinimal = settings.presentationStyle === 'minimal';
  const cellWidth = settings.iconSize + (settings.showLabels ? 44 : isMinimal ? 8 : 20);
  const cellHeight = settings.iconSize + (settings.showLabels ? 42 : isMinimal ? 8 : 20);
  const gap = settings.spacing;
  const padX = 24;
  const headerHeight = settings.showHeader && settings.headerTitle.trim() ? 60 : 0;
  const padY = 22;

  const contentWidth = cols * cellWidth + Math.max(0, cols - 1) * gap;
  const totalWidth = Math.max(420, contentWidth + padX * 2);
  const totalHeight = padY * 2 + headerHeight + rows * cellHeight + Math.max(0, rows - 1) * gap;

  const svgLines: string[] = [];
  const allDefs: string[] = [];
  const allStyles: string[] = [];

  svgLines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" role="img" aria-label="${escapeHtml(settings.headerTitle || 'Technology Stack')}">`
  );

  items.forEach((item, index) => {
    const uid = `b_${index}_${item.id.replace(/[^a-zA-Z0-9]/g, '')}`;
    const parts = buildInternalSvgAnimationMarkup(item, uid, {
      theme: settings.theme,
      animate: settings.animateSvgLogos,
      speedMultiplier: settings.animationSpeedMultiplier,
    });
    if (parts.defs) allDefs.push(parts.defs);
    if (parts.style) allStyles.push(parts.style);
  });

  if (allDefs.length > 0) {
    svgLines.push(`  <defs>${allDefs.join('')}</defs>`);
  }
  if (allStyles.length > 0) {
    svgLines.push(`  <style>${allStyles.join('\n')}</style>`);
  }

  svgLines.push(
    `  <rect width="${totalWidth}" height="${totalHeight}" rx="12" fill="${bg}" stroke="${tileStroke}" stroke-width="1"/>`
  );

  if (headerHeight > 0) {
    const anchor =
      settings.alignment === 'center' ? 'middle' : settings.alignment === 'right' ? 'end' : 'start';
    const headerX =
      settings.alignment === 'center'
        ? Math.round(totalWidth / 2)
        : settings.alignment === 'right'
          ? totalWidth - padX
          : padX;

    svgLines.push(
      `  <text x="${headerX}" y="${padY + 20}" text-anchor="${anchor}" fill="${textPrimary}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="17" font-weight="700">${escapeHtml(settings.headerTitle.trim())}</text>`
    );
    if (settings.headerSubtitle.trim()) {
      svgLines.push(
        `  <text x="${headerX}" y="${padY + 40}" text-anchor="${anchor}" fill="${textSecondary}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12">${escapeHtml(settings.headerSubtitle.trim())}</text>`
      );
    }
  }

  if (items.length === 0) {
    svgLines.push(
      `  <text x="${Math.round(totalWidth / 2)}" y="${Math.round(totalHeight / 2)}" text-anchor="middle" fill="${textSecondary}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13">Select technologies to preview your stack</text>`
    );
    svgLines.push('</svg>');
    return svgLines.join('\n');
  }

  items.forEach((item, index) => {
    const rowIdx = Math.floor(index / cols);
    const colIdx = index % cols;
    const itemsInThisRow = Math.min(cols, items.length - rowIdx * cols);
    const rowWidth = itemsInThisRow * cellWidth + Math.max(0, itemsInThisRow - 1) * gap;

    let rowStartX = padX;
    if (settings.alignment === 'center') {
      rowStartX = Math.round((totalWidth - rowWidth) / 2);
    } else if (settings.alignment === 'right') {
      rowStartX = totalWidth - padX - rowWidth;
    }

    const x = rowStartX + colIdx * (cellWidth + gap);
    const y = padY + headerHeight + rowIdx * (cellHeight + gap);

    if (settings.presentationStyle !== 'minimal') {
      const rx = settings.presentationStyle === 'pills' ? Math.round(cellHeight / 2) : 10;
      svgLines.push(
        `  <rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" rx="${rx}" fill="${tileBg}" stroke="${tileStroke}" stroke-width="1"/>`
      );
    }

    const boxSize = settings.iconSize;
    const boxX = Number((x + (cellWidth - boxSize) / 2).toFixed(1));
    const boxY = Number((y + (settings.showLabels ? 10 : (cellHeight - boxSize) / 2)).toFixed(1));

    if (settings.showInnerPlate) {
      svgLines.push(
        `  <rect x="${boxX}" y="${boxY}" width="${boxSize}" height="${boxSize}" rx="${Math.round(boxSize * 0.2)}" fill="#131822" stroke="#242E3E" stroke-width="1"/>`
      );
    }

    const innerPad = Number((boxSize * (settings.showInnerPlate ? 0.14 : 0.06)).toFixed(2));
    const innerSize = boxSize - innerPad * 2;
    const vbParts = (item.svgViewBox || '0 0 24 24').split(/\s+/).map(Number);
    const baseViewBoxWidth = Number.isFinite(vbParts[2]) && vbParts[2] > 0 ? vbParts[2] : 24;
    const iconScale = (innerSize / baseViewBoxWidth).toFixed(4);
    const iconOffsetX = (boxX + innerPad).toFixed(2);
    const iconOffsetY = (boxY + innerPad).toFixed(2);

    const uid = `b_${index}_${item.id.replace(/[^a-zA-Z0-9]/g, '')}`;
    const parts = buildInternalSvgAnimationMarkup(item, uid, {
      theme: settings.theme,
      animate: settings.animateSvgLogos,
      speedMultiplier: settings.animationSpeedMultiplier,
    });

    svgLines.push(
      `  <g transform="translate(${iconOffsetX}, ${iconOffsetY}) scale(${iconScale})">${parts.body}</g>`
    );

    if (settings.showLabels) {
      const labelX = Math.round(x + cellWidth / 2);
      const labelY = y + cellHeight - 10;
      const truncatedLabel = item.name.length > 14 ? `${item.name.slice(0, 12)}…` : item.name;
      svgLines.push(
        `  <text x="${labelX}" y="${labelY}" text-anchor="middle" fill="${textPrimary}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="600">${escapeHtml(truncatedLabel)}</text>`
      );
    }
  });

  svgLines.push('</svg>');
  return svgLines.join('\n');
}

/**
 * Dispatcher for generating the requested export code format.
 */
export function generateExportOutput(
  format: ExportFormat,
  items: readonly TechItem[],
  settings: CustomizationSettings
): string {
  switch (format) {
    case 'markdown':
      return generateReadmeMarkdown(items, settings);
    case 'html':
      return generateStandaloneHtml(items, settings);
    case 'svg':
      return generateStandaloneSvg(items, settings);
  }
}
