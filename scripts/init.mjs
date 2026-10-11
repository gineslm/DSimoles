// Inicia un proyecto desde el seed: copia seed/ a data/ y fija la identidad del proyecto.
// Desde ese momento data/ pertenece al proyecto y nada lo vincula al seed salvo `seedVersion`.
import {readFile, writeFile, mkdir, access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateGuide, validateProject} from '../model.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const force = args.includes('--force');
const fail = m => { console.error(`Error: ${m}`); process.exit(1); };

const id = opt('id'), name = opt('name'), language = opt('language') ?? 'es';
if (!id || !name) fail('uso: npm run init -- --id <project-id> --name "<Design System name>" [--language es] [--force]');

const read = async p => JSON.parse(await readFile(path.join(root, p), 'utf8'));
const guide = await read('seed/guide.json');
const seed = await read('seed/project.json');

const exists = p => access(path.join(root, p)).then(() => true, () => false);
if (await exists('data/project.json')) {
  const current = await read('data/project.json');
  if (current.projectId !== seed.projectId && !force) {
    fail(`data/project.json ya pertenece al proyecto "${current.projectId}". Empezar de nuevo sobrescribiría sus estados, notes y reviews. Usa --force solo si es intencionado.`);
  }
}

const project = {...seed, projectId: id, name, language, seedVersion: guide.version};
try { validateGuide(guide); validateProject(project, guide); } catch (e) { fail(e.message); }

await mkdir(path.join(root, 'data'), {recursive: true});
const out = o => JSON.stringify(o, null, 2) + '\n';
await writeFile(path.join(root, 'data/guide.json'), out(guide));
await writeFile(path.join(root, 'data/project.json'), out(project));
console.log(`OK: proyecto "${name}" (${id}) iniciado desde el seed ${guide.version}.`);
console.log('Siguiente: crea las páginas en sections/ en cada suggestedPath y ejecuta npm run check y npm test.');
console.log('sections/ y assets/ no se han tocado.');
