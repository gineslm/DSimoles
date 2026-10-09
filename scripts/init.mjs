// Starts a project from the seed: copies seed/ to data/ and fixes the project identity.
// From then on data/ belongs to the project and nothing links it to the seed except `seedVersion`.
import {readFile, writeFile, mkdir, access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateGuide, validateProject} from '../model.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const force = args.includes('--force');
const fail = m => { console.error(`Error: ${m}`); process.exit(1); };

const id = opt('id'), name = opt('name'), language = opt('language') ?? 'en';
if (!id || !name) fail('usage: npm run init -- --id <project-id> --name "<Design System name>" [--language en] [--force]');

const read = async p => JSON.parse(await readFile(path.join(root, p), 'utf8'));
const guide = await read('seed/guide.json');
const seed = await read('seed/project.json');

const exists = p => access(path.join(root, p)).then(() => true, () => false);
if (await exists('data/project.json')) {
  const current = await read('data/project.json');
  if (current.projectId !== seed.projectId && !force) {
    fail(`data/project.json already belongs to the project "${current.projectId}". Starting again would overwrite its statuses, notes and reviews. Use --force only if that is intended.`);
  }
}

const project = {...seed, projectId: id, name, language, seedVersion: guide.version};
try { validateGuide(guide); validateProject(project, guide); } catch (e) { fail(e.message); }

await mkdir(path.join(root, 'data'), {recursive: true});
const out = o => JSON.stringify(o, null, 2) + '\n';
await writeFile(path.join(root, 'data/guide.json'), out(guide));
await writeFile(path.join(root, 'data/project.json'), out(project));
console.log(`OK: project "${name}" (${id}) started from seed ${guide.version}.`);
console.log('Next: create pages in sections/ at each suggestedPath, then run npm run check and npm test.');
console.log('sections/ and assets/ were not touched.');
