# Aviso de traspaso a Claude Design

Generado el 2026-10-15 · base: `862604890ce6` (origin/main) · framework: 2.6.1.

Este archivo describe lo que cambia respecto a la base. No contiene el hash de su propio commit: el prompt que lo acompaña lo indica. Se reescribe en cada envío; el historial está en `CHANGELOG.md`.

## Resumen

- Diseño: 2 archivos
- Proyecto (documentación): 1 archivo
- Otros: 2 archivos

## Cambios por tipo

### Diseño

- `data/project.json` · modificado · hecho en Claude Code — IDs: components.text-link
- `sections/components/text-link.dc.html` · modificado · coincide con Claude Design

### Proyecto (documentación)

- `design-baseline.json` · modificado

### Otros

- `components/core.js` · modificado · coincide con Claude Design
- `components/TextLink.js` · modificado · coincide con Claude Design

## Diferencias con la versión de Claude Design

Comparación del 2026-10-15 (manifiesto de hashes).

- Con contenido distinto (1): `data/project.json`

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
