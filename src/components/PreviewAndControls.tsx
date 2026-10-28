import React, { useMemo, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Box,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  Eye,
  FileCode,
  Heading,
  Image,
  Moon,
  Pause,
  Play,
  Sliders,
  Sparkles,
  Square,
  Sun,
  Tag,
} from 'lucide-react';
import { GITHUB_PAGES_URL, GITHUB_RAW_PUBLIC_URL, STUDIO_PRESETS } from '../data/catalog';
import {
  CustomizationSettings,
  ExportFormat,
  PresentationStyle,
  StackAlignment,
  TechItem,
  WebAnimationStyle,
} from '../types/stack';
import {
  generateExportOutput,
  generateStandaloneSvg,
  groupItemsByCategory,
} from '../utils/studioLogic';
import { usePrefersReducedMotion } from '../utils/usePrefersReducedMotion';
import { TechIcon } from './TechIcon';

interface PreviewAndControlsProps {
  items: TechItem[];
  settings: CustomizationSettings;
  onUpdateSettings: (partial: Partial<CustomizationSettings>) => void;
  onApplyPreset: (presetId: string) => void;
  childrenAfterPreview?: React.ReactNode;
}

export const PreviewAndControls: React.FC<PreviewAndControlsProps> = ({
  items,
  settings,
  onUpdateSettings,
  onApplyPreset,
  childrenAfterPreview,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDark = settings.theme === 'dark';
  const [previewMode, setPreviewMode] = useState<'interactive' | 'svg-banner'>('interactive');
  const [copiedFormat, setCopiedFormat] = useState<ExportFormat | null>(null);

  const svgBannerMarkup = useMemo(() => generateStandaloneSvg(items, settings), [items, settings]);

  const handleQuickCopy = async (format: ExportFormat) => {
    const output = generateExportOutput(format, items, settings);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(output);
      } else {
        const temp = document.createElement('textarea');
        temp.value = output;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      setCopiedFormat(format);
      window.setTimeout(() => setCopiedFormat(null), 2200);
    } catch {
      setCopiedFormat(null);
    }
  };

  const handleQuickDownloadSvg = () => {
    const blob = new Blob([svgBannerMarkup], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tech-stack.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  const isLogosOnlyMode =
    !settings.showLabels && settings.presentationStyle === 'minimal' && !settings.showInnerPlate;

  return (
    <div id="customize-section" className="space-y-5">
      {/* Live Preview + Quick Customize & Direct Copy Workspace */}
      <section
        aria-labelledby="live-preview-heading"
        className="bg-[#0F131B] border border-[#1E2636] rounded-2xl overflow-hidden shadow-sm"
      >
        {/* Top Header Bar: Title + Motion / Speed / Theme + Preview Mode Switcher */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#1E2636] bg-[#0C1017] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <h2
              id="live-preview-heading"
              className="text-sm font-bold text-[#F1F5F9] whitespace-nowrap"
            >
              Live preview
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-[#141923] border border-[#1E2636] text-[11px] font-medium text-[#94A3B8] tabular-nums whitespace-nowrap">
              {items.length} {items.length === 1 ? 'logo' : 'logos'}
            </span>

            {/* Interactive vs 1:1 SVG Banner Mode */}
            <div
              role="group"
              aria-label="Preview rendering mode"
              className="hidden sm:flex items-center gap-0.5 bg-[#090B10] border border-[#1E2636] rounded-lg p-0.5 ml-1"
            >
              <button
                type="button"
                onClick={() => setPreviewMode('interactive')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  previewMode === 'interactive'
                    ? 'bg-[#161F30] text-[#38BDF8] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
                title="Interactive DOM preview"
              >
                <Eye className="w-3 h-3" />
                <span>Interactive</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('svg-banner')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  previewMode === 'svg-banner'
                    ? 'bg-[#161F30] text-[#38BDF8] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
                title="Exact 1:1 standalone SVG banner preview"
              >
                <Image className="w-3 h-3" />
                <span>1:1 SVG Export</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onUpdateSettings({ animateSvgLogos: !settings.animateSvgLogos })}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                settings.animateSvgLogos
                  ? 'bg-[#38BDF8]/15 border-[#38BDF8]/50 text-[#38BDF8]'
                  : 'bg-[#090B10] border-[#1E2636] text-[#94A3B8]'
              }`}
            >
              {settings.animateSvgLogos ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
              <span>{settings.animateSvgLogos ? 'Motion: On' : 'Motion: Off'}</span>
            </button>

            <div className="flex items-center gap-0.5 bg-[#090B10] border border-[#1E2636] rounded-lg p-0.5 shrink-0">
              {([0.5, 1, 1.5] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onUpdateSettings({ animationSpeedMultiplier: spd })}
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
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-[#090B10] border border-[#1E2636] text-[#E2E8F0] hover:border-[#2C374D] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              {isDark ? (
                <Moon className="w-3 h-3 text-[#38BDF8]" />
              ) : (
                <Sun className="w-3 h-3 text-amber-400" />
              )}
              <span>{isDark ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>

        {/* Instant Visual Toggles Strip (Names, Card Frame, Inner Box "Khung 2", Stack Title) */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-[#1E2636] bg-[#090B10]/90 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Toggle 1: Tech Names below logo */}
            <button
              type="button"
              onClick={() => onUpdateSettings({ showLabels: !settings.showLabels })}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                settings.showLabels
                  ? 'bg-[#161F30] border-[#38BDF8]/50 text-[#F1F5F9]'
                  : 'bg-[#0C1017] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
              title="Show or hide technology names under each logo"
            >
              <Tag className="w-3 h-3 text-[#38BDF8]" />
              <span>Names: {settings.showLabels ? 'On' : 'Off'}</span>
            </button>

            {/* Toggle 2: Outer Card Frame vs Minimal (No Frame) */}
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({
                  presentationStyle: settings.presentationStyle === 'minimal' ? 'tiles' : 'minimal',
                })
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                settings.presentationStyle !== 'minimal'
                  ? 'bg-[#161F30] border-[#38BDF8]/50 text-[#F1F5F9]'
                  : 'bg-[#0C1017] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
              title="Show or hide outer card frame around each technology"
            >
              <Square className="w-3 h-3 text-[#38BDF8]" />
              <span>
                Card Frame:{' '}
                {settings.presentationStyle === 'minimal' ? 'Off' : settings.presentationStyle}
              </span>
            </button>

            {/* Toggle 3: Inner Icon Box ("Khung số 2") */}
            <button
              type="button"
              onClick={() => onUpdateSettings({ showInnerPlate: !settings.showInnerPlate })}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                settings.showInnerPlate
                  ? 'bg-[#161F30] border-[#38BDF8]/50 text-[#F1F5F9]'
                  : 'bg-[#0C1017] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
              title="Show or hide the inner icon well frame (Khung số 2) inside cards"
            >
              <Box className="w-3 h-3 text-[#38BDF8]" />
              <span>Inner Box: {settings.showInnerPlate ? 'On' : 'Off'}</span>
            </button>

            {/* Toggle 4: Stack Heading ("Tên techstack") */}
            <button
              type="button"
              onClick={() => onUpdateSettings({ showHeader: !settings.showHeader })}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                settings.showHeader
                  ? 'bg-[#161F30] border-[#38BDF8]/50 text-[#F1F5F9]'
                  : 'bg-[#0C1017] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
              title="Show or hide the section heading above the stack"
            >
              <Heading className="w-3 h-3 text-[#38BDF8]" />
              <span>Stack Title: {settings.showHeader ? 'On' : 'Off'}</span>
            </button>

            {/* 1-Click Logos Only Preset */}
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({
                  showLabels: false,
                  presentationStyle: 'minimal',
                  showInnerPlate: false,
                  showHeader: false,
                })
              }
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                isLogosOnlyMode
                  ? 'bg-[#38BDF8] text-[#090B10] border-[#38BDF8] font-semibold'
                  : 'bg-[#0C1017] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
              title="Clean logos only — no names, no card frame, no inner box"
            >
              <Sparkles className="w-3 h-3" />
              <span>Logos Only</span>
            </button>
          </div>

          {/* Direct Copy & Download Bar on the Preview */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickCopy('svg')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#090B10] text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
              title="Copy exact animated SVG banner code matching this preview"
            >
              {copiedFormat === 'svg' ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied SVG!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy SVG</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleQuickCopy('markdown')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141923] hover:bg-[#1C2433] border border-[#263248] text-[#E2E8F0] text-[11px] font-medium transition-colors cursor-pointer"
              title="Copy GitHub README Markdown"
            >
              {copiedFormat === 'markdown' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied MD!</span>
                </>
              ) : (
                <>
                  <FileCode className="w-3 h-3 text-[#38BDF8]" />
                  <span>Copy README.md</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleQuickCopy('html')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141923] hover:bg-[#1C2433] border border-[#263248] text-[#E2E8F0] text-[11px] font-medium transition-colors cursor-pointer"
              title="Copy self-contained HTML snippet"
            >
              {copiedFormat === 'html' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied HTML!</span>
                </>
              ) : (
                <>
                  <Code2 className="w-3 h-3 text-[#38BDF8]" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleQuickDownloadSvg}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0C1017] hover:bg-[#141923] border border-[#1E2636] text-[#CBD5E1] text-[11px] font-medium transition-colors cursor-pointer"
              title="Download standalone tech-stack.svg banner"
            >
              <Download className="w-3 h-3 text-[#38BDF8]" />
              <span>.svg</span>
            </button>
          </div>
        </div>

        {/* Inline Stack Title Editor when Stack Title is On */}
        {settings.showHeader && (
          <div className="px-4 sm:px-5 py-2.5 border-b border-[#1E2636] bg-[#0B0E16] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="header-title-input" className="block text-[11px] text-[#94A3B8] mb-1">
                Stack heading
              </label>
              <input
                id="header-title-input"
                type="text"
                value={settings.headerTitle}
                onChange={(e) => onUpdateSettings({ headerTitle: e.target.value })}
                placeholder="e.g. Tech Stack"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0F131B] border border-[#1E2636] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
            <div>
              <label
                htmlFor="header-subtitle-input"
                className="block text-[11px] text-[#94A3B8] mb-1"
              >
                Subtitle (optional)
              </label>
              <input
                id="header-subtitle-input"
                type="text"
                value={settings.headerSubtitle}
                onChange={(e) => onUpdateSettings({ headerSubtitle: e.target.value })}
                placeholder="Optional subtitle..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0F131B] border border-[#1E2636] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
          </div>
        )}

        {/* Rendered Preview Surface */}
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

        {/* Integrated Selected Stack Reorder Tray */}
        {childrenAfterPreview}
      </section>

      {/* Customization Controls */}
      <section
        aria-labelledby="customization-controls-heading"
        className="bg-[#0F131B] border border-[#1E2636] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1E2636]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#38BDF8]" />
            <h2 id="customization-controls-heading" className="text-base font-bold text-[#F1F5F9]">
              2. Customize your stack
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {STUDIO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset.id)}
                className="px-2.5 py-1 rounded-lg bg-[#090B10] hover:bg-[#141923] border border-[#1E2636] hover:border-[#38BDF8]/50 text-xs font-medium text-[#E2E8F0] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                title={preset.summary}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders: Icon Size, Spacing, Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#090B10] border border-[#1E2636]">
            <div className="flex justify-between text-xs font-medium mb-2">
              <label htmlFor="icon-size-range" className="text-[#94A3B8]">
                Icon size
              </label>
              <span className="text-[#F1F5F9] font-semibold tabular-nums">
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

          <div className="p-3 rounded-xl bg-[#090B10] border border-[#1E2636]">
            <div className="flex justify-between text-xs font-medium mb-2">
              <label htmlFor="spacing-range" className="text-[#94A3B8]">
                Spacing
              </label>
              <span className="text-[#F1F5F9] font-semibold tabular-nums">
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

          <div className="p-3 rounded-xl bg-[#090B10] border border-[#1E2636]">
            <div className="flex justify-between text-xs font-medium mb-2">
              <label htmlFor="per-row-range" className="text-[#94A3B8]">
                Columns
              </label>
              <span className="text-[#F1F5F9] font-semibold tabular-nums">
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

        {/* Alignment & Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="block text-xs font-medium text-[#94A3B8] mb-1.5">Alignment</span>
            <div className="grid grid-cols-3 gap-1.5 bg-[#090B10] p-1 rounded-xl border border-[#1E2636]">
              {(
                [
                  { id: 'left', label: 'Left', icon: AlignLeft },
                  { id: 'center', label: 'Center', icon: AlignCenter },
                  { id: 'right', label: 'Right', icon: AlignRight },
                ] as { id: StackAlignment; label: string; icon: React.FC<{ className?: string }> }[]
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onUpdateSettings({ alignment: id })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    settings.alignment === id
                      ? 'bg-[#38BDF8] text-[#090B10] font-semibold shadow-xs'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-[#94A3B8] mb-1.5">
              Card frame style
            </span>
            <div className="grid grid-cols-4 gap-1 bg-[#090B10] p-1 rounded-xl border border-[#1E2636]">
              {(['tiles', 'minimal', 'cards', 'pills'] as PresentationStyle[]).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => onUpdateSettings({ presentationStyle: style })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap cursor-pointer transition-all ${
                    settings.presentationStyle === style
                      ? 'bg-[#38BDF8] text-[#090B10] font-semibold shadow-xs'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  {style === 'minimal' ? 'No Frame' : style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="flex flex-wrap items-center gap-4 pt-2.5 border-t border-[#1E2636]">
          <label className="inline-flex items-center gap-2 text-xs text-[#E2E8F0] cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showLabels}
              onChange={(e) => onUpdateSettings({ showLabels: e.target.checked })}
              className="accent-[#38BDF8] rounded"
            />
            <span>Show tech names</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-[#E2E8F0] cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(settings.showInnerPlate)}
              onChange={(e) => onUpdateSettings({ showInnerPlate: e.target.checked })}
              className="accent-[#38BDF8] rounded"
            />
            <span>Show inner icon box (Frame 2)</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-[#E2E8F0] cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showHeader}
              onChange={(e) => onUpdateSettings({ showHeader: e.target.checked })}
              className="accent-[#38BDF8] rounded"
            />
            <span>Show stack heading</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-[#E2E8F0] cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showCategoryGrouping}
              onChange={(e) => onUpdateSettings({ showCategoryGrouping: e.target.checked })}
              className="accent-[#38BDF8] rounded"
            />
            <span>Group by category</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-[#E2E8F0] cursor-pointer">
            <input
              type="checkbox"
              checked={settings.linkIconsToDocs}
              onChange={(e) => onUpdateSettings({ linkIconsToDocs: e.target.checked })}
              className="accent-[#38BDF8] rounded"
            />
            <span>Link logos to official docs</span>
          </label>
        </div>

        {/* GitHub Repository & README Asset Host Configuration */}
        <details className="group rounded-xl bg-[#090B10] border border-[#1E2636] p-3">
          <summary className="flex items-center justify-between text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] cursor-pointer list-none">
            <span>
              GitHub Pages / README SVG host URL ({settings.assetBaseUrl || GITHUB_PAGES_URL})
            </span>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="mt-3 pt-3 border-t border-[#1E2636] space-y-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#94A3B8]">Quick host presets:</span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ assetBaseUrl: GITHUB_PAGES_URL })}
                className={`px-2 py-0.5 rounded text-[11px] border cursor-pointer transition-colors ${
                  settings.assetBaseUrl === GITHUB_PAGES_URL
                    ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-[#38BDF8]'
                    : 'bg-[#0F131B] border-[#1E2636] text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                GitHub Pages (ThanhNguyxnOrg/Techstack-Studio)
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
                GitHub Raw (main/public)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="asset-base-url-input" className="text-xs text-[#94A3B8] shrink-0">
                Markdown SVG base URL:
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
      </section>
    </div>
  );
};
