import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guide = JSON.parse(readFileSync(path.join(root, 'data/guide.json'), 'utf8'));
const items = new Map(guide.categories.flatMap(c => c.items.map(i => [i.id, i])));
const page = 'sections/visuals/color.dc.html';

// Copia del repo en un directorio temporal para poder mutarla sin tocar el original.
// Salvo que se indique `asIs`, se parte de un proyecto vacío (seed) y se instalan la página fixture y support.js, de modo que
// estas pruebas no dependan de las páginas ni de los estados que haya desarrollado el proyecto (un DSBook nuevo no tiene ninguna).
function sandbox(mutate, {asIs = false} = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-check-'));
  cpSync(root, dir, {recursive: true, filter: p => !/[\\/](\.git|node_modules|.dsbook)([\\/]|$)/.test(p)});
  try {
    if (!asIs) {
      // Un proyecto con páginas propias no debe influir: se parte de sections/ vacío y del proyecto del seed (todo en Pending).
      for (const e of readdirSync(path.join(dir, 'sections'), {withFileTypes: true})) if (e.isDirectory()) rmSync(path.join(dir, 'sections', e.name), {recursive: true, force: true});
      cpSync(path.join(root, 'seed/project.json'), path.join(dir, 'data/project.json'));
      mkdirSync(path.join(dir, 'sections/visuals'), {recursive: true});
      cpSync(path.join(root, 'scripts/fixtures/page.dc.html'), path.join(dir, page));
      cpSync(path.join(root, 'scripts/fixtures/support.js'), path.join(dir, 'sections/visuals/support.js'));
    }
    mutate?.(dir);
    const r = spawnSync(process.execPath, ['scripts/check.mjs'], {cwd: dir, encoding: 'utf8'});
    return {code: r.status, out: r.stdout + r.stderr};
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
}
const edit = (dir, file, fn) => { const p = path.join(dir, file); writeFileSync(p, fn(readFileSync(p, 'utf8'))); };
const expectFail = (r, text) => { assert.notEqual(r.code, 0, r.out); assert.ok(r.out.includes(text), `Esperaba «${text}» en:\n${r.out}`); };

test('El repositorio tal cual pasa check', () => {
  const r = sandbox(undefined, {asIs: true});
  assert.equal(r.code, 0, r.out);
});

test('Un repositorio con la página fixture pasa check', () => {
  const r = sandbox();
  assert.equal(r.code, 0, r.out);
});

test('sc-for dentro de elementos de tabla falla', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('<sc-for list="{{ roles }}"', '<table><tbody><sc-for list="{{ roles }}"'))), 'dentro de <tbody>');
});

test('Falta el runtime antes de support.js: falla', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace(/<script src="\.\.\/\.\.\/assets\/_runtime\/react-dom[^>]*><\/script>\s*/, ''))), 'debe cargar assets/_runtime/react-dom.production.min.js');
});

test('Una imagen de página que no existe falla', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('"src": ""', '"src": "../../assets/visuals/color/no-existe.png"'))), 'cita una imagen que no existe');
});

test('Una página .dc.html sin lang="es" falla', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('<html lang="es">', '<html>'))), 'lang="es"');
});

test('Los scripts externos en una página .dc.html fallan', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('<script src="./support.js">', '<script src="https://unpkg.com/x.js"></script>\n<script src="./support.js">'))), 'scripts externos');
});

test('.html y .dc.html no pueden coexistir', () => {
  expectFail(sandbox(d => writeFileSync(path.join(d, 'sections/visuals/color.html'), readFileSync(path.join(d, page)))), 'dos páginas');
});

test('Una sección en I sin página falla', () => {
  expectFail(sandbox(d => edit(d, 'data/project.json', s => s.replace('"status": "P"', '"status": "I"'))), 'no tiene página');
});

test('La meta ds-section-id debe coincidir con el ID', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('content="visuals.color"', 'content="visuals.other"'))), 'Falta la meta de identidad');
});

test('El runtime vendorizado debe coincidir con el SHA-384 que declara support.js', () => {
  expectFail(sandbox(d => edit(d, 'assets/_runtime/react.production.min.js', s => s + '\n//')), 'no coincide con la versión');
});

test('Las copias de support.js deben ser idénticas', () => {
  const id = 'tokens.token-layers', suggested = items.get(id).suggestedPath.replace(/\.html$/, '.dc.html');
  expectFail(sandbox(d => {
    const html = readFileSync(path.join(d, page), 'utf8').replace('content="visuals.color"', `content="${id}"`);
    mkdirSync(path.dirname(path.join(d, suggested)), {recursive: true});
    writeFileSync(path.join(d, suggested), html);
    writeFileSync(path.join(d, path.dirname(suggested), 'support.js'), readFileSync(path.join(d, 'sections/visuals/support.js'), 'utf8') + '\n//');
  }), 'no son idénticas');
});

test('Una segunda carpeta con una copia idéntica de support.js pasa', () => {
  const id = 'tokens.token-layers', suggested = items.get(id).suggestedPath.replace(/\.html$/, '.dc.html');
  const r = sandbox(d => {
    const html = readFileSync(path.join(d, page), 'utf8').replace('content="visuals.color"', `content="${id}"`);
    mkdirSync(path.dirname(path.join(d, suggested)), {recursive: true});
    writeFileSync(path.join(d, suggested), html);
    writeFileSync(path.join(d, path.dirname(suggested), 'support.js'), readFileSync(path.join(d, 'sections/visuals/support.js')));
  });
  assert.equal(r.code, 0, r.out);
});

test('El seed debe empezar vacío y en Pending', () => {
  expectFail(sandbox(d => edit(d, 'seed/project.json', s => s.replace('"status": "P"', '"status": "I"'))), 'seed/');
});

test('Los IDs de subsección duplicados en la guía fallan', () => {
  expectFail(sandbox(d => edit(d, 'data/guide.json', s => s.replace('"id": "foundations.system-users"', '"id": "foundations.goals-and-usage-guide"'))), 'ID de subsección duplicado');
});

test('Una entrada de proyecto sin subsección en la guía falla', () => {
  expectFail(sandbox(d => edit(d, 'data/project.json', s => s.replace('"foundations.glossary"', '"foundations.ghost"'))), 'Falta la entrada de sección');
});
