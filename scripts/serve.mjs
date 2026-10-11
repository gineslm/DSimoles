// Sirve este repositorio como archivos estáticos en 127.0.0.1 para que el contenedor pueda cargar sus JSON.
//   npm start                  primer puerto libre desde 8000
//   npm start -- --port 9000   primer puerto libre desde 9000 (--port 0 deja que elija el sistema)
// Dos proyectos pueden correr a la vez: cada uno imprime la dirección que obtuvo.
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
    else { console.error(`Error: no se pudo arrancar el servidor (${e.message})`); process.exit(1); }
  });
  server.listen(port, '127.0.0.1', () => {
    const {port: got} = server.address();
    console.log(`Sirviendo ${path.basename(root)} en http://localhost:${got}`);
    if (port !== start && start !== 0) console.log(`(el puerto ${start} estaba ocupado)`);
    console.log('Pulsa Ctrl+C para detener.');
  });
}
listen(start);
