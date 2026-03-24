import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  StreamableHTTPClientTransport,
  StreamableHTTPError,
} from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

/**
 * Connect an MCP Client to a server URL, trying Streamable HTTP first
 * (MCP spec 2025-03-26+) and falling back to SSE only when the server
 * returns 404 or 405 — indicating it doesn't speak the newer protocol.
 * Any other error (auth, network, etc.) is re-thrown immediately.
 */
export async function connectMcpClient(
  client: Client,
  url: string,
  headers: Record<string, string>
): Promise<void> {
  try {
    const transport = new StreamableHTTPClientTransport(new URL(url), {
      requestInit: { headers },
    });
    await client.connect(transport);
  } catch (err) {
    if (
      err instanceof StreamableHTTPError &&
      (err.code === 404 || err.code === 405)
    ) {
      const sseTransport = new SSEClientTransport(new URL(url), {
        requestInit: { headers },
        eventSourceInit: {
          fetch: (u, init) =>
            fetch(u, {
              ...init,
              headers: {
                ...(init?.headers as Record<string, string>),
                ...headers,
              },
            }),
        },
      });
      await client.connect(sseTransport);
    } else {
      throw err;
    }
  }
}
