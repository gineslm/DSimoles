// Instala los hooks de git del proyecto (core.hooksPath → scripts/hooks). Solo afecta a este clon.
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {chmodSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try {
  execFileSync('git', ['config', 'core.hooksPath', 'scripts/hooks'], {cwd: root});
  const hook = path.join(root, 'scripts/hooks/pre-push');
  if (existsSync(hook)) { try { chmodSync(hook, 0o755); } catch {} }
  console.log('OK: hooks instalados (core.hooksPath = scripts/hooks). Antes de cada push se comprobará el trabajo de Claude Design.');
  console.log('Para quitarlos: git config --unset core.hooksPath');
} catch (e) { console.error(`Error: no se pudieron instalar los hooks (${e.message})`); process.exit(1); }
