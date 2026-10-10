// The DSBook framework is the part of the repository that every project shares: the container, the scripts,
// the seed, the vendored runtime and the permanent guides. `dsbook.json` records its version and the SHA-256
// of each of those files, so two repositories can tell whether they run the same framework.
// A project's own files (data/, sections/, assets/<category>/, README, CLAUDE.md, CHANGELOG, LICENSE) are not part of it.
import {readFile, readdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

export const MANIFEST = 'dsbook.json';
export const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

// Single files, and folders with the way they are walked.
const FILES = ['package.json', 'index.html', 'styles.css', 'app.js', 'model.js', '.gitattributes', 'templates/component.md'];
const FOLDERS = [
  {dir: 'scripts', deep: true},
  {dir: 'seed', deep: true},
  {dir: 'assets/_runtime', deep: true},
  {dir: 'docs', deep: false},
];
// Vendored files are byte-exact (their hash is also checked against support.js); everything else is text
// and is hashed with LF line endings so a Windows checkout and a Linux one agree.
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
    throw Error(`${MANIFEST} is not a valid DSBook manifest`);
  }
  return m;
}

// Compares the files on disk with the manifest.
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

export async function release(root, version) {
  if (!SEMVER.test(version)) throw Error(`Invalid version "${version}" (expected MAJOR.MINOR.PATCH)`);
  const files = {};
  for (const rel of await ownedFiles(root)) files[rel] = await hashOf(root, rel);
  const manifest = {framework: 'DSBook', version, files};
  await writeFile(path.join(root, MANIFEST), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}

// Compares two manifests (no need to hash the other repository's files).
export function compare(a, b) {
  const names = new Set([...Object.keys(a.files), ...Object.keys(b.files)]);
  const differ = [...names].filter(n => a.files[n] !== b.files[n]).sort();
  return {sameVersion: a.version === b.version, differ};
}

export function describe(r) {
  const parts = [];
  if (r.changed.length) parts.push(`changed: ${r.changed.join(', ')}`);
  if (r.missing.length) parts.push(`missing: ${r.missing.join(', ')}`);
  if (r.added.length) parts.push(`not in the manifest: ${r.added.join(', ')}`);
  return parts.join('; ');
}
