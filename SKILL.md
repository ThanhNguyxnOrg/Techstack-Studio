---
name: techstack-studio
description: Build, customize, and insert animated or static pure-vector SVG tech stack badges and banners into GitHub/GitLab READMEs, developer profiles, and portfolios using Tech Stack Studio's 542 verified icons.
---

# Tech Stack Studio Skill

Use this skill whenever a user asks to beautify a GitHub profile, repository README, or portfolio with an animated or static tech stack showcase.

## When to use which path

1. **Zero-install (chat / quick README edit):**
   - Resolve canonical icon IDs from `https://thanhnguyxnorg.github.io/Techstack-Studio/catalog.json` (never guess punctuation: `next.js -> nextdotjs`, `vue -> vuedotjs`, `nodejs -> nodedotjs`, `postgres -> postgresql`, `k8s -> kubernetes`).
   - Embed animated icons via `https://thanhnguyxnorg.github.io/Techstack-Studio/icons/animated/<id>.svg` or static icons via `https://thanhnguyxnorg.github.io/Techstack-Studio/icons/source/<id>.svg`.
   - Always offer the user a pre-filled live Studio link so they can tweak visually:
     `https://thanhnguyxnorg.github.io/Techstack-Studio/?stack=<id1>,<id2>&theme=dark&anim=1` (add `&anim=0` for static, `&theme=light`, `&style=cards|minimal|pills`, `&cols=6`, `&speed=1.5`).

2. **Automated repo scan & README patching (coding agent / CLI):**

   ```bash
   # Auto-detect from package.json, Dockerfile, requirements.txt, Cargo.toml, go.mod, etc.
   npx -y techstack-studio --detect . --readme README.md

   # Static mode or single combined SVG banner
   npx -y techstack-studio --ids=react,typescript,docker,postgresql --animate=false --out=tech-stack.svg --readme README.md
   ```

   Patching is idempotent between `<!-- techstack-studio:start -->` and `<!-- techstack-studio:end -->`.

3. **MCP Server (structured tool calls):**
   Connect `npx -y techstack-studio mcp` and call:
   - `search_icons` → find canonical IDs & URLs
   - `detect_stack` → scan repo or pasted manifest
   - `build_readme_snippet` / `build_svg_banner` / `patch_readme` → generate or update README safely
   - `build_share_url` → hand off a pre-configured web link to the user

4. **Browser automation on the live site:**
   Call `window.techStackStudio.setStack([...])`, `setSettings(...)`, `getShareUrl()`, or `await exportOutput('markdown' | 'svg' | 'html')`.
