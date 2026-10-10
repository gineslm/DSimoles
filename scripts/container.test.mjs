// Browser smoke test of the container. It drives a local headless Chrome through the DevTools protocol
// and is skipped when Chrome (or Node's global WebSocket) is not available. Set DSBOOK_CHROME to a browser path to force one.
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
const skip = typeof WebSocket === 'undefined' ? 'Node has no global WebSocket (use Node 22+)' : !chrome ? 'Chrome not found (set DSBOOK_CHROME)' : false;

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
      async go(hash) { await b.eval(`location.hash=${JSON.stringify(hash)}`); await sleep(500); },
    };
    try { await fn(b); } finally { ws.close(); }
  } finally { proc.kill(); server.close(); try { rmSync(dir, {recursive: true, force: true}); } catch {} }
}

test('Container: home, sections, views, filters and legacy links work without console errors', {skip, timeout: 60000}, async () => {
  await session(async b => {
    await b.goto('');
    assert.equal(await b.eval(`document.querySelectorAll('.card').length`), guide.categories.length, 'home shows one card per category');
    assert.equal(await b.eval(`document.getElementById('views').hidden`), true, 'no view tabs on the home page');
    assert.equal(await b.eval(`document.querySelectorAll('.meters progress').length`), 2, 'the home page shows progress and complexity');

    if (withPage) {
      await b.go(`#/${withPage.id}`);
      assert.equal(await b.eval(`!!document.querySelector('#view iframe')`), true, 'a section in I/R with a page opens its page by default');
      assert.equal(await b.eval(`document.querySelector('#views [aria-current]').textContent`), 'Content');
      assert.equal(await b.eval(`document.getElementById('head-status').textContent`).then(t => t.startsWith(project.sections[withPage.id].status)), true);
      assert.equal(await b.eval(`document.documentElement.scrollHeight <= innerHeight`), true, 'the page does not add document scroll: the iframe fills the view');
      await b.go(`#/${withPage.id}/info`);
      assert.equal(await b.eval(`document.querySelectorAll('.guide-grid > div').length`), 5);
      await b.go(`#/${withPage.id}/record`);
      assert.match(await b.eval(`[...document.querySelectorAll('.record h2')].map(h => h.textContent).join()`), /Status.*Owner.*Tasks.*Review/);
      await b.goto(`#item-${withPage.id}`);
      assert.equal(await b.eval(`location.hash`), `#/${withPage.id}`, 'old #item-<id> links are translated');
    }
    if (withoutPage) {
      await b.go(`#/${withoutPage.id}`);
      assert.equal(await b.eval(`document.querySelector('#views [aria-current]').textContent`), 'Info', 'a section without a page opens its info view');
      await b.go(`#/${withoutPage.id}/content`);
      assert.equal(await b.eval(`document.querySelector('.empty h2').textContent`), 'No page yet');
    }
    await b.go('#/');
    assert.equal(await b.eval(`document.getElementById('home-link').getAttribute('href')`), '#/framework', 'the DSB mark opens the framework page');
    await b.eval(`document.getElementById('home-link').click()`); await sleep(400);
    assert.equal(await b.eval(`location.hash`), '#/framework');
    assert.equal(await b.eval(`document.querySelector('#view h1').textContent`), 'DSBook framework');
    assert.deepEqual(await b.eval(`[...document.querySelectorAll('.about-block h2')].map(h => h.textContent)`), ['DSBook framework', 'This project']);
    const manifest = JSON.parse(readFileSync(path.join(root, 'dsbook.json'), 'utf8'));
    assert.equal(await b.eval(`document.querySelector('.about-block dd').textContent`), manifest.version, 'the page shows the framework version from dsbook.json');
    assert.equal(await b.eval(`document.querySelectorAll('.about-block button').length`) >= 1, true, 'there is a check button');
    assert.equal(await b.eval(`document.querySelector('#crumbs a').getAttribute('href')`), '#/', 'the breadcrumb leads back to the home page');
    await b.go('#/');
    const counts = {};
    for (const s of Object.values(project.sections)) counts[s.status] = (counts[s.status] || 0) + 1;
    await b.eval(`document.querySelector('[data-filter="I"]').click()`); await sleep(300);
    const withI = guide.categories.filter(c => c.items.some(i => project.sections[i.id].status === 'I')).length;
    assert.equal(await b.eval(`document.querySelectorAll('.card').length`), withI, 'the I filter trims the home page');
    await b.eval(`document.querySelector('[data-filter="all"]').click()`);
    await b.go('#/nope');
    assert.equal(await b.eval(`document.querySelector('#view h1').textContent`), 'Page not found');
    assert.deepEqual(b.errors, [], 'no console errors or exceptions');
  });
});
