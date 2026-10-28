import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, RotateCcw, Trash2, X } from 'lucide-react';
import { TechItem } from '../types/stack';
import { TechIcon } from './TechIcon';

interface SelectedStackBarProps {
  selectedItems: TechItem[];
  onMoveTech: (techId: string, direction: 'left' | 'right' | 'first' | 'last') => void;
  onRemoveTech: (techId: string) => void;
  onClearStack: () => void;
  onRestoreStarterStack: () => void;
}

export const SelectedStackBar: React.FC<SelectedStackBarProps> = ({
  selectedItems,
  onMoveTech,
  onRemoveTech,
  onClearStack,
  onRestoreStarterStack,
}) => {
  return (
    <section
      aria-labelledby="selected-stack-heading"
      className="border-t border-[#1E2636] bg-[#0C1017] px-4 sm:px-5 py-3.5"
    >
      <div className="flex items-center justify-between gap-2 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <h2
            id="selected-stack-heading"
            className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] whitespace-nowrap"
          >
            Selected logos
          </h2>
          <span className="px-1.5 py-0.5 rounded-md bg-[#38BDF8]/15 text-[#38BDF8] text-[11px] font-semibold tabular-nums shrink-0">
            {selectedItems.length}
          </span>
          <span className="text-[11px] text-[#64748B] hidden xl:inline truncate">
            — Reorder or remove
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onRestoreStarterStack}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#090B10] border border-[#1E2636] text-[11px] font-medium text-[#CBD5E1] hover:text-[#F1F5F9] hover:border-[#38BDF8]/50 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-[#38BDF8]" aria-hidden="true" />
            <span>Reset default</span>
          </button>

          {selectedItems.length > 0 && (
            <button
              type="button"
              onClick={onClearStack}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#090B10] border border-[#1E2636] text-[11px] font-medium text-[#94A3B8] hover:text-[#F87171] hover:border-[#F87171]/40 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" aria-hidden="true" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {selectedItems.length === 0 ? (
        <div className="py-3 px-4 rounded-lg bg-[#090B10] border border-dashed border-[#1E2636] text-center">
          <p className="text-xs text-[#94A3B8]">
            No technologies selected yet. Click any technology in the catalog or restore the default
            stack.
          </p>
        </div>
      ) : (
        <ul
          aria-label="Selected technologies"
          className="flex flex-wrap gap-1.5 max-h-[116px] overflow-y-auto pr-1"
        >
          {selectedItems.map((item, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === selectedItems.length - 1;

            return (
              <li
                key={item.id}
                className="group inline-flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-lg bg-[#090B10] border border-[#1E2636] hover:border-[#2E3A52] transition-colors"
              >
                <TechIcon item={item} size={18} theme="dark" animate={false} />
                <span className="text-[11px] font-medium text-[#E2E8F0] whitespace-nowrap">
                  {item.name}
                </span>

                <div className="flex items-center gap-0.5 pl-1 border-l border-[#1E2636]">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onMoveTech(item.id, 'first')}
                    aria-label={`Move ${item.name} to start`}
                    title="Move to start"
                    className="p-0.5 rounded text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#161C28] disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronsLeft className="w-3 h-3" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onMoveTech(item.id, 'left')}
                    aria-label={`Move ${item.name} earlier`}
                    title="Move left"
                    className="p-0.5 rounded text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#161C28] disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => onMoveTech(item.id, 'right')}
                    aria-label={`Move ${item.name} later`}
                    title="Move right"
                    className="p-0.5 rounded text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#161C28] disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveTech(item.id)}
                    aria-label={`Remove ${item.name}`}
                    title={`Remove ${item.name}`}
                    className="p-0.5 rounded text-[#64748B] hover:text-[#F87171] hover:bg-[#1F1218] cursor-pointer"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
