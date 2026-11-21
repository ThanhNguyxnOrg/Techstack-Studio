import fs from 'node:fs';
import storyConceptsJson from '../../../src/data/storyConcepts.json';
import { GITHUB_PAGES_URL, TECH_CATALOG } from '../../../src/data/catalog';
import { PresentationStyle, PreviewTheme, TechCategory } from '../../../src/types/stack';
import {
  buildShareUrl,
  resolveAutomationSettings,
  resolveCanonicalIds,
  runAutomationBuild,
} from '../../../src/utils/automationRunner';
import { scanProjectDirectory } from '../../../src/utils/projectScanner';
import { detectStackFromFileContent } from '../../../src/utils/stackDetector';
import { filterCatalog, generateReadmeMarkdown } from '../../../src/utils/studioLogic';
import { resolveSafePath } from './sandbox';

const STORY_CONCEPTS = storyConceptsJson as Record<string, string>;
const SITE = GITHUB_PAGES_URL.replace(/\/$/, '');

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
}

export interface McpHandlerOptions {
  rootDir?: string;
  llmsGuidePath?: string;
}

export const MCP_TOOLS = [
  {
    name: 'search_icons',
    description:
      'Search 542 verified pure-vector tech logos by name, alias, or category. Returns canonical IDs, animated & static SVG URLs, docs URLs, and motion stories.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query or alias (e.g. "react", "k8s", "pg")' },
        category: { type: 'string', description: 'Optional category filter or "all"' },
        limit: { type: 'number', description: 'Max results (1-50, default 12)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'detect_stack',
    description:
      'Detect canonical Tech Stack Studio icon IDs from a local project directory/manifest path or pasted manifest text (package.json, Dockerfile, requirements.txt, Cargo.toml, go.mod, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Local project directory or manifest file path' },
        content: { type: 'string', description: 'Raw pasted manifest file content' },
        filename: { type: 'string', description: 'Optional filename hint for pasted content' },
      },
    },
  },
  {
    name: 'build_readme_snippet',
    description:
      'Generate a paste-ready GitHub README HTML/Markdown snippet using hosted animated or static SVGs from Tech Stack Studio.',
    inputSchema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'string' }, description: 'Icon IDs or aliases' },
        animate: {
          type: 'boolean',
          description: 'Use animated SVGs (true, default) or static SVGs (false)',
        },
        cols: { type: 'number', description: 'Icons per row (0 = auto, 1-12 = fixed grid)' },
        showLabels: { type: 'boolean', description: 'Show names under icons (default true)' },
        linkDocs: { type: 'boolean', description: 'Link icons to official docs (default true)' },
        alignment: { type: 'string', enum: ['left', 'center', 'right'] },
      },
      required: ['ids'],
    },
  },
  {
    name: 'build_svg_banner',
    description:
      'Generate a single self-contained animated or static SVG banner containing multiple tech logos, optionally writing it to disk.',
    inputSchema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'string' }, description: 'Icon IDs or aliases' },
        animate: { type: 'boolean', description: 'Animated (true) or static (false)' },
        theme: { type: 'string', enum: ['dark', 'light'] },
        style: { type: 'string', enum: ['tiles', 'minimal', 'cards', 'pills'] },
        preset: {
          type: 'string',
          enum: ['dark-tiles', 'logos-only', 'readme-compact', 'light-cards'],
        },
        cols: { type: 'number' },
        speed: { type: 'number', enum: [0.5, 1, 1.5] },
        showLabels: { type: 'boolean' },
        showInnerPlate: { type: 'boolean' },
        headerTitle: { type: 'string' },
        outPath: { type: 'string', description: 'Optional file path to write the SVG banner' },
      },
      required: ['ids'],
    },
  },
  {
    name: 'patch_readme',
    description:
      'Idempotently insert or update a Tech Stack section inside a README.md between <!-- techstack-studio:start --> and <!-- techstack-studio:end --> markers.',
    inputSchema: {
      type: 'object',
      properties: {
        readmePath: { type: 'string', description: 'Path to target README.md' },
        ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional explicit icon IDs/aliases',
        },
        detectPath: {
          type: 'string',
          description: 'Optional project dir/file to auto-detect stack',
        },
        format: {
          type: 'string',
          enum: ['md', 'svg'],
          description: 'Embed Markdown table (default) or SVG image',
        },
        svgOutPath: {
          type: 'string',
          description: 'Required when format is "svg" — path to write the SVG banner',
        },
        animate: { type: 'boolean' },
        theme: { type: 'string', enum: ['dark', 'light'] },
        style: { type: 'string', enum: ['tiles', 'minimal', 'cards', 'pills'] },
        preset: {
          type: 'string',
          enum: ['dark-tiles', 'logos-only', 'readme-compact', 'light-cards'],
        },
        cols: { type: 'number' },
        speed: { type: 'number', enum: [0.5, 1, 1.5] },
        dryRun: { type: 'boolean', description: 'Preview without modifying files' },
      },
      required: ['readmePath'],
    },
  },
  {
    name: 'build_share_url',
    description:
      'Build a pre-configured live Tech Stack Studio web URL so a human user can open, preview, and tweak the stack visually in their browser.',
    inputSchema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'string' }, description: 'Icon IDs or aliases' },
        animate: { type: 'boolean' },
        theme: { type: 'string', enum: ['dark', 'light'] },
        style: { type: 'string', enum: ['tiles', 'minimal', 'cards', 'pills'] },
        preset: {
          type: 'string',
          enum: ['dark-tiles', 'logos-only', 'readme-compact', 'light-cards'],
        },
        cols: { type: 'number' },
        speed: { type: 'number', enum: [0.5, 1, 1.5] },
        showLabels: { type: 'boolean' },
        showInnerPlate: { type: 'boolean' },
      },
      required: ['ids'],
    },
  },
] as const;

export const MCP_RESOURCES = [
  {
    uri: 'techstack://catalog',
    name: 'Tech Stack Studio Icon Catalog',
    description: 'Compact JSON index of all 542 verified icons, aliases, URLs, and motion stories.',
    mimeType: 'application/json',
  },
  {
    uri: 'techstack://llms-guide',
    name: 'Tech Stack Studio AI Usage Guide',
    description: 'Concise machine-readable guide for using animated & static SVGs in READMEs.',
    mimeType: 'text/plain',
  },
] as const;

function textResult(data: unknown, isError = false) {
  return {
    content: [
      {
        type: 'text',
        text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
      },
    ],
    ...(isError ? { isError: true } : {}),
  };
}

function callTool(name: string, args: Record<string, unknown>, opts: McpHandlerOptions) {
  switch (name) {
    case 'search_icons': {
      const query = String(args.query ?? '');
      const category = (args.category ? String(args.category) : 'all') as TechCategory | 'all';
      const limit = Math.max(1, Math.min(50, Number(args.limit ?? 12) || 12));
      const icons = filterCatalog(TECH_CATALOG, query, category)
        .slice(0, limit)
        .map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          aliases: item.aliases,
          animatedUrl: `${SITE}/icons/animated/${item.id}.svg`,
          staticUrl: `${SITE}/icons/source/${item.id}.svg`,
          docsUrl: item.docsUrl,
          story: STORY_CONCEPTS[item.id] || item.role,
        }));
      return textResult({ count: icons.length, icons });
    }

    case 'detect_stack': {
      if (typeof args.path === 'string' && args.path.trim()) {
        const safePath = resolveSafePath(args.path, opts.rootDir);
        const scanned = scanProjectDirectory(safePath, TECH_CATALOG);
        return textResult(scanned);
      }
      if (typeof args.content === 'string') {
        const ids = detectStackFromFileContent(
          args.content,
          TECH_CATALOG,
          typeof args.filename === 'string' ? args.filename : ''
        );
        return textResult({ ids, matchedFiles: args.filename ? [String(args.filename)] : [] });
      }
      return textResult('Provide either "path" or "content".', true);
    }

    case 'build_readme_snippet': {
      const requested = Array.isArray(args.ids) ? args.ids.map(String) : [];
      const { items, unknownIds } = resolveCanonicalIds(requested);
      if (items.length === 0) return textResult('No valid icon IDs resolved.', true);
      const settings = resolveAutomationSettings({
        animate: typeof args.animate === 'boolean' ? args.animate : true,
        cols: typeof args.cols === 'number' ? args.cols : undefined,
        showLabels: typeof args.showLabels === 'boolean' ? args.showLabels : undefined,
      });
      if (typeof args.linkDocs === 'boolean') settings.linkIconsToDocs = args.linkDocs;
      if (args.alignment === 'left' || args.alignment === 'center' || args.alignment === 'right') {
        settings.alignment = args.alignment;
      }
      const markdown = generateReadmeMarkdown(items, settings);
      return textResult({
        ids: items.map((i) => i.id),
        unknownIds,
        shareUrl: buildShareUrl(
          items.map((i) => i.id),
          settings
        ),
        markdown,
      });
    }

    case 'build_svg_banner': {
      const requested = Array.isArray(args.ids) ? args.ids.map(String) : [];
      const outPath =
        typeof args.outPath === 'string' && args.outPath.trim()
          ? resolveSafePath(args.outPath, opts.rootDir)
          : undefined;
      const res = runAutomationBuild({
        ids: requested,
        format: 'svg',
        outPath,
        animate: typeof args.animate === 'boolean' ? args.animate : undefined,
        theme: args.theme as PreviewTheme | undefined,
        style: args.style as PresentationStyle | undefined,
        preset: typeof args.preset === 'string' ? args.preset : undefined,
        cols: typeof args.cols === 'number' ? args.cols : undefined,
        speed: typeof args.speed === 'number' ? args.speed : undefined,
        showLabels: typeof args.showLabels === 'boolean' ? args.showLabels : undefined,
        showInnerPlate: typeof args.showInnerPlate === 'boolean' ? args.showInnerPlate : undefined,
        headerTitle: typeof args.headerTitle === 'string' ? args.headerTitle : undefined,
      });
      return textResult({
        ids: res.ids,
        unknownIds: res.unknownIds,
        shareUrl: res.shareUrl,
        writtenOutPath: res.writtenOutPath || null,
        svg: res.writtenOutPath ? undefined : res.output,
      });
    }

    case 'patch_readme': {
      if (typeof args.readmePath !== 'string' || !args.readmePath.trim()) {
        return textResult('readmePath is required.', true);
      }
      const readmePath = resolveSafePath(args.readmePath, opts.rootDir);
      const detectPath =
        typeof args.detectPath === 'string' && args.detectPath.trim()
          ? resolveSafePath(args.detectPath, opts.rootDir)
          : undefined;
      const svgOutPath =
        typeof args.svgOutPath === 'string' && args.svgOutPath.trim()
          ? resolveSafePath(args.svgOutPath, opts.rootDir)
          : undefined;
      const fmt = args.format === 'svg' ? 'svg' : 'markdown';
      const res = runAutomationBuild({
        ids: Array.isArray(args.ids) ? args.ids.map(String) : undefined,
        detectPath,
        format: fmt,
        outPath: svgOutPath,
        readmePath,
        dryRun: Boolean(args.dryRun),
        animate: typeof args.animate === 'boolean' ? args.animate : undefined,
        theme: args.theme as PreviewTheme | undefined,
        style: args.style as PresentationStyle | undefined,
        preset: typeof args.preset === 'string' ? args.preset : undefined,
        cols: typeof args.cols === 'number' ? args.cols : undefined,
        speed: typeof args.speed === 'number' ? args.speed : undefined,
      });
      return textResult({
        ids: res.ids,
        unknownIds: res.unknownIds,
        matchedFiles: res.matchedFiles,
        shareUrl: res.shareUrl,
        patchedReadmePath: res.patchedReadmePath,
        readmeChanged: res.readmeChanged,
        readmeMode: res.readmeMode,
        writtenOutPath: res.writtenOutPath || null,
      });
    }

    case 'build_share_url': {
      const requested = Array.isArray(args.ids) ? args.ids.map(String) : [];
      const { items, unknownIds } = resolveCanonicalIds(requested);
      if (items.length === 0) return textResult('No valid icon IDs resolved.', true);
      const settings = resolveAutomationSettings({
        animate: typeof args.animate === 'boolean' ? args.animate : undefined,
        theme: args.theme as PreviewTheme | undefined,
        style: args.style as PresentationStyle | undefined,
        preset: typeof args.preset === 'string' ? args.preset : undefined,
        cols: typeof args.cols === 'number' ? args.cols : undefined,
        speed: typeof args.speed === 'number' ? args.speed : undefined,
        showLabels: typeof args.showLabels === 'boolean' ? args.showLabels : undefined,
        showInnerPlate: typeof args.showInnerPlate === 'boolean' ? args.showInnerPlate : undefined,
      });
      const ids = items.map((i) => i.id);
      return textResult({ ids, unknownIds, shareUrl: buildShareUrl(ids, settings) });
    }

    default:
      return textResult(`Unknown tool: ${name}`, true);
  }
}

export function handleMcpMessage(
  req: JsonRpcRequest,
  opts: McpHandlerOptions = {}
): JsonRpcResponse | null {
  // Notifications have no id and expect no response.
  if (req.id === undefined) return null;
  const id = req.id ?? null;

  try {
    switch (req.method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {}, resources: {} },
            serverInfo: { name: 'techstack-studio', version: '1.0.0' },
          },
        };
      case 'ping':
        return { jsonrpc: '2.0', id, result: {} };
      case 'tools/list':
        return { jsonrpc: '2.0', id, result: { tools: MCP_TOOLS } };
      case 'tools/call': {
        const params = (req.params || {}) as { name?: string; arguments?: Record<string, unknown> };
        if (!params.name) {
          return { jsonrpc: '2.0', id, error: { code: -32602, message: 'Missing tool name' } };
        }
        return {
          jsonrpc: '2.0',
          id,
          result: callTool(params.name, params.arguments || {}, opts),
        };
      }
      case 'resources/list':
        return { jsonrpc: '2.0', id, result: { resources: MCP_RESOURCES } };
      case 'resources/read': {
        const uri = String((req.params || {}).uri || '');
        if (uri === 'techstack://catalog') {
          const payload = TECH_CATALOG.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            aliases: item.aliases,
            animatedUrl: `${SITE}/icons/animated/${item.id}.svg`,
            staticUrl: `${SITE}/icons/source/${item.id}.svg`,
            story: STORY_CONCEPTS[item.id] || item.role,
          }));
          return {
            jsonrpc: '2.0',
            id,
            result: {
              contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(payload) }],
            },
          };
        }
        if (uri === 'techstack://llms-guide') {
          const text =
            opts.llmsGuidePath && fs.existsSync(opts.llmsGuidePath)
              ? fs.readFileSync(opts.llmsGuidePath, 'utf8')
              : `Tech Stack Studio (${SITE}) — 542 animated & static SVG logos.`;
          return {
            jsonrpc: '2.0',
            id,
            result: { contents: [{ uri, mimeType: 'text/plain', text }] },
          };
        }
        return { jsonrpc: '2.0', id, error: { code: -32602, message: `Unknown resource: ${uri}` } };
      }
      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${req.method}` },
        };
    }
  } catch (err) {
    return {
      jsonrpc: '2.0',
      id,
      result: textResult(err instanceof Error ? err.message : String(err), true),
    };
  }
}
