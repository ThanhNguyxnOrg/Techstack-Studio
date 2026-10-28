import React, { useMemo, useRef, useState } from 'react';
import { Check, Code2, Copy, Download, FileCode, Image } from 'lucide-react';
import { CustomizationSettings, ExportFormat, TechItem } from '../types/stack';
import { generateExportOutput, generateStandaloneSvg } from '../utils/studioLogic';

interface ExportStudioProps {
  selectedItems: TechItem[];
  settings: CustomizationSettings;
}

const FORMAT_OPTIONS: Array<{
  id: ExportFormat;
  label: string;
  extension: string;
  mimeType: string;
  summary: string;
}> = [
  {
    id: 'markdown',
    label: 'Markdown (README.md)',
    extension: 'README-stack.md',
    mimeType: 'text/markdown;charset=utf-8',
    summary: 'Ready to paste directly into your GitHub profile or repository README.',
  },
  {
    id: 'svg',
    label: 'Animated SVG (.svg)',
    extension: 'tech-stack.svg',
    mimeType: 'image/svg+xml;charset=utf-8',
    summary:
      'Single vector file containing all animated logos. Embed via ![Tech Stack](./tech-stack.svg).',
  },
  {
    id: 'html',
    label: 'HTML Snippet (.html)',
    extension: 'tech-stack.html',
    mimeType: 'text/html;charset=utf-8',
    summary: 'Self-contained HTML with inline animated SVGs for websites and portfolios.',
  },
];

export const ExportStudio: React.FC<ExportStudioProps> = ({ selectedItems, settings }) => {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('markdown');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const codeAreaRef = useRef<HTMLTextAreaElement>(null);

  const generatedCode = useMemo(
    () => generateExportOutput(activeFormat, selectedItems, settings),
    [activeFormat, selectedItems, settings]
  );

  const svgPreviewMarkup = useMemo(
    () => generateStandaloneSvg(selectedItems, settings),
    [selectedItems, settings]
  );

  const activeFormatMeta =
    FORMAT_OPTIONS.find((opt) => opt.id === activeFormat) || FORMAT_OPTIONS[0];

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedCode);
        setCopyStatus('copied');
      } else if (codeAreaRef.current) {
        codeAreaRef.current.select();
        document.execCommand('copy');
        setCopyStatus('copied');
      } else {
        throw new Error('Clipboard API unavailable');
      }
      window.setTimeout(() => setCopyStatus('idle'), 2400);
    } catch {
      if (codeAreaRef.current) {
        codeAreaRef.current.focus();
        codeAreaRef.current.select();
      }
      setCopyStatus('error');
      window.setTimeout(() => setCopyStatus('idle'), 3500);
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([generatedCode], { type: activeFormatMeta.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFormatMeta.extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="export-section"
      aria-labelledby="export-heading"
      className="rounded-2xl bg-[#0F131B] border border-[#1E2636] p-4 sm:p-5 space-y-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2636]">
        <div>
          <h2 id="export-heading" className="text-base font-bold text-[#F1F5F9]">
            3. Export
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">{activeFormatMeta.summary}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadFile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090B10] border border-[#1E2636] text-xs font-medium text-[#E2E8F0] hover:border-[#38BDF8] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
            <span>Download {activeFormatMeta.extension}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#38BDF8] text-[#090B10] text-xs font-semibold hover:bg-[#7DD3FC] whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-xs"
          >
            {copyStatus === 'copied' ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Format Tabs */}
      <div
        role="tablist"
        aria-label="Export format"
        className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-[#090B10] p-1 rounded-xl border border-[#1E2636]"
      >
        {FORMAT_OPTIONS.map((option) => {
          const isSelected = activeFormat === option.id;
          const Icon = option.id === 'markdown' ? FileCode : option.id === 'html' ? Code2 : Image;

          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                setActiveFormat(option.id);
                setCopyStatus('idle');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#161F30] text-[#38BDF8] border border-[#38BDF8]/40 shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] border border-transparent'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isSelected ? 'text-[#38BDF8]' : 'text-[#64748B]'
                }`}
                aria-hidden="true"
              />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Accessible Status Feedback */}
      <div role="status" aria-live="polite" className="sr-only">
        {copyStatus === 'copied'
          ? `${activeFormatMeta.label} copied to clipboard.`
          : copyStatus === 'error'
            ? 'Clipboard copy failed; code selected for manual copy.'
            : ''}
      </div>

      {/* Code Output */}
      <div>
        <label htmlFor="generated-code-textarea" className="sr-only">
          Generated {activeFormatMeta.label} code
        </label>
        <textarea
          ref={codeAreaRef}
          id="generated-code-textarea"
          readOnly
          value={generatedCode}
          rows={7}
          spellCheck={false}
          className="w-full p-3.5 rounded-xl bg-[#07090E] border border-[#1E2636] font-mono text-xs text-[#E2E8F0] leading-relaxed focus:outline-none focus:border-[#38BDF8] resize-y"
        />
      </div>

      {/* Animated SVG Banner Preview when SVG tab is active */}
      {activeFormat === 'svg' && (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-medium text-[#94A3B8]">Exported SVG file preview:</div>
          <div
            className="p-4 rounded-xl bg-[#07090E] border border-[#1E2636] overflow-x-auto flex justify-center"
            dangerouslySetInnerHTML={{ __html: svgPreviewMarkup }}
          />
        </div>
      )}
    </section>
  );
};
