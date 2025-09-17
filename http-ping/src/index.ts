// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { request } from "undici";
import { z } from "zod";

// stdio 전송 시 console 출력 방지
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
};

// stdio 사용 시 console 출력을 stderr로 리다이렉트
console.log = (...args) => originalConsole.error(...args);
console.info = (...args) => originalConsole.error(...args);
console.warn = (...args) => originalConsole.error(...args);

const server = new McpServer(
  { name: "http-ping", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

// 원래 작동하던 tool() 메서드
server.tool(
  "http_get",
  "Fetch a URL over HTTP and return status + snippet",
  z.object({
    url: z.string().min(1)
  }),
  async ({ url }) => {
    try {
      const res = await request(url);
      const text = await res.body.text();
      return {
        content: [
          {
            type: "text",
            text: `Status: ${res.statusCode}\nSnippet: ${text.slice(0, 200)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      };
    }
  }
);
await server.connect(new StdioServerTransport());
