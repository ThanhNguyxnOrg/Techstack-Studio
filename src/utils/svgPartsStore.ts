import storyConceptsJson from '../data/storyConcepts.json';
import { TechItem } from '../types/stack';
import { fetchStandaloneSvgAsset } from './svgAssetLoader';

export interface StandaloneSvgPartEntry {
  defs: string;
  style: string;
  body: string;
  staticBody: string;
  viewBox?: string;
  concept: string;
  technique: string;
}

const STORY_CONCEPTS = storyConceptsJson as Record<string, string>;
const partsRegistry: Record<string, StandaloneSvgPartEntry> = {};

export function registerStandaloneSvgParts(entries: Record<string, StandaloneSvgPartEntry>): void {
  Object.assign(partsRegistry, entries);
}

export function getStandaloneSvgPart(id: string): StandaloneSvgPartEntry | undefined {
  return partsRegistry[id];
}

export function hasStandaloneSvgPartsFor(items: TechItem[]): boolean {
  return items.every((item) => Boolean(partsRegistry[item.id]));
}

/**
 * Fetches and caches only the selected icons' standalone animated & static SVGs
 * (reusing the in-memory fetch cache from TechIcon), avoiding bundling all 542
 * icons' SVG payloads into the browser JavaScript bundle.
 */
export async function ensureSvgPartsForItems(items: TechItem[]): Promise<void> {
  const missing = items.filter((item) => !partsRegistry[item.id]);
  if (missing.length === 0 || typeof fetch === 'undefined') {
    return;
  }

  await Promise.all(
    missing.map(async (item) => {
      const animatedPath = item.animatedSvgPath || `/icons/animated/${item.id}.svg`;
      const sourcePath = item.sourceSvgPath || `/icons/source/${item.id}.svg`;
      try {
        const [animated, source] = await Promise.all([
          fetchStandaloneSvgAsset(animatedPath),
          fetchStandaloneSvgAsset(sourcePath),
        ]);
        partsRegistry[item.id] = {
          defs: animated.defs,
          style: animated.style,
          body: animated.body,
          staticBody: source.body,
          viewBox: animated.viewBox || source.viewBox || '0 0 24 24',
          concept: STORY_CONCEPTS[item.id] || item.name,
          technique: 'standalone-svg',
        };
      } catch {
        // Leave unregistered so callers gracefully fall back
      }
    })
  );
}
