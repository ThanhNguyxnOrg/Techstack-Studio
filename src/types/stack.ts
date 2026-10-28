export type TechCategory =
  | 'Programming languages'
  | 'Frontend'
  | 'Backend'
  | 'AI and machine learning'
  | 'Databases'
  | 'Cloud and DevOps'
  | 'Embedded development'
  | 'Developer tools';

export type SvgMotionFamily =
  | 'liquid-wave-fill'
  | 'stroke-trace-fill'
  | 'orbital-spin'
  | 'dual-snake-interlock'
  | 'container-stack-slide'
  | 'circuit-trace-pulse'
  | 'node-network-signal'
  | 'flame-core-flicker'
  | 'radar-sweep-mask'
  | 'shimmer-prism-sweep'
  | 'segmented-assembly'
  | 'curtain-vertical-reveal'
  | 'pendulum-harmonic'
  | 'pixel-grid-cascade'
  | 'data-stream-flow'
  | 'iris-aperture-bloom'
  | 'beacon-ripple-rings'
  | 'elastic-morph-bounce';

export const ALL_SVG_MOTION_FAMILIES: readonly SvgMotionFamily[] = [
  'liquid-wave-fill',
  'stroke-trace-fill',
  'orbital-spin',
  'dual-snake-interlock',
  'container-stack-slide',
  'circuit-trace-pulse',
  'node-network-signal',
  'flame-core-flicker',
  'radar-sweep-mask',
  'shimmer-prism-sweep',
  'segmented-assembly',
  'curtain-vertical-reveal',
  'pendulum-harmonic',
  'pixel-grid-cascade',
  'data-stream-flow',
  'iris-aperture-bloom',
  'beacon-ripple-rings',
  'elastic-morph-bounce',
] as const;

export type CatalogTier = 'A' | 'B' | 'C';

export type CatalogSortMode = 'popularity' | 'alphabetical' | 'subcategory';

export type StudioStage = 'select' | 'customize' | 'generate';

export interface MotionRecipe {
  family: SvgMotionFamily;
  durationSec: number;
  easing: string;
  delaySec: number;
  direction: 'normal' | 'reverse' | 'alternate';
  secondaryColor: string;
  rationale: string;
}

export interface TechItem {
  id: string;
  name: string;
  aliases: string[];
  category: TechCategory;
  subcategory: string;
  role: string;
  brandColor: string;
  darkSafeColor: string;
  iconUrl: string;
  docsUrl: string;
  monogram: string;
  svgPath: string;
  svgViewBox?: string;
  referenceSvgFile?: string;
  sourceSvgPath?: string;
  animatedSvgPath?: string;
  tier: CatalogTier;
  categoryRank: number;
  evidenceSource: string;
  provenance: string;
  license: string;
  verified: boolean;
  motionRecipe: MotionRecipe;
}

export type PreviewTheme = 'dark' | 'light';
export type StackAlignment = 'left' | 'center' | 'right';
export type PresentationStyle = 'tiles' | 'minimal' | 'cards' | 'pills';
export type WebAnimationStyle = 'none' | 'float' | 'pulse' | 'wave';
export type ExportFormat = 'markdown' | 'html' | 'svg';

export interface CustomizationSettings {
  theme: PreviewTheme;
  iconSize: number; // 28 to 80 px
  spacing: number; // 6 to 36 px
  alignment: StackAlignment;
  itemsPerRow: number; // 0 = auto-wrap, or 3..12
  showLabels: boolean;
  showInnerPlate?: boolean;
  presentationStyle: PresentationStyle;
  animationStyle: WebAnimationStyle;
  animateSvgLogos: boolean;
  animationSpeedMultiplier: number; // 0.5, 1, 1.5
  assetBaseUrl?: string;
  showHeader: boolean;
  headerTitle: string;
  headerSubtitle: string;
  showCategoryGrouping: boolean;
  linkIconsToDocs: boolean;
}

export interface PresetConfig {
  id: string;
  name: string;
  summary: string;
  settings: Partial<CustomizationSettings>;
  recommendedStack?: string[];
}

export interface PersistedStudioState {
  version: number;
  selectedIds: string[];
  settings: CustomizationSettings;
}

export interface ManifestValidationResult {
  valid: boolean;
  totalCount: number;
  verifiedCount: number;
  tierACount: number;
  tierBCount: number;
  tierCCount: number;
  distinctMotionFamilies: number;
  errors: string[];
}
