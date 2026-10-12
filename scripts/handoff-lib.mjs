// Lógica compartida por `design-diff`, `handoff-note` y el control previo al push.
// Es lógica pura (sin git ni disco) para poder probarla.
export const TYPES = {
  diseno: 'Diseño',
  estructura: 'Estructura',
  framework: 'Framework',
  proyecto: 'Proyecto (documentación)',
  otros: 'Otros',
};

const PROJECT_DOCS = /^(README\.md|CLAUDE\.md|CHANGELOG\.md|LICENSE|ROADMAP\.md|handoff-last\.md|design-baseline\.json|sections\/README\.md|assets\/README\.md|docs\/proposals\/.*)$/;

// `frameworkFiles`: conjunto de rutas del manifiesto de dsbook.json. `structural`: true si el catálogo cambió de IDs, rutas o números.
export function classify(rel, {frameworkFiles = new Set(), structural = false} = {}) {
  if (rel === 'dsbook.json' || frameworkFiles.has(rel)) return 'framework';
  if (PROJECT_DOCS.test(rel)) return 'proyecto';
  if (rel === 'data/guide.json') return structural ? 'estructura' : 'diseno';
  if (rel === 'data/project.json' || rel.startsWith('sections/')) return 'diseno';
  if (/^assets\/(?!_runtime\/|_framework\/)/.test(rel)) return 'diseno';
  return 'otros';
}

// ¿Cambió la estructura del catálogo? Compara los IDs, números y rutas sugeridas de dos guías.
export function guideStructure(guide) {
  const out = new Map();
  for (const c of guide?.categories ?? []) {
    out.set(c.id, `cat|${c.number}`);
    for (const i of c.items ?? []) out.set(i.id, `item|${i.number}|${i.suggestedPath}`);
  }
  return out;
}
export function structureChanged(before, after) {
  const a = guideStructure(before), b = guideStructure(after);
  if (a.size !== b.size) return true;
  for (const [k, v] of a) if (b.get(k) !== v) return true;
  return false;
}

// IDs de sección cuyas entradas difieren entre dos `project.json` (o dos guías con `items`).
export function changedSectionIds(before, after) {
  const a = before?.sections ?? {}, b = after?.sections ?? {};
  const ids = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...ids].filter(id => JSON.stringify(a[id]) !== JSON.stringify(b[id])).sort();
}
export function changedGuideIds(before, after) {
  const flat = g => new Map((g?.categories ?? []).flatMap(c => [[c.id, JSON.stringify({...c, items: undefined})], ...(c.items ?? []).map(i => [i.id, JSON.stringify(i)])]));
  const a = flat(before), b = flat(after);
  return [...new Set([...a.keys(), ...b.keys()])].filter(id => a.get(id) !== b.get(id)).sort();
}

// Rutas del proyecto de Claude Design que no se comparan: lo que no se transfiere, su copia de seguridad y los dos archivos que genera
// Claude Code (design-baseline.json y handoff-last.md): Claude Design los lee del repositorio y su copia siempre va un envío por detrás.
export const DESIGN_IGNORED = /^(_ds\/|_backup\/|uploads\/|github\.md$|design-manifest\.json$|design-baseline\.json$|handoff-last\.md$|\.thumbnail$|scripts\/|node_modules\/|\.git\/|\.claude\/|\.dsbook\/)/;
// Rutas del repositorio que no existen en Claude Design por diseño.
export const REPO_IGNORED = /^(design-baseline\.json$|handoff-last\.md$|\.dsbook\/|node_modules\/|\.git\/|\.claude\/|scripts\/)/;

// Los SVG que importa Claude Design vuelven reserializados (etiquetas autocerradas expandidas, sin salto de línea final):
// se comparan en esa forma canónica para que no se señale una diferencia que no existe.
export function canonicalSvg(text) {
  return text.replace(/\r\n/g, '\n').replace(/<([A-Za-z][\w:-]*)([^<>]*?)\s*\/>/g, '<$1$2></$1>').replace(/\s+$/, '');
}
export const BINARY = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|pdf)$/i;

// Compara dos mapas ruta → hash. Devuelve lo que solo tiene Claude Design, lo que solo tiene el repo y lo que difiere.
export function diffTrees(design, repo) {
  const onlyDesign = [], onlyRepo = [], different = [];
  for (const [p, h] of design) { if (!repo.has(p)) onlyDesign.push(p); else if (repo.get(p) !== h) different.push(p); }
  for (const p of repo.keys()) if (!design.has(p)) onlyRepo.push(p);
  return {onlyDesign: onlyDesign.sort(), onlyRepo: onlyRepo.sort(), different: different.sort()};
}

// Lee un manifiesto de Claude Design: el JSON directo o la respuesta de get_file ({content: "<json>"}).
export function parseManifest(raw) {
  let m = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (m && typeof m.content === 'string' && !m.files) m = JSON.parse(m.content);
  if (!m || typeof m.files !== 'object' || Array.isArray(m.files)) throw Error('el manifiesto debe tener un objeto "files" {ruta: hash}');
  const files = new Map();
  for (const [p, h] of Object.entries(m.files)) {
    if (typeof h !== 'string' || !/^[0-9a-f]{64}$/i.test(h)) throw Error(`hash no válido para ${p}`);
    files.set(p, h.toLowerCase());
  }
  return {files, generated: m.generated ?? null, nonce: m.nonce ?? null};
}

// Comparación a tres bandas. `baseline` es lo último que se integró ({ruta: {design, repo}}), `design` y `repo` son los mapas ruta → hash de ahora.
// Lo que importa es no perder trabajo: un archivo que Claude Design cambió desde la última integración y que el repo no ha tocado está SIN INTEGRAR.
export function threeWay({baseline = {}, discarded = [], design, repo}) {
  const out = {pending: [], newInDesign: [], needsConfirm: [], repoAhead: [], integrated: [], discarded: [], designDeleted: [], repoOnly: [], unchanged: []};
  const dropped = new Map(discarded.map(d => [d.path, d.designHash]));
  for (const [p, d] of design) {
    if (dropped.get(p) === d) { out.discarded.push(p); continue; }
    const r = repo.get(p), b = baseline[p];
    if (r === undefined) { out.newInDesign.push(p); continue; }
    if (r === d) { (b && b.design === d && b.repo === r ? out.unchanged : out.integrated).push(p); continue; }
    if (!b) { out.needsConfirm.push(p); continue; }          // sin historia: hay que confirmar que está integrado
    if (b.design === d) { out.repoAhead.push(p); continue; } // Claude Design no ha cambiado; el repo va por delante
    if (b.repo === r) out.pending.push(p);                   // Claude Design cambió y el repo no se tocó: SIN INTEGRAR
    else out.needsConfirm.push(p);                           // ambos cambiaron: confirmar que se integró
  }
  for (const p of repo.keys()) {
    if (design.has(p)) continue;
    if (baseline[p]) out.designDeleted.push(p); else out.repoOnly.push(p);
  }
  for (const k of Object.keys(out)) out[k].sort();
  // Bloquea el push lo que puede perder trabajo: sin integrar, nuevo en Claude Design o sin confirmar.
  out.blocking = [...out.pending, ...out.newInDesign, ...out.needsConfirm].sort();
  return out;
}
