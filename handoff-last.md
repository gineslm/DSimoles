# Aviso de traspaso a Claude Design

Generado el 2026-10-12 · base: `4af6c438ee59` (origin/main) · framework: 1.2.0 → 2.2.1.

Este archivo describe lo que cambia respecto a la base. No contiene el hash de su propio commit: el prompt que lo acompaña lo indica. Se reescribe en cada envío; el historial está en `CHANGELOG.md`.

## Resumen

- Diseño: 45 archivos
- Framework: 43 archivos
- Proyecto (documentación): 8 archivos
- Otros: 1 archivo

## Cambios por tipo

### Diseño

- `data/guide.json` · modificado · hecho en Claude Code — 146 IDs, entre ellos: components, components.accessibility, components.actions, components.data, components.disclosure-and-overlays, components.feedback, components.field-structure, components.input-and-selection, components.navigation, components.presentation, content, content.accessibility, …
- `data/project.json` · modificado · hecho en Claude Code — 132 IDs, entre ellos: components.accessibility, components.actions, components.data, components.disclosure-and-overlays, components.feedback, components.field-structure, components.input-and-selection, components.navigation, components.presentation, content.accessibility, content.conventions-and-formats, content.help-and-instructions, …
- `sections/components/accessibility.dc.html` · nuevo · hecho en Claude Code
- `sections/components/actions.dc.html` · nuevo · hecho en Claude Code
- `sections/components/data.dc.html` · nuevo · hecho en Claude Code
- `sections/components/disclosure-and-overlays.dc.html` · nuevo · hecho en Claude Code
- `sections/components/feedback.dc.html` · nuevo · hecho en Claude Code
- `sections/components/field-structure.dc.html` · nuevo · hecho en Claude Code
- `sections/components/input-and-selection.dc.html` · nuevo · hecho en Claude Code
- `sections/components/navigation.dc.html` · nuevo · hecho en Claude Code
- `sections/components/presentation.dc.html` · nuevo · hecho en Claude Code
- `sections/components/support.js` · nuevo · coincide con Claude Design
- `sections/foundations/accessibility.dc.html` · nuevo · hecho en Claude Code
- `sections/foundations/goals-and-usage-guide.dc.html` · nuevo · hecho en Claude Code
- `sections/foundations/products-and-requirements.dc.html` · nuevo · hecho en Claude Code
- `sections/foundations/support.js` · nuevo · coincide con Claude Design
- `sections/foundations/system-users.dc.html` · nuevo · hecho en Claude Code
- `sections/implementation/publishing-and-migration.dc.html` · nuevo · hecho en Claude Code
- `sections/implementation/support.js` · nuevo · coincide con Claude Design
- `sections/interaction/focus-management.dc.html` · nuevo · hecho en Claude Code
- `sections/interaction/interaction-states.dc.html` · nuevo · hecho en Claude Code
- `sections/interaction/support.js` · nuevo · coincide con Claude Design
- `sections/layout/breakpoints.dc.html` · nuevo · hecho en Claude Code
- `sections/layout/containers-and-grid.dc.html` · nuevo · hecho en Claude Code
- `sections/layout/support.js` · nuevo · coincide con Claude Design
- `sections/navigation/current-location.dc.html` · nuevo · hecho en Claude Code
- `sections/navigation/levels-and-hierarchy.dc.html` · nuevo · hecho en Claude Code
- `sections/navigation/support.js` · nuevo · coincide con Claude Design
- `sections/patterns/forms-and-validation.dc.html` · nuevo · hecho en Claude Code
- `sections/patterns/support.js` · nuevo · coincide con Claude Design
- `sections/resources/libraries-and-licenses.dc.html` · nuevo · hecho en Claude Code
- `sections/resources/support.js` · nuevo · coincide con Claude Design
- `sections/tokens/design-code-mapping.dc.html` · nuevo · hecho en Claude Code
- `sections/tokens/naming-and-aliases.dc.html` · nuevo · hecho en Claude Code
- `sections/tokens/support.js` · nuevo · coincide con Claude Design
- `sections/tokens/token-layers.dc.html` · nuevo · hecho en Claude Code
- `sections/visuals/accessibility.dc.html` · nuevo · hecho en Claude Code
- `sections/visuals/borders.dc.html` · nuevo · hecho en Claude Code
- `sections/visuals/color.dc.html` · modificado · hecho en Claude Code
- `sections/visuals/dimensions.dc.html` · nuevo · hecho en Claude Code
- `sections/visuals/elevation.dc.html` · nuevo · hecho en Claude Code
- `sections/visuals/opacity.dc.html` · nuevo · hecho en Claude Code
- `sections/visuals/shape.dc.html` · nuevo · hecho en Claude Code
- `sections/visuals/spacing.dc.html` · nuevo · hecho en Claude Code
- `sections/visuals/typography.dc.html` · nuevo · hecho en Claude Code

### Framework

- `.claude/skills/dsbook-handoff/SKILL.md` · nuevo · coincide con Claude Design
- `app.js` · modificado · hecho en Claude Code
- `assets/_runtime/README.md` · modificado · hecho en Claude Code
- `docs/claude-code.md` · modificado · hecho en Claude Code
- `docs/claude-design.md` · modificado · hecho en Claude Code
- `docs/data-contract.md` · modificado · hecho en Claude Code
- `docs/framework.md` · modificado · hecho en Claude Code
- `docs/glossary.md` · nuevo · hecho en Claude Code
- `docs/handoff.md` · modificado · hecho en Claude Code
- `docs/page-style.md` · modificado · hecho en Claude Code
- `docs/quality.md` · modificado · hecho en Claude Code
- `docs/scripts.md` · modificado · hecho en Claude Code
- `docs/template.md` · modificado · hecho en Claude Code
- `dsbook.json` · modificado · hecho en Claude Code
- `index.html` · modificado · hecho en Claude Code
- `model.js` · modificado · hecho en Claude Code
- `package.json` · modificado · hecho en Claude Code
- `scripts/about.test.mjs` · modificado · coincide con Claude Design
- `scripts/check.mjs` · modificado · coincide con Claude Design
- `scripts/check.test.mjs` · modificado · coincide con Claude Design
- `scripts/container.test.mjs` · modificado · coincide con Claude Design
- `scripts/design-diff.mjs` · nuevo · coincide con Claude Design
- `scripts/fixtures/page.dc.html` · modificado · coincide con Claude Design
- `scripts/framework-lib.mjs` · modificado · coincide con Claude Design
- `scripts/framework.mjs` · modificado · coincide con Claude Design
- `scripts/framework.test.mjs` · modificado · coincide con Claude Design
- `scripts/handoff-lib.mjs` · nuevo · coincide con Claude Design
- `scripts/handoff-note.mjs` · nuevo · coincide con Claude Design
- `scripts/handoff-protection.test.mjs` · nuevo · coincide con Claude Design
- `scripts/handoff.test.mjs` · nuevo · coincide con Claude Design
- `scripts/home.test.mjs` · modificado · coincide con Claude Design
- `scripts/hooks-install.mjs` · nuevo · coincide con Claude Design
- `scripts/hooks/pre-push` · nuevo · coincide con Claude Design
- `scripts/init.mjs` · modificado · coincide con Claude Design
- `scripts/init.test.mjs` · modificado · coincide con Claude Design
- `scripts/model.test.mjs` · modificado · coincide con Claude Design
- `scripts/pre-push-check.mjs` · nuevo · coincide con Claude Design
- `scripts/serve.mjs` · modificado · coincide con Claude Design
- `scripts/serve.test.mjs` · modificado · coincide con Claude Design
- `seed/guide.json` · modificado · hecho en Claude Code
- `seed/project.json` · modificado · hecho en Claude Code
- `styles.css` · modificado · hecho en Claude Code
- `templates/component.md` · modificado · hecho en Claude Code

### Proyecto (documentación)

- `assets/README.md` · modificado · hecho en Claude Code
- `CHANGELOG.md` · modificado · hecho en Claude Code
- `CLAUDE.md` · modificado · hecho en Claude Code
- `design-baseline.json` · nuevo · coincide con Claude Design
- `docs/proposals/pilot-6-castellano.md` · nuevo · hecho en Claude Code
- `docs/proposals/README.md` · modificado · hecho en Claude Code
- `README.md` · modificado · hecho en Claude Code
- `sections/README.md` · modificado · hecho en Claude Code

### Otros

- `.gitignore` · modificado · hecho en Claude Code

## Diferencias con la versión de Claude Design

Comparación del 2026-10-12 (manifiesto de hashes).

- Con contenido distinto (62): `.gitignore`, `CHANGELOG.md`, `CLAUDE.md`, `README.md`, `app.js`, `assets/README.md`, `assets/_runtime/README.md`, `data/guide.json`, `data/project.json`, `docs/claude-code.md`, `docs/claude-design.md`, `docs/data-contract.md`, `docs/framework.md`, `docs/handoff.md`, `docs/page-style.md`, `docs/proposals/README.md`, `docs/quality.md`, `docs/scripts.md`, `docs/template.md`, `dsbook.json`, `index.html`, `model.js`, `package.json`, `sections/README.md`, `sections/components/accessibility.dc.html`, `sections/components/actions.dc.html`, `sections/components/data.dc.html`, `sections/components/disclosure-and-overlays.dc.html`, `sections/components/feedback.dc.html`, `sections/components/field-structure.dc.html`, `sections/components/input-and-selection.dc.html`, `sections/components/navigation.dc.html`, `sections/components/presentation.dc.html`, `sections/foundations/accessibility.dc.html`, `sections/foundations/goals-and-usage-guide.dc.html`, `sections/foundations/products-and-requirements.dc.html`, `sections/foundations/system-users.dc.html`, `sections/implementation/publishing-and-migration.dc.html`, `sections/interaction/focus-management.dc.html`, `sections/interaction/interaction-states.dc.html`, `sections/layout/breakpoints.dc.html`, `sections/layout/containers-and-grid.dc.html`, `sections/navigation/current-location.dc.html`, `sections/navigation/levels-and-hierarchy.dc.html`, `sections/patterns/forms-and-validation.dc.html`, `sections/resources/libraries-and-licenses.dc.html`, `sections/tokens/design-code-mapping.dc.html`, `sections/tokens/naming-and-aliases.dc.html`, `sections/tokens/token-layers.dc.html`, `sections/visuals/accessibility.dc.html`, `sections/visuals/borders.dc.html`, `sections/visuals/color.dc.html`, `sections/visuals/dimensions.dc.html`, `sections/visuals/elevation.dc.html`, `sections/visuals/opacity.dc.html`, `sections/visuals/shape.dc.html`, `sections/visuals/spacing.dc.html`, `sections/visuals/typography.dc.html`, `seed/guide.json`, `seed/project.json`, `styles.css`, `templates/component.md`
- Solo en este repositorio (2): `docs/glossary.md`, `docs/proposals/pilot-6-castellano.md`

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
