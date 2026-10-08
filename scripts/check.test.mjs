import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guide = JSON.parse(readFileSync(path.join(root, 'data/guide.json'), 'utf8'));
const items = new Map(guide.categories.flatMap(c => c.items.map(i => [i.id, i])));
const page = 'sections/visuales/color.dc.html';

// Copia del repo en un directorio temporal para mutarla sin tocar el original.
function sandbox(mutate) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-check-'));
  cpSync(root, dir, {recursive: true, filter: p => !/[\\/](\.git|node_modules|\.claude)([\\/]|$)/.test(p)});
  try {
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
  const r = sandbox();
  assert.equal(r.code, 0, r.out);
});

test('sc-for dentro de elementos de tabla falla', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('<sc-for list="{{ roles }}"', '<table><tbody><sc-for list="{{ roles }}"'))), 'dentro de <tbody>');
});

test('Falta cargar el runtime antes de support.js', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace(/<script src="\.\.\/\.\.\/assets\/_runtime\/react-dom[^>]*><\/script>\s*/, ''))), 'debe cargar assets/_runtime/react-dom.production.min.js');
});

test('Una página .dc.html sin lang="es" falla', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('<html lang="es">', '<html>'))), 'lang="es"');
});

test('Scripts externos en una página .dc.html fallan', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('<script src="./support.js">', '<script src="https://unpkg.com/x.js"></script>\n<script src="./support.js">'))), 'scripts externos');
});

test('No pueden coexistir .html y .dc.html', () => {
  expectFail(sandbox(d => writeFileSync(path.join(d, 'sections/visuales/color.html'), readFileSync(path.join(d, page)))), 'dos páginas');
});

test('Sección en I sin página falla', () => {
  expectFail(sandbox(d => edit(d, 'data/project.json', s => s.replace('"status": "P"', '"status": "I"'))), 'no tiene página');
});

test('La meta ds-section-id debe coincidir con el ID', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('content="visuales.color"', 'content="visuales.otro"'))), 'Meta de identidad ausente');
});

test('El runtime vendorizado debe coincidir con el SHA-384 de support.js', () => {
  expectFail(sandbox(d => edit(d, 'assets/_runtime/react.production.min.js', s => s + '\n//')), 'no coincide con la versión');
});

test('Las copias de support.js deben ser idénticas', () => {
  const id = 'tokens.capas-de-tokens', suggested = items.get(id).suggestedPath.replace(/\.html$/, '.dc.html');
  expectFail(sandbox(d => {
    const html = readFileSync(path.join(d, page), 'utf8').replace('content="visuales.color"', `content="${id}"`);
    mkdirSync(path.dirname(path.join(d, suggested)), {recursive: true});
    writeFileSync(path.join(d, suggested), html);
    writeFileSync(path.join(d, path.dirname(suggested), 'support.js'), readFileSync(path.join(d, 'sections/visuales/support.js'), 'utf8') + '\n//');
  }), 'no son idénticas');
});

test('Una segunda carpeta con copia idéntica de support.js pasa', () => {
  const id = 'tokens.capas-de-tokens', suggested = items.get(id).suggestedPath.replace(/\.html$/, '.dc.html');
  const r = sandbox(d => {
    const html = readFileSync(path.join(d, page), 'utf8').replace('content="visuales.color"', `content="${id}"`);
    mkdirSync(path.dirname(path.join(d, suggested)), {recursive: true});
    writeFileSync(path.join(d, suggested), html);
    writeFileSync(path.join(d, path.dirname(suggested), 'support.js'), readFileSync(path.join(d, 'sections/visuales/support.js')));
  });
  assert.equal(r.code, 0, r.out);
  assert.ok(existsSync(path.join(root, page)));
});
