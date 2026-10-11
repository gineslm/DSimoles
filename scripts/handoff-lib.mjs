// Lógica compartida por `design-diff` y `handoff-note`: a qué tipo pertenece cada archivo del repositorio.
// Es lógica pura (sin git ni disco) para poder probarla.
export const TYPES = {
  diseno: 'Diseño',
  estructura: 'Estructura',
  framework: 'Framework',
  proyecto: 'Proyecto (documentación)',
  otros: 'Otros',
};

const PROJECT_DOCS = /^(README\.md|CLAUDE\.md|CHANGELOG\.md|LICENSE|ROADMAP\.md|handoff-last\.md|sections\/README\.md|assets\/README\.md|docs\/proposals\/.*)$/;

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

// Rutas que Claude Design tiene y el repositorio no debe recibir.
export const DESIGN_IGNORED = /^(_ds\/|uploads\/|github\.md$|\.thumbnail$|scripts\/|node_modules\/|\.git\/|\.claude\/)/;

// Compara dos mapas ruta → hash. Devuelve lo que solo tiene Claude Design, lo que solo tiene el repo y lo que difiere.
export function diffTrees(design, repo) {
  const onlyDesign = [], onlyRepo = [], different = [];
  for (const [p, h] of design) { if (!repo.has(p)) onlyDesign.push(p); else if (repo.get(p) !== h) different.push(p); }
  for (const p of repo.keys()) if (!design.has(p)) onlyRepo.push(p);
  return {onlyDesign: onlyDesign.sort(), onlyRepo: onlyRepo.sort(), different: different.sort()};
}
