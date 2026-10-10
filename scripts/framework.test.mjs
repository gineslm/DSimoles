import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Runs a script in a temporary copy of the repo so the original is never touched.
function inCopy(fn) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsbook-fw-'));
  cpSync(root, dir, {recursive: true, filter: p => !/[\/](\.git|node_modules|\.claude)([\/]|$)/.test(p)});
  try { return fn(dir); } finally { rmSync(dir, {recursive: true, force: true}); }
}
const run = (dir, script, ...args) => { const r = spawnSync(process.execPath, [`scripts/${script}`, ...args], {cwd: dir, encoding: 'utf8'}); return {code: r.status, out: r.stdout + r.stderr}; };
const manifest = dir => JSON.parse(readFileSync(path.join(dir, 'dsbook.json'), 'utf8'));

test('The framework files match the recorded version', () => {
  const r = run(root, 'framework.mjs');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /DSBook framework \d+\.\d+\.\d+/);
});

test('Changing a framework file makes the report and check fail', () => {
  inCopy(dir => {
    writeFileSync(path.join(dir, 'app.js'), readFileSync(path.join(dir, 'app.js'), 'utf8') + '\n//');
    const r = run(dir, 'framework.mjs');
    assert.notEqual(r.code, 0); assert.match(r.out, /changed: app\.js/);
    const c = run(dir, 'check.mjs');
    assert.notEqual(c.code, 0); assert.match(c.out, /npm run framework -- --release/);
  });
});

test('Line endings do not change the hash', () => {
  inCopy(dir => {
    const f = path.join(dir, 'docs/handoff.md');
    writeFileSync(f, readFileSync(f, 'utf8').replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'));
    assert.equal(run(dir, 'framework.mjs').code, 0);
  });
});

test('A project\'s own files are not part of the framework', () => {
  inCopy(dir => {
    writeFileSync(path.join(dir, 'README.md'), 'Another project\n');
    writeFileSync(path.join(dir, 'CHANGELOG.md'), 'Another project\n');
    assert.equal(run(dir, 'framework.mjs').code, 0);
  });
});

test('A file added to the framework folders must be recorded', () => {
  inCopy(dir => {
    writeFileSync(path.join(dir, 'scripts/extra.mjs'), '// new\n');
    const r = run(dir, 'framework.mjs');
    assert.notEqual(r.code, 0); assert.match(r.out, /not in the manifest: scripts\/extra\.mjs/);
  });
});

test('--release records a new version and makes the files match again', () => {
  inCopy(dir => {
    writeFileSync(path.join(dir, 'styles.css'), readFileSync(path.join(dir, 'styles.css'), 'utf8') + '\n/* x */');
    const r = run(dir, 'framework.mjs', '--release', '9.8.7');
    assert.equal(r.code, 0, r.out);
    assert.equal(manifest(dir).version, '9.8.7');
    assert.equal(run(dir, 'framework.mjs').code, 0);
    assert.equal(run(dir, 'check.mjs').code, 0);
  });
});

test('--release rejects a version that is not MAJOR.MINOR.PATCH', () => {
  inCopy(dir => {
    const r = run(dir, 'framework.mjs', '--release', 'v2');
    assert.notEqual(r.code, 0); assert.match(r.out, /Invalid version/);
  });
});

test('--compare tells identical and different repositories apart', () => {
  inCopy(dir => {
    assert.equal(run(dir, 'framework.mjs', '--compare', root).code, 0);
    writeFileSync(path.join(dir, 'model.js'), readFileSync(path.join(dir, 'model.js'), 'utf8') + '\n//');
    run(dir, 'framework.mjs', '--release', '1.0.1');
    const r = run(dir, 'framework.mjs', '--compare', root);
    assert.notEqual(r.code, 0); assert.match(r.out, /versions differ/); assert.match(r.out, /model\.js/);
  });
});
