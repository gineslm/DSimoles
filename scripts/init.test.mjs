import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, mkdtempSync, readFileSync, writeFileSync, readdirSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {validateGuide, validateProject} from '../model.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = (dir, f) => JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
const listing = dir => readdirSync(path.join(dir, 'sections'), {recursive: true}).sort().join('|');

// Ejecuta el equivalente de `npm run init` dentro de una copia temporal del repo.
function run(args, mutate) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-init-'));
  cpSync(root, dir, {recursive: true, filter: p => !/[\\/](\.git|node_modules|.dsbook)([\\/]|$)/.test(p)});
  try {
    mutate?.(dir);
    const before = listing(dir);
    const r = spawnSync(process.execPath, ['scripts/init.mjs', ...args], {cwd: dir, encoding: 'utf8'});
    return {code: r.status, out: r.stdout + r.stderr, project: json(dir, 'data/project.json'), guide: json(dir, 'data/guide.json'), sectionsUntouched: before === listing(dir)};
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
}

test('init sin argumentos imprime el uso y falla', () => {
  const r = run([]);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /uso: npm run init/);
});

test('init se niega a sobrescribir un proyecto que ya tiene identidad propia', () => {
  const r = run(['--id', 'other-ds', '--name', 'Other DS'], dir => {
    const p = path.join(dir, 'data/project.json');
    writeFileSync(p, JSON.stringify({...json(dir, 'data/project.json'), projectId: 'existing-ds'}, null, 2));
  });
  assert.notEqual(r.code, 0);
  assert.match(r.out, /ya pertenece al proyecto "existing-ds"/);
  assert.equal(r.project.projectId, 'existing-ds');
});

test('init --force inicia un proyecto nuevo desde el seed y no toca sections/', () => {
  const r = run(['--id', 'other-ds', '--name', 'Other DS', '--force']);
  assert.equal(r.code, 0, r.out);
  assert.equal(r.project.projectId, 'other-ds');
  assert.equal(r.project.name, 'Other DS');
  assert.equal(r.project.language, 'es');
  assert.equal(r.project.seedVersion, r.guide.version);
  assert.equal(validateGuide(r.guide), true);
  assert.equal(validateProject(r.project, r.guide), true);
  assert.ok(Object.values(r.project.sections).every(s => s.status === 'P' && !s.owner && !s.notes && s.tasks.length === 0));
  assert.equal(r.sectionsUntouched, true);
});

test('init funciona sin --force mientras data/ aún lleve la identidad del seed', () => {
  const r = run(['--id', 'first-ds', '--name', 'First DS', '--language', 'en'], dir => {
    writeFileSync(path.join(dir, 'data/project.json'), readFileSync(path.join(dir, 'seed/project.json')));
  });
  assert.equal(r.code, 0, r.out);
  assert.equal(r.project.projectId, 'first-ds');
  assert.equal(r.project.language, 'en');
});

test('init rechaza un ID de proyecto no válido', () => {
  const r = run(['--id', 'Bad ID', '--name', 'X', '--force']);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Identidad/);
});
