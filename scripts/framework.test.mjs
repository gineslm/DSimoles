import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Ejecuta un script en una copia temporal del repo para no tocar nunca el original.
function inCopy(fn) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-fw-'));
  cpSync(root, dir, {recursive: true, filter: p => !/[\/](\.git|node_modules|\.claude)([\/]|$)/.test(p)});
  try { return fn(dir); } finally { rmSync(dir, {recursive: true, force: true}); }
}
const run = (dir, script, ...args) => { const r = spawnSync(process.execPath, [`scripts/${script}`, ...args], {cwd: dir, encoding: 'utf8'}); return {code: r.status, out: r.stdout + r.stderr}; };
const manifest = dir => JSON.parse(readFileSync(path.join(dir, 'dsbook.json'), 'utf8'));

test('Los archivos del framework coinciden con la versión registrada', () => {
  const r = run(root, 'framework.mjs');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /framework DSBook \d+\.\d+\.\d+/);
});

test('Cambiar un archivo del framework hace fallar el informe y check', () => {
  inCopy(dir => {
    writeFileSync(path.join(dir, 'app.js'), readFileSync(path.join(dir, 'app.js'), 'utf8') + '\n//');
    const r = run(dir, 'framework.mjs');
    assert.notEqual(r.code, 0); assert.match(r.out, /cambiados: app\.js/);
    const c = run(dir, 'check.mjs');
    assert.notEqual(c.code, 0); assert.match(c.out, /npm run framework -- --release/);
  });
});

test('Los saltos de línea no cambian el hash', () => {
  inCopy(dir => {
    const f = path.join(dir, 'docs/handoff.md');
    writeFileSync(f, readFileSync(f, 'utf8').replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'));
    assert.equal(run(dir, 'framework.mjs').code, 0);
  });
});

test('Los archivos propios de un proyecto no forman parte del framework', () => {
  inCopy(dir => {
    writeFileSync(path.join(dir, 'README.md'), 'Another project\n');
    writeFileSync(path.join(dir, 'CHANGELOG.md'), 'Another project\n');
    assert.equal(run(dir, 'framework.mjs').code, 0);
  });
});

test('Un archivo añadido a las carpetas del framework debe registrarse', () => {
  inCopy(dir => {
    writeFileSync(path.join(dir, 'scripts/extra.mjs'), '// new\n');
    const r = run(dir, 'framework.mjs');
    assert.notEqual(r.code, 0); assert.match(r.out, /fuera del manifiesto: scripts\/extra\.mjs/);
  });
});

test('--release registra una versión nueva y hace que los archivos vuelvan a coincidir', () => {
  inCopy(dir => {
    writeFileSync(path.join(dir, 'styles.css'), readFileSync(path.join(dir, 'styles.css'), 'utf8') + '\n/* x */');
    const r = run(dir, 'framework.mjs', '--release', '9.8.7');
    assert.equal(r.code, 0, r.out);
    assert.equal(manifest(dir).version, '9.8.7');
    assert.equal(run(dir, 'framework.mjs').code, 0);
    assert.equal(run(dir, 'check.mjs').code, 0);
  });
});

test('--release registra la fecha y conserva el repositorio de origen salvo que se indique otro',() => {
  inCopy(dir => {
    run(dir, 'framework.mjs', '--release', '2.0.0');
    const m = manifest(dir);
    assert.equal(m.repository, manifest(root).repository);
    assert.match(m.released, /^\d{4}-\d{2}-\d{2}$/);
    run(dir, 'framework.mjs', '--release', '2.0.1', '--repository', 'https://github.com/someone/other');
    assert.equal(manifest(dir).repository, 'https://github.com/someone/other');
    const bad = run(dir, 'framework.mjs', '--release', '2.0.2', '--repository', 'not-a-url');
    assert.notEqual(bad.code, 0); assert.match(bad.out, /Repositorio .* no válido/);
  });
});

test('--release rechaza una versión que no sea MAJOR.MINOR.PATCH', () => {
  inCopy(dir => {
    const r = run(dir, 'framework.mjs', '--release', 'v2');
    assert.notEqual(r.code, 0); assert.match(r.out, /no válida/);
  });
});

test('--compare distingue repositorios idénticos y distintos', () => {
  inCopy(dir => {
    assert.equal(run(dir, 'framework.mjs', '--compare', root).code, 0);
    writeFileSync(path.join(dir, 'model.js'), readFileSync(path.join(dir, 'model.js'), 'utf8') + '\n//');
    run(dir, 'framework.mjs', '--release', '1.0.1');
    const r = run(dir, 'framework.mjs', '--compare', root);
    assert.notEqual(r.code, 0); assert.match(r.out, /versiones difieren/); assert.match(r.out, /model\.js/);
  });
});
