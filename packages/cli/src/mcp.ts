import readline from 'node:readline';
import { handleMcpMessage, JsonRpcRequest, McpHandlerOptions } from './mcpHandlers';

/**
 * Starts a newline-delimited JSON-RPC 2.0 MCP server on stdin/stdout.
 */
export function startMcpServer(opts: McpHandlerOptions = {}): void {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

  rl.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const req = JSON.parse(trimmed) as JsonRpcRequest;
      const res = handleMcpMessage(req, opts);
      if (res) {
        process.stdout.write(JSON.stringify(res) + '\n');
      }
    } catch (err) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32700,
            message: err instanceof Error ? err.message : 'Parse error',
          },
        }) + '\n'
      );
    }
  });
}
