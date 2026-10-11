// Compara el contenido de un proyecto de Claude Design con este repositorio y lo agrupa por tipo.
//   npm run design-diff -- <carpeta>                  compara una copia de los archivos de Claude Design (contenido y rutas)
//   npm run design-diff -- --listing <lista.json>     compara solo las rutas (la salida de list_files, un array de rutas o {paths:[…]})
//   añade --json <salida.json> para guardar el resultado (lo lee `handoff-note --divergences`)
// Este script no se conecta a Claude Design: lo hace el agente por MCP y le entrega la carpeta o la lista. Ver docs/scripts.md.
import {readFile, readdir, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ownedFiles, hashOf} from './framework-lib.mjs';
import {classify, TYPES, diffTrees, changedSectionIds, changedGuideIds, DESIGN_IGNORED} from './handoff-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const fail = m => { console.error(`Error: ${m}`); process.exit(1); };
const folder = args.find((a, i) => !a.startsWith('--') && !['--listing', '--json'].includes(args[i - 1]));
const listing = opt('listing'), jsonOut = opt('json');
if (!folder && !listing) fail('uso: npm run design-diff -- <carpeta con los archivos de Claude Design> | --listing <lista.json> [--json <salida.json>]');

async function walk(dir, base = dir) {
  const out = [];
  for (const e of await readdir(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (['.git', 'node_modules', '.claude'].includes(e.name)) continue; out.push(...await walk(p, base)); } else out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
}
const keep = p => !DESIGN_IGNORED.test(p);

// Archivos del repositorio que son «de Claude Design»: páginas, recursos, datos y las guías/contenedor que él también ve.
const tracked = (await walk(root)).filter(p => keep(p) && !/^(node_modules|\.git)\//.test(p));
const repoPaths = tracked.filter(p => !p.startsWith('scripts/'));

let designPaths, designHash = null;
if (listing) {
  const raw = JSON.parse(await readFile(listing, 'utf8'));
  const arr = Array.isArray(raw) ? raw : raw.paths;
  if (!Array.isArray(arr)) fail(`${listing} debe ser un array de rutas o {"paths": […]}`);
  const names = arr.filter(p => typeof p === 'string').map(p => p.replace(/\/+$/, ''));
  // list_files devuelve también las carpetas: se descartan las rutas que son prefijo de otra.
  designPaths = names.filter(p => keep(p) && !names.some(q => q.startsWith(p + '/')));
} else {
  try { if (!(await stat(folder)).isDirectory()) throw 0; } catch { fail(`no existe la carpeta ${folder}`); }
  designPaths = (await walk(folder)).filter(keep);
  designHash = p => hashOf(path.resolve(folder), p);
}

const repoSet = new Set(repoPaths), designSet = new Set(designPaths);
const repoMap = new Map(), designMap = new Map();
for (const p of repoSet) repoMap.set(p, designHash ? await hashOf(root, p) : '·');
for (const p of designSet) designMap.set(p, designHash ? await designHash(p) : '·');
const diff = diffTrees(designMap, repoMap);
// Sin contenido (modo --listing) solo hay diferencias de ruta.
if (!designHash) diff.different = [];

const fw = new Set(await ownedFiles(root));
const group = list => { const g = {}; for (const p of list) (g[classify(p, {frameworkFiles: fw})] ??= []).push(p); return g; };
const detail = {};
if (designHash && diff.different.includes('data/project.json')) {
  detail.sections = changedSectionIds(JSON.parse(await readFile(path.join(path.resolve(folder), 'data/project.json'), 'utf8')), JSON.parse(await readFile(path.join(root, 'data/project.json'), 'utf8')));
}
if (designHash && diff.different.includes('data/guide.json')) {
  detail.guide = changedGuideIds(JSON.parse(await readFile(path.join(path.resolve(folder), 'data/guide.json'), 'utf8')), JSON.parse(await readFile(path.join(root, 'data/guide.json'), 'utf8')));
}

const total = diff.onlyDesign.length + diff.onlyRepo.length + diff.different.length;
console.log(`Claude Design (${designPaths.length} archivos) frente a este repositorio (${repoPaths.length} archivos)${designHash ? '' : ' · solo rutas'}.`);
if (!total) console.log('Sin diferencias.');
for (const [title, list, hint] of [
  ['Solo en Claude Design', diff.onlyDesign, 'por traer al repositorio'],
  ['Solo en el repositorio', diff.onlyRepo, 'Claude Design aún no lo tiene (o es contenido hecho en Claude Code)'],
  ['Con contenido distinto', diff.different, 'por contrastar antes de decidir cuál prevalece'],
]) {
  if (!list.length) continue;
  console.log(`\n${title} · ${list.length} (${hint})`);
  for (const [t, files] of Object.entries(group(list))) console.log(`  ${TYPES[t]} (${files.length}): ${files.length > 12 ? files.slice(0, 12).join(', ') + ', …' : files.join(', ')}`);
}
if (detail.sections?.length) console.log(`\nEntradas de data/project.json que difieren (${detail.sections.length}): ${detail.sections.join(', ')}`);
if (detail.guide?.length) console.log(`Entradas de data/guide.json que difieren (${detail.guide.length}): ${detail.guide.join(', ')}`);
if (jsonOut) {
  await writeFile(jsonOut, JSON.stringify({generated: new Date().toISOString(), mode: designHash ? 'content' : 'listing', ...diff, ...detail}, null, 2) + '\n');
  console.log(`\nGuardado en ${jsonOut}.`);
}
process.exitCode = total ? 1 : 0;
