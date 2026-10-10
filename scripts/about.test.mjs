// The logic behind the Framework page: its route, the repository fields and the update comparisons.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateGuide, validateProject, parseRoute, routeHash, breadcrumb, parseRepo, compareVersions, frameworkStatus, shaFromGit, commitState} from '../model.js';

const guide = JSON.parse(await readFile(new URL('../data/guide.json', import.meta.url)));
const base = JSON.parse(await readFile(new URL('../data/project.json', import.meta.url)));
const route = h => parseRoute(h, guide);

test('The framework page is a route of its own', () => {
  assert.deepEqual(route('#/framework'), {name: 'framework'});
  assert.equal(route('#/framework/info').name, 'notfound');
  assert.equal(routeHash(route('#/framework')), '#/framework');
  assert.deepEqual(breadcrumb(guide, route('#/framework'), 'Example DS'), [{label: 'Example DS', hash: '#/'}, {label: 'DSBook framework'}]);
});

test('A category cannot take the ID of the framework page', () => {
  const g = structuredClone(guide);
  g.categories[0].id = 'framework';
  g.categories[0].items.forEach(i => {
    i.id = i.id.replace(/^[^.]+/, 'framework');
    i.suggestedPath = i.suggestedPath.replace(/^sections\/[^/]+\//, 'sections/framework/');
  });
  assert.throws(() => validateGuide(g), /Reserved category ID/);
});

test('The project repository is optional and must be a GitHub URL', () => {
  const p = structuredClone(base);
  p.repository = 'https://github.com/someone/ds-project';
  assert.equal(validateProject(p, guide), true);
  for (const bad of ['http://github.com/a/b', 'https://example.com/a/b', 'https://github.com/a', 'github.com/a/b', 42]) {
    assert.throws(() => validateProject({...p, repository: bad}, guide), /Invalid repository/, String(bad));
  }
  assert.deepEqual(parseRepo('https://github.com/gineslm/DSbook.git/'), {owner: 'gineslm', repo: 'DSbook'});
  assert.equal(parseRepo('https://github.com/a/b/c'), null);
});

test('Framework status: update, ahead, diverged or current', () => {
  const m = (version, files) => ({version, files});
  assert.equal(compareVersions('1.10.0', '1.2.0'), 1);
  assert.equal(compareVersions('1.0.0', '1.0.0'), 0);
  assert.equal(compareVersions('0.9.9', '1.0.0'), -1);
  assert.deepEqual(frameworkStatus(m('1.0.0', {a: '1'}), m('1.1.0', {a: '2', b: '3'})), {state: 'update', differ: ['a', 'b'], local: '1.0.0', remote: '1.1.0'});
  assert.equal(frameworkStatus(m('1.2.0', {a: '1'}), m('1.1.0', {a: '1'})).state, 'ahead');
  assert.equal(frameworkStatus(m('1.1.0', {a: '1'}), m('1.1.0', {a: '2'})).state, 'diverged');
  assert.equal(frameworkStatus(m('1.1.0', {a: '1'}), m('1.1.0', {a: '1'})).state, 'current');
});

test('The local commit is read from .git and the GitHub comparison is interpreted', () => {
  const a = 'a'.repeat(40), b = 'b'.repeat(40);
  assert.equal(shaFromGit(a + '\n'), a);
  assert.equal(shaFromGit('ref: refs/heads/main\n', b + '\n', ''), b);
  assert.equal(shaFromGit('ref: refs/heads/main', null, '# pack-refs\n' + a + ' refs/heads/main\n' + b + ' refs/heads/other\n'), a);
  assert.equal(shaFromGit('ref: refs/heads/main', null, ''), null);
  assert.equal(shaFromGit(null), null);
  assert.deepEqual(commitState({status: 'identical'}), {state: 'current'});
  assert.deepEqual(commitState({status: 'ahead', ahead_by: 2}), {state: 'update', count: 2});
  assert.deepEqual(commitState({status: 'behind', behind_by: 1}), {state: 'unpushed', count: 1});
  assert.deepEqual(commitState({status: 'diverged'}), {state: 'diverged'});
  assert.deepEqual(commitState(null), {state: 'unpushed'});
});
