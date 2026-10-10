import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const script = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'serve.mjs');

// Starts serve.mjs and resolves with the URL it prints.
function start(...args) {
  const proc = spawn(process.execPath, [script, ...args], {stdio: ['ignore', 'pipe', 'inherit']});
  const url = new Promise((resolve, reject) => {
    let out = '';
    proc.stdout.on('data', d => { out += d; const m = out.match(/http:\/\/localhost:\d+/); if (m) resolve(m[0]); });
    proc.on('exit', c => reject(Error(`serve.mjs exited with ${c}`)));
  });
  return {proc, url};
}

test('npm start serves the repository and skips a busy port', async () => {
  const busy = createServer((q, r) => r.end('another project'));
  await new Promise(r => busy.listen(0, '127.0.0.1', r));
  const port = busy.address().port;
  const s = start('--port', String(port));
  try {
    const url = await s.url;
    assert.notEqual(url, `http://localhost:${port}`, 'it must not take the busy port');
    const html = await (await fetch(`${url}/index.html`)).text();
    assert.match(html, /<title>DSBook<\/title>/);
    assert.equal((await fetch(`${url}/data/project.json`)).status, 200);
    assert.equal((await fetch(`${url}/nope.json`)).status, 404);
    assert.equal((await fetch(`${url}/..%2f..%2fetc%2fpasswd`)).status === 200, false, 'it must not leave the repository');
  } finally { s.proc.kill(); busy.close(); }
});
