# Asset Pipeline

The catalog is generated from a seed table and two upstream icon sources. Nothing
in `public/icons/source/`, `public/icons/animated/`, `src/data/generatedCatalog.json`,
`src/data/standaloneSvgParts.json`, or `docs/animation/animation-manifest.json`
should be edited by hand.

## Commands

```bash
npm run generate:catalog   # seed table -> src/data/generatedCatalog.json
npm run generate:icons     # catalog -> 554 source + 554 animated SVGs + runtime parts
npm run generate           # both, in order
```

`npm run generate` is idempotent: running it twice produces the same files. It also
deletes orphan SVGs that are no longer present in the catalog.

## Phase 1 — Catalog resolution

`scripts/buildCatalogManifest.mjs` contains the seed table (`CATEGORY_SEEDS` plus
`EXTRA_COMMUNITY_SLUGS`) and resolves each row in this order:

1. A verified fallback vector in `VERIFIED_FALLBACK_ICONS`.
2. A match in the bundled community icon set by ID, normalized ID, slug, normalized
   slug, or normalized display name.
3. Otherwise the row is reported as unresolved and skipped.

For every resolved row it derives:

- canonical lowercase ID and search aliases
- category, subcategory, and one-line role
- brand color and a dark-surface-safe variant
- a harmonic secondary color for dual-tone motion
- tier (`A`, `B`, or `C`) and category rank
- documentation URL, provenance, license label
- one of 18 motion recipes with a fixed 3.6 s duration and shared easing

Output: `src/data/generatedCatalog.json` — currently **554 entries**: 506 from the
bundled community icon set and 48 from verified fallback vectors.

> Unresolved seeds are intentionally dropped. The generator logs their count so a
> missing icon is visible instead of silently shipping broken artwork. To add one,
> provide a verified vector in `VERIFIED_FALLBACK_ICONS` or update the row to a
> valid icon slug.

## Phase 2 — SVG generation

`scripts/generateStandaloneSvgLibrary.mjs` reads the catalog and writes four
outputs.

### `public/icons/source/{id}.svg`

Static, brand-accurate SVGs normalized to `viewBox="0 0 24 24"`. Most use the
bundled community icon path directly. Roughly 40 marks with multi-color or structural detail
(Google Cloud, Python, TypeScript, JavaScript, AWS, Spring Boot, C/C++, C#, Docker,
Node.js, Next.js, React, Kubernetes, Git, and others) get dedicated source
builders so the static file stays faithful to the official logo.

### `public/icons/animated/{id}.svg`

Standalone animated SVGs with:

- the brand mark and animation layers in one file
- CSS `@keyframes` inside `<style>` (no JavaScript)
- a `prefers-reduced-motion: reduce` block that freezes the logo
- unique, prefixed IDs so multiple files can be inlined on one page
- no external images, fonts, or scripts

The generator starts from one of 18 motion families, then applies hand-tuned
choreography for the most recognizable marks. Family assignment lives in the seed
table and is recorded in the animation manifest.

| Family                    | Motion idea                                     |
| ------------------------- | ----------------------------------------------- |
| `liquid-wave-fill`        | Dual-tone waves rise inside the logo silhouette |
| `stroke-trace-fill`       | Outline draws, then fills with brand color      |
| `orbital-spin`            | Satellite accents orbit the mark                |
| `dual-snake-interlock`    | Two halves interlock along the logo's centroid  |
| `container-stack-slide`   | Stacked layers slide into place                 |
| `circuit-trace-pulse`     | Pulses travel along circuit-like paths          |
| `node-network-signal`     | Nodes light up in sequence                      |
| `flame-core-flicker`      | Warm core flicker with a stable silhouette      |
| `radar-sweep-mask`        | Sweep reveals the mark through a mask           |
| `shimmer-prism-sweep`     | Prismatic highlight crosses the logo            |
| `segmented-assembly`      | Segments assemble from offset positions         |
| `curtain-vertical-reveal` | Vertical curtain reveal                         |
| `pendulum-harmonic`       | Harmonic pendulum sway                          |
| `pixel-grid-cascade`      | Pixel cells cascade into the mark               |
| `data-stream-flow`        | Data particles stream through the shape         |
| `iris-aperture-bloom`     | Aperture-style bloom from the center            |
| `beacon-ripple-rings`     | Concentric beacon rings expand                  |
| `elastic-morph-bounce`    | Elastic scale/settle with overshoot             |

### `src/data/standaloneSvgParts.json`

The export runtime for the app. Each entry stores `defs`, `style`, `body`, and
`staticBody` fragments so `generateStandaloneSvg()` can compose a banner without
fetching 554 files. Also stores the human-readable `concept` and `technique` used
by the animation manifest.

### `docs/animation/animation-manifest.json`

Provenance for every animated asset: source path, motion family, duration,
technique, and concept. Useful when reviewing a large regeneration diff.

## Output inventory

| Output                | Count | Notes                                       |
| --------------------- | ----: | ------------------------------------------- |
| Catalog entries       |   554 | 8 categories, 50 Tier A                     |
| Source SVGs           |   554 | `public/icons/source/`                      |
| Animated SVGs         |   554 | `public/icons/animated/`                    |
| Runtime part entries  |   554 | `src/data/standaloneSvgParts.json`          |
| Reference source SVGs |    29 | `public/icons/reference/` (provenance only) |
| Motion families       |    18 | All used by at least one entry              |
| Orphan assets         |     0 | Enforced by the generator and tests         |

## Invariants enforced by tests

`src/utils/catalogIntegrity.test.ts` fails the build if:

- the catalog is not exactly 554 entries, 8 categories, and 18 families
- any category or motion family is unused
- an ID is duplicated or does not match `/^[a-z0-9_]+$/`
- the source folder, animated folder, or parts file drift from the catalog
- an SVG is missing its `viewBox`, `role="img"`, keyframes, or reduced-motion block
- an SVG contains a script, `foreignObject`, raster image, inline event handler,
  `javascript:` URL, or external runtime reference
- the Apache Doris replacement disappears or the bogus `duckdb_motherduck` entry
  returns

## Adding a technology

1. Pick a unique lowercase ID and add a row to the right category in
   `CATEGORY_SEEDS`:

   ```js
   [
     'apachedoris',
     'Apache Doris',
     'apachedoris',
     'Data Warehouses & Lakehouse',
     'Real-Time Analytical MPP Database for BI & Lakehouse',
     ['doris'],
     'data-stream-flow',
   ],
   ```

   Fields are: `id`, display name, icon slug, subcategory, role, aliases, motion
   family.

2. Run `npm run generate`. The generator will write both SVGs and refresh the
   catalog, parts, and manifest.
3. Run `npm run verify`.
4. Commit the seed change and every regenerated file together.

If the icon is missing from the bundled set, add a verified vector to
`VERIFIED_FALLBACK_ICONS` with an official source and license, or choose a
different technology. Do not trace a logo by hand or pull an unlicensed asset from
a search result.

## Removing or renaming a technology

1. Remove or rename the seed row.
2. Run `npm run generate`. Orphan SVGs are deleted automatically.
3. Run `npm run verify`.

Renaming an ID breaks saved local state and shared links. Prefer keeping the old ID
as a `LEGACY_ID_MAP` alias in `src/data/techCatalog.ts` when the change is only
cosmetic.

## Updating upstream icons

```bash
npm update
npm run generate
npm run verify
```

Review the diff before committing, especially brand colors, multi-color source
builders, and any animated file that changed family. An upstream rename can
surface as a new unresolved seed; fix the slug instead of deleting the row.

## Troubleshooting

| Symptom                               | Cause                                              | Fix                                        |
| ------------------------------------- | -------------------------------------------------- | ------------------------------------------ |
| Generator prints unresolved entries   | No community icon or fallback match                | Fix the slug or add a verified vector      |
| Test reports a missing SVG            | Catalog changed without regeneration               | `npm run generate`                         |
| Test reports an extra SVG             | Removed entry left an orphan                       | `npm run generate` deletes it              |
| Animated SVG has no motion            | Catalog entry is static or keyframes were stripped | Regenerate; check the family mapping       |
| Export preview shows the wrong colors | Dark-safe color changed upstream                   | Review the diff in `generatedCatalog.json` |
| Bundle size jumps                     | Parts JSON grew                                    | Confirm the catalog count is still 554     |
