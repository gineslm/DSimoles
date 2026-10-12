// Prueba de humo del contenedor en navegador. Maneja un Chrome headless local por el protocolo DevTools
// y se omite cuando Chrome (o el WebSocket global de Node) no está disponible. Define DSBOOK_CHROME con la ruta de un navegador para forzar uno.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync, mkdtempSync, rmSync} from 'node:fs';
import {createServer} from 'node:http';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guide = JSON.parse(readFileSync(path.join(root, 'data/guide.json'), 'utf8'));
const project = JSON.parse(readFileSync(path.join(root, 'data/project.json'), 'utf8'));
const CANDIDATES = [process.env.DSBOOK_CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const chrome = CANDIDATES.find(p => p && existsSync(p));
const skip = typeof WebSocket === 'undefined' ? 'Node no tiene WebSocket global (usa Node 22+)' : !chrome ? 'Chrome no encontrado (define DSBOOK_CHROME)' : false;

const MIME = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8'};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const items = guide.categories.flatMap(c => c.items);
const pageOf = i => [i.suggestedPath, i.suggestedPath.replace(/\.html$/, '.dc.html')].find(f => existsSync(path.join(root, f)));
const withPage = items.find(i => ['I', 'R'].includes(project.sections[i.id].status) && pageOf(i));
const withoutPage = items.find(i => project.sections[i.id].status === 'P' && !pageOf(i));

async function session(fn) {
  const server = createServer((req, res) => {
    const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    const file = existsSync(f) && statSync(f).isDirectory() ? path.join(f, 'index.html') : f;
    if (!file.startsWith(root) || !existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, {'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'});
    res.end(req.method === 'HEAD' ? undefined : readFileSync(file));
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const port = 9300 + Math.floor(Math.random() * 600), dir = mkdtempSync(path.join(tmpdir(), 'dsbook-chrome-'));
  const proc = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, 'about:blank'], {stdio: 'ignore'});
  try {
    let page;
    for (let k = 0; k < 60 && !page; k++) { try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page'); } catch {} if (!page) await sleep(250); }
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    let id = 0; const pending = new Map(), errors = [];
    ws.onmessage = e => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(Error(JSON.stringify(m.error))) : p.res(m.result); }
      else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
      else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value ?? a.description).join(' '));
    };
    const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, {res, rej}); ws.send(JSON.stringify({id: i, method, params})); });
    await send('Page.enable'); await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {width: 1280, height: 800, deviceScaleFactor: 1, mobile: false});
    const b = {
      errors,
      async goto(hash) { await send('Page.navigate', {url: base + hash}); await sleep(1200); },
      async eval(expr) { const r = await send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true}); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; },
      async mouse(x, y, wait = 30) { await send('Input.dispatchMouseEvent', {type: 'mouseMoved', x, y}); await sleep(wait); },
      async touch(on) { await send('Emulation.setTouchEmulationEnabled', {enabled: on, maxTouchPoints: 5}); },
      async go(hash) { await b.eval(`location.hash=${JSON.stringify(hash)}`); await sleep(500); },
    };
    try { await fn(b); } finally { ws.close(); }
  } finally { proc.kill(); server.close(); try { rmSync(dir, {recursive: true, force: true}); } catch {} }
}

test('Contenedor: la home, las secciones, las vistas, los filtros y los enlaces antiguos funcionan sin errores de consola', {skip, timeout: 60000}, async () => {
  await session(async b => {
    await b.goto('');
    assert.equal(await b.eval(`document.querySelectorAll('.card').length`), guide.categories.length, 'la home muestra una tarjeta por categoría');
    assert.equal(await b.eval(`document.querySelectorAll('.meters progress').length`), 2, 'la home muestra Progress y Complexity');
    // selector de vista de la home: tarjetas (por defecto) o lista con todas las subsecciones
    assert.equal(await b.eval(`document.querySelector('.seg-btn[aria-pressed=true]').textContent.trim()`), 'Tarjetas', 'por defecto, tarjetas');
    await b.eval(`document.querySelectorAll('.seg-btn')[1].click()`); await sleep(200);
    assert.equal(await b.eval(`document.querySelectorAll('.tree-cat').length`), guide.categories.length, 'la lista muestra todas las categorías');
    assert.equal(await b.eval(`document.querySelectorAll('.tree-rows .row').length`), items.length, 'y todas las subsecciones');
    assert.equal(await b.eval(`document.querySelectorAll('.card').length`), 0, 'sin tarjetas en la lista');
    await b.eval(`document.querySelector('.tree-toggle').click()`); await sleep(100);
    assert.equal(await b.eval(`document.querySelector('.tree-rows').hidden`), true, 'cada categoría se puede contraer');
    assert.equal(await b.eval(`document.querySelector('.tree-all').textContent`), 'Expandir todo');
    await b.eval(`document.querySelectorAll('.seg-btn')[0].click()`); await sleep(200);
    assert.equal(await b.eval(`document.querySelectorAll('.card').length`), guide.categories.length, 'se vuelve a las tarjetas');

    if (withPage) {
      await b.go(`#/${withPage.id}`);
      assert.equal(await b.eval(`!!document.querySelector('#view iframe')`), true, 'una sección en I/R con página abre su página por defecto');
      assert.equal(await b.eval(`getComputedStyle(document.querySelector('#views [aria-current]')).borderBottomWidth`), '3px', 'la vista activa es una pestaña con indicador');
      assert.equal(await b.eval(`getComputedStyle(document.querySelector('#views a:not([aria-current])')).borderBottomColor`), 'rgba(0, 0, 0, 0)', 'las inactivas no llevan indicador');
      assert.equal(await b.eval(`document.querySelector('#views [aria-current]').textContent`), 'Content');
      assert.equal(await b.eval(`document.getElementById('head-status').textContent`).then(t => t.startsWith(project.sections[withPage.id].status)), true);
      assert.equal(await b.eval(`document.documentElement.scrollHeight <= innerHeight`), true, 'la página no añade scroll al documento: el iframe llena la vista');
      await b.go(`#/${withPage.id}/info`);
      assert.equal(await b.eval(`document.querySelectorAll('.guide-grid > div').length`), 5);
      await b.go(`#/${withPage.id}/record`);
      assert.match(await b.eval(`[...document.querySelectorAll('.record h2')].map(h => h.textContent).join()`), /Status.*Owner.*Tasks.*Review/);
      await b.goto(`#item-${withPage.id}`);
      assert.equal(await b.eval(`location.hash`), `#/${withPage.id}`, 'los enlaces antiguos #item-<id> se traducen');
    }
    if (withoutPage) {
      await b.go(`#/${withoutPage.id}`);
      assert.equal(await b.eval(`document.querySelector('#views [aria-current]').textContent`), 'Info', 'una sección sin página abre su vista Info');
      await b.go(`#/${withoutPage.id}/content`);
      assert.equal(await b.eval(`document.querySelector('.empty h2').textContent`), 'Aún no hay página');
    }
    await b.go('#/');
    assert.equal(await b.eval(`document.getElementById('home-link').getAttribute('href')`), '#/framework', 'el logo de DSBook abre la página Framework');
    await b.eval(`document.getElementById('home-link').click()`); await sleep(400);
    assert.equal(await b.eval(`location.hash`), '#/framework');
    assert.equal(await b.eval(`document.querySelector('#view h1').textContent`), 'DSBook framework');
    const seed = JSON.parse(readFileSync(path.join(root, 'seed/project.json'), 'utf8'));
    assert.deepEqual(await b.eval(`[...document.querySelectorAll('.about-block h2')].map(h => h.textContent)`), project.projectId === seed.projectId ? ['DSBook framework'] : ['DSBook framework', 'This project'], 'una copia que no se ha iniciado muestra solo el framework');
    const manifest = JSON.parse(readFileSync(path.join(root, 'dsbook.json'), 'utf8'));
    assert.equal(await b.eval(`document.querySelector('.about-block dd').textContent`), manifest.version, 'la página muestra la versión del framework de dsbook.json');
    assert.equal(await b.eval(`document.querySelectorAll('.about-block button').length`) >= 1, true, 'hay un botón de comprobación');
    assert.equal(await b.eval(`document.querySelector('#crumbs a').getAttribute('href')`), '#/', 'el breadcrumb lleva de vuelta a la home');
    await b.go('#/');
    assert.deepEqual(await b.eval(`[...document.querySelectorAll('#views a')].map(a => a.textContent)`), ['Content', 'Info', 'Record'], 'la home tiene las mismas tres vistas que una sección');
    assert.equal(await b.eval(`document.querySelector('#views [aria-current]').textContent`), 'Content');
    assert.equal(await b.eval(`document.getElementById('head-status').hidden && document.getElementById('pager').hidden`), true, 'sin estado ni anterior/siguiente en la home');
    await b.go('#/home/info');
    assert.equal(await b.eval(`document.querySelector('#view .empty h2').textContent`), 'Aún no hay información', 'la vista Info de la home existe y está vacía');
    await b.go('#/home/record');
    assert.equal(await b.eval(`document.querySelector('#views [aria-current]').textContent`), 'Record');
    assert.deepEqual(await b.eval(`[...document.querySelectorAll('#view h2')].map(h => h.textContent).filter(t => ['Owner', 'Notes', 'Project tasks', 'Section tasks'].includes(t))`), ['Owner', 'Notes', 'Project tasks', 'Section tasks']);
    const gathered = guide.categories.flatMap(c => c.items).filter(i => project.sections[i.id].tasks.length);
    assert.equal(await b.eval(`document.querySelectorAll('.task-section').length`), gathered.length, 'cada sección con tasks aparece, sin filtrar');
    await b.eval(`document.querySelector('[data-filter="N"]').click()`); await sleep(300);
    assert.equal(await b.eval(`document.querySelectorAll('.task-section').length`), gathered.length, 'los filtros de estado no ocultan tasks');
    await b.eval(`document.querySelector('[data-filter="all"]').click()`); await sleep(200);
    await b.go('#/');
    // el menú Sections se abre con hover y muestra las subsecciones de una categoría con hover
    await b.goto('');
    const at = sel => b.eval(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return {x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2)}; })()`);
    const icon = await at('#sections-btn');
    await b.mouse(icon.x, icon.y, 250);
    const row = await at('.menu-cat:nth-child(3) .menu-cat-link');
    for (let k = 1; k <= 8; k++) await b.mouse(Math.round(icon.x + (row.x - icon.x) * k / 8), Math.round(icon.y + (row.y - icon.y) * k / 8), 15);
    await sleep(300);
    assert.equal(await b.eval(`document.getElementById('sidebar').dataset.panel`), 'sections', 'pasar el puntero por el icono Sections abre su panel');
    assert.equal(await b.eval(`getComputedStyle(document.querySelector('.menu-cat.open .submenu')).display`), 'block', 'pasar el puntero por una categoría muestra sus subsecciones');
    await b.mouse(5, 5, 400);
    // un PC que informa de que no hay hover y de un puntero grueso (algunas configuraciones de Firefox) debe seguir recibiendo la cascada con un ratón
    await b.touch(true);
    await b.goto('');
    assert.equal(await b.eval(`matchMedia('(any-hover:none)').matches`), true, 'el navegador ahora informa de que no hay capacidad de hover');
    const icon2 = await at('#sections-btn');
    await b.mouse(icon2.x, icon2.y, 250);
    const row2 = await at('.menu-cat:nth-child(3) .menu-cat-link');
    for (let k = 1; k <= 8; k++) await b.mouse(Math.round(icon2.x + (row2.x - icon2.x) * k / 8), Math.round(icon2.y + (row2.y - icon2.y) * k / 8), 15);
    await sleep(300);
    assert.equal(await b.eval(`getComputedStyle(document.querySelector('.menu-cat.open .submenu')).position`), 'fixed', 'sin capacidad de hover el diseño ancho sigue siendo la cascada');
    assert.equal(await b.eval(`getComputedStyle(document.querySelector('.menu-cat.open .submenu')).display`), 'block', 'pasar el puntero por una categoría sigue mostrando sus subsecciones');
    assert.equal(await b.eval(`getComputedStyle(document.querySelector('.menu-chevron')).display`), 'block', 'el chevron también está disponible, para táctil');
    await b.mouse(5, 5, 400);
    await b.touch(false);
    await b.go('#/');
    const counts = {};
    for (const s of Object.values(project.sections)) counts[s.status] = (counts[s.status] || 0) + 1;
    await b.eval(`document.querySelector('[data-filter="I"]').click()`); await sleep(300);
    const withI = guide.categories.filter(c => c.items.some(i => project.sections[i.id].status === 'I')).length;
    assert.equal(await b.eval(`document.querySelectorAll('.card').length`), withI, 'el filtro I recorta la home');
    await b.eval(`document.querySelector('[data-filter="all"]').click()`);
    await b.go('#/nope');
    assert.equal(await b.eval(`document.querySelector('#view h1').textContent`), 'Página no encontrada');
    assert.deepEqual(b.errors, [], 'sin errores de consola ni excepciones');
  });
});
