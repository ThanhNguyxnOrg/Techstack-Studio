import { PresetConfig, TechCategory, CustomizationSettings } from '../types/stack';
import { TECH_BY_ID, TECH_CATALOG } from './techCatalog';

export const TECH_CATEGORIES: readonly TechCategory[] = [
  'Programming languages',
  'Frontend',
  'Backend',
  'AI and machine learning',
  'Databases',
  'Cloud and DevOps',
  'Embedded development',
  'Developer tools',
] as const;

export const GITHUB_REPO_URL = 'https://github.com/ThanhNguyxnOrg/Techstack-Studio';
export const GITHUB_PAGES_URL = 'https://thanhnguyxnorg.github.io/Techstack-Studio';
export const GITHUB_RAW_PUBLIC_URL =
  'https://raw.githubusercontent.com/ThanhNguyxnOrg/Techstack-Studio/main/public';

export const DEFAULT_CUSTOMIZATION_SETTINGS: CustomizationSettings = {
  theme: 'dark',
  iconSize: 48,
  spacing: 14,
  alignment: 'left',
  itemsPerRow: 0,
  showLabels: true,
  showInnerPlate: false,
  presentationStyle: 'tiles',
  animationStyle: 'float',
  animateSvgLogos: true,
  animationSpeedMultiplier: 1,
  assetBaseUrl: GITHUB_PAGES_URL,
  showHeader: false,
  headerTitle: 'Tech Stack',
  headerSubtitle: '',
  showCategoryGrouping: false,
  linkIconsToDocs: true,
};

export const DEFAULT_STARTER_STACK_IDS: string[] = [
  'javascript',
  'typescript',
  'python',
  'react',
  'nextdotjs',
  'tailwindcss',
  'nodedotjs',
  'postgresql',
  'docker',
  'kubernetes',
  'googlecloud',
  'github',
];

export const STUDIO_PRESETS: PresetConfig[] = [
  {
    id: 'dark-tiles',
    name: 'Dark Tiles',
    summary: '48px animated logos on dark tiles with names and no inner frame.',
    settings: {
      theme: 'dark',
      iconSize: 48,
      spacing: 14,
      alignment: 'left',
      itemsPerRow: 0,
      showLabels: true,
      showInnerPlate: false,
      presentationStyle: 'tiles',
      animationStyle: 'float',
      animateSvgLogos: true,
      animationSpeedMultiplier: 1,
      showHeader: false,
    },
  },
  {
    id: 'logos-only',
    name: 'Logos Only (No Names / No Frame)',
    summary: 'Pure animated logos without names or outer/inner card borders.',
    settings: {
      theme: 'dark',
      iconSize: 48,
      spacing: 14,
      alignment: 'left',
      itemsPerRow: 0,
      showLabels: false,
      showInnerPlate: false,
      presentationStyle: 'minimal',
      animationStyle: 'float',
      animateSvgLogos: true,
      animationSpeedMultiplier: 1,
      showHeader: false,
    },
  },
  {
    id: 'readme-compact',
    name: 'Compact Row',
    summary: 'Centered 44px logos arranged in 8 columns.',
    settings: {
      theme: 'dark',
      iconSize: 44,
      spacing: 12,
      alignment: 'center',
      itemsPerRow: 8,
      showLabels: true,
      showInnerPlate: false,
      presentationStyle: 'tiles',
      animationStyle: 'none',
      animateSvgLogos: true,
      animationSpeedMultiplier: 1,
      showHeader: false,
    },
  },
  {
    id: 'light-cards',
    name: 'Light Cards',
    summary: 'Clean light theme cards with 6 items per row.',
    settings: {
      theme: 'light',
      iconSize: 44,
      spacing: 14,
      alignment: 'left',
      itemsPerRow: 6,
      showLabels: true,
      showInnerPlate: true,
      presentationStyle: 'cards',
      animationStyle: 'none',
      animateSvgLogos: true,
      animationSpeedMultiplier: 1,
      showHeader: false,
    },
  },
];

export { TECH_CATALOG, TECH_BY_ID };
