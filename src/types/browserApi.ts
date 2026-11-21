import { CustomizationSettings, ExportFormat, StudioStage, TechCategory } from './stack';

export interface BrowserIconSummary {
  id: string;
  name: string;
  category: TechCategory;
  aliases: string[];
  animatedSvgPath: string;
  sourceSvgPath: string;
  docsUrl: string;
  story: string;
}

export interface BrowserStudioState {
  selectedIds: string[];
  settings: CustomizationSettings;
  activeStage: StudioStage;
  shareUrl: string;
  catalogCount: number;
}

export interface TechStackStudioBrowserApi {
  version: string;
  getState: () => BrowserStudioState;
  search: (
    query: string,
    options?: { category?: TechCategory | 'all'; limit?: number }
  ) => BrowserIconSummary[];
  setStack: (ids: string[]) => string[];
  add: (ids: string[]) => string[];
  remove: (ids: string[]) => string[];
  reorder: (sourceId: string, targetId: string) => void;
  clear: () => void;
  undo: () => boolean;
  setSettings: (partial: Partial<CustomizationSettings>) => CustomizationSettings;
  applyPreset: (presetId: string) => boolean;
  setStage: (stage: StudioStage) => void;
  detectFromText: (content: string, filename?: string) => string[];
  getShareUrl: () => string;
  exportOutput: (format: ExportFormat) => Promise<string>;
}

declare global {
  interface Window {
    techStackStudio?: TechStackStudioBrowserApi;
  }
}
