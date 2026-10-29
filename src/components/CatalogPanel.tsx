import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Check, Plus, Search, X } from 'lucide-react';
import { TECH_CATALOG, TECH_CATEGORIES } from '../data/catalog';
import { CatalogSortMode, TechCategory } from '../types/stack';
import { filterCatalog, sortCatalogItems } from '../utils/studioLogic';
import { TechIcon } from './TechIcon';

interface CatalogPanelProps {
  selectedIds: string[];
  animateSvgLogos: boolean;
  animationSpeedMultiplier: number;
  onToggleTech: (techId: string) => void;
}

const CATEGORY_SHORT_LABELS: Record<TechCategory, string> = {
  'Programming languages': 'Languages',
  Frontend: 'Frontend',
  Backend: 'Backend',
  'AI and machine learning': 'AI & ML',
  Databases: 'Databases',
  'Cloud and DevOps': 'Cloud & DevOps',
  'Embedded development': 'Embedded & IoT',
  'Developer tools': 'Dev Tools',
};

export const CatalogPanel: React.FC<CatalogPanelProps> = ({
  selectedIds,
  animateSvgLogos,
  animationSpeedMultiplier,
  onToggleTech,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TechCategory | 'all'>('all');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [sortMode, setSortMode] = useState<CatalogSortMode>('popularity');
  const [visibleLimit, setVisibleLimit] = useState<number>(40);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const subcategoriesForActive = useMemo(() => {
    const base =
      activeCategory === 'all'
        ? TECH_CATALOG
        : TECH_CATALOG.filter((i) => i.category === activeCategory);
    const set = new Set<string>();
    for (const item of base) {
      if (item.subcategory) set.add(item.subcategory);
    }
    return Array.from(set).sort();
  }, [activeCategory]);

  const filteredAndSorted = useMemo(() => {
    const rawFiltered = filterCatalog(TECH_CATALOG, searchQuery, activeCategory, activeSubcategory);
    return sortCatalogItems(rawFiltered, sortMode);
  }, [searchQuery, activeCategory, activeSubcategory, sortMode]);

  const displayedItems = useMemo(
    () => filteredAndSorted.slice(0, visibleLimit),
    [filteredAndSorted, visibleLimit]
  );

  const handleCategoryChange = (cat: TechCategory | 'all') => {
    setActiveCategory(cat);
    setActiveSubcategory('all');
    setVisibleLimit(40);
  };

  return (
    <section
      id="catalog-section"
      aria-labelledby="catalog-heading"
      className="scroll-mt-20 bg-[#0F131B] border border-[#1E2636] rounded-2xl flex flex-col overflow-hidden shadow-sm xl:h-full xl:min-h-0"
    >
      {/* Header & Controls */}
      <div className="p-3 sm:p-4 border-b border-[#1E2636] flex flex-col gap-3 bg-[#0C1017] shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 id="catalog-heading" className="text-base font-bold tracking-tight text-[#F1F5F9]">
              Choose technologies
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Select logos to add them to your live animated stack.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#141923] border border-[#1E2636] text-xs font-medium text-[#94A3B8] tabular-nums shrink-0">
            {filteredAndSorted.length} available
          </span>
        </div>

        {/* Search Input + Sort Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-7 xl:col-span-8 relative">
            <Search
              className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="catalog-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleLimit(40);
              }}
              placeholder="Search 550+ technologies (React, Python, AWS...)"
              aria-label="Search technologies"
              className="w-full pl-9 pr-8 py-2 bg-[#090B10] border border-[#1E2636] focus:border-[#38BDF8] rounded-xl text-xs text-[#F1F5F9] placeholder-[#64748B] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F1F5F9] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="sm:col-span-5 xl:col-span-4 flex items-center gap-1.5 bg-[#090B10] border border-[#1E2636] hover:border-[#2C374D] rounded-xl px-2.5 py-2 transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            <label htmlFor="catalog-sort-select" className="sr-only">
              Sort by
            </label>
            <select
              id="catalog-sort-select"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as CatalogSortMode)}
              className="w-full bg-transparent text-xs font-medium text-[#E2E8F0] focus:outline-none cursor-pointer"
            >
              <option value="popularity" className="bg-[#0F131B]">
                Sort: Popular
              </option>
              <option value="alphabetical" className="bg-[#0F131B]">
                Sort: Name (A–Z)
              </option>
              <option value="subcategory" className="bg-[#0F131B]">
                Sort: Category
              </option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs — Clean Flex-Wrap (Zero Horizontal Scrollbar) */}
        <div
          role="tablist"
          aria-label="Technology categories"
          className="flex flex-wrap items-center gap-1.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => handleCategoryChange('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
              activeCategory === 'all'
                ? 'bg-[#38BDF8] text-[#090B10] border-[#38BDF8] font-semibold shadow-xs'
                : 'bg-[#090B10] text-[#94A3B8] border-[#1E2636] hover:text-[#F1F5F9] hover:border-[#2C374D]'
            }`}
          >
            All
          </button>

          {TECH_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat)}
                title={cat}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#38BDF8] text-[#090B10] border-[#38BDF8] font-semibold shadow-xs'
                    : 'bg-[#090B10] text-[#94A3B8] border-[#1E2636] hover:text-[#F1F5F9] hover:border-[#2C374D]'
                }`}
              >
                {CATEGORY_SHORT_LABELS[cat] || cat}
              </button>
            );
          })}
        </div>

        {/* Subcategory Pills when a specific category is selected */}
        {activeCategory !== 'all' && subcategoriesForActive.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1E2636]/70">
            <button
              type="button"
              onClick={() => setActiveSubcategory('all')}
              className={`px-2.5 py-0.5 rounded-md text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                activeSubcategory === 'all'
                  ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] bg-[#090B10] border border-[#1E2636]'
              }`}
            >
              All types
            </button>
            {subcategoriesForActive.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setActiveSubcategory(sub)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  activeSubcategory === sub
                    ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9] bg-[#090B10] border border-[#1E2636]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Catalog Grid */}
      <div className="p-3 sm:p-4 overflow-y-auto max-h-[720px] xl:flex-1 xl:min-h-0 xl:max-h-none xl:overscroll-contain">
        {displayedItems.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[#1E2636] rounded-xl bg-[#090B10]/50">
            <p className="text-sm text-[#94A3B8]">
              No technologies match{' '}
              <span className="text-[#F1F5F9] font-semibold">&ldquo;{searchQuery}&rdquo;</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setActiveSubcategory('all');
              }}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#161C28] border border-[#263248] text-xs font-medium text-[#38BDF8] hover:bg-[#1E2636] cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {displayedItems.map((item) => {
                const isSelected = selectedSet.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleTech(item.id)}
                    aria-pressed={isSelected}
                    className={`group text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#121C2E] border-[#38BDF8]/65 shadow-[inset_0_1px_0_rgba(56,189,248,0.14)]'
                        : 'bg-[#090C12] border-[#1A2130] hover:border-[#2C374D] hover:bg-[#111622]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <TechIcon
                        item={item}
                        size={40}
                        theme="dark"
                        animate={animateSvgLogos}
                        speedMultiplier={animationSpeedMultiplier}
                      />

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#F1F5F9] truncate">
                          {item.name}
                        </div>
                        <p className="text-xs text-[#64748B] group-hover:text-[#94A3B8] truncate mt-0.5 transition-colors">
                          {item.subcategory || item.category}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-[#38BDF8] text-[#090B10] border-[#38BDF8] shadow-xs'
                          : 'bg-[#0F131B] text-[#64748B] border-[#1E2636] group-hover:text-[#F1F5F9] group-hover:border-[#334155]'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Load More Controls */}
            {filteredAndSorted.length > visibleLimit && (
              <div className="mt-4 pt-3.5 border-t border-[#1E2636] flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-[#94A3B8] tabular-nums">
                  Showing {displayedItems.length} of {filteredAndSorted.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibleLimit((prev) => prev + 60)}
                    className="px-3 py-1.5 rounded-lg bg-[#141923] hover:bg-[#1C2331] border border-[#263248] text-xs font-medium text-[#38BDF8] cursor-pointer transition-colors"
                  >
                    Show more
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleLimit(filteredAndSorted.length)}
                    className="px-3 py-1.5 rounded-lg bg-[#090B10] hover:bg-[#141923] border border-[#1E2636] text-xs font-medium text-[#E2E8F0] cursor-pointer transition-colors"
                  >
                    Show all ({filteredAndSorted.length})
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
