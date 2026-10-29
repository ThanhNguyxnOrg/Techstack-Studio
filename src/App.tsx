/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_CUSTOMIZATION_SETTINGS,
  DEFAULT_STARTER_STACK_IDS,
  GITHUB_PAGES_URL,
  GITHUB_REPO_URL,
  STUDIO_PRESETS,
  TECH_CATALOG,
} from './data/catalog';
import { CustomizationSettings, StudioStage } from './types/stack';
import {
  STORAGE_KEY,
  moveTechInStack,
  parsePersistedState,
  removeTechFromStack,
  resolveSelectedItems,
  sanitizeSettings,
  serializePersistedState,
  toggleTechInStack,
} from './utils/studioLogic';
import { CatalogPanel } from './components/CatalogPanel';
import { ExportStudio } from './components/ExportStudio';
import { HeroSection } from './components/HeroSection';
import { PreviewAndControls } from './components/PreviewAndControls';
import { SelectedStackBar } from './components/SelectedStackBar';

export default function App() {
  const initialState = useMemo(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return parsePersistedState(raw);
    } catch {
      return {
        version: 1 as const,
        selectedIds: [...DEFAULT_STARTER_STACK_IDS],
        settings: { ...DEFAULT_CUSTOMIZATION_SETTINGS },
      };
    }
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialState.selectedIds);
  const [settings, setSettings] = useState<CustomizationSettings>(initialState.settings);
  const [activeStage, setActiveStage] = useState<StudioStage>('select');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    try {
      const serialized = serializePersistedState({
        version: 1,
        selectedIds,
        settings,
      });
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // Ignore storage quota or private-browsing errors
    }
  }, [selectedIds, settings]);

  const selectedItems = useMemo(() => resolveSelectedItems(selectedIds), [selectedIds]);

  const handleToggleTech = (techId: string) => {
    setSelectedIds((prev) => {
      const next = toggleTechInStack(prev, techId);
      const item = TECH_CATALOG.find((t) => t.id === techId);
      if (item) {
        const wasAdded = next.length > prev.length;
        setStatusMessage(
          wasAdded ? `Added ${item.name} to stack.` : `Removed ${item.name} from stack.`
        );
      }
      return next;
    });
  };

  const handleRemoveTech = (techId: string) => {
    setSelectedIds((prev) => {
      const item = TECH_CATALOG.find((t) => t.id === techId);
      if (item) {
        setStatusMessage(`Removed ${item.name} from stack.`);
      }
      return removeTechFromStack(prev, techId);
    });
  };

  const handleMoveTech = (techId: string, direction: 'left' | 'right' | 'first' | 'last') => {
    setSelectedIds((prev) => moveTechInStack(prev, techId, direction));
  };

  const handleClearStack = () => {
    setSelectedIds([]);
    setStatusMessage('Cleared all selected technologies.');
  };

  const handleRestoreStarterStack = () => {
    setSelectedIds([...DEFAULT_STARTER_STACK_IDS]);
    setSettings({ ...DEFAULT_CUSTOMIZATION_SETTINGS });
    setStatusMessage('Restored default stack and settings.');
  };

  const handleUpdateSettings = (partial: Partial<CustomizationSettings>) => {
    setSettings((prev) => sanitizeSettings({ ...prev, ...partial }));
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = STUDIO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSettings((prev) => sanitizeSettings({ ...prev, ...preset.settings }));
    setStatusMessage(`Applied style: ${preset.name}`);
  };

  return (
    <div className="min-h-screen bg-[#090B10] text-[#F1F5F9] flex flex-col selection:bg-[#38BDF8] selection:text-[#090B10] xl:h-svh xl:min-h-0 xl:overflow-hidden">
      <div role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      <HeroSection
        selectedCount={selectedItems.length}
        activeStage={activeStage}
        onSelectStage={setActiveStage}
        onResetDefault={handleRestoreStarterStack}
        onClearAll={handleClearStack}
      />

      <main
        id="studio-workspace"
        className="flex-1 max-w-[1920px] w-full mx-auto px-3 sm:px-4 2xl:px-6 py-3 sm:py-4 xl:flex-1 xl:min-h-0 xl:overflow-hidden"
      >
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-4 items-start xl:h-full xl:min-h-0">
          {/* Keep the catalog visible on desktop; on smaller screens each step gets a focused view. */}
          <div
            className={
              activeStage === 'select'
                ? 'block min-w-0 xl:h-full xl:min-h-0'
                : 'hidden xl:block min-w-0 xl:h-full xl:min-h-0'
            }
          >
            <CatalogPanel
              selectedIds={selectedIds}
              animateSvgLogos={settings.animateSvgLogos}
              animationSpeedMultiplier={settings.animationSpeedMultiplier}
              onToggleTech={handleToggleTech}
            />
          </div>

          {/* Workflow tabs switch this panel instead of scrolling the whole page. */}
          <div
            className={
              activeStage === 'select'
                ? 'hidden xl:flex min-w-0 flex-col gap-4 xl:h-full xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1'
                : 'flex min-w-0 flex-col gap-4 xl:h-full xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1'
            }
          >
            {activeStage !== 'generate' && (
              <PreviewAndControls
                items={selectedItems}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onApplyPreset={handleApplyPreset}
                showCustomization={activeStage === 'customize'}
                childrenAfterPreview={
                  activeStage === 'select' ? (
                    <SelectedStackBar
                      selectedItems={selectedItems}
                      onMoveTech={handleMoveTech}
                      onRemoveTech={handleRemoveTech}
                      onClearStack={handleClearStack}
                      onRestoreStarterStack={handleRestoreStarterStack}
                    />
                  ) : undefined
                }
              />
            )}

            {activeStage === 'generate' && (
              <ExportStudio selectedItems={selectedItems} settings={settings} />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1E2636] bg-[#07090E] py-4 px-4 sm:px-6 lg:px-8 mt-8 xl:hidden">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#94A3B8]">Tech Stack Studio</span>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38BDF8] hover:underline"
            >
              ThanhNguyxnOrg/Techstack-Studio
            </a>
            <a
              href={GITHUB_PAGES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94A3B8] hover:text-[#F1F5F9] hover:underline"
            >
              Live Demo
            </a>
          </div>
          <span>554 standalone animated SVGs • Community-curated icons &amp; contributors</span>
        </div>
      </footer>
    </div>
  );
}
