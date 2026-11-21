# AGENTS.md — Tech Stack Studio

This file guides AI coding agents working **with** or **inside** Tech Stack Studio.

## 1. Using Tech Stack Studio for another repository or profile

- **Hosted catalog:** `https://thanhnguyxnorg.github.io/Techstack-Studio/catalog.json` (542 verified pure-vector 24x24 icons, animated + static).
- **Hosted guide:** `https://thanhnguyxnorg.github.io/Techstack-Studio/llms.txt` and `llms-full.txt`.
- **CLI (zero-clone):** `npx -y techstack-studio --detect . --readme README.md` (add `--animate=false` for static).
- **MCP Server:** `npx -y techstack-studio mcp` (tools: `search_icons`, `detect_stack`, `build_readme_snippet`, `build_svg_banner`, `patch_readme`, `build_share_url`).
- **Browser API:** `window.techStackStudio` on the live site.
- See `SKILL.md` for step-by-step agent instructions.

## 2. Developing inside this repository

- **Icon art & motion pipeline:**
  - Master vector art lives in `assets/icons/art/{id}.svg` (pure vector only, no `<image>`).
  - Per-icon story specs live in `scripts/icons/stories/*.mjs` (6.0s synchronized loop; active story across `4–84%`, clean rest across `84–100%` and `0–4%`; unique `story` per icon).
  - Build all 542 icons + runtime parts: `npm run generate:icons` (`scripts/icons/build.mjs`).
  - Refresh agent discovery artifacts: `npm run publish:agent`.
  - Build publishable CLI & MCP package: `npm run build:cli` (`packages/cli/dist/cli.js`).
- **Verification gate (must pass before commit):**
  - `npm run verify` (`format:check`, `typecheck`, `test`, `build`).
  - Keep `standaloneSvgParts.json` and MCP/Node modules out of the Vite browser bundle (`dist/`).
