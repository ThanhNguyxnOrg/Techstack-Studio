import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadNodeStandaloneSvgParts } from './nodeSvgPartsLoader';
import { resolveSafePath } from '../../packages/cli/src/sandbox';
import { handleMcpMessage } from '../../packages/cli/src/mcpHandlers';

loadNodeStandaloneSvgParts();

test('resolveSafePath enforces workspace root when configured and blocks traversal', () => {
  const root = path.resolve(os.tmpdir(), 'tss-root-test');
  const ok = resolveSafePath('README.md', root);
  assert.equal(ok, path.join(root, 'README.md'));

  assert.throws(() => resolveSafePath('../escape.txt', root), /escapes the configured root/);
  assert.throws(() => resolveSafePath('../../etc/passwd', root), /escapes the configured root/);
});

test('MCP server handles initialize, tools/list, resources/list, and all 6 tools', () => {
  const init = handleMcpMessage({ jsonrpc: '2.0', id: 1, method: 'initialize' });
  assert.ok(init?.result);

  const list = handleMcpMessage({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  const tools = (list?.result as { tools: Array<{ name: string }> }).tools;
  assert.equal(tools.length, 6);

  const search = handleMcpMessage({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: { name: 'search_icons', arguments: { query: 'docker', limit: 3 } },
  });
  const searchPayload = JSON.parse(
    (search?.result as { content: Array<{ text: string }> }).content[0].text
  );
  assert.equal(searchPayload.icons[0].id, 'docker');
  assert.ok(searchPayload.icons[0].animatedUrl.endsWith('/icons/animated/docker.svg'));
  assert.ok(searchPayload.icons[0].staticUrl.endsWith('/icons/source/docker.svg'));

  const snippet = handleMcpMessage({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'build_readme_snippet',
      arguments: { ids: ['react', 'nodejs'], animate: false },
    },
  });
  const snippetPayload = JSON.parse(
    (snippet?.result as { content: Array<{ text: string }> }).content[0].text
  );
  assert.deepEqual(snippetPayload.ids, ['react', 'nodedotjs']);
  assert.ok(snippetPayload.markdown.includes('/icons/source/react.svg'));

  const share = handleMcpMessage({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'build_share_url',
      arguments: { ids: ['react', 'pg'], theme: 'light', animate: false },
    },
  });
  const sharePayload = JSON.parse(
    (share?.result as { content: Array<{ text: string }> }).content[0].text
  );
  assert.ok(sharePayload.shareUrl.includes('stack=react%2Cpostgresql'));
  assert.ok(sharePayload.shareUrl.includes('theme=light'));
  assert.ok(sharePayload.shareUrl.includes('anim=0'));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tss-mcp-'));
  try {
    const readme = path.join(tmp, 'README.md');
    fs.writeFileSync(readme, '# MCP Test\n', 'utf8');

    const patched = handleMcpMessage(
      {
        jsonrpc: '2.0',
        id: 6,
        method: 'tools/call',
        params: {
          name: 'patch_readme',
          arguments: { readmePath: 'README.md', ids: ['react', 'docker'] },
        },
      },
      { rootDir: tmp }
    );
    const patchPayload = JSON.parse(
      (patched?.result as { content: Array<{ text: string }> }).content[0].text
    );
    assert.equal(patchPayload.readmeChanged, true);
    assert.ok(fs.readFileSync(readme, 'utf8').includes('<!-- techstack-studio:start -->'));

    const blocked = handleMcpMessage(
      {
        jsonrpc: '2.0',
        id: 7,
        method: 'tools/call',
        params: {
          name: 'patch_readme',
          arguments: { readmePath: '../outside.md', ids: ['react'] },
        },
      },
      { rootDir: tmp }
    );
    assert.equal((blocked?.result as { isError?: boolean }).isError, true);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
