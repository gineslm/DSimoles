// Control previo al push: no se sube nada mientras haya trabajo de Claude Design sin integrar o sin comprobar.
// Lo ejecuta el hook scripts/hooks/pre-push (se instala con `npm run hooks:install`). Lee .dsbook/last-diff.json,
// que escribe `npm run design-diff -- --manifest …`. Para saltárselo a propósito: DSBOOK_SKIP_DESIGN_CHECK=1 git push.
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_HOURS = Number(process.env.DSBOOK_MAX_DIFF_HOURS ?? 24);
const stop = (lines) => { console.error(['', 'PUSH BLOQUEADO · protección del trabajo de Claude Design', ...lines.map(l => `  ${l}`), '', '  Para saltarlo a propósito: DSBOOK_SKIP_DESIGN_CHECK=1 git push', ''].join('\n')); process.exit(1); };

if (process.env.DSBOOK_SKIP_DESIGN_CHECK === '1') { console.error('AVISO: se omite la comprobación con Claude Design (DSBOOK_SKIP_DESIGN_CHECK=1).'); process.exit(0); }

let s;
try { s = JSON.parse(await readFile(path.join(root, '.dsbook/last-diff.json'), 'utf8')); } catch {
  stop(['No hay una comparación con Claude Design.', 'Ejecuta: npm run design-diff -- --request, pega el prompt en Claude Design,', 'trae su manifiesto y ejecuta: npm run design-diff -- --manifest <archivo>']);
}
const hours = (Date.now() - new Date(s.at).getTime()) / 36e5;
if (!(hours <= MAX_HOURS)) stop([`La última comparación con Claude Design es de hace ${Math.round(hours)} h (máximo ${MAX_HOURS}).`, 'Repítela: npm run design-diff -- --request y después --manifest.']);
if (s.blocking?.length) stop([`Hay ${s.blocking.length} archivo(s) de Claude Design sin integrar o sin confirmar:`, ...s.blocking.slice(0, 10), ...(s.blocking.length > 10 ? [`… (+${s.blocking.length - 10})`] : []), '', 'Intégralos en el repo, confírmalos con npm run design-diff -- --record --confirm …,', 'o descártalos con --record --discard <ruta> --reason "motivo".']);
console.error(`Comprobación con Claude Design correcta (${Math.round(hours)} h, ${s.recorded ? 'integración registrada' : 'sin pendientes'}).`);
