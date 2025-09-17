#!/usr/bin/env node

// 빌드 후 서버 실행 (stdout 오염 방지)
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dist/server.js를 직접 실행
const serverPath = join(__dirname, 'dist', 'server.js');
const child = spawn('node', [serverPath], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code);
});