import React, { useEffect, useId, useRef, useState } from 'react';
import { PreviewTheme, TechItem } from '../types/stack';
import { buildInternalSvgAnimationMarkup } from '../utils/studioLogic';
import {
  fetchStandaloneSvgAsset,
  getCachedStandaloneSvgAsset,
  ParsedStandaloneSvg,
  scopeStandaloneSvgParts,
} from '../utils/svgAssetLoader';
import { usePrefersReducedMotion } from '../utils/usePrefersReducedMotion';

interface TechIconProps {
  item: TechItem;
  size?: number;
  theme?: PreviewTheme;
  animate?: boolean;
  speedMultiplier?: number;
  showPlate?: boolean;
  className?: string;
}

/**
 * Renders an authentic technology brand logo by loading its standalone animated SVG file
 * (`/icons/animated/{id}.svg`) or static source SVG file (`/icons/source/{id}.svg`) from `public/icons/`.
 * Supports optional inner plate framing (`showPlate`) so users can toggle the inner box on or off.
 */
export const TechIcon: React.FC<TechIconProps> = ({
  item,
  size = 44,
  theme = 'dark',
  animate = true,
  speedMultiplier = 1,
  showPlate = true,
  className = '',
}) => {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const uid = `${item.id.replace(/[^a-zA-Z0-9]/g, '')}_${reactId}`;
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const shouldAnimate = animate && !prefersReducedMotion && isVisible;
  const activeAssetPath = shouldAnimate
    ? item.animatedSvgPath || `/icons/animated/${item.id}.svg`
    : item.sourceSvgPath || `/icons/source/${item.id}.svg`;

  const [fetchedSvg, setFetchedSvg] = useState<ParsedStandaloneSvg | undefined>(() =>
    getCachedStandaloneSvgAsset(activeAssetPath)
  );
  const [assetError, setAssetError] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { rootMargin: '120px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const cached = getCachedStandaloneSvgAsset(activeAssetPath);
    if (cached) {
      setFetchedSvg(cached);
      setAssetError(null);
      return;
    }
    if (typeof fetch === 'undefined') {
      return;
    }
    fetchStandaloneSvgAsset(activeAssetPath)
      .then((parsed) => {
        if (!cancelled) {
          setFetchedSvg(parsed);
          setAssetError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setAssetError(err instanceof Error ? err.message : 'Missing SVG file');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeAssetPath]);

  const borderRadius = Math.max(6, Math.round(size * 0.22));
  const padding = showPlate
    ? Math.max(4, Math.round(size * 0.14))
    : Math.max(2, Math.round(size * 0.06));

  if (assetError) {
    return (
      <span
        ref={containerRef}
        data-testid="svg-asset-error"
        data-asset-path={activeAssetPath}
        className={`inline-flex flex-col items-center justify-center select-none shrink-0 bg-[#2A1215] border border-[#EF4444] text-[#FCA5A5] text-[9px] font-mono leading-tight text-center ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius,
          padding: 2,
        }}
        title={`Missing or invalid SVG asset: ${activeAssetPath} (${assetError})`}
      >
        <span>ERR</span>
      </span>
    );
  }

  const parts = fetchedSvg
    ? shouldAnimate
      ? scopeStandaloneSvgParts(fetchedSvg, item, uid, speedMultiplier)
      : { defs: fetchedSvg.defs, style: '', body: fetchedSvg.body }
    : buildInternalSvgAnimationMarkup(item, uid, {
        theme,
        animate: shouldAnimate,
        speedMultiplier,
      });

  const innerSvgMarkup = `${parts.defs ? `<defs>${parts.defs}</defs>` : ''}${
    parts.style ? `<style>${parts.style}</style>` : ''
  }${parts.body}`;

  const plateClasses = showPlate
    ? 'bg-[#111622] border border-[#222B3D] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] group-hover:border-[#33415C]'
    : 'bg-transparent border border-transparent';

  return (
    <span
      ref={containerRef}
      data-svg-asset={activeAssetPath}
      data-svg-loaded={fetchedSvg ? 'true' : 'hydrated'}
      className={`inline-flex items-center justify-center select-none shrink-0 transition-colors duration-150 ${plateClasses} ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: showPlate ? borderRadius : 0,
        padding,
      }}
      title={item.name}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={fetchedSvg?.viewBox || item.svgViewBox || '0 0 24 24'}
        role="img"
        aria-label={item.name}
        className="w-full h-full overflow-visible block"
        dangerouslySetInnerHTML={{ __html: innerSvgMarkup }}
      />
    </span>
  );
};
