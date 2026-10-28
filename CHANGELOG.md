# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-10-28

### Added

- 554 verified technology logos across 8 categories, each with a static source SVG
  and a standalone animated SVG.
- 18 motion families with brand-aware colors and a `prefers-reduced-motion`
  fallback in every animated asset.
- Live stack composer with search, aliases, popularity and alphabetical sorting,
  category filters, reordering, and LocalStorage persistence.
- Live preview with 1:1 SVG export mode, dark and light themes, icon sizing,
  spacing, columns, alignment, tile/pill/minimal presentation, labels, inner plates,
  and animation speed control.
- Three export formats: GitHub README Markdown, standalone HTML snippet, and a
  single self-contained animated SVG banner.
- Reproducible asset pipeline (`npm run generate`) that rebuilds the catalog,
  source SVGs, animated SVGs, runtime parts, and animation manifest.
- Catalog integrity and unit test suites, strict TypeScript, Prettier formatting,
  and CI verification.
- GitHub Pages deployment workflow, social preview image, web manifest, favicon
  set, sitemap, and robots metadata.
- Community documentation: contributing guide, code of conduct, security policy,
  attribution, architecture, asset pipeline, and deployment docs.

### Changed

- Standardized the project on npm with a committed lockfile and Node 22 CI target.
- Replaced the mismatched `duckdb_motherduck` catalog entry with Apache Doris.
- Removed unused dependencies, duplicate root SVG assets, dead components, and
  obsolete helpers.
- Moved build tooling to `devDependencies` and added repository metadata.

### Fixed

- Generated SVG libraries no longer accumulate orphan files after catalog changes.
- Removed an unreachable reference-SVG branch and an obsolete Docker migration path
  from the generators.

[Unreleased]: https://github.com/ThanhNguyxnOrg/Techstack-Studio/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ThanhNguyxnOrg/Techstack-Studio/releases/tag/v1.0.0
