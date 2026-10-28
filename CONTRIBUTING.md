# Contributing to Tech Stack Studio

Thanks for taking the time to improve the project. This guide covers the local
setup, the quality gate, and the workflow for changing the catalog or an export.

## Code of conduct

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
Please report unacceptable behavior to the maintainers.

## Development setup

Requirements:

- Node.js **22.12 or newer** (see `.nvmrc`)
- npm **10 or newer**
- Git

```bash
git clone https://github.com/ThanhNguyxnOrg/Techstack-Studio.git
cd Techstack-Studio
npm ci
npm run dev
```

The dev server runs at `http://localhost:3000`.

## Quality gate

Run the same checks as CI before opening a pull request:

```bash
npm run verify
```

That command runs, in order:

1. `format:check` — Prettier formatting
2. `typecheck` — TypeScript in strict mode
3. `test` — unit and asset-integrity suites
4. `build` — production Vite build

Useful individual commands:

| Command                    | Purpose                                           |
| -------------------------- | ------------------------------------------------- |
| `npm run dev`              | Start the Vite dev server on port 3000            |
| `npm run build`            | Build the production site into `dist/`            |
| `npm run preview`          | Preview the production build locally              |
| `npm run format`           | Format the repository with Prettier               |
| `npm run typecheck`        | Run `tsc --noEmit`                                |
| `npm test`                 | Run the Node test suites through `tsx`            |
| `npm run generate:catalog` | Rebuild the catalog manifest from the seed table  |
| `npm run generate:icons`   | Regenerate source/animated SVGs and runtime parts |
| `npm run generate`         | Run both generators                               |
| `npm run clean`            | Remove `dist/`                                    |

## What to work on

- Bug reports with a reproduction are always welcome.
- Small accessibility, documentation, and test improvements are easy wins.
- For a new feature or a large refactor, open an issue first so the approach can be
  agreed on before code is written.
- Do not open a pull request that only reformats unrelated files.

## Adding or changing a technology

The catalog is generated, not hand-edited. The source of truth is the
`CATEGORY_SEEDS` table in `scripts/buildCatalogManifest.mjs`.

1. Add or edit a seed row with a stable lowercase `id`, display name, slug,
   category, subcategory, aliases, and motion family.
2. Use an official brand asset or a permissively licensed icon from the developer
   community. If the icon needs a verified fallback vector, add it to the
   appropriate map in the generator instead of inventing or tracing artwork. Record
   the source in your pull request so maintainers can review it.
3. Regenerate everything:

   ```bash
   npm run generate
   ```

4. Run the full quality gate:

   ```bash
   npm run verify
   ```

5. Commit the seed change **and** the regenerated files together:
   `src/data/generatedCatalog.json`, `src/data/standaloneSvgParts.json`,
   `public/icons/source/`, `public/icons/animated/`, and
   `docs/animation/animation-manifest.json`.

Asset rules:

- Source and animated SVGs must be self-contained and use `viewBox="0 0 24 24"`.
- No `<script>`, `<foreignObject>`, raster `<image>`, inline event handlers,
  `javascript:` URLs, or external runtime references.
- Every animated SVG must include `@keyframes` and a
  `prefers-reduced-motion: reduce` fallback.
- Brand colors must stay recognizable. The generator applies a dark-surface
  legibility adjustment only when a brand color is too dark to see.
- IDs must be unique, lowercase, and match `/^[a-z0-9_]+$/`.
- Never hand-edit a generated SVG. Change the generator and regenerate.

The integrity suite (`src/utils/catalogIntegrity.test.ts`) enforces these rules
and will fail if the catalog, SVG folders, and runtime parts drift apart.

## Changing the UI or exports

- Keep the live preview and the exported SVG visually consistent. Both are driven
  by the same settings and `buildInternalSvgAnimationMarkup()`.
- Preserve keyboard access, visible focus states, and ARIA labels.
- Check the dark and light themes, narrow viewports, and reduced-motion mode.
- Add or update a unit test when export output or catalog logic changes.
- Attach before/after screenshots to UI pull requests.

## Coding style

- TypeScript strict mode is mandatory. Avoid `any`; prefer explicit domain types.
- Prettier owns formatting. Run `npm run format` before committing.
- Keep components presentational; put reusable logic in `src/utils/`.
- Prefer small, named functions over deep inline expressions.
- Comments should explain _why_, not restate the code.

## Commit and pull request guidelines

- Keep commits focused and use an imperative subject, for example
  `fix: keep GCP colors in exported SVG`.
- Describe the user-visible change, the approach, and the verification you ran.
- Link the issue being fixed with `Closes #123` when applicable.
- Do not include build output, `node_modules`, secrets, or editor state.

The pull request template repeats the important checks. Maintainers may ask for
changes before merging; please keep the discussion constructive.

## Reporting security issues

Do not open a public issue for a vulnerability. Follow [SECURITY.md](SECURITY.md).
