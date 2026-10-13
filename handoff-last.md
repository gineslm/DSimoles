# Aviso de traspaso a Claude Design

Generado el 2026-10-13 · base: `509e3783bfb8` (origin/main) · framework: 2.4.0 → 2.5.0.

Este archivo describe lo que cambia respecto a la base. No contiene el hash de su propio commit: el prompt que lo acompaña lo indica. Se reescribe en cada envío; el historial está en `CHANGELOG.md`.

## Resumen

- Diseño: 13 archivos
- Estructura: 1 archivo
- Framework: 6 archivos
- Proyecto (documentación): 1 archivo

## Cambios por tipo

### Diseño

- `data/project.json` · modificado · coincide con Claude Design — IDs: documentation.reference-evidence, foundations.accessibility, foundations.design-principles, foundations.goals-and-usage-guide, foundations.products-and-requirements, foundations.system-users, governance.accessibility, governance.team-and-contribution, quality.accessibility
- `sections/documentation/imoles-app.dc.html` · modificado · coincide con Claude Design
- `sections/documentation/reference-evidence.dc.html` · nuevo · coincide con Claude Design
- `sections/foundations/accessibility.dc.html` · modificado · coincide con Claude Design
- `sections/foundations/design-principles.dc.html` · nuevo · coincide con Claude Design
- `sections/foundations/goals-and-usage-guide.dc.html` · modificado · coincide con Claude Design
- `sections/foundations/products-and-requirements.dc.html` · modificado · coincide con Claude Design
- `sections/foundations/system-users.dc.html` · modificado · coincide con Claude Design
- `sections/governance/accessibility.dc.html` · nuevo · coincide con Claude Design
- `sections/governance/support.js` · nuevo · coincide con Claude Design
- `sections/governance/team-and-contribution.dc.html` · nuevo · coincide con Claude Design
- `sections/quality/accessibility.dc.html` · nuevo · coincide con Claude Design
- `sections/quality/support.js` · nuevo · coincide con Claude Design

### Estructura

- `data/guide.json` · modificado · coincide con Claude Design — IDs: documentation.imoles-app, documentation.reference-evidence, foundations.products-and-requirements, foundations.system-users

### Framework

- `app.js` · modificado · hecho en Claude Code
- `docs/quality.md` · modificado · hecho en Claude Code
- `dsbook.json` · modificado · hecho en Claude Code
- `model.js` · modificado · hecho en Claude Code
- `scripts/container.test.mjs` · modificado
- `scripts/model.test.mjs` · modificado

### Proyecto (documentación)

- `design-baseline.json` · modificado

> La estructura del catálogo cambió (IDs, números o rutas de `data/guide.json`): Claude Design debe actualizar su mapa de pantallas y no renombrar nada por su cuenta.

## Diferencias con la versión de Claude Design

Comparación del 2026-10-13 (manifiesto de hashes).

- Con contenido distinto (6): `CHANGELOG.md`, `README.md`, `app.js`, `docs/quality.md`, `dsbook.json`, `model.js`

## Qué debe hacer Claude Design

1. **Antes de nada, protege tu trabajo.** Calcula el hash de cada archivo que tengas y compáralo con `design-baseline.json` (raíz del repositorio, campo `design`). Si tu hash difiere de la base y el contenido del repositorio difiere del tuyo, **no lo sobrescribas**: guarda tu copia en `_backup/<fecha>/<ruta>` y avísame.
2. Leer el repositorio y comprobar que el commit indicado en el prompt contiene lo que figura arriba.
3. Para lo marcado «hecho en Claude Code» o con contenido distinto: adoptar la versión del repositorio como base antes de seguir editando, salvo lo protegido en el paso 1.
4. Actualizar `github.md` con el nuevo commit, la versión de `CHANGELOG.md` y la versión del framework.
5. Responder con lo que comprobó, lo que difiere, lo que protegió y su nueva base.

## Qué no debe tocar

- El framework (contenedor, `scripts/`, `seed/`, runtime y `docs/`).
- IDs, rutas y carpetas existentes.
- `_ds/`, `github.md` y `uploads/` no se transfieren.
