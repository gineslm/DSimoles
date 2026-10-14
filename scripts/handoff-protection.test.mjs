// Protección del trabajo de Claude Design: comparación a tres bandas, manifiesto con nonce, registro de la integración,
// control previo al push y el aviso de handoff-note.
import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {canonicalSvg, threeWay, parseManifest, DESIGN_IGNORED} from './handoff-lib.mjs';
import {hashOf} from './framework-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const H = x => createHash('sha256').update(x).digest('hex');
const M = o => new Map(Object.entries(o));
const EXCLUDE = /[\\/](\.git|node_modules|\.dsbook)([\\/]|$)/;

function inCopy(fn, {git = false} = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-prot-'));
  cpSync(root, dir, {recursive: true, filter: p => !EXCLUDE.test(p)});
  try {
    if (git) {
      const g = (...a) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...a], {cwd: dir, encoding: 'utf8'});
      g('init', '-q'); g('add', '-A'); g('commit', '-q', '-m', 'base');
    }
    return fn(dir);
  } finally { rmSync(dir, {recursive: true, force: true}); }
}
const run = (dir, script, ...args) => { const r = spawnSync(process.execPath, [`scripts/${script}`, ...args], {cwd: dir, encoding: 'utf8'}); return {code: r.status, out: r.stdout + r.stderr}; };

const SAMPLE = ['data/guide.json', 'sections/foundations/system-users.dc.html', 'docs/handoff.md'];
const PAGE = 'sections/foundations/system-users.dc.html';
// Un DSBook recién creado no tiene páginas: se crea una de prueba para no depender del contenido del proyecto.
const ensurePage = dir => { const f = path.join(dir, PAGE); if (!existsSync(f)) { mkdirSync(path.dirname(f), {recursive: true}); writeFileSync(f, '<!DOCTYPE html><html lang="es"><body>página de prueba</body></html>\n'); } };
async function manifestFor(dir, nonce, change = {}) {
  const files = {};
  for (const p of SAMPLE) files[p] = change[p] ?? await hashOf(dir, p);
  return {generated: '2026-10-11T10:00:00Z', nonce, files};
}
const nonceOf = out => out.match(/nonce ([0-9a-f]{12})/)[1];
const writeM = (dir, m) => { const f = path.join(dir, 'm.json'); writeFileSync(f, JSON.stringify(m)); return f; };
const last = dir => JSON.parse(readFileSync(path.join(dir, '.dsbook/last-diff.json'), 'utf8'));

test('threeWay: el trabajo de Claude Design que el repo no tiene queda sin integrar', () => {
  const baseline = {a: {design: 'd1', repo: 'r1'}, b: {design: 'd1', repo: 'r1'}, c: {design: 'd1', repo: 'r1'}, e: {design: 'd1', repo: 'r1'}, g: {design: 'd1', repo: 'r1'}};
  const r = threeWay({
    baseline,
    design: M({a: 'd2', b: 'd2', c: 'd1', d: 'dn', e: 'x', f: 'f1', h: 'h1'}),
    repo: M({a: 'r1', b: 'r2', c: 'r1', e: 'x', f: 'f2', g: 'r1', i: 'ri'}),
  });
  assert.deepEqual(r.pending, ['a'], 'Claude Design cambió y el repo no: sin integrar');
  assert.deepEqual(r.needsConfirm, ['b', 'f'], 'cambiaron en ambos lados, o no hay historia');
  assert.deepEqual(r.newInDesign, ['d', 'h'], 'solo existen en Claude Design');
  assert.deepEqual(r.integrated, ['e'], 'idéntico pero distinto de la base registrada');
  assert.deepEqual(r.designDeleted, ['g'], 'estaba en la base y Claude Design ya no lo tiene');
  assert.deepEqual(r.repoOnly, ['i']);
  assert.deepEqual(r.blocking, ['a', 'b', 'd', 'f', 'h']);
});

test('threeWay: lo hecho en Claude Code tras registrar no bloquea y un descarte explícito se respeta', () => {
  const baseline = {a: {design: 'd1', repo: 'r1'}};
  const r1 = threeWay({baseline, design: M({a: 'd1'}), repo: M({a: 'r9'})});
  assert.deepEqual(r1.repoAhead, ['a']); assert.deepEqual(r1.blocking, []);
  const r2 = threeWay({baseline, discarded: [{path: 'a', designHash: 'd2'}], design: M({a: 'd2'}), repo: M({a: 'r1'})});
  assert.deepEqual(r2.discarded, ['a']); assert.deepEqual(r2.blocking, []);
  const r3 = threeWay({baseline, discarded: [{path: 'a', designHash: 'd2'}], design: M({a: 'd3'}), repo: M({a: 'r1'})});
  assert.deepEqual(r3.pending, ['a'], 'si Claude Design vuelve a cambiar, reaparece');
});

test('Los archivos que genera Claude Code no cuentan como trabajo de Claude Design', () => {
  for (const p of ['design-baseline.json', 'handoff-last.md', 'design-manifest.json', '_backup/2026-10-12/a.html', 'github.md']) assert.match(p, DESIGN_IGNORED, p);
  assert.doesNotMatch('sections/visuals/color.dc.html', DESIGN_IGNORED);
});

test('Un SVG reserializado por Claude Design coincide con el original en forma canónica', () => {
  const original = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" fill="#000"/>\n<path d="M0 0Z"/>\n</svg>\n';
  const reserializado = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" fill="#000"></rect>\n<path d="M0 0Z"></path>\n</svg>';
  assert.equal(canonicalSvg(original), reserializado);
});

test('El logo real del framework, en forma canónica, tiene el hash que calculó Claude Design', () => {
  const svg = readFileSync(path.join(root, 'assets/_framework/dsbook-logo.svg'), 'utf8');
  assert.equal(H(canonicalSvg(svg)), '131278d0ee7988c483dd7d4d60c78bd8596daf06d70a90a4b418913bfbfe9e02');
});

test('parseManifest acepta el JSON directo y la respuesta de get_file, y rechaza hashes inventados', () => {
  const m = {generated: '2026-10-11T10:00:00Z', nonce: 'abc', files: {'a.txt': H('a')}};
  assert.equal(parseManifest(m).files.get('a.txt'), H('a'));
  assert.equal(parseManifest(JSON.stringify({method: 'get_file', content: JSON.stringify(m)})).nonce, 'abc');
  assert.throws(() => parseManifest({files: {'a.txt': 'no-es-un-hash'}}), /hash no válido/);
  assert.throws(() => parseManifest({}), /files/);
});

test('design-diff --request genera el prompt con un nonce y lo guarda', () => {
  inCopy(dir => {
    const r = run(dir, 'design-diff.mjs', '--request');
    assert.equal(r.code, 0, r.out);
    assert.match(r.out, /design-manifest\.json/);
    assert.match(r.out, /crypto\.subtle/);
    assert.equal(JSON.parse(readFileSync(path.join(dir, '.dsbook/nonce.json'), 'utf8')).nonce, nonceOf(r.out));
  });
});

test('design-diff --manifest rechaza un manifiesto que no es el que se pidió', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-prot-'));
  cpSync(root, dir, {recursive: true, filter: p => !EXCLUDE.test(p)});
  ensurePage(dir);
  try {
    run(dir, 'design-diff.mjs', '--request');
    const r = run(dir, 'design-diff.mjs', '--manifest', writeM(dir, await manifestFor(dir, 'otro-nonce')));
    assert.equal(r.code, 2, r.out);
    assert.match(r.out, /el nonce no coincide/);
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test('Flujo completo: sin integrar bloquea, registrar exige resolver y descartar es explícito y deja constancia', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-prot-'));
  cpSync(root, dir, {recursive: true, filter: p => !EXCLUDE.test(p)});
  ensurePage(dir);
  try {
    const nonce = nonceOf(run(dir, 'design-diff.mjs', '--request').out);
    const nuevo = {[PAGE]: H('trabajo nuevo de Claude Design')};
    // 1 · el contenido de Claude Design coincide con el repo: nada que confirmar; se registra
    let r = run(dir, 'design-diff.mjs', '--manifest', writeM(dir, await manifestFor(dir, nonce)));
    assert.deepEqual(last(dir).blocking, [], r.out);
    r = run(dir, 'design-diff.mjs', '--record');
    assert.equal(r.code, 0, r.out);
    assert.equal(JSON.parse(readFileSync(path.join(dir, 'design-baseline.json'), 'utf8')).files[PAGE].design, await hashOf(dir, PAGE));
    // 2 · Claude Design cambia la página y el repo no se toca: SIN INTEGRAR
    r = run(dir, 'design-diff.mjs', '--manifest', writeM(dir, await manifestFor(dir, nonce, nuevo)));
    assert.equal(r.code, 2, r.out);
    assert.match(r.out, /SIN INTEGRAR/);
    assert.deepEqual(last(dir).pending, [PAGE]);
    assert.deepEqual(last(dir).blocking, [PAGE]);
    // 3 · registrar sin resolverlo falla
    r = run(dir, 'design-diff.mjs', '--record', '--confirm', 'todo');
    assert.equal(r.code, 2, r.out);
    assert.match(r.out, /sin integrar/);
    // 4 · descartar exige un motivo
    r = run(dir, 'design-diff.mjs', '--record', '--discard', PAGE);
    assert.notEqual(r.code, 0);
    assert.match(r.out, /--reason/);
    // 5 · integrarlo en el repo: queda por confirmar y hay que confirmarlo a propósito
    writeFileSync(path.join(dir, PAGE), readFileSync(path.join(dir, PAGE), 'utf8') + '\n<!-- integrado -->\n');
    r = run(dir, 'design-diff.mjs', '--manifest', writeM(dir, await manifestFor(dir, nonce, nuevo)));
    assert.equal(r.code, 2, r.out);
    assert.deepEqual(last(dir).needsConfirm, [PAGE]);
    r = run(dir, 'design-diff.mjs', '--record');
    assert.equal(r.code, 2, r.out);
    assert.match(r.out, /faltan por confirmar/);
    r = run(dir, 'design-diff.mjs', '--record', '--confirm', 'todo');
    assert.equal(r.code, 0, r.out);
    assert.deepEqual(last(dir).blocking, []);
    // 6 · otro cambio de Claude Design, esta vez descartado a propósito
    const m2 = writeM(dir, await manifestFor(dir, nonce, {[PAGE]: H('otro cambio')}));
    r = run(dir, 'design-diff.mjs', '--manifest', m2);
    assert.equal(r.code, 2, r.out);
    r = run(dir, 'design-diff.mjs', '--record', '--discard', PAGE, '--reason', 'prueba descartada por el owner');
    assert.equal(r.code, 0, r.out);
    const b2 = JSON.parse(readFileSync(path.join(dir, 'design-baseline.json'), 'utf8'));
    assert.equal(b2.discarded.length, 1);
    assert.equal(b2.discarded[0].reason, 'prueba descartada por el owner');
    run(dir, 'design-diff.mjs', '--manifest', m2);
    assert.equal(last(dir).discarded.length, 1);
    assert.deepEqual(last(dir).blocking, []);
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test('design-diff --record descarta varias rutas a la vez con un único motivo', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-prot-'));
  cpSync(root, dir, {recursive: true, filter: p => !EXCLUDE.test(p)});
  ensurePage(dir);
  try {
    const nonce = nonceOf(run(dir, 'design-diff.mjs', '--request').out);
    const A = 'pruebas/a.dc.html', B = 'pruebas/b con espacio.dc.html';
    const mf = await manifestFor(dir, nonce);
    Object.assign(mf.files, {[A]: H('a'), [B]: H('b')});
    const m = writeM(dir, mf);
    let r = run(dir, 'design-diff.mjs', '--manifest', m);
    assert.equal(r.code, 2, r.out);
    assert.deepEqual(last(dir).newInDesign.sort(), [A, B]);
    r = run(dir, 'design-diff.mjs', '--record', '--confirm', 'todo', '--discard', A, '--reason', 'prueba');
    assert.equal(r.code, 2, r.out);
    r = run(dir, 'design-diff.mjs', '--record', '--confirm', 'todo', '--discard', A, '--discard', B, '--reason', 'evidencia que Design conserva');
    assert.equal(r.code, 0, r.out);
    const b = JSON.parse(readFileSync(path.join(dir, 'design-baseline.json'), 'utf8'));
    assert.deepEqual(b.discarded.map(d => d.path).sort(), [A, B]);
    run(dir, 'design-diff.mjs', '--manifest', m);
    assert.deepEqual(last(dir).blocking, []);
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test('El control previo al push bloquea si falta la comparación, si está vencida o si hay trabajo sin integrar', () => {
  inCopy(dir => {
    const hook = env => { const r = spawnSync(process.execPath, ['scripts/pre-push-check.mjs'], {cwd: dir, encoding: 'utf8', env: {...process.env, ...env}}); return {code: r.status, out: r.stdout + r.stderr}; };
    const put = o => { mkdirSync(path.join(dir, '.dsbook'), {recursive: true}); writeFileSync(path.join(dir, '.dsbook/last-diff.json'), JSON.stringify(o)); };
    let r = hook({});
    assert.equal(r.code, 1); assert.match(r.out, /No hay una comparación con Claude Design/);
    put({at: new Date().toISOString(), blocking: []});
    r = hook({}); assert.equal(r.code, 0, r.out);
    put({at: new Date(Date.now() - 48 * 36e5).toISOString(), blocking: []});
    r = hook({}); assert.equal(r.code, 1); assert.match(r.out, /hace 48 h/);
    put({at: new Date().toISOString(), blocking: ['sections/a/b.dc.html']});
    r = hook({}); assert.equal(r.code, 1); assert.match(r.out, /sections\/a\/b\.dc\.html/);
    r = hook({DSBOOK_SKIP_DESIGN_CHECK: '1'}); assert.equal(r.code, 0); assert.match(r.out, /se omite/);
  });
});

test('handoff-note no avisa con trabajo de Claude Design sin integrar, y avisa si no hubo comparación', () => {
  inCopy(dir => {
    writeFileSync(path.join(dir, 'sections/zzz.txt'), 'x');
    let r = run(dir, 'handoff-note.mjs', '--base', 'HEAD');
    assert.equal(r.code, 0, r.out);
    assert.match(readFileSync(path.join(dir, 'handoff-last.md'), 'utf8'), /Sin comprobar con Claude Design/);
    mkdirSync(path.join(dir, '.dsbook'), {recursive: true});
    writeFileSync(path.join(dir, '.dsbook/last-diff.json'), JSON.stringify({at: new Date().toISOString(), pending: ['p.dc.html'], needsConfirm: [], newInDesign: [], repoAhead: [], repoOnly: [], blocking: ['p.dc.html']}));
    r = run(dir, 'handoff-note.mjs', '--base', 'HEAD');
    assert.notEqual(r.code, 0);
    assert.match(r.out, /sin integrar o sin confirmar: p\.dc\.html/);
    r = run(dir, 'handoff-note.mjs', '--base', 'HEAD', '--force');
    assert.equal(r.code, 0, r.out);
    assert.match(readFileSync(path.join(dir, 'handoff-last.md'), 'utf8'), /protege tu trabajo/);
  }, {git: true});
});
