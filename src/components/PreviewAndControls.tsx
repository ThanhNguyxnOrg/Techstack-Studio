import React, { useMemo, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Box,
  Check,
  ChevronDown,
  Eye,
  Heading,
  Image,
  LayoutGrid,
  Link2,
  Moon,
  Pause,
  Play,
  Sliders,
  Sun,
  Tag,
} from 'lucide-react';
import { GITHUB_PAGES_URL, GITHUB_RAW_PUBLIC_URL, STUDIO_PRESETS } from '../data/catalog';
import {
  CustomizationSettings,
  PresentationStyle,
  StackAlignment,
  TechItem,
  WebAnimationStyle,
} from '../types/stack';
import { generateStandaloneSvg, groupItemsByCategory } from '../utils/studioLogic';
import { usePrefersReducedMotion } from '../utils/usePrefersReducedMotion';
import { TechIcon } from './TechIcon';

interface PreviewAndControlsProps {
  items: TechItem[];
  settings: CustomizationSettings;
  onUpdateSettings: (partial: Partial<CustomizationSettings>) => void;
  onApplyPreset: (presetId: string) => void;
  showCustomization?: boolean;
  childrenAfterPreview?: React.ReactNode;
}

type DisplayToggleKey =
  'showLabels' | 'showInnerPlate' | 'showHeader' | 'showCategoryGrouping' | 'linkIconsToDocs';

const DISPLAY_TOGGLES: Array<{
  key: DisplayToggleKey;
  label: string;
  title: string;
  icon: React.FC<{ className?: string }>;
}> = [
  {
    key: 'showLabels',
    label: 'Names',
    title: 'Show or hide technology names under each logo',
    icon: Tag,
  },
  {
    key: 'showInnerPlate',
    label: 'Inner box',
    title: 'Show or hide the inner icon well inside each frame',
    icon: Box,
  },
  {
    key: 'showHeader',
    label: 'Stack title',
    title: 'Show or hide the heading above the stack',
    icon: Heading,
  },
  {
    key: 'showCategoryGrouping',
    label: 'Category groups',
    title: 'Group logos by technology category',
    icon: LayoutGrid,
  },
  {
    key: 'linkIconsToDocs',
    label: 'Docs links',
    title: 'Link each logo to its official documentation',
    icon: Link2,
  },
];

const FRAME_STYLES: Array<{ id: PresentationStyle; label: string }> = [
  { id: 'tiles', label: 'Tiles' },
  { id: 'minimal', label: 'No frame' },
  { id: 'cards', label: 'Cards' },
  { id: 'pills', label: 'Pills' },
];

const ALIGNMENTS: Array<{
  id: StackAlignment;
  label: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { id: 'left', label: 'Left', icon: AlignLeft },
  { id: 'center', label: 'Center', icon: AlignCenter },
  { id: 'right', label: 'Right', icon: AlignRight },
];

const presetLabel = (name: string) => name.replace(/\s*\(.*?\)\s*$/, '');

export const PreviewAndControls: React.FC<PreviewAndControlsProps> = ({
  items,
  settings,
  onUpdateSettings,
  onApplyPreset,
  showCustomization = true,
  childrenAfterPreview,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDark = settings.theme === 'dark';
  const [previewMode, setPreviewMode] = useState<'interactive' | 'svg-banner'>('interactive');

  const svgBannerMarkup = useMemo(() => generateStandaloneSvg(items, settings), [items, settings]);

  const activePresetId = useMemo(() => {
    const match = STUDIO_PRESETS.find((preset) =>
      Object.entries(preset.settings).every(
        ([key, value]) => settings[key as keyof CustomizationSettings] === value
      )
    );
    return match?.id ?? null;
  }, [settings]);

  const handleToggleDisplay = (key: DisplayToggleKey) => {
    onUpdateSettings({ [key]: !settings[key] } as Partial<CustomizationSettings>);
  };

  const getTileStyleClasses = (style: PresentationStyle) => {
    if (style === 'minimal') {
      return 'p-1.5 bg-transparent border border-transparent';
    }
    if (style === 'pills') {
      return isDark
        ? 'px-3.5 py-2 rounded-full bg-[#131926] border border-[#232D42]'
        : 'px-3.5 py-2 rounded-full bg-white border border-slate-200 shadow-xs';
    }
    if (style === 'cards') {
      return isDark
        ? 'p-3.5 rounded-xl bg-[#131926] border border-[#232D42]'
        : 'p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs';
    }
    return isDark
      ? 'p-2.5 rounded-xl bg-[#111622] border border-[#1E2636] hover:border-[#38BDF8]/50'
      : 'p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 shadow-xs';
  };

  const getContainerMotionClass = (anim: WebAnimationStyle) => {
    if (prefersReducedMotion || anim === 'none') return '';
    if (anim === 'float') return 'hover:-translate-y-1 transition-transform duration-200';
    if (anim === 'pulse') return 'hover:scale-105 transition-transform duration-200';
    if (anim === 'wave') return 'hover:-translate-y-1.5 transition-transform duration-200';
    return '';
  };

  const renderTechGroup = (groupItems: TechItem[]) => {
    const justifyClass =
      settings.alignment === 'center'
        ? 'justify-center'
        : settings.alignment === 'right'
          ? 'justify-end'
          : 'justify-start';

    if (settings.itemsPerRow > 0) {
      return (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${settings.itemsPerRow}, minmax(0, 1fr))`,
            gap: `${settings.spacing}px`,
            justifyItems:
              settings.alignment === 'center'
                ? 'center'
                : settings.alignment === 'right'
                  ? 'end'
                  : 'start',
          }}
        >
          {groupItems.map((item) => (
            <div
              key={item.id}
              className={`group inline-flex flex-col items-center text-center transition-colors ${getTileStyleClasses(
                settings.presentationStyle
              )} ${getContainerMotionClass(settings.animationStyle)}`}
            >
              <TechIcon
                item={item}
                size={settings.iconSize}
                theme={settings.theme}
                animate={settings.animateSvgLogos}
                speedMultiplier={settings.animationSpeedMultiplier}
                showPlate={Boolean(settings.showInnerPlate)}
              />
              {settings.showLabels && (
                <span
                  className={`mt-1.5 text-xs font-medium tracking-tight ${
                    isDark ? 'text-[#E2E8F0]' : 'text-slate-800'
                  }`}
                >
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`flex flex-wrap ${justifyClass}`} style={{ gap: `${settings.spacing}px` }}>
        {groupItems.map((item) => (
          <div
            key={item.id}
            className={`group inline-flex flex-col items-center text-center transition-colors ${getTileStyleClasses(
              settings.presentationStyle
            )} ${getContainerMotionClass(settings.animationStyle)}`}
          >
            <TechIcon
              item={item}
              size={settings.iconSize}
              theme={settings.theme}
              animate={settings.animateSvgLogos}
              speedMultiplier={settings.animationSpeedMultiplier}
              showPlate={Boolean(settings.showInnerPlate)}
            />
            {settings.showLabels && (
              <span
                className={`mt-1.5 text-xs font-medium tracking-tight ${
                  isDark ? 'text-[#E2E8F0]' : 'text-slate-800'
                }`}
              >
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id="customize-section" className="scroll-mt-20">
      <section
        aria-labelledby="live-preview-heading"
        className="bg-[#0F131B] border border-[#1E2636] rounded-2xl overflow-hidden shadow-sm"
      >
        {/* Header: preview mode, motion, speed, theme */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#1E2636] bg-[#0C1017] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] shrink-0" aria-hidden="true" />
            <h2
              id="live-preview-heading"
              className="text-sm font-bold text-[#F1F5F9] whitespace-nowrap"
            >
              {showCustomization ? (
                <>
                  <span className="text-[#64748B]">2.</span> Preview &amp; customize
                </>
              ) : (
                'Live preview'
              )}
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-[#141923] border border-[#1E2636] text-[11px] font-medium text-[#94A3B8] tabular-nums whitespace-nowrap">
              {items.length} {items.length === 1 ? 'logo' : 'logos'}
            </span>

            <div
              role="group"
              aria-label="Preview rendering mode"
              className="hidden sm:flex items-center gap-0.5 bg-[#090B10] border border-[#1E2636] rounded-lg p-0.5 ml-1"
            >
              <button
                type="button"
                onClick={() => setPreviewMode('interactive')}
                aria-pressed={previewMode === 'interactive'}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  previewMode === 'interactive'
                    ? 'bg-[#161F30] text-[#38BDF8] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
                title="Interactive DOM preview"
              >
                <Eye className="w-3 h-3" aria-hidden="true" />
                <span>Interactive</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('svg-banner')}
                aria-pressed={previewMode === 'svg-banner'}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  previewMode === 'svg-banner'
                    ? 'bg-[#161F30] text-[#38BDF8] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
                title="Exact 1:1 standalone SVG banner preview"
              >
                <Image className="w-3 h-3" aria-hidden="true" />
                <span>1:1 SVG</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onUpdateSettings({ animateSvgLogos: !settings.animateSvgLogos })}
              aria-pressed={settings.animateSvgLogos}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                settings.animateSvgLogos
                  ? 'bg-[#38BDF8]/15 border-[#38BDF8]/50 text-[#38BDF8]'
                  : 'bg-[#090B10] border-[#1E2636] text-[#94A3B8]'
              }`}
              title={settings.animateSvgLogos ? 'Pause logo animation' : 'Play logo animation'}
            >
              {settings.animateSvgLogos ? (
                <Pause className="w-3 h-3" aria-hidden="true" />
              ) : (
                <Play className="w-3 h-3" aria-hidden="true" />
              )}
              <span>{settings.animateSvgLogos ? 'Motion on' : 'Motion off'}</span>
            </button>

            <div
              role="group"
              aria-label="Animation speed"
              className="flex items-center gap-0.5 bg-[#090B10] border border-[#1E2636] rounded-lg p-0.5 shrink-0"
            >
              {([0.5, 1, 1.5] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onUpdateSettings({ animationSpeedMultiplier: spd })}
                  aria-pressed={settings.animationSpeedMultiplier === spd}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium tabular-nums cursor-pointer transition-colors ${
                    settings.animationSpeedMultiplier === spd
                      ? 'bg-[#38BDF8] text-[#090B10] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdateSettings({
                  theme: settings.theme === 'dark' ? 'light' : 'dark',
                })
              }
              aria-pressed={isDark}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-[#090B10] border border-[#1E2636] text-[#E2E8F0] hover:border-[#2C374D] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              title={`Switch to ${isDark ? 'light' : 'dark'} preview`}
            >
              {isDark ? (
                <Moon className="w-3 h-3 text-[#38BDF8]" aria-hidden="true" />
              ) : (
                <Sun className="w-3 h-3 text-amber-400" aria-hidden="true" />
              )}
              <span>{isDark ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>

        {/* Preview surface */}
        <div
          className={`p-5 sm:p-6 transition-colors min-h-[190px] ${
            isDark ? 'preview-grid-dark text-[#F1F5F9]' : 'preview-grid-light text-slate-900'
          }`}
        >
          {previewMode === 'svg-banner' ? (
            <div
              data-testid="svg-banner-preview"
              className="overflow-x-auto flex justify-center"
              dangerouslySetInnerHTML={{ __html: svgBannerMarkup }}
            />
          ) : (
            <>
              {settings.showHeader && settings.headerTitle.trim() && (
                <div
                  className={`mb-5 ${
                    settings.alignment === 'center'
                      ? 'text-center'
                      : settings.alignment === 'right'
                        ? 'text-right'
                        : 'text-left'
                  }`}
                >
                  <h3 className="text-lg font-bold tracking-tight">{settings.headerTitle}</h3>
                  {settings.headerSubtitle.trim() && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                      {settings.headerSubtitle}
                    </p>
                  )}
                </div>
              )}

              {items.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-[#1E2636] rounded-xl">
                  <p className="text-xs text-[#94A3B8]">
                    Choose technologies from the catalog on the left to preview your stack.
                  </p>
                </div>
              ) : settings.showCategoryGrouping ? (
                <div className="space-y-5">
                  {groupItemsByCategory(items).map((group) => (
                    <div key={group.category}>
                      <h4
                        className={`text-xs font-semibold uppercase tracking-wider mb-2.5 ${
                          isDark ? 'text-[#94A3B8]' : 'text-slate-500'
                        }`}
                      >
                        {group.category}
                      </h4>
                      {renderTechGroup(group.items)}
                    </div>
                  ))}
                </div>
              ) : (
                renderTechGroup(items)
              )}
            </>
          )}
        </div>

        {/* One editing surface for every style control */}
        {showCustomization && (
          <div
            aria-labelledby="customization-controls-heading"
            className="border-t border-[#1E2636] bg-[#0C1017]"
          >
            <div className="px-4 sm:px-5 py-4 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
                  <h3
                    id="customization-controls-heading"
                    className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                  >
                    Customize
                  </h3>
                </div>
                <span className="text-[11px] text-[#64748B] hidden sm:inline">
                  Changes apply instantly
                </span>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#64748B] mr-0.5">Presets</span>
                {STUDIO_PRESETS.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onApplyPreset(preset.id)}
                      aria-pressed={isActive}
                      title={preset.summary}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#38BDF8] border-[#38BDF8] text-[#090B10] font-semibold'
                          : 'bg-[#090B10] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#2C374D]'
                      }`}
                    >
                      {isActive && <Check className="w-3 h-3" aria-hidden="true" />}
                      <span>{presetLabel(preset.name)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Frame + alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="block text-[11px] font-medium text-[#64748B] mb-1.5">Frame</span>
                  <div className="grid grid-cols-4 gap-0.5 bg-[#090B10] p-0.5 rounded-lg border border-[#1E2636]">
                    {FRAME_STYLES.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onUpdateSettings({ presentationStyle: style.id })}
                        aria-pressed={settings.presentationStyle === style.id}
                        className={`py-1.5 px-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer transition-all ${
                          settings.presentationStyle === style.id
                            ? 'bg-[#38BDF8] text-[#090B10] font-semibold'
                            : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-medium text-[#64748B] mb-1.5">
                    Alignment
                  </span>
                  <div className="grid grid-cols-3 gap-0.5 bg-[#090B10] p-0.5 rounded-lg border border-[#1E2636]">
                    {ALIGNMENTS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onUpdateSettings({ alignment: id })}
                        aria-pressed={settings.alignment === id}
                        className={`py-1.5 px-2 rounded-md text-[11px] font-medium flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                          settings.alignment === id
                            ? 'bg-[#38BDF8] text-[#090B10] font-semibold'
                            : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display toggles */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#64748B] mr-0.5">Show</span>
                {DISPLAY_TOGGLES.map(({ key, label, title, icon: Icon }) => {
                  const isActive = Boolean(settings[key]);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleToggleDisplay(key)}
                      aria-pressed={isActive}
                      title={title}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#38BDF8]/12 border-[#38BDF8]/45 text-[#E2E8F0]'
                          : 'bg-[#090B10] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#2C374D]'
                      }`}
                    >
                      <Icon
                        className={`w-3 h-3 ${isActive ? 'text-[#38BDF8]' : 'text-[#64748B]'}`}
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Stack title fields, only when the title is visible */}
              {settings.showHeader && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="header-title-input"
                      className="block text-[11px] font-medium text-[#64748B] mb-1"
                    >
                      Stack heading
                    </label>
                    <input
                      id="header-title-input"
                      type="text"
                      value={settings.headerTitle}
                      onChange={(e) => onUpdateSettings({ headerTitle: e.target.value })}
                      placeholder="e.g. Tech Stack"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#090B10] border border-[#1E2636] text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="header-subtitle-input"
                      className="block text-[11px] font-medium text-[#64748B] mb-1"
                    >
                      Subtitle
                    </label>
                    <input
                      id="header-subtitle-input"
                      type="text"
                      value={settings.headerSubtitle}
                      onChange={(e) => onUpdateSettings({ headerSubtitle: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#090B10] border border-[#1E2636] text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                </div>
              )}

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-3 rounded-xl bg-[#090B10] border border-[#1E2636] px-3 py-2.5">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <label htmlFor="icon-size-range" className="font-medium text-[#94A3B8]">
                      Icon size
                    </label>
                    <span className="text-[#E2E8F0] font-semibold tabular-nums">
                      {settings.iconSize}px
                    </span>
                  </div>
                  <input
                    id="icon-size-range"
                    type="range"
                    min={28}
                    max={72}
                    value={settings.iconSize}
                    onChange={(e) => onUpdateSettings({ iconSize: Number(e.target.value) })}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <label htmlFor="spacing-range" className="font-medium text-[#94A3B8]">
                      Spacing
                    </label>
                    <span className="text-[#E2E8F0] font-semibold tabular-nums">
                      {settings.spacing}px
                    </span>
                  </div>
                  <input
                    id="spacing-range"
                    type="range"
                    min={6}
                    max={32}
                    value={settings.spacing}
                    onChange={(e) => onUpdateSettings({ spacing: Number(e.target.value) })}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <label htmlFor="per-row-range" className="font-medium text-[#94A3B8]">
                      Columns
                    </label>
                    <span className="text-[#E2E8F0] font-semibold tabular-nums">
                      {settings.itemsPerRow === 0 ? 'Auto' : `${settings.itemsPerRow} / row`}
                    </span>
                  </div>
                  <input
                    id="per-row-range"
                    type="range"
                    min={0}
                    max={10}
                    value={settings.itemsPerRow}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateSettings({ itemsPerRow: val > 0 && val < 3 ? 3 : val });
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Advanced embed host */}
              <details className="group rounded-lg bg-[#090B10] border border-[#1E2636] px-3 py-2">
                <summary className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#94A3B8] hover:text-[#F1F5F9] cursor-pointer list-none">
                  <span>README embed host</span>
                  <ChevronDown
                    className="w-3.5 h-3.5 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="mt-2.5 pt-2.5 border-t border-[#1E2636] space-y-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-[#64748B]">Quick presets:</span>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ assetBaseUrl: GITHUB_PAGES_URL })}
                      className={`px-2 py-0.5 rounded text-[11px] border cursor-pointer transition-colors ${
                        settings.assetBaseUrl === GITHUB_PAGES_URL
                          ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-[#38BDF8]'
                          : 'bg-[#0F131B] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9]'
                      }`}
                    >
                      GitHub Pages
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ assetBaseUrl: GITHUB_RAW_PUBLIC_URL })}
                      className={`px-2 py-0.5 rounded text-[11px] border cursor-pointer transition-colors ${
                        settings.assetBaseUrl === GITHUB_RAW_PUBLIC_URL
                          ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-[#38BDF8]'
                          : 'bg-[#0F131B] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9]'
                      }`}
                    >
                      GitHub Raw
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label
                      htmlFor="asset-base-url-input"
                      className="text-[11px] text-[#94A3B8] shrink-0"
                    >
                      SVG base URL
                    </label>
                    <input
                      id="asset-base-url-input"
                      type="url"
                      value={settings.assetBaseUrl || GITHUB_PAGES_URL}
                      onChange={(e) => onUpdateSettings({ assetBaseUrl: e.target.value })}
                      spellCheck={false}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0F131B] border border-[#1E2636] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Selected stack tray */}
        {childrenAfterPreview}
      </section>
    </div>
  );
};
