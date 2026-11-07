#!/usr/bin/env node
/* Zero-dependency static server:  node scripts/serve.mjs [port]  → http://localhost:5173 . Owned by S1. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..'), port = +process.argv[2] || 5173;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon' };
createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, ''); if (p.endsWith('/')) p += 'index.html';
  try { const f = join(root, p); if ((await stat(f)).isFile()) { res.writeHead(200, { 'Content-Type': types[extname(f)] || 'application/octet-stream' }); return res.end(await readFile(f)); } } catch {}
  /* like GitHub Pages / Netlify: a missing address gets 404.html with a 404 status */
  try { const nf = await readFile(join(root, '404.html')); res.writeHead(404, { 'Content-Type': types['.html'] }); return res.end(nf); } catch {}
  res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('404');
}).listen(port, () => console.log(`Next Inc. dev server → http://localhost:${port}`));
