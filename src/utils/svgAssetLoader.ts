import { TechItem } from '../types/stack';

export interface ParsedStandaloneSvg {
  viewBox?: string;
  defs: string;
  style: string;
  body: string;
  rawSvg: string;
}

const fetchedSvgCache = new Map<string, ParsedStandaloneSvg>();
const inflightFetchMap = new Map<string, Promise<ParsedStandaloneSvg>>();

/**
 * Resolves a public asset path (e.g. `/icons/animated/docker.svg`) against Vite's `BASE_URL`
 * so both root deployments and subpath GitHub Pages deployments load the exact file.
 */
export function resolvePublicSvgUrl(assetPath: string): string {
  const clean = assetPath.replace(/^\/+/, '');
  const baseUrl =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.BASE_URL === 'string'
      ? import.meta.env.BASE_URL
      : '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${clean}`;
}

/**
 * Extracts `<defs>`, `<style>`, and inner body elements from a standalone `<svg>` document.
 */
export function parseStandaloneSvgString(svgMarkup: string): ParsedStandaloneSvg {
  const trimmed = svgMarkup.trim();
  if (!trimmed.startsWith('<svg') || !trimmed.endsWith('</svg>')) {
    throw new Error('Malformed standalone SVG document');
  }

  let defs = '';
  let style = '';
  const vbMatch = trimmed.match(/viewBox="([^"]+)"/i);
  const viewBox = vbMatch ? vbMatch[1] : undefined;
  let body = trimmed.replace(/^<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');

  body = body.replace(/<defs>([\s\S]*?)<\/defs>/gi, (_, content: string) => {
    defs += content;
    return '';
  });

  body = body.replace(/<style>([\s\S]*?)<\/style>/gi, (_, content: string) => {
    style += content;
    return '';
  });

  return {
    viewBox,
    defs: defs.trim(),
    style: style.trim(),
    body: body.trim(),
    rawSvg: trimmed,
  };
}

/**
 * Scopes `tss_{itemUid}_*` identifiers and CSS animation durations for a specific component instance
 * so multiple copies of the same standalone SVG on the page never collide in `<clipPath>` / `<mask>` / `<filter>` IDs.
 */
export function scopeStandaloneSvgParts(
  parts: { defs: string; style: string; body: string },
  item: TechItem,
  instanceUid: string,
  speedMultiplier = 1
): { defs: string; style: string; body: string } {
  const canonicalPrefix = `tss_${item.id.replace(/[^a-zA-Z0-9]/g, '')}_`;
  const scopedPrefix = `tss_${instanceUid}_`;

  const rewriteIds = (str: string) => (str ? str.split(canonicalPrefix).join(scopedPrefix) : '');

  let style = rewriteIds(parts.style);
  const effectiveSpeed = speedMultiplier > 0 ? speedMultiplier : 1;
  if (style) {
    style = style.replace(/(\d+(?:\.\d+)?)s\b/g, (_, numStr: string) => {
      const val = parseFloat(numStr);
      if (!Number.isFinite(val) || val === 0) return `${numStr}s`;
      return `${(val / effectiveSpeed).toFixed(2)}s`;
    });
  }

  return {
    defs: rewriteIds(parts.defs),
    style,
    body: rewriteIds(parts.body),
  };
}

/**
 * Fetches and parses the real standalone SVG file (`/icons/animated/{id}.svg` or `/icons/source/{id}.svg`)
 * served from `public/icons/`. Throws an explicit error if the file is missing or malformed so broken
 * assets are surfaced during development rather than silently masked.
 */
export async function fetchStandaloneSvgAsset(assetPath: string): Promise<ParsedStandaloneSvg> {
  const resolvedUrl = resolvePublicSvgUrl(assetPath);
  const cached = fetchedSvgCache.get(resolvedUrl);
  if (cached) {
    return cached;
  }

  const inflight = inflightFetchMap.get(resolvedUrl);
  if (inflight) {
    return inflight;
  }

  const promise = (async () => {
    const fetchUrl = resolvedUrl.includes('?') ? `${resolvedUrl}&v=4` : `${resolvedUrl}?v=4`;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} loading ${resolvedUrl}`);
    }
    const text = await response.text();
    const parsed = parseStandaloneSvgString(text);
    fetchedSvgCache.set(resolvedUrl, parsed);
    inflightFetchMap.delete(resolvedUrl);
    return parsed;
  })().catch((err) => {
    inflightFetchMap.delete(resolvedUrl);
    throw err;
  });

  inflightFetchMap.set(resolvedUrl, promise);
  return promise;
}

export function getCachedStandaloneSvgAsset(assetPath: string): ParsedStandaloneSvg | undefined {
  return fetchedSvgCache.get(resolvePublicSvgUrl(assetPath));
}
