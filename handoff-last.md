# Aviso de traspaso a Claude Design

Generado el 2026-10-13 · base: `08beb60ba368` (origin/main) · framework: 2.3.1 → 2.3.2.

Este archivo describe lo que cambia respecto a la base. No contiene el hash de su propio commit: el prompt que lo acompaña lo indica. Se reescribe en cada envío; el historial está en `CHANGELOG.md`.

## Resumen

- Diseño: 4 archivos
- Estructura: 1 archivo
- Framework: 5 archivos
- Proyecto (documentación): 2 archivos

## Cambios por tipo

### Diseño

- `data/project.json` · modificado · coincide con Claude Design — IDs: documentation.imoles-app, foundations.goals-and-usage-guide
- `sections/documentation/imoles-app.dc.html` · nuevo · coincide con Claude Design
- `sections/documentation/support.js` · nuevo · coincide con Claude Design
- `sections/foundations/goals-and-usage-guide.dc.html` · modificado · coincide con Claude Design

### Estructura

- `data/guide.json` · modificado · coincide con Claude Design — IDs: documentation, documentation.imoles-app

### Framework

- `dsbook.json` · modificado · hecho en Claude Code
- `scripts/about.test.mjs` · modificado
- `scripts/check.test.mjs` · modificado
- `scripts/home.test.mjs` · modificado
- `scripts/model.test.mjs` · modificado

### Proyecto (documentación)

- `CHANGELOG.md` · modificado · hecho en Claude Code
- `design-baseline.json` · modificado

> La estructura del catálogo cambió (IDs, números o rutas de `data/guide.json`): Claude Design debe actualizar su mapa de pantallas y no renombrar nada por su cuenta.

## Diferencias con la versión de Claude Design

Comparación del 2026-10-13 (manifiesto de hashes).

- Con contenido distinto (2): `CHANGELOG.md`, `dsbook.json`

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
