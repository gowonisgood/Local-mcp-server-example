#!/usr/bin/env node

// MCP 서버 응답 테스트
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 서버 실행
const serverPath = join(__dirname, 'build', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// JSON-RPC 메시지 전송
function sendMessage(id, method, params = {}) {
  const message = {
    jsonrpc: "2.0",
    id,
    method,
    params
  };

  const jsonStr = JSON.stringify(message) + '\n';
  console.error(`Sending: ${jsonStr.trim()}`);
  server.stdin.write(jsonStr);
}

// 응답 수신
server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.error(`Received:`, JSON.stringify(response, null, 2));
    } catch (e) {
      console.error(`Raw output: ${line}`);
    }
  });
});

server.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// 초기화 및 테스트 시퀀스
setTimeout(() => {
  // 1. 초기화
  sendMessage(1, "initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "test", version: "1.0.0" }
  });
}, 100);

setTimeout(() => {
  // 2. initialized 알림
  server.stdin.write(JSON.stringify({
    jsonrpc: "2.0",
    method: "notifications/initialized"
  }) + '\n');
}, 200);

setTimeout(() => {
  // 3. tools/list 요청
  sendMessage(2, "tools/list");
}, 300);

setTimeout(() => {
  server.kill();
  process.exit(0);
}, 1000);