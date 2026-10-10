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

// Runs `npm run init` equivalent inside a temporary copy of the repo.
function run(args, mutate) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-init-'));
  cpSync(root, dir, {recursive: true, filter: p => !/[\\/](\.git|node_modules|\.claude)([\\/]|$)/.test(p)});
  try {
    mutate?.(dir);
    const before = listing(dir);
    const r = spawnSync(process.execPath, ['scripts/init.mjs', ...args], {cwd: dir, encoding: 'utf8'});
    return {code: r.status, out: r.stdout + r.stderr, project: json(dir, 'data/project.json'), guide: json(dir, 'data/guide.json'), sectionsUntouched: before === listing(dir)};
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
}

test('init without arguments prints the usage and fails', () => {
  const r = run([]);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /usage: npm run init/);
});

test('init refuses to overwrite a project that already has its own identity', () => {
  const r = run(['--id', 'other-ds', '--name', 'Other DS'], dir => {
    const p = path.join(dir, 'data/project.json');
    writeFileSync(p, JSON.stringify({...json(dir, 'data/project.json'), projectId: 'existing-ds'}, null, 2));
  });
  assert.notEqual(r.code, 0);
  assert.match(r.out, /already belongs to the project "existing-ds"/);
  assert.equal(r.project.projectId, 'existing-ds');
});

test('init --force starts a new project from the seed and does not touch sections/', () => {
  const r = run(['--id', 'other-ds', '--name', 'Other DS', '--force']);
  assert.equal(r.code, 0, r.out);
  assert.equal(r.project.projectId, 'other-ds');
  assert.equal(r.project.name, 'Other DS');
  assert.equal(r.project.language, 'en');
  assert.equal(r.project.seedVersion, r.guide.version);
  assert.equal(validateGuide(r.guide), true);
  assert.equal(validateProject(r.project, r.guide), true);
  assert.ok(Object.values(r.project.sections).every(s => s.status === 'P' && !s.owner && !s.notes && s.tasks.length === 0));
  assert.equal(r.sectionsUntouched, true);
});

test('init works without --force while data/ still carries the seed identity', () => {
  const r = run(['--id', 'first-ds', '--name', 'First DS', '--language', 'es'], dir => {
    writeFileSync(path.join(dir, 'data/project.json'), readFileSync(path.join(dir, 'seed/project.json')));
  });
  assert.equal(r.code, 0, r.out);
  assert.equal(r.project.projectId, 'first-ds');
  assert.equal(r.project.language, 'es');
});

test('init rejects an invalid project ID', () => {
  const r = run(['--id', 'Bad ID', '--name', 'X', '--force']);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /identity/);
});
