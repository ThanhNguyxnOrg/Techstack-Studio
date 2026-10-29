# SVG logo fidelity and motion audit

**Updated:** 2026-10-29  
**Scope:** static TypeScript source, TypeScript animated SVG, the SVG generator's special-case animation branches, and the export fallback. This is a code-level audit, not a claimed screenshot-by-screenshot visual approval of all 554 icons.

## Immediate disposition

- **TypeScript static logo:** uses the official Microsoft TypeScript SVG geometry and brand blue `#3178C6`.
- **TypeScript animated asset:** now exactly matches its static source asset. Motion is intentionally disabled until a proper animation is designed and visually reviewed. This prevents the previous hand-drawn rounded `T/S` paths from appearing as a different logo in previews or exports.
- **Generator and export fallback:** preserve the canonical TypeScript geometry, so regenerating the SVG library or exporting one TypeScript logo does not restore the old custom glyph.
- **No UI, package, or deployment workflow changes** are included in this audit.

## Confirmed / high-priority findings

| Technology | Finding | Current action |
|---|---|---|
| TypeScript | The previous animation used custom rounded stroke paths (`M 88 118`, `M 164 124`) instead of the official filled TS mark. | Replaced the animated asset with the exact official static mark; motion deferred. |
| OpenAI | The generator adds a separate pulsing center circle on top of the canonical OpenAI path and rotates the entire mark. The extra circle is not part of the source silhouette and needs a brand-fidelity review. | Not changed in this pass; recorded for the later motion pass. |

## High-risk cases for visual comparison

The generator has **57 custom animation branches**. **20 branches** build or reconstruct the main silhouette rather than reusing `item.svgPath` directly. These are not all proven wrong, but they carry higher fidelity risk and should be compared with their matching `public/icons/source/{id}.svg` at the start, midpoint, end frame, and reduced-motion state:

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
