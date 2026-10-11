// Escribe handoff-last.md: el aviso para Claude Design con lo que cambia este envío respecto al último publicado.
//   npm run handoff-note                          compara el árbol de trabajo con origin/main
//   npm run handoff-note -- --base <ref>          compara con otra referencia de git
//   npm run handoff-note -- --divergences <json>  incorpora el resultado de `design-diff --json` (qué es de Claude Design y qué no)
//   npm run handoff-note -- --out <archivo>       otro destino (por defecto handoff-last.md en la raíz)
// Se ejecuta antes del commit, así que no puede contener el hash de su propio commit: ese va en el prompt, después del push.
import {readFile, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ownedFiles} from './framework-lib.mjs';
import {classify, TYPES, structureChanged, changedSectionIds, changedGuideIds} from './handoff-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const fail = m => { console.error(`Error: ${m}`); process.exit(1); };
const git = (...a) => execFileSync('git', a, {cwd: root, encoding: 'utf8', maxBuffer: 1 << 28}).replace(/\r\n/g, '\n');
const tryGit = (...a) => { try { return git(...a); } catch { return null; } };
const OUT = opt('out') ?? 'handoff-last.md';

if (tryGit('rev-parse', '--git-dir') === null) fail('esto no es un repositorio git');
let base = opt('base');
if (!base) base = tryGit('rev-parse', '--verify', '-q', 'origin/main') !== null ? 'origin/main' : 'HEAD';
const baseSha = tryGit('rev-parse', '--verify', '-q', base)?.trim();
if (!baseSha) fail(`no existe la referencia ${base}`);

// Archivos cambiados: lo versionado que difiere de la base (confirmado o no) más lo nuevo sin versionar.
const status = new Map();
for (const line of git('diff', '--name-status', '--no-renames', baseSha).split('\n').filter(Boolean)) {
  const [s, ...p] = line.split('\t'); status.set(p.join('\t'), s === 'A' ? 'nuevo' : s === 'D' ? 'eliminado' : 'modificado');
}
for (const p of git('ls-files', '-o', '--exclude-standard').split('\n').filter(Boolean)) if (!status.has(p)) status.set(p, 'nuevo');
status.delete(OUT);
if (!status.size) fail(`no hay cambios respecto a ${base}; nada que avisar`);

const show = f => { const t = tryGit('show', `${baseSha}:${f}`); try { return t ? JSON.parse(t) : null; } catch { return null; } };
const now = async f => { try { return JSON.parse(await readFile(path.join(root, f), 'utf8')); } catch { return null; } };
const guideBefore = show('data/guide.json'), guideNow = await now('data/guide.json');
const projectBefore = show('data/project.json'), projectNow = await now('data/project.json');
const structural = !!(guideBefore && guideNow && structureChanged(guideBefore, guideNow));
const fw = new Set(await ownedFiles(root));
for (const p of tryGit('ls-tree', '-r', '--name-only', baseSha)?.split('\n') ?? []) if ((p.startsWith('scripts/') || p.startsWith('docs/') || p.startsWith('seed/')) && !p.startsWith('docs/proposals/')) fw.add(p);

const manifestBefore = show('dsbook.json'), manifestNow = await now('dsbook.json');
const fwVersion = manifestBefore?.version !== manifestNow?.version ? `${manifestBefore?.version ?? '—'} → ${manifestNow?.version ?? '—'}` : (manifestNow?.version ?? '—');

let div = null;
if (opt('divergences')) {
  try { div = JSON.parse(await readFile(opt('divergences'), 'utf8')); } catch (e) { fail(`no se pudo leer ${opt('divergences')}: ${e.message}`); }
}
const divergent = new Set([...(div?.different ?? []), ...(div?.onlyRepo ?? [])]);
const origin = p => !div ? '' : divergent.has(p) ? ' · hecho en Claude Code' : ' · coincide con Claude Design';

const groups = {};
for (const [p, s] of [...status].sort(([a], [b]) => a.localeCompare(b))) (groups[classify(p, {frameworkFiles: fw, structural})] ??= []).push([p, s]);

const rel = ids => ids.length ? ` — IDs: ${ids.join(', ')}` : '';
const lines = [];
const today = new Date().toISOString().slice(0, 10);
lines.push('# Aviso de traspaso a Claude Design', '',
  `Generado el ${today} · base: \`${baseSha.slice(0, 12)}\` (${base}) · framework: ${fwVersion}.`, '',
  'Este archivo describe lo que cambia respecto a la base. No contiene el hash de su propio commit: el prompt que lo acompaña lo indica. Se reescribe en cada envío; el historial está en `CHANGELOG.md`.', '',
  '## Resumen', '');
for (const t of Object.keys(TYPES)) if (groups[t]) lines.push(`- ${TYPES[t]}: ${groups[t].length} archivo${groups[t].length === 1 ? '' : 's'}`);
lines.push('', '## Cambios por tipo', '');
for (const t of Object.keys(TYPES)) {
  const g = groups[t]; if (!g) continue;
  lines.push(`### ${TYPES[t]}`, '');
  for (const [p, s] of g) {
    let extra = '';
    if (p === 'data/project.json') extra = rel(changedSectionIds(projectBefore, projectNow));
    if (p === 'data/guide.json') extra = rel(changedGuideIds(guideBefore, guideNow));
    lines.push(`- \`${p}\` · ${s}${origin(p)}${extra}`);
  }
  lines.push('');
}
if (structural) lines.push('> La estructura del catálogo cambió (IDs, números o rutas de `data/guide.json`): Claude Design debe actualizar su mapa de pantallas y no renombrar nada por su cuenta.', '');
if (div) {
  lines.push('## Diferencias con la versión de Claude Design', '',
    `Comparación del ${div.generated?.slice(0, 10) ?? '—'} (${div.mode === 'content' ? 'contenido' : 'solo rutas'}).`, '');
  const sect = (title, list) => { if (list?.length) lines.push(`- ${title} (${list.length}): ${list.map(p => `\`${p}\``).join(', ')}`); };
  sect('Con contenido distinto', div.different); sect('Solo en este repositorio', div.onlyRepo); sect('Solo en Claude Design (no se ha traído)', div.onlyDesign);
  if (!div.different?.length && !div.onlyRepo?.length && !div.onlyDesign?.length) lines.push('- Ninguna: el repositorio y Claude Design coinciden.');
  lines.push('');
}
lines.push('## Qué debe hacer Claude Design', '',
  '1. Leer el repositorio y comprobar que el commit indicado en el prompt contiene lo que figura arriba.',
  '2. Para lo marcado «hecho en Claude Code» o con contenido distinto: adoptar la versión del repositorio como base antes de seguir editando. No la sobrescribas con tu copia anterior.',
  '3. Actualizar `github.md` con el nuevo commit, la versión de `CHANGELOG.md` y la versión del framework.',
  '4. Responder con lo que comprobó, lo que difiere y su nueva base.', '',
  '## Qué no debe tocar', '',
  '- El framework (contenedor, `scripts/`, `seed/`, runtime y `docs/`).',
  '- IDs, rutas y carpetas existentes.',
  '- `_ds/`, `github.md` y `uploads/` no se transfieren.', '');

await writeFile(path.join(root, OUT), lines.join('\n'));
console.log(`OK: ${OUT} escrito (${status.size} archivos cambiados respecto a ${base}).`);
for (const t of Object.keys(TYPES)) if (groups[t]) console.log(`  ${TYPES[t]}: ${groups[t].length}`);
console.log('Siguiente: haz el commit con este archivo, súbelo y escribe el prompt para Claude Design con el hash publicado.');
