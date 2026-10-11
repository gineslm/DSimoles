// Informa y registra la versión del framework DSBook que usa este repositorio.
//   npm run framework                          informa de la versión y de si los archivos del framework coinciden con ella
//   npm run framework -- --release <version> [--repository <url>]   registra una versión nueva (tras un cambio intencionado del framework)
//   npm run framework -- --compare <folder>    compara con otro repositorio DSBook (su dsbook.json)
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verify, release, readManifest, compare, describe} from './framework-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const fail = m => { console.error(`Error: ${m}`); process.exit(1); };

try {
  if (args.includes('--release')) {
    const version = opt('release');
    if (!version) fail('uso: npm run framework -- --release <MAJOR.MINOR.PATCH>');
    const before = await readManifest(root).catch(() => null);
    const m = await release(root, version, {repository: opt('repository')});
    console.log(`OK: framework DSBook ${before ? `${before.version} → ` : ''}${m.version} registrado (${Object.keys(m.files).length} archivos).`);
    console.log('Siguiente: añade la entrada a CHANGELOG.md y porta el cambio a los demás repositorios DSBook (docs/framework.md).');
  } else if (args.includes('--compare')) {
    const other = opt('compare');
    if (!other) fail('uso: npm run framework -- --compare <carpeta de otro repositorio DSBook>');
    const a = await readManifest(root), b = await readManifest(path.resolve(other));
    const c = compare(a, b);
    console.log(`Este repositorio: DSBook ${a.version}. ${other}: DSBook ${b.version}.`);
    if (c.sameVersion && !c.differ.length) console.log('Misma versión y archivos del framework idénticos.');
    else {
      if (!c.sameVersion) console.log('Las versiones difieren.');
      if (c.differ.length) console.log(`Archivos que difieren: ${c.differ.join(', ')}`);
    }
    process.exitCode = c.sameVersion && !c.differ.length ? 0 : 1;
  } else {
    const r = await verify(root);
    if (r.ok) console.log(`OK: framework DSBook ${r.version}; los archivos del framework coinciden con el manifiesto.`);
    else {
      console.error(`Error: los archivos del framework difieren de DSBook ${r.version} (${describe(r)}).`);
      process.exitCode = 1;
    }
  }
} catch (e) { fail(e.message); }
