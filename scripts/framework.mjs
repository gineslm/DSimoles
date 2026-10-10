// Reports and records the version of the DSBook framework this repository runs.
//   npm run framework                          report the version and whether the framework files match it
//   npm run framework -- --release <version> [--repository <url>]   record a new version (after an intended framework change)
//   npm run framework -- --compare <folder>    compare with another DSBook repository (its dsbook.json)
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
    if (!version) fail('usage: npm run framework -- --release <MAJOR.MINOR.PATCH>');
    const before = await readManifest(root).catch(() => null);
    const m = await release(root, version, {repository: opt('repository')});
    console.log(`OK: DSBook framework ${before ? `${before.version} → ` : ''}${m.version} recorded (${Object.keys(m.files).length} files).`);
    console.log('Next: add the entry to CHANGELOG.md and port the change to the other DSBook repositories (docs/framework.md).');
  } else if (args.includes('--compare')) {
    const other = opt('compare');
    if (!other) fail('usage: npm run framework -- --compare <folder of another DSBook repository>');
    const a = await readManifest(root), b = await readManifest(path.resolve(other));
    const c = compare(a, b);
    console.log(`This repository: DSBook ${a.version}. ${other}: DSBook ${b.version}.`);
    if (c.sameVersion && !c.differ.length) console.log('Same version and identical framework files.');
    else {
      if (!c.sameVersion) console.log('The versions differ.');
      if (c.differ.length) console.log(`Files that differ: ${c.differ.join(', ')}`);
    }
    process.exitCode = c.sameVersion && !c.differ.length ? 0 : 1;
  } else {
    const r = await verify(root);
    if (r.ok) console.log(`OK: DSBook framework ${r.version}; the framework files match the manifest.`);
    else {
      console.error(`Error: the framework files differ from DSBook ${r.version} (${describe(r)}).`);
      process.exitCode = 1;
    }
  }
} catch (e) { fail(e.message); }
