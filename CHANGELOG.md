# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- C++: the static source now uses the official logo geometry, and the animated
  version was rebuilt around it (line-art assembly, facets lock in, the C sweeps
  around, the two `+` signs pop and tick like an increment, light sheen).
- TypeScript: new choreography on the official badge (rim trace, badge fill, T and S
  draw as outlines then fill, light sheen).
- Rust, Go, Redis and Linux moved from a generic motion family to hand-tuned
  choreography: a rust-orange heat beam sweeping around the cog (Rust), letters
  dashing in with three speed lines stretching behind them (Go), a ping/pong ripple
  from the counter of the R (Redis), and a waddle around the feet (Linux).
- Arduino, Espressif, MQTT, Node-RED, PlatformIO, R, MongoDB and HTML5 also moved to
  hand-tuned choreography: LED-style blink plus a current pulse around the loop
  (Arduino), a signal spreading from the chip dot (Espressif), publish/subscribe
  bands lighting outward then inward (MQTT), packets running along wires and lighting
  the nodes (Node-RED), antennae wiggling while the pupils look around (PlatformIO),
  a comet orbiting the ring with a flash on the R (R), a leaf growing and swaying
  (MongoDB), and a scan line rendering the shield (HTML5).
- The 12 newly hand-tuned animations use the 3.6 s loop, scoped ids, and the
  `prefers-reduced-motion` fallback. C++ and TypeScript retain their dedicated 8 s
  and 6 s choreography.

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
