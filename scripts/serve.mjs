// Serves this repository as static files on 127.0.0.1 so the container can load its JSON files.
//   npm start                  first free port from 8000
//   npm start -- --port 9000   first free port from 9000 (--port 0 lets the system choose)
// Two projects can run at the same time: each one prints the address it got.
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const start = Number(args[args.indexOf('--port') + 1] ?? 8000);
const MIME = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.woff2': 'font/woff2'};

const server = createServer(async (req, res) => {
  try {
    let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404); res.end(); }
});

function listen(port, tries = 0) {
  server.once('error', e => {
    if (e.code === 'EADDRINUSE' && tries < 50) listen(port + 1, tries + 1);
    else { console.error(`Error: could not start the server (${e.message})`); process.exit(1); }
  });
  server.listen(port, '127.0.0.1', () => {
    const {port: got} = server.address();
    console.log(`Serving ${path.basename(root)} at http://localhost:${got}`);
    if (port !== start && start !== 0) console.log(`(port ${start} was busy)`);
    console.log('Press Ctrl+C to stop.');
  });
}
listen(start);
