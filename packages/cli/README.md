# techstack-studio

CLI and zero-dependency MCP server for **[Tech Stack Studio](https://thanhnguyxnorg.github.io/Techstack-Studio/)** — 542 verified pure-vector animated & static SVG logos for GitHub READMEs, portfolios, and AI agents.

## Quick CLI usage

```bash
# Auto-detect your project's stack and patch README.md between markers
npx techstack-studio --detect . --readme README.md

# Build a static (non-animated) SVG banner
npx techstack-studio --ids=react,typescript,docker,postgresql --animate=false --out=tech-stack.svg

# Print a pre-configured live web Studio link for visual tweaking
npx techstack-studio --ids=react,docker,kubernetes --theme=light --share-url

# Search icons as JSON
npx techstack-studio search kafka --json
```

## MCP Server (Claude Desktop, Cursor, Antigravity, VS Code)

Add to your MCP config:

```json
{
  "mcpServers": {
    "techstack-studio": {
      "command": "npx",
      "args": ["-y", "techstack-studio", "mcp"]
    }
  }
}
```

Optional workspace sandbox: pass `"--root", "/path/to/workspace"` in `args` or set `TECHSTACK_STUDIO_ROOT`.

### Available MCP Tools

- `search_icons` — search 542 icons by query/alias/category (returns animated & static URLs + motion stories)
- `detect_stack` — auto-detect stack from a local directory/file or pasted manifest
- `build_readme_snippet` — generate paste-ready animated or static README markup
- `build_svg_banner` — generate a single self-contained animated or static SVG banner
- `patch_readme` — idempotently update `README.md` between `<!-- techstack-studio:start -->` and `<!-- techstack-studio:end -->`
- `build_share_url` — generate a live Studio URL pre-filled with the stack & theme
