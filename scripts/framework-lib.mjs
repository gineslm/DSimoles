// El framework DSBook es la parte del repositorio que comparten todos los proyectos: el contenedor, los scripts,
// el seed, el runtime vendorizado y las guías permanentes. `dsbook.json` registra su versión y el SHA-256
// de cada uno de esos archivos, para que dos repositorios puedan saber si usan el mismo framework.
// Los archivos propios de un proyecto (data/, sections/, assets/<category>/, README, CLAUDE.md, CHANGELOG, LICENSE) no forman parte.
import {readFile, readdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {parseRepo} from '../model.js';

export const MANIFEST = 'dsbook.json';
export const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

// Archivos sueltos, y carpetas con la forma de recorrerlas.
const FILES = ['package.json', 'index.html', 'styles.css', 'app.js', 'model.js', '.gitattributes', 'templates/component.md'];
const FOLDERS = [
  {dir: 'scripts', deep: true},
  {dir: 'seed', deep: true},
  {dir: 'assets/_runtime', deep: true},
  {dir: 'assets/_framework', deep: true},
  {dir: 'docs', deep: false},
];
// Los archivos vendorizados se comparan byte a byte (su hash también se comprueba contra support.js); todo lo demás es texto
// y se calcula con saltos de línea LF para que coincidan un checkout de Windows y uno de Linux.
const isBinaryLike = rel => rel.startsWith('assets/_runtime/') && /\.js$/.test(rel);

async function walk(root, dir, deep) {
  const out = [];
  let entries;
  try { entries = await readdir(path.join(root, dir), {withFileTypes: true}); } catch { return out; }
  for (const e of entries) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (deep) out.push(...await walk(root, rel, deep)); }
    else out.push(rel);
  }
  return out;
}

export async function ownedFiles(root) {
  const found = new Set();
  for (const f of FILES) { try { await readFile(path.join(root, f)); found.add(f); } catch {} }
  for (const {dir, deep} of FOLDERS) for (const f of await walk(root, dir, deep)) found.add(f);
  return [...found].sort();
}

export async function hashOf(root, rel) {
  let bytes = await readFile(path.join(root, rel));
  if (!isBinaryLike(rel)) bytes = Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  return createHash('sha256').update(bytes).digest('hex');
}

export async function readManifest(root) {
  const m = JSON.parse(await readFile(path.join(root, MANIFEST), 'utf8'));
  if (m.framework !== 'DSBook' || !SEMVER.test(m.version) || !m.files || typeof m.files !== 'object') {
    throw Error(`${MANIFEST} no es un manifiesto DSBook válido`);
  }
  if (m.repository !== undefined && !parseRepo(m.repository)) throw Error(`${MANIFEST}: repositorio no válido (se esperaba https://github.com/<owner>/<repo>)`);
  if (m.released !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(m.released)) throw Error(`${MANIFEST}: fecha de publicación no válida (se esperaba YYYY-MM-DD)`);
  return m;
}

// Compara los archivos del disco con el manifiesto.
export async function verify(root) {
  const manifest = await readManifest(root);
  const present = await ownedFiles(root);
  const changed = [], missing = [], added = [];
  for (const [rel, hash] of Object.entries(manifest.files)) {
    if (!present.includes(rel)) missing.push(rel);
    else if (await hashOf(root, rel) !== hash) changed.push(rel);
  }
  for (const rel of present) if (!(rel in manifest.files)) added.push(rel);
  return {version: manifest.version, changed, missing, added, ok: !changed.length && !missing.length && !added.length};
}

// `repository` es el origen del framework (de donde vienen las actualizaciones); se conserva del manifiesto anterior salvo que se indique.
export async function release(root, version, {repository} = {}) {
  if (!SEMVER.test(version)) throw Error(`Versión "${version}" no válida (se esperaba MAJOR.MINOR.PATCH)`);
  const previous = await readManifest(root).catch(() => null);
  const source = repository ?? previous?.repository;
  if (source !== undefined && !parseRepo(source)) throw Error(`Repositorio "${source}" no válido (se esperaba https://github.com/<owner>/<repo>)`);
  const files = {};
  for (const rel of await ownedFiles(root)) files[rel] = await hashOf(root, rel);
  const released = new Date().toISOString().slice(0, 10);
  const manifest = {framework: 'DSBook', version, released, ...(source ? {repository: source} : {}), files};
  await writeFile(path.join(root, MANIFEST), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}

// Compara dos manifiestos (no hace falta calcular el hash de los archivos del otro repositorio).
export function compare(a, b) {
  const names = new Set([...Object.keys(a.files), ...Object.keys(b.files)]);
  const differ = [...names].filter(n => a.files[n] !== b.files[n]).sort();
  return {sameVersion: a.version === b.version, differ};
}

export function describe(r) {
  const parts = [];
  if (r.changed.length) parts.push(`cambiados: ${r.changed.join(', ')}`);
  if (r.missing.length) parts.push(`ausentes: ${r.missing.join(', ')}`);
  if (r.added.length) parts.push(`fuera del manifiesto: ${r.added.join(', ')}`);
  return parts.join('; ');
}
