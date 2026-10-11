// `design-diff` y `handoff-note`: clasificación por tipo, comparación con una copia de Claude Design y el aviso generado.
import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {classify, structureChanged, changedSectionIds, diffTrees} from './handoff-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guide = JSON.parse(readFileSync(path.join(root, 'data/guide.json'), 'utf8'));
const fwFiles = new Set(['app.js', 'docs/handoff.md', 'scripts/check.mjs', 'seed/guide.json']);

test('Cada archivo se clasifica por tipo', () => {
  const c = p => classify(p, {frameworkFiles: fwFiles});
  assert.equal(c('app.js'), 'framework');
  assert.equal(c('dsbook.json'), 'framework');
  assert.equal(c('docs/handoff.md'), 'framework');
  assert.equal(c('docs/proposals/pilot-6.md'), 'proyecto');
  assert.equal(c('CLAUDE.md'), 'proyecto');
  assert.equal(c('handoff-last.md'), 'proyecto');
  assert.equal(c('sections/README.md'), 'proyecto');
  assert.equal(c('sections/visuals/color.dc.html'), 'diseno');
  assert.equal(c('sections/visuals/support.js'), 'diseno');
  assert.equal(c('assets/visuals/color/p.svg'), 'diseno');
  assert.equal(c('assets/_runtime/react.production.min.js'), 'otros');
  assert.equal(c('data/project.json'), 'diseno');
  assert.equal(classify('data/guide.json', {structural: true}), 'estructura');
  assert.equal(classify('data/guide.json', {structural: false}), 'diseno');
  assert.equal(c('algo.txt'), 'otros');
});

test('Un cambio de texto en la guía no es estructural; un ID, un número o una ruta nuevos sí', () => {
  const g = structuredClone(guide);
  g.categories[0].items[0].title = 'Otro título';
  assert.equal(structureChanged(guide, g), false);
  const n = structuredClone(guide);
  n.categories[0].items[0].number = '9.9';
  assert.equal(structureChanged(guide, n), true);
  const r = structuredClone(guide);
  r.categories[0].items.pop();
  assert.equal(structureChanged(guide, r), true);
});

test('Se detectan las entradas de proyecto que difieren', () => {
  const a = {sections: {x: {status: 'P'}, y: {status: 'P'}}}, b = {sections: {x: {status: 'I'}, y: {status: 'P'}, z: {status: 'P'}}};
  assert.deepEqual(changedSectionIds(a, b), ['x', 'z']);
});

test('diffTrees separa lo que solo tiene cada lado y lo que difiere', () => {
  const d = new Map([['a', '1'], ['b', '2'], ['c', '3']]), r = new Map([['a', '1'], ['b', 'X'], ['d', '4']]);
  assert.deepEqual(diffTrees(d, r), {onlyDesign: ['c'], onlyRepo: ['d'], different: ['b']});
});

function inCopy(fn, {git = false} = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-hand-'));
  cpSync(root, dir, {recursive: true, filter: p => !/[\\/](\.git|node_modules|\.claude)([\\/]|$)/.test(p)});
  try {
    if (git) {
      const g = (...a) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...a], {cwd: dir, encoding: 'utf8'});
      g('init', '-q'); g('add', '-A'); g('commit', '-q', '-m', 'base');
      return fn(dir, g);
    }
    return fn(dir);
  } finally { rmSync(dir, {recursive: true, force: true}); }
}
const run = (dir, script, ...args) => { const r = spawnSync(process.execPath, [`scripts/${script}`, ...args], {cwd: dir, encoding: 'utf8'}); return {code: r.status, out: r.stdout + r.stderr}; };

test('design-diff sin argumentos explica el uso y falla', () => {
  const r = run(root, 'design-diff.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /uso: npm run design-diff/);
});

test('design-diff compara una copia de Claude Design y guarda el resultado', () => {
  inCopy(dir => {
    const d = path.join(dir, '..', path.basename(dir) + '-design');
    mkdirSync(path.join(d, 'sections/zzz'), {recursive: true});
    mkdirSync(path.join(d, 'data'), {recursive: true});
    mkdirSync(path.join(d, '_ds'), {recursive: true});
    const guideText = readFileSync(path.join(dir, 'data/guide.json'), 'utf8');
    writeFileSync(path.join(d, 'data/guide.json'), guideText);
    const proj = JSON.parse(readFileSync(path.join(dir, 'data/project.json'), 'utf8'));
    const first = Object.keys(proj.sections)[0];
    proj.sections[first].notes = 'distinto';
    writeFileSync(path.join(d, 'data/project.json'), JSON.stringify(proj, null, 2) + '\n');
    writeFileSync(path.join(d, 'sections/zzz/nueva.dc.html'), '<p>nueva</p>');
    writeFileSync(path.join(d, '_ds/ignorado.css'), 'x');
    try {
      const out = path.join(d, 'resultado.json');
      const r = run(dir, 'design-diff.mjs', d, '--json', out);
      assert.equal(r.code, 1, r.out);
      assert.match(r.out, /Solo en Claude Design/);
      assert.match(r.out, /sections\/zzz\/nueva\.dc\.html/);
      assert.match(r.out, /Con contenido distinto/);
      assert.match(r.out, new RegExp(`Entradas de data/project\\.json que difieren \\(1\\): ${first.replace('.', '\\.')}`));
      assert.doesNotMatch(r.out, /_ds\/ignorado/, 'lo que no se transfiere se ignora');
      const j = JSON.parse(readFileSync(out, 'utf8'));
      assert.deepEqual(j.onlyDesign, ['sections/zzz/nueva.dc.html']);
      assert.deepEqual(j.different, ['data/project.json']);
      assert.equal(j.mode, 'content');
    } finally { rmSync(d, {recursive: true, force: true}); }
  });
});

test('design-diff --listing compara solo las rutas', () => {
  inCopy(dir => {
    const list = path.join(dir, 'lista.json');
    writeFileSync(list, JSON.stringify({paths: ['data/guide.json', 'sections/zzz/nueva.dc.html', 'sections/zzz', '_ds/x.css']}));
    const r = run(dir, 'design-diff.mjs', '--listing', list);
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, /solo rutas/);
    assert.match(r.out, /sections\/zzz\/nueva\.dc\.html/);
    assert.doesNotMatch(r.out, /Con contenido distinto/);
  });
});

test('handoff-note agrupa los cambios por tipo y no incluye su propio commit', () => {
  inCopy((dir, g) => {
    writeFileSync(path.join(dir, 'app.js'), readFileSync(path.join(dir, 'app.js'), 'utf8') + '\n// cambio\n');
    mkdirSync(path.join(dir, 'sections/zzz'), {recursive: true});
    writeFileSync(path.join(dir, 'sections/zzz/nueva.dc.html'), '<p>nueva</p>');
    const proj = JSON.parse(readFileSync(path.join(dir, 'data/project.json'), 'utf8'));
    const first = Object.keys(proj.sections)[0];
    proj.sections[first].notes = 'cambiado';
    writeFileSync(path.join(dir, 'data/project.json'), JSON.stringify(proj, null, 2) + '\n');
    writeFileSync(path.join(dir, 'README.md'), readFileSync(path.join(dir, 'README.md'), 'utf8') + '\nmás\n');
    const r = run(dir, 'handoff-note.mjs', '--base', 'HEAD');
    assert.equal(r.code, 0, r.out);
    const md = readFileSync(path.join(dir, 'handoff-last.md'), 'utf8');
    assert.match(md, /^# Aviso de traspaso a Claude Design/);
    assert.match(md, /### Framework\n\n- `app\.js` · modificado/);
    assert.match(md, /### Diseño\n[\s\S]*`data\/project\.json` · modificado — IDs: /);
    assert.match(md, /`sections\/zzz\/nueva\.dc\.html` · nuevo/);
    assert.match(md, /### Proyecto \(documentación\)\n\n- `README\.md`/);
    assert.ok(md.includes(first));
    assert.doesNotMatch(md, /### Estructura/);
    assert.match(md, /base: `[0-9a-f]{12}`/);
  }, {git: true});
});

test('handoff-note detecta un cambio de estructura y marca lo hecho en Claude Code', () => {
  inCopy((dir, g) => {
    const gp = path.join(dir, 'data/guide.json');
    const gd = JSON.parse(readFileSync(gp, 'utf8'));
    gd.categories[0].items[0].number = '0.99';
    writeFileSync(gp, JSON.stringify(gd, null, 2) + '\n');
    writeFileSync(path.join(dir, 'sections/zzz.txt'), 'x');
    const div = path.join(dir, 'div.json');
    writeFileSync(div, JSON.stringify({generated: '2026-10-11T00:00:00Z', mode: 'content', different: ['sections/zzz.txt'], onlyRepo: [], onlyDesign: []}));
    const r = run(dir, 'handoff-note.mjs', '--base', 'HEAD', '--divergences', div, '--out', 'salida.md');
    assert.equal(r.code, 0, r.out);
    const md = readFileSync(path.join(dir, 'salida.md'), 'utf8');
    assert.match(md, /### Estructura\n\n- `data\/guide\.json`/);
    assert.match(md, /actualizar su mapa de pantallas/);
    assert.match(md, /`sections\/zzz\.txt` · nuevo · hecho en Claude Code/);
    assert.match(md, /## Diferencias con la versión de Claude Design/);
  }, {git: true});
});

test('handoff-note sin cambios no escribe nada', () => {
  inCopy((dir, g) => {
    const r = run(dir, 'handoff-note.mjs', '--base', 'HEAD');
    assert.notEqual(r.code, 0);
    assert.match(r.out, /nada que avisar/);
    assert.equal(existsSync(path.join(dir, 'handoff-last.md')), false);
  }, {git: true});
});
