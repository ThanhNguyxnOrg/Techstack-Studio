# Architecture

Tech Stack Studio is a static, browser-only React application. It has no server,
database, authentication, or runtime API. The 554-logo catalog and both SVG
libraries are committed to the repository and shipped as static files.

## System overview

```text
┌────────────────────────────────────────────────────────────────────┐
│ Browser                                                            │
│                                                                    │
│  App.tsx                                                           │
│  ├─ state: selected IDs, settings, stage, status                   │
│  ├─ persistence: localStorage (versioned, sanitized)               │
│  └─ views                                                          │
│     ├─ HeroSection          navigation + reset/clear               │
│     ├─ CatalogPanel         554-item searchable catalog            │
│     ├─ PreviewAndControls   live preview + customization           │
│     ├─ SelectedStackBar     reorder/remove selected logos          │
│     └─ ExportStudio         Markdown / HTML / SVG output           │
│                                                                    │
│  Preview path                        Export path                   │
│  TechIcon                            studioLogic.ts                │
│  └─ fetch /icons/animated/{id}.svg   ├─ buildInternalSvg...()      │
│     parse + scope IDs + cache        ├─ generateReadmeMarkdown()   │
│                                      ├─ generateStandaloneHtml()   │
│                                      └─ generateStandaloneSvg()    │
│                                         └─ standaloneSvgParts.json │
└────────────────────────────────────────────────────────────────────┘
```

Everything above runs in the browser. The only network requests are for the app
bundle, Google Fonts, and same-origin SVG files in `public/icons/`.

## Module map

| Path                                       | Responsibility                                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `src/App.tsx`                              | Owns selection and settings state, restores persisted state, wires the page together.                 |
| `src/components/HeroSection.tsx`           | Sticky header, stage navigation, GitHub link, reset and clear actions.                                |
| `src/components/CatalogPanel.tsx`          | Search, category filters, sorting, and technology cards.                                              |
| `src/components/PreviewAndControls.tsx`    | Live preview modes, themes, sizing, layout, animation, and copy/download shortcuts.                   |
| `src/components/SelectedStackBar.tsx`      | Reorder, remove, reset, and clear the selected stack.                                                 |
| `src/components/ExportStudio.tsx`          | Format tabs, generated code, clipboard, file download, and SVG preview.                               |
| `src/components/TechIcon.tsx`              | Loads a standalone SVG, scopes its IDs, applies reduced motion, and renders it inline or as an image. |
| `src/data/catalog.ts`                      | Public URLs, default settings, starter stack, and presets.                                            |
| `src/data/techCatalog.ts`                  | Typed catalog index and legacy-ID aliases.                                                            |
| `src/data/generatedCatalog.json`           | Generated catalog metadata for all 554 entries. Do not hand-edit.                                     |
| `src/data/standaloneSvgParts.json`         | Generated `defs`/`style`/`body` fragments used for synchronous exports. Do not hand-edit.             |
| `src/utils/studioLogic.ts`                 | Selection rules, search/sort, persistence sanitization, export generators, and SVG markup assembly.   |
| `src/utils/svgAssetLoader.ts`              | Fetch cache, SVG parsing, ID scoping, and base-path resolution.                                       |
| `src/utils/usePrefersReducedMotion.ts`     | Subscribes to the `prefers-reduced-motion` media query.                                               |
| `src/types/stack.ts`                       | Domain types, including the 18 motion families.                                                       |
| `scripts/buildCatalogManifest.mjs`         | Resolves the seed table into the catalog using the bundled community icon set and verified fallbacks. |
| `scripts/generateStandaloneSvgLibrary.mjs` | Builds source SVGs, animated SVGs, runtime parts, and the animation manifest.                         |

## State and persistence

`App.tsx` keeps two pieces of user state:

- `selectedIds`: an ordered list of catalog IDs.
- `settings`: theme, icon size, spacing, alignment, columns, labels, inner plate,
  presentation style, animation on/off, speed, and README asset base URL.

Every mutation goes through helpers in `studioLogic.ts` (`toggleTechInStack`,
`moveTechInStack`, `removeTechFromStack`, `sanitizeSettings`). The state is
serialized to `localStorage` under a versioned key and validated when restored.
Unknown IDs are dropped, invalid settings fall back to defaults, and malformed JSON
is ignored rather than crashing the app.

## Preview rendering

`TechIcon` fetches `/icons/animated/{id}.svg` (or the source variant), parses out
`<defs>`, `<style>`, and the body, and scopes every internal ID with a React
`useId()` prefix so multiple logos can coexist on one page without collisions.
Fetched documents are cached in memory; in-flight requests are de-duplicated.

Using the actual standalone files in the preview is deliberate: what the user sees
is the same file they download. When reduced motion is requested, the component
renders the static body instead of the animation.

## Export rendering

Exports must work synchronously and offline, so they do not fetch 554 SVG files.
Instead, `generateStandaloneSvgLibrary.mjs` compiles each logo into
`standaloneSvgParts.json`:

```json
{
  "docker": {
    "defs": "<clipPath ...>",
    "style": "@keyframes ...",
    "body": "<g ...>",
    "staticBody": "<g ...>",
    "concept": "…",
    "technique": "…"
  }
}
```

`generateStandaloneSvg()` composes those fragments into one `<svg>` with layout,
tiles, labels, theme colors, and per-icon transforms. Markdown export references
the hosted SVG files; HTML export embeds the generated vector markup.

The tradeoff is bundle size. `standaloneSvgParts.json` is about 4.2 MB of source
(roughly 1.35 MB gzipped for the whole app), which keeps exports instant and
offline. A future improvement could move the parts behind a lazy import, at the
cost of an extra load before the export panel is usable.

## Accessibility

- All interactive controls are native buttons or inputs with accessible names.
- The preview pauses when `prefers-reduced-motion: reduce` is set, and every
  animated SVG carries its own media query fallback.
- Copy actions announce success or failure through an ARIA live region.
- Focus states, keyboard tab order, and contrast are part of the UI review
  checklist in `CONTRIBUTING.md`.
- Generated SVG output includes `role="img"` and an accessible label.

## Security

- The app is same-origin and has no backend to attack.
- User-provided titles and labels are escaped before entering Markdown, HTML, or
  SVG output.
- Generated assets are checked for scripts, event handlers, external references,
  raster embeds, and `javascript:` URLs by `catalogIntegrity.test.ts`.
- Dependencies are locked, audited in CI, and updated by Dependabot.

See [SECURITY.md](../SECURITY.md) for reporting.

## Testing strategy

| Suite                                | Covers                                                                                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/studioLogic.test.ts`      | Selection, ordering, search, sorting, persistence, escaping, and all export formats.                                                            |
| `src/utils/catalogIntegrity.test.ts` | Catalog counts, unique IDs, category/family coverage, SVG file parity, safety checks, reduced-motion support, and the Apache Doris replacement. |

The build and tests run on Node 22 in CI. `tsc --noEmit` enforces strict typing;
Prettier enforces formatting. There is intentionally no ESLint layer yet — the
project relies on TypeScript plus focused tests instead of a second style engine.

## Design decisions

1. **Generated assets are committed.** The site never calls an icon API, so it
   keeps working if upstream services change. Reviewers can inspect exactly what
   ships.
2. **Two representations of each logo.** The preview loads the standalone file;
   exports use precompiled parts. This keeps preview and download identical while
   avoiding hundreds of network requests during export.
3. **No runtime dependency for exported SVGs.** A downloaded banner works in a
   README, an `<img>` tag, or a plain HTML file without JavaScript.
4. **Small dependency surface.** React, React DOM, and Lucide icons are the only
   runtime dependencies. Everything else is build-time tooling.
5. **Catalog as data, not code.** Seeds live in one table; search, sorting, tiers,
   and aliases are derived, so adding a technology is a data change plus a
   regeneration.
