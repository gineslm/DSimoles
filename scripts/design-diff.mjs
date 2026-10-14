// Compara el proyecto de Claude Design con este repositorio y protege su trabajo de perderse.
//   npm run design-diff -- --request                       prepara el prompt que pide a Claude Design su manifiesto de hashes (con un nonce)
//   npm run design-diff -- --manifest <archivo> [--json s] comparación a tres bandas con el manifiesto (el JSON o la respuesta de get_file)
//   npm run design-diff -- --record [--confirm todo|ruta,…] [--discard ruta … --reason "…"]   registra la integración (design-baseline.json)
//   npm run design-diff -- <carpeta> | --listing <lista.json>  comparación simple de una copia o de las rutas
// Códigos de salida: 0 sin diferencias, 1 diferencias sin riesgo, 2 hay trabajo de Claude Design sin integrar o sin confirmar.
// Este script no se conecta a Claude Design: lo hace el agente por MCP. Ver docs/scripts.md y docs/handoff.md.
import {readFile, readdir, stat, writeFile, mkdir} from 'node:fs/promises';
import {randomBytes, createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ownedFiles, hashOf} from './framework-lib.mjs';
import {classify, TYPES, diffTrees, changedSectionIds, changedGuideIds, DESIGN_IGNORED, REPO_IGNORED, canonicalSvg, BINARY, parseManifest, threeWay} from './handoff-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const optAll = n => args.flatMap((a, i) => a === `--${n}` && args[i + 1] !== undefined ? [args[i + 1]] : []);
const has = n => args.includes(`--${n}`);
const fail = (m, code = 1) => { console.error(`Error: ${m}`); process.exit(code); };
const STATE = path.join(root, '.dsbook');
const BASELINE = path.join(root, 'design-baseline.json');
const readJson = async (f, fallback) => { try { return JSON.parse(await readFile(f, 'utf8')); } catch (e) { if (fallback !== undefined) return fallback; throw e; } };
const sha = b => createHash('sha256').update(b).digest('hex');
const list = (a, n = 12) => a.length > n ? a.slice(0, n).join(', ') + `, … (+${a.length - n})` : a.join(', ');

async function walk(dir, base = dir) {
  const out = [];
  for (const e of await readdir(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (['.git', 'node_modules', '.claude'].includes(e.name)) continue; out.push(...await walk(p, base)); }
    else out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
}
// Hash de un archivo del repositorio con las mismas reglas que se piden a Claude Design: binarios y runtime tal cual,
// texto con saltos de línea LF y los SVG en su forma canónica.
async function repoHash(rel) {
  if (BINARY.test(rel)) return sha(await readFile(path.join(root, rel)));
  if (/\.svg$/i.test(rel)) return sha(canonicalSvg(await readFile(path.join(root, rel), 'utf8')));
  return hashOf(root, rel);
}
const repoPaths = async () => (await walk(root)).filter(p => !REPO_IGNORED.test(p));
const headSha = () => { try { return execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim(); } catch { return null; } };

// ---- --request: el prompt que pide el manifiesto
if (has('request')) {
  const nonce = randomBytes(6).toString('hex');
  await mkdir(STATE, {recursive: true});
  await writeFile(path.join(STATE, 'nonce.json'), JSON.stringify({nonce, at: new Date().toISOString()}) + '\n');
  console.log(`Pega esto en Claude Design (nonce ${nonce}):\n
---
Prepara la entrega: genera \`design-manifest.json\` en la raíz de tu proyecto. No cambies ningún otro archivo.

1. Recorre todos los archivos del proyecto salvo \`_ds/\`, \`_backup/\`, \`uploads/\`, \`github.md\`, \`.thumbnail\` y el propio \`design-manifest.json\`. Incluye los archivos ocultos (por ejemplo \`.gitattributes\`).
2. Lee cada archivo como bytes y calcula su SHA-256 en hexadecimal con \`crypto.subtle.digest\`. En los archivos de texto (html, js, json, md, css, svg, mjs, txt y los ocultos de configuración) cambia antes \`\\r\\n\` por \`\\n\`. No normales los binarios (png, jpg, webp, gif, woff2) ni \`assets/_runtime/*.js\` ni los \`support.js\`.
3. Escribe \`design-manifest.json\` con esta forma exacta: {"generated": "<fecha ISO>", "nonce": "${nonce}", "files": {"<ruta>": "<sha256>", …}}.
4. Contéstame con el número de archivos y la fecha. Si no puedes calcular un hash real de algún archivo, dímelo en vez de inventarlo.
---`);
  process.exit(0);
}

// ---- --manifest / --record: comparación a tres bandas
if (opt('manifest') || has('record')) {
  const manifestFile = opt('manifest') ?? path.join(STATE, 'manifest.json');
  let m;
  try { m = parseManifest(await readFile(manifestFile, 'utf8')); } catch (e) { fail(`manifiesto no válido (${manifestFile}): ${e.message}`); }
  if (opt('manifest')) { await mkdir(STATE, {recursive: true}); await writeFile(path.join(STATE, 'manifest.json'), JSON.stringify({generated: m.generated, nonce: m.nonce, files: Object.fromEntries(m.files)}) + '\n'); }

  // Frescura: el manifiesto debe ser el que se pidió con --request.
  let freshness = 'ok';
  const asked = await readJson(path.join(STATE, 'nonce.json'), null);
  if (!asked) freshness = 'sin nonce pedido';
  else if (m.nonce !== asked.nonce) freshness = 'el nonce no coincide';
  if (freshness !== 'ok' && !has('no-nonce') && !has('record')) fail(`el manifiesto no es el que se pidió (${freshness}). Ejecuta --request, pega el prompt en Claude Design y vuelve a traer su manifiesto (o usa --no-nonce bajo tu responsabilidad).`, 2);

  const design = new Map([...m.files].filter(([p]) => !DESIGN_IGNORED.test(p)));
  const repo = new Map();
  for (const p of await repoPaths()) repo.set(p, await repoHash(p));
  const base = await readJson(BASELINE, {version: 1, files: {}, discarded: []});
  const r = threeWay({baseline: base.files, discarded: base.discarded, design, repo});

  if (has('record')) {
    // Registrar la integración solo es posible si no queda nada sin resolver.
    const confirm = (opt('confirm') ?? '').split(',').map(s => s.trim()).filter(Boolean);
    const all = confirm.includes('todo');
    const toDiscard = [...new Set(optAll('discard'))];
    if (toDiscard.length && !opt('reason')) fail('--discard exige --reason "motivo"');
    const stillPending = [...r.pending, ...r.newInDesign].filter(p => !toDiscard.includes(p));
    if (stillPending.length) fail(`hay trabajo de Claude Design sin integrar: ${list(stillPending)}. Intégralo, o descártalo con --discard <ruta> --reason "motivo".`, 2);
    const unconfirmed = r.needsConfirm.filter(p => !all && !confirm.includes(p));
    if (unconfirmed.length) fail(`faltan por confirmar (cambiaron en Claude Design y en el repo): ${list(unconfirmed)}. Revísalos y confirma con --confirm todo o --confirm ruta1,ruta2.`, 2);
    for (const p of toDiscard) base.discarded.push({path: p, designHash: design.get(p), reason: opt('reason'), date: new Date().toISOString().slice(0, 10)});
    for (const [p, d] of design) if (repo.has(p) && !toDiscard.includes(p)) base.files[p] = {design: d, repo: repo.get(p)};
    for (const p of Object.keys(base.files)) if (!design.has(p) && !repo.has(p)) delete base.files[p];
    base.recorded = new Date().toISOString(); base.manifestGenerated = m.generated;
    await writeFile(BASELINE, JSON.stringify(base, null, 2) + '\n');
    const after = threeWay({baseline: base.files, discarded: base.discarded, design, repo});
    await writeFile(path.join(STATE, 'last-diff.json'), JSON.stringify({at: new Date().toISOString(), head: headSha(), manifestGenerated: m.generated, freshness, recorded: true, blocking: after.blocking, ...after}, null, 2) + '\n');
    console.log(`OK: integración registrada en design-baseline.json (${Object.keys(base.files).length} archivos${toDiscard.length ? `, ${toDiscard.length} descartado${toDiscard.length > 1 ? 's' : ''}` : ''}).`);
    process.exit(0);
  }

  await mkdir(STATE, {recursive: true});
  await writeFile(path.join(STATE, 'last-diff.json'), JSON.stringify({at: new Date().toISOString(), head: headSha(), manifestGenerated: m.generated, freshness, recorded: false, ...r}, null, 2) + '\n');
  const fw = new Set(await ownedFiles(root));
  console.log(`Claude Design (${design.size} archivos, manifiesto de ${m.generated ?? 'fecha desconocida'}) frente a este repositorio (${repo.size}). Frescura: ${freshness}.`);
  const show = (title, files, hint) => { if (!files.length) return; console.log(`\n${title} · ${files.length}${hint ? ` (${hint})` : ''}`); const g = {}; for (const p of files) (g[classify(p, {frameworkFiles: fw})] ??= []).push(p); for (const [t, f] of Object.entries(g)) console.log(`  ${TYPES[t]} (${f.length}): ${list(f)}`); };
  show('SIN INTEGRAR — Claude Design cambió estos archivos y el repo no se ha tocado', r.pending, 'se perderían al actualizar Claude Design desde el repo');
  show('NUEVOS EN CLAUDE DESIGN — no existen en el repo', r.newInDesign, 'por traer');
  show('POR CONFIRMAR — cambiaron en ambos lados', r.needsConfirm, 'confirma con --record --confirm');
  show('El repo va por delante de Claude Design', r.repoAhead, 'hecho en Claude Code; Claude Design debe adoptarlo');
  show('Eliminados en Claude Design', r.designDeleted, 'decide si se eliminan también aquí');
  show('Descartados a propósito', r.discarded);
  show('Solo en el repositorio (sin baseline)', r.repoOnly);
  console.log(`\nIdénticos y ya registrados: ${r.unchanged.length}. Integrados sin cambios: ${r.integrated.length}.`);
  if (r.blocking.length) console.log(`\nBLOQUEA EL PUSH: ${r.blocking.length} archivo${r.blocking.length > 1 ? 's' : ''} sin resolver. Intégralos y repite, o descártalos con --record --discard.`);
  else console.log('\nNada sin resolver: puedes registrar la integración con --record cuando hayas validado.');
  if (opt('json')) await writeFile(opt('json'), JSON.stringify({generated: new Date().toISOString(), mode: 'manifest', different: [...r.pending, ...r.needsConfirm, ...r.repoAhead], onlyRepo: r.repoOnly, onlyDesign: r.newInDesign, ...r}, null, 2) + '\n');
  process.exit(r.blocking.length ? 2 : (r.repoAhead.length || r.designDeleted.length || r.repoOnly.length || r.integrated.length) ? 1 : 0);
}

// ---- modo simple: carpeta o listado de rutas
const folder = args.find((a, i) => !a.startsWith('--') && !['--listing', '--json'].includes(args[i - 1]));
const listing = opt('listing'), jsonOut = opt('json');
if (!folder && !listing) fail('uso: npm run design-diff -- --request | --manifest <archivo> | --record | <carpeta> | --listing <lista.json> [--json <salida.json>]');

const repoList = await repoPaths();
let designPaths, designHash = null;
if (listing) {
  const raw = JSON.parse(await readFile(listing, 'utf8'));
  const arr = Array.isArray(raw) ? raw : raw.paths;
  if (!Array.isArray(arr)) fail(`${listing} debe ser un array de rutas o {"paths": […]}`);
  const names = arr.filter(p => typeof p === 'string').map(p => p.replace(/\/+$/, ''));
  // list_files devuelve también las carpetas: se descartan las rutas que son prefijo de otra.
  designPaths = names.filter(p => !DESIGN_IGNORED.test(p) && !names.some(q => q.startsWith(p + '/')));
} else {
  try { if (!(await stat(folder)).isDirectory()) throw 0; } catch { fail(`no existe la carpeta ${folder}`); }
  designPaths = (await walk(folder)).filter(p => !DESIGN_IGNORED.test(p));
  designHash = p => hashOf(path.resolve(folder), p);
}
const repoMap = new Map(), designMap = new Map();
for (const p of repoList) repoMap.set(p, designHash ? await hashOf(root, p) : '·');
for (const p of designPaths) designMap.set(p, designHash ? await designHash(p) : '·');
const diff = diffTrees(designMap, repoMap);
if (!designHash) diff.different = [];

const fw = new Set(await ownedFiles(root));
const group = l => { const g = {}; for (const p of l) (g[classify(p, {frameworkFiles: fw})] ??= []).push(p); return g; };
const detail = {};
if (designHash && diff.different.includes('data/project.json')) detail.sections = changedSectionIds(await readJson(path.join(path.resolve(folder), 'data/project.json')), await readJson(path.join(root, 'data/project.json')));
if (designHash && diff.different.includes('data/guide.json')) detail.guide = changedGuideIds(await readJson(path.join(path.resolve(folder), 'data/guide.json')), await readJson(path.join(root, 'data/guide.json')));

const total = diff.onlyDesign.length + diff.onlyRepo.length + diff.different.length;
console.log(`Claude Design (${designPaths.length} archivos) frente a este repositorio (${repoList.length} archivos)${designHash ? '' : ' · solo rutas'}.`);
if (!total) console.log('Sin diferencias.');
for (const [title, l, hint] of [
  ['Solo en Claude Design', diff.onlyDesign, 'por traer al repositorio'],
  ['Solo en el repositorio', diff.onlyRepo, 'Claude Design aún no lo tiene (o es contenido hecho en Claude Code)'],
  ['Con contenido distinto', diff.different, 'por contrastar antes de decidir cuál prevalece'],
]) {
  if (!l.length) continue;
  console.log(`\n${title} · ${l.length} (${hint})`);
  for (const [t, files] of Object.entries(group(l))) console.log(`  ${TYPES[t]} (${files.length}): ${list(files)}`);
}
if (detail.sections?.length) console.log(`\nEntradas de data/project.json que difieren (${detail.sections.length}): ${detail.sections.join(', ')}`);
if (detail.guide?.length) console.log(`Entradas de data/guide.json que difieren (${detail.guide.length}): ${detail.guide.join(', ')}`);
if (jsonOut) {
  await writeFile(jsonOut, JSON.stringify({generated: new Date().toISOString(), mode: designHash ? 'content' : 'listing', ...diff, ...detail}, null, 2) + '\n');
  console.log(`\nGuardado en ${jsonOut}.`);
}
process.exitCode = total ? 1 : 0;
