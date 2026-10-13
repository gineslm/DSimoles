// La home como registro: sus tres vistas, el record propio del proyecto y las tasks reunidas de todas las secciones.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateGuide, validateProject, validateTasks, parseRoute, routeHash, breadcrumb, homeView, projectRecord, collectTasks} from '../model.js';

const guide = JSON.parse(await readFile(new URL('../seed/guide.json', import.meta.url)));
const base = JSON.parse(await readFile(new URL('../seed/project.json', import.meta.url)));
const route = h => parseRoute(h, guide);
const copy = () => structuredClone(base);
// Un proyecto sin secciones N ni tasks, para que cada prueba controle exactamente lo que comprueba.
const clean = () => {
  const p = copy();
  delete p.record;
  for (const s of Object.values(p.sections)) { s.status = 'P'; s.exclusionReason = ''; s.tasks = []; }
  return p;
};
const ids = guide.categories.flatMap(c => c.items.map(i => i.id));

test('La home tiene tres vistas en #/home/<view>; #/ es su resumen', () => {
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

test('La categoría 5 se llama content y sigue llegando a su lista en #/content', () => {
  assert.deepEqual(route('#/content'), {name: 'category', id: 'content'});
});

test('"home" y "framework" son IDs de categoría reservados', () => {
  for (const reserved of ['home', 'framework']) {
    const g = structuredClone(guide);
    g.categories[0].id = reserved;
    g.categories[0].items.forEach(i => {
      i.id = i.id.replace(/^[^.]+/, reserved);
      i.suggestedPath = i.suggestedPath.replace(/^sections\/[^/]+\//, `sections/${reserved}/`);
    });
    assert.throws(() => validateGuide(g), /ID de categoría reservado/, reserved);
  }
});

test('Las tasks de sección y las del proyecto comparten una forma', () => {
  assert.equal(validateTasks([]), true);
  assert.equal(validateTasks([{text: 'Do it', when: 'pending'}, {text: 'Later', when: 'future'}]), true);
  for (const bad of [null, {}, [{text: 'x'}], [{text: '', when: 'pending'}], [{text: 'x', when: 'soon'}], [{text: 'x', when: 'pending', owner: 'me'}], ['x']]) {
    assert.equal(validateTasks(bad), false, JSON.stringify(bad));
  }
});

test('El project record es opcional, estricto y reutiliza la forma de las tasks', () => {
  const p = clean();
  assert.equal(validateProject(p, guide), true);
  assert.deepEqual(projectRecord(p), {owner: '', notes: '', tasks: []});
  p.record = {owner: 'Someone', notes: 'Context', tasks: [{text: 'Unlink the loaded design system', when: 'pending'}]};
  assert.equal(validateProject(p, guide), true);
  assert.equal(projectRecord(p).owner, 'Someone');
  for (const bad of [{owner: '', notes: ''}, {owner: '', notes: '', tasks: [{text: 'x', when: 'maybe'}]}, {owner: 1, notes: '', tasks: []}, {owner: '', notes: '', tasks: [], status: 'R'}, null, 'text']) {
    assert.throws(() => validateProject({...p, record: bad}, guide), /Project record no válido/, JSON.stringify(bad));
  }
});

test('Una sección Not applicable no puede tener tasks; los otros estados sí', () => {
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
  assert.equal(validateProject(r, guide), true, 'las tasks nunca bloquean Ready');
  const n = clean();
  n.sections[ids[0]].status = 'N';
  n.sections[ids[0]].exclusionReason = 'Out of scope';
  n.sections[ids[0]].tasks = [{text: 'Something to do', when: 'pending'}];
  assert.throws(() => validateProject(n, guide), /no puede tener tasks.*reabre/);
  n.sections[ids[0]].tasks = [];
  assert.equal(validateProject(n, guide), true);
});

test('Las tasks se reúnen de todas las secciones, agrupadas por categoría y sin filtrar', () => {
  const p = clean();
  assert.deepEqual(collectTasks(guide, p), [], 'no hay tasks en ningún sitio');
  const a = guide.categories[0].items[1].id, b = guide.categories[2].items[0].id, c = guide.categories[2].items[3].id;
  p.sections[a].tasks = [{text: 'A1', when: 'pending'}, {text: 'A2', when: 'future'}];
  p.sections[b].tasks = [{text: 'B1', when: 'future'}];
  p.sections[c].status = 'N'; p.sections[c].exclusionReason = 'Out of scope';
  const all = collectTasks(guide, p);
  assert.deepEqual(all.map(g => g.category.id), [guide.categories[0].id, guide.categories[2].id], 'solo las categorías con tasks, en orden de catálogo');
  assert.deepEqual(all[0].sections.map(s => s.item.id), [a]);
  assert.deepEqual(all[0].sections[0].pending.map(t => t.text), ['A1']);
  assert.deepEqual(all[0].sections[0].future.map(t => t.text), ['A2']);
  assert.deepEqual(all[1].sections.map(s => s.item.id), [b]);
});

test('El proyecto real cumple su propio contrato con el record incluido', async () => {
  const realGuide = JSON.parse(await readFile(new URL('../data/guide.json', import.meta.url))), real = JSON.parse(await readFile(new URL('../data/project.json', import.meta.url)));
  assert.equal(validateProject(real, realGuide), true);
  assert.equal(validateProject(base, guide), true, 'y el seed también');
});
