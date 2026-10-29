# SVG logo fidelity and motion audit

**Updated:** 2026-10-29

**Scope:** static TypeScript source, TypeScript animated SVG, the SVG generator's special-case animation branches, and the export fallback. This is a code-level audit, not a claimed screenshot-by-screenshot visual approval of all 554 icons.

## Immediate disposition

- **TypeScript static logo:** uses the official Microsoft TypeScript SVG geometry and brand blue `#3178C6`.
- **TypeScript animated asset:** restored from commit `a93f69c42d0a1a72ceb9cabd9ad6350d54961c03`. It uses the official Microsoft TS geometry with the existing low-opacity sheen. The user will review/redesign motion later; this is not marked visually approved.
- **Generator and export fallback:** use the same official TS geometry and existing sheen effect, so generation and single-icon export do not fall back to the old hand-drawn glyph.
- **No UI, package, or deployment workflow changes** are included in this audit.

## Confirmed / high-priority findings

- **TypeScript:** the prior animated logo used custom rounded stroke paths (`M 88 118`, `M 164 124`) instead of the filled official TS mark. The animated SVG is restored to commit `a93f69c42d0a1a72ceb9cabd9ad6350d54961c03`; its effect is pending the user's visual review.
- **OpenAI:** the generator adds a separate pulsing center circle on top of the canonical OpenAI path and rotates the entire mark. The extra circle is not part of the source silhouette and needs a brand-fidelity review. It is recorded for the later motion pass and is not changed here.

## High-risk cases for visual comparison

The generator has **57 custom animation branches**. **19 branches** build or reconstruct the main silhouette rather than reusing `item.svgPath` directly. These are not all proven wrong, but they carry higher fidelity risk and should be compared with their matching `public/icons/source/{id}.svg` at the start, midpoint, end frame, and reduced-motion state:

- Docker
- Google Cloud
- Python
- Spring Boot
- C
- C++
- C#
- JavaScript
- AWS
- React
- Kubernetes
- Git
- Figma
- Vue.js
- Vite
- GraphQL
- Webpack
- Nginx
- Prettier

Other special branches reuse the canonical path but may add overlays, particles, rings, or movement. Those effects still need a clipping/clear-space check so they do not look like extra parts of a brand mark.

## Review method and limitations

1. Compare each animated SVG's final frame with its paired source SVG.
2. Check that the silhouette, negative space, brand colors, and wordmarks match.
3. Freeze start, mid, end, and reduced-motion frames; check for clipping, stray lines, and foreign shapes.
4. Test browser rendering and standalone SVG export before marking an icon as visually approved.

The repository was inspected through source and generator code in this pass; a full live-browser contact sheet and screenshot review for all 554 icons was not available. Therefore, the non-TypeScript entries are **not** certified visually correct by this note. The list above is a prioritized review queue, not a list of confirmed failures.

## Static-logo integrity pass

- The suite covers all **554** static source files and verifies that asset filenames match catalog IDs.
- For source SVGs generated directly from catalog data, the test requires the exact canonical `item.svgPath` and brand-safe fill to appear in the static asset.
- The source generator has a small allowlist of brand-specific variants (Google Cloud, Python, TypeScript, JavaScript, AWS, Spring Boot, C, C++, C#). These are checked for expected brand colors/official-mark signatures rather than forcing multicolor badges into a single-path template.
- This is a reproducible data/path integrity check, not a claim that every logo received an independent screenshot-based comparison against the brand's latest website. It establishes that generic assets follow catalog source data and intentional overrides retain their expected identifying marks.
