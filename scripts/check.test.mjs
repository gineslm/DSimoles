import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guide = JSON.parse(readFileSync(path.join(root, 'data/guide.json'), 'utf8'));
const items = new Map(guide.categories.flatMap(c => c.items.map(i => [i.id, i])));
const page = 'sections/visuals/color.dc.html';

// Copy of the repo in a temporary directory so it can be mutated without touching the original.
// Unless `asIs` is set, the fixture page and support.js are installed first, so these tests do not
// depend on the project having developed any page (a fresh DSBook has none).
function sandbox(mutate, {asIs = false} = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-check-'));
  cpSync(root, dir, {recursive: true, filter: p => !/[\\/](\.git|node_modules|\.claude)([\\/]|$)/.test(p)});
  try {
    if (!asIs) {
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

test('The repository as is passes check', () => {
  const r = sandbox(undefined, {asIs: true});
  assert.equal(r.code, 0, r.out);
});

test('A repository with the fixture page passes check', () => {
  const r = sandbox();
  assert.equal(r.code, 0, r.out);
});

test('sc-for inside table elements fails', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('<sc-for list="{{ roles }}"', '<table><tbody><sc-for list="{{ roles }}"'))), 'inside <tbody>');
});

test('Missing runtime before support.js fails', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace(/<script src="\.\.\/\.\.\/assets\/_runtime\/react-dom[^>]*><\/script>\s*/, ''))), 'must load assets/_runtime/react-dom.production.min.js');
});

test('A page image that does not exist fails', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('"src": ""', '"src": "../../assets/visuals/color/no-existe.png"'))), 'cites an image that does not exist');
});

test('A .dc.html page without lang="en" fails', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('<html lang="en">', '<html>'))), 'lang="en"');
});

test('External scripts in a .dc.html page fail', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('<script src="./support.js">', '<script src="https://unpkg.com/x.js"></script>\n<script src="./support.js">'))), 'external scripts');
});

test('.html and .dc.html cannot coexist', () => {
  expectFail(sandbox(d => writeFileSync(path.join(d, 'sections/visuals/color.html'), readFileSync(path.join(d, page)))), 'two pages');
});

test('A section in I without a page fails', () => {
  expectFail(sandbox(d => edit(d, 'data/project.json', s => s.replace('"status": "P"', '"status": "I"'))), 'has no page');
});

test('The ds-section-id meta must match the ID', () => {
  expectFail(sandbox(d => edit(d, page, s => s.replace('content="visuals.color"', 'content="visuals.other"'))), 'Identity meta missing');
});

test('The vendored runtime must match the SHA-384 declared by support.js', () => {
  expectFail(sandbox(d => edit(d, 'assets/_runtime/react.production.min.js', s => s + '\n//')), 'does not match the version');
});

test('The support.js copies must be identical', () => {
  const id = 'tokens.token-layers', suggested = items.get(id).suggestedPath.replace(/\.html$/, '.dc.html');
  expectFail(sandbox(d => {
    const html = readFileSync(path.join(d, page), 'utf8').replace('content="visuals.color"', `content="${id}"`);
    mkdirSync(path.dirname(path.join(d, suggested)), {recursive: true});
    writeFileSync(path.join(d, suggested), html);
    writeFileSync(path.join(d, path.dirname(suggested), 'support.js'), readFileSync(path.join(d, 'sections/visuals/support.js'), 'utf8') + '\n//');
  }), 'are not identical');
});

test('A second folder with an identical support.js copy passes', () => {
  const id = 'tokens.token-layers', suggested = items.get(id).suggestedPath.replace(/\.html$/, '.dc.html');
  const r = sandbox(d => {
    const html = readFileSync(path.join(d, page), 'utf8').replace('content="visuals.color"', `content="${id}"`);
    mkdirSync(path.dirname(path.join(d, suggested)), {recursive: true});
    writeFileSync(path.join(d, suggested), html);
    writeFileSync(path.join(d, path.dirname(suggested), 'support.js'), readFileSync(path.join(d, 'sections/visuals/support.js')));
  });
  assert.equal(r.code, 0, r.out);
});

test('The seed must start empty and Pending', () => {
  expectFail(sandbox(d => edit(d, 'seed/project.json', s => s.replace('"status": "P"', '"status": "I"'))), 'seed/');
});

test('Duplicate subsection IDs in the guide fail', () => {
  expectFail(sandbox(d => edit(d, 'data/guide.json', s => s.replace('"id": "foundations.system-users"', '"id": "foundations.goals-and-usage-guide"'))), 'Duplicate subsection ID');
});

test('A project entry without a subsection in the guide fails', () => {
  expectFail(sandbox(d => edit(d, 'data/project.json', s => s.replace('"foundations.glossary"', '"foundations.ghost"'))), 'Missing section entry');
});
