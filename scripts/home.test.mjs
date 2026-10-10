// The home page as a record: its three views, the project's own record and the tasks gathered from every section.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateGuide, validateProject, validateTasks, parseRoute, routeHash, breadcrumb, homeView, projectRecord, collectTasks} from '../model.js';

const guide = JSON.parse(await readFile(new URL('../data/guide.json', import.meta.url)));
const base = JSON.parse(await readFile(new URL('../data/project.json', import.meta.url)));
const route = h => parseRoute(h, guide);
const copy = () => structuredClone(base);
// A project with no N sections and no tasks, so each test controls exactly what it checks.
const clean = () => {
  const p = copy();
  delete p.record;
  for (const s of Object.values(p.sections)) { s.status = 'P'; s.exclusionReason = ''; s.tasks = []; }
  return p;
};
const ids = guide.categories.flatMap(c => c.items.map(i => i.id));

test('The home page has three views at #/home/<view>; #/ is its summary', () => {
  assert.deepEqual(route('#/'), {name: 'home'});
  assert.deepEqual(route('#/home'), {name: 'home'});
  for (const v of ['content', 'info', 'record']) assert.deepEqual(route(`#/home/${v}`), {name: 'home', view: v});
  for (const bad of ['#/home/other', '#/home/record/x', '#/home/guide']) assert.equal(route(bad).name, 'notfound', bad);
  assert.equal(routeHash({name: 'home'}), '#/');
  assert.equal(routeHash({name: 'home', view: 'record'}), '#/home/record');
  assert.equal(homeView({name: 'home'}), 'content');
  assert.equal(homeView({name: 'home', view: 'info'}), 'info');
  assert.deepEqual(breadcrumb(guide, {name: 'home', view: 'record'}, 'Example DS'), [{label: 'Example DS'}]);
});

test('Category 5 is called content and still reaches its list at #/content', () => {
  assert.deepEqual(route('#/content'), {name: 'category', id: 'content'});
});

test('"home" and "framework" are reserved category IDs', () => {
  for (const reserved of ['home', 'framework']) {
    const g = structuredClone(guide);
    g.categories[0].id = reserved;
    g.categories[0].items.forEach(i => {
      i.id = i.id.replace(/^[^.]+/, reserved);
      i.suggestedPath = i.suggestedPath.replace(/^sections\/[^/]+\//, `sections/${reserved}/`);
    });
    assert.throws(() => validateGuide(g), /Reserved category ID/, reserved);
  }
});

test('Section tasks and project tasks share one shape', () => {
  assert.equal(validateTasks([]), true);
  assert.equal(validateTasks([{text: 'Do it', when: 'pending'}, {text: 'Later', when: 'future'}]), true);
  for (const bad of [null, {}, [{text: 'x'}], [{text: '', when: 'pending'}], [{text: 'x', when: 'soon'}], [{text: 'x', when: 'pending', owner: 'me'}], ['x']]) {
    assert.equal(validateTasks(bad), false, JSON.stringify(bad));
  }
});

test('The project record is optional, strict and reuses the task shape', () => {
  const p = clean();
  assert.equal(validateProject(p, guide), true);
  assert.deepEqual(projectRecord(p), {owner: '', notes: '', tasks: []});
  p.record = {owner: 'Someone', notes: 'Context', tasks: [{text: 'Unlink the loaded design system', when: 'pending'}]};
  assert.equal(validateProject(p, guide), true);
  assert.equal(projectRecord(p).owner, 'Someone');
  for (const bad of [{owner: '', notes: ''}, {owner: '', notes: '', tasks: [{text: 'x', when: 'maybe'}]}, {owner: 1, notes: '', tasks: []}, {owner: '', notes: '', tasks: [], status: 'R'}, null, 'text']) {
    assert.throws(() => validateProject({...p, record: bad}, guide), /Invalid project record/, JSON.stringify(bad));
  }
});

test('A Not applicable section cannot have tasks; the other statuses can', () => {
  for (const status of ['P', 'I']) {
    const p = clean();
    p.sections[ids[0]].status = status;
    p.sections[ids[0]].tasks = [{text: 'Something to do', when: 'pending'}];
    assert.equal(validateProject(p, guide), true, status);
  }
  const r = clean();
  r.sections[ids[0]].status = 'R';
  r.sections[ids[0]].review = {by: 'Reviewer', date: '2026-10-10', evidence: 'Recorded'};
  r.sections[ids[0]].tasks = [{text: 'A later improvement', when: 'future'}];
  assert.equal(validateProject(r, guide), true, 'tasks never block Ready');
  const n = clean();
  n.sections[ids[0]].status = 'N';
  n.sections[ids[0]].exclusionReason = 'Out of scope';
  n.sections[ids[0]].tasks = [{text: 'Something to do', when: 'pending'}];
  assert.throws(() => validateProject(n, guide), /cannot have tasks.*reopen/);
  n.sections[ids[0]].tasks = [];
  assert.equal(validateProject(n, guide), true);
});

test('Tasks are gathered from every section, grouped by category, without filtering', () => {
  const p = clean();
  assert.deepEqual(collectTasks(guide, p), [], 'no tasks anywhere');
  const a = guide.categories[0].items[1].id, b = guide.categories[2].items[0].id, c = guide.categories[2].items[3].id;
  p.sections[a].tasks = [{text: 'A1', when: 'pending'}, {text: 'A2', when: 'future'}];
  p.sections[b].tasks = [{text: 'B1', when: 'future'}];
  p.sections[c].status = 'N'; p.sections[c].exclusionReason = 'Out of scope';
  const all = collectTasks(guide, p);
  assert.deepEqual(all.map(g => g.category.id), [guide.categories[0].id, guide.categories[2].id], 'only categories with tasks, in catalog order');
  assert.deepEqual(all[0].sections.map(s => s.item.id), [a]);
  assert.deepEqual(all[0].sections[0].pending.map(t => t.text), ['A1']);
  assert.deepEqual(all[0].sections[0].future.map(t => t.text), ['A2']);
  assert.deepEqual(all[1].sections.map(s => s.item.id), [b]);
});

test('The real project passes its own contract with the record in it', () => {
  assert.equal(validateProject(base, guide), true);
});
