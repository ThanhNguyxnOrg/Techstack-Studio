import { TechItem } from '../types/stack';
import generatedCatalogJson from './generatedCatalog.json';

/**
 * Canonical SVG-first technology catalog (554 verified entries).
 * Every entry maps deterministically to:
 * - Static source SVG: `/icons/source/{id}.svg`
 * - Standalone animated SVG: `/icons/animated/{id}.svg`
 */
export const TECH_CATALOG: TechItem[] = (generatedCatalogJson as TechItem[]).map((item) => ({
  ...item,
  name: item.id === 'googlecloud' ? 'Google Cloud' : item.name,
  sourceSvgPath: item.sourceSvgPath || `/icons/source/${item.id}.svg`,
  animatedSvgPath: item.animatedSvgPath || `/icons/animated/${item.id}.svg`,
}));

export const LEGACY_ID_MAP: Record<string, string> = {
  nodejs: 'nodedotjs',
  nextjs: 'nextdotjs',
  vuejs: 'vuedotjs',
  golang: 'go',
  k8s: 'kubernetes',
  postgres: 'postgresql',
  tailwind: 'tailwindcss',
  stm32: 'stmicroelectronics',
  esp32: 'espressif',
  aws: 'amazonaws',
  gcp: 'googlecloud',
};

export const TECH_BY_ID: Record<string, TechItem> = (() => {
  const map: Record<string, TechItem> = {};
  for (const item of TECH_CATALOG) {
    map[item.id] = item;
  }
  for (const [legacyId, canonicalId] of Object.entries(LEGACY_ID_MAP)) {
    if (map[canonicalId] && !map[legacyId]) {
      map[legacyId] = map[canonicalId];
    }
  }
  return map;
})();
