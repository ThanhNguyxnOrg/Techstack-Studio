import React from 'react';
import { CheckCircle2, Code2, ExternalLink, RotateCcw, Sliders, Trash2 } from 'lucide-react';
import { GITHUB_REPO_URL } from '../data/catalog';
import { StudioStage } from '../types/stack';

interface HeroSectionProps {
  selectedCount: number;
  activeStage: StudioStage;
  onSelectStage: (stage: StudioStage) => void;
  onResetDefault: () => void;
  onClearAll: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCount,
  activeStage,
  onSelectStage,
  onResetDefault,
  onClearAll,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1E2636] bg-[#090B10]/90 backdrop-blur-md">
      <div className="max-w-[1920px] mx-auto w-full px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 2xl:h-16 2xl:flex-nowrap 2xl:py-0">
        {/* Zone 1: Brand Lockup */}
        <div className="order-1 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#161F30] to-[#0F1420] border border-[#263248] flex items-center justify-center shrink-0 shadow-xs">
            <img
              src={`${import.meta.env.BASE_URL}favicon.svg`}
              alt=""
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#F1F5F9] whitespace-nowrap">
              Tech Stack Studio
            </h1>
            <span className="hidden 2xl:inline-block text-xs text-[#64748B] whitespace-nowrap">
              Animated SVG stack builder for GitHub READMEs &amp; portfolios
            </span>
          </div>
        </div>

        {/* Zone 2: 3-Step Segmented Navigation */}
        <nav
          aria-label="Workflow steps"
          className="order-3 grid w-full grid-cols-3 items-center gap-1 bg-[#0F131B] p-1 rounded-xl border border-[#1E2636] 2xl:order-2 2xl:flex 2xl:w-auto 2xl:shrink-0"
        >
          <button
            type="button"
            onClick={() => onSelectStage('select')}
            aria-pressed={activeStage === 'select'}
            aria-label="Build stack and choose technologies"
            title="Build stack and choose technologies"
            className={`inline-flex w-full 2xl:w-auto items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeStage === 'select'
                ? 'bg-[#38BDF8] text-[#090B10] font-semibold shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#161C28]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Build</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[11px] tabular-nums ${
                activeStage === 'select'
                  ? 'bg-[#090B10]/15 text-[#090B10] font-bold'
                  : 'bg-[#161C28] text-[#38BDF8]'
              }`}
            >
              {selectedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStage('customize')}
            aria-pressed={activeStage === 'customize'}
            aria-label="Preview and customize the stack"
            title="Preview and customize the stack"
            className={`inline-flex w-full 2xl:w-auto items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeStage === 'customize'
                ? 'bg-[#38BDF8] text-[#090B10] font-semibold shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#161C28]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span>Customize</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStage('generate')}
            aria-pressed={activeStage === 'generate'}
            aria-label="Export generated stack code"
            title="Export generated stack code"
            className={`inline-flex w-full 2xl:w-auto items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeStage === 'generate'
                ? 'bg-[#38BDF8] text-[#090B10] font-semibold shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#161C28]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 shrink-0" />
            <span>Export</span>
          </button>
        </nav>

        {/* Zone 3: Single-line Utility Actions */}
        <div className="order-2 flex items-center gap-1 sm:gap-2 shrink-0 2xl:order-3">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="ThanhNguyxnOrg/Techstack-Studio on GitHub"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#CBD5E1] hover:text-[#F1F5F9] bg-[#0F131B] hover:bg-[#161C28] border border-[#1E2636] hover:border-[#2C374D] whitespace-nowrap shrink-0 transition-colors"
          >
            <span>GitHub Repo</span>
            <ExternalLink className="w-3 h-3 text-[#38BDF8]" />
          </a>
          <button
            type="button"
            onClick={onResetDefault}
            title="Restore default starter stack"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#CBD5E1] hover:text-[#F1F5F9] bg-[#0F131B] hover:bg-[#161C28] border border-[#1E2636] hover:border-[#2C374D] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            type="button"
            onClick={onClearAll}
            disabled={selectedCount === 0}
            title="Clear all selected technologies"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#F87171] bg-[#0F131B] hover:bg-[#1B1318] border border-[#1E2636] hover:border-[#F87171]/40 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </header>
  );
};
