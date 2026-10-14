# Aviso de traspaso a Claude Design

Generado el 2026-10-14 · base: `150b9ec16368` (origin/main) · framework: 2.5.0 → 2.6.0.

Este archivo describe lo que cambia respecto a la base. No contiene el hash de su propio commit: el prompt que lo acompaña lo indica. Se reescribe en cada envío; el historial está en `CHANGELOG.md`.

## Resumen

- Diseño: 72 archivos
- Estructura: 1 archivo
- Framework: 5 archivos
- Proyecto (documentación): 1 archivo
- Otros: 28 archivos

## Cambios por tipo

### Diseño

- `assets/components/presentation/antebrazo-izq-02.jpg` · nuevo · coincide con Claude Design
- `assets/components/presentation/gemelo.jpg` · nuevo · coincide con Claude Design
- `assets/components/presentation/no-evaluable.jpg` · nuevo · coincide con Claude Design
- `assets/components/presentation/omoplato-izq-01.jpg` · nuevo · coincide con Claude Design
- `assets/implementation/publishing-and-migration/discrepancias-ds-imoles.md` · nuevo · coincide con Claude Design
- `assets/visuals/tokens.css` · nuevo · coincide con Claude Design
- `assets/visuals/typography/fonts/LICENSE-Material-Symbols.txt` · nuevo · coincide con Claude Design
- `assets/visuals/typography/fonts/LICENSE-Roboto-Condensed.txt` · nuevo · coincide con Claude Design
- `assets/visuals/typography/fonts/LICENSE-Roboto.txt` · nuevo · coincide con Claude Design
- `assets/visuals/typography/fonts/material-symbols-rounded-subset.woff2` · nuevo · coincide con Claude Design
- `assets/visuals/typography/fonts/roboto-300.woff2` · nuevo · coincide con Claude Design
- `assets/visuals/typography/fonts/roboto-400.woff2` · nuevo · coincide con Claude Design
- `assets/visuals/typography/fonts/roboto-500.woff2` · nuevo · coincide con Claude Design
- `assets/visuals/typography/fonts/roboto-condensed-700.woff2` · nuevo · coincide con Claude Design
- `data/project.json` · modificado · coincide con Claude Design — 61 IDs, entre ellos: components.accessibility, components.actions, components.back-link, components.bottom-nav, components.button, components.choice-list, components.data, components.description-list, components.disclosure, components.disclosure-and-overlays, components.feedback, components.field, …
- `sections/components/accessibility.dc.html` · modificado · coincide con Claude Design
- `sections/components/actions.dc.html` · eliminado · coincide con Claude Design
- `sections/components/back-link.dc.html` · nuevo · coincide con Claude Design
- `sections/components/bottom-nav.dc.html` · nuevo · coincide con Claude Design
- `sections/components/button.dc.html` · nuevo · coincide con Claude Design
- `sections/components/choice-list.dc.html` · nuevo · coincide con Claude Design
- `sections/components/data.dc.html` · eliminado · coincide con Claude Design
- `sections/components/description-list.dc.html` · nuevo · coincide con Claude Design
- `sections/components/disclosure-and-overlays.dc.html` · eliminado · coincide con Claude Design
- `sections/components/disclosure.dc.html` · nuevo · coincide con Claude Design
- `sections/components/feedback.dc.html` · eliminado · coincide con Claude Design
- `sections/components/field-structure.dc.html` · eliminado · coincide con Claude Design
- `sections/components/field.dc.html` · nuevo · coincide con Claude Design
- `sections/components/fieldset.dc.html` · nuevo · coincide con Claude Design
- `sections/components/filter-chips.dc.html` · nuevo · coincide con Claude Design
- `sections/components/icon-button.dc.html` · nuevo · coincide con Claude Design
- `sections/components/icon.dc.html` · nuevo · coincide con Claude Design
- `sections/components/inline-alert.dc.html` · nuevo · coincide con Claude Design
- `sections/components/input-and-selection.dc.html` · eliminado · coincide con Claude Design
- `sections/components/list-row.dc.html` · nuevo · coincide con Claude Design
- `sections/components/navigation.dc.html` · eliminado · coincide con Claude Design
- `sections/components/options-menu.dc.html` · nuevo · coincide con Claude Design
- `sections/components/pager.dc.html` · nuevo · coincide con Claude Design
- `sections/components/presentation.dc.html` · eliminado · coincide con Claude Design
- `sections/components/process-steps.dc.html` · nuevo · coincide con Claude Design
- `sections/components/segmented-control.dc.html` · nuevo · coincide con Claude Design
- `sections/components/spinner.dc.html` · nuevo · coincide con Claude Design
- `sections/components/status-chip.dc.html` · nuevo · coincide con Claude Design
- `sections/components/text-field.dc.html` · nuevo · coincide con Claude Design
- `sections/components/text-link.dc.html` · nuevo · coincide con Claude Design
- `sections/imoles-components/action-card.dc.html` · nuevo · coincide con Claude Design
- `sections/imoles-components/analysis-summary.dc.html` · nuevo · coincide con Claude Design
- `sections/imoles-components/capture-row.dc.html` · nuevo · coincide con Claude Design
- `sections/imoles-components/follow-up-card.dc.html` · nuevo · coincide con Claude Design
- `sections/imoles-components/follow-up-header.dc.html` · nuevo · coincide con Claude Design
- `sections/imoles-components/risk-badge.dc.html` · nuevo · coincide con Claude Design
- `sections/imoles-components/summary-card.dc.html` · nuevo · coincide con Claude Design
- `sections/imoles-components/support.js` · nuevo · coincide con Claude Design
- `sections/implementation/publishing-and-migration.dc.html` · modificado · coincide con Claude Design
- `sections/interaction/focus-management.dc.html` · modificado · coincide con Claude Design
- `sections/interaction/interaction-states.dc.html` · modificado · coincide con Claude Design
- `sections/layout/breakpoints.dc.html` · modificado · coincide con Claude Design
- `sections/navigation/current-location.dc.html` · modificado · coincide con Claude Design
- `sections/tokens/design-code-mapping.dc.html` · modificado · coincide con Claude Design
- `sections/tokens/naming-and-aliases.dc.html` · modificado · coincide con Claude Design
- `sections/tokens/simple-and-composite-values.dc.html` · nuevo · coincide con Claude Design
- `sections/tokens/token-layers.dc.html` · modificado · coincide con Claude Design
- `sections/tokens/token-lifecycle.dc.html` · nuevo · coincide con Claude Design
- `sections/visuals/accessibility.dc.html` · modificado · coincide con Claude Design
- `sections/visuals/borders.dc.html` · modificado · coincide con Claude Design
- `sections/visuals/color.dc.html` · modificado · coincide con Claude Design
- `sections/visuals/dimensions.dc.html` · modificado · coincide con Claude Design
- `sections/visuals/elevation.dc.html` · modificado · coincide con Claude Design
- `sections/visuals/opacity.dc.html` · modificado · coincide con Claude Design
- `sections/visuals/shape.dc.html` · modificado · coincide con Claude Design
- `sections/visuals/spacing.dc.html` · modificado · coincide con Claude Design
- `sections/visuals/typography.dc.html` · modificado · coincide con Claude Design

### Estructura

- `data/guide.json` · modificado · coincide con Claude Design — 104 IDs, entre ellos: components, components.accessibility, components.actions, components.back-link, components.bottom-nav, components.button, components.choice-list, components.data, components.description-list, components.disclosure, components.disclosure-and-overlays, components.feedback, …

### Framework

- `.claude/skills/dsbook-handoff/SKILL.md` · modificado
- `docs/scripts.md` · modificado · hecho en Claude Code
- `dsbook.json` · modificado · hecho en Claude Code
- `scripts/design-diff.mjs` · modificado
- `scripts/handoff-protection.test.mjs` · modificado

### Proyecto (documentación)

- `design-baseline.json` · modificado

### Otros

- `components/ActionCard.js` · nuevo · coincide con Claude Design
- `components/AnalysisSummary.js` · nuevo · coincide con Claude Design
- `components/BackLink.js` · nuevo · coincide con Claude Design
- `components/BottomNav.js` · nuevo · coincide con Claude Design
- `components/Button.js` · nuevo · coincide con Claude Design
- `components/CaptureRow.js` · nuevo · coincide con Claude Design
- `components/ChoiceList.js` · nuevo · coincide con Claude Design
- `components/core.js` · nuevo · coincide con Claude Design
- `components/DescriptionList.js` · nuevo · coincide con Claude Design
- `components/Disclosure.js` · nuevo · coincide con Claude Design
- `components/Field.js` · nuevo · coincide con Claude Design
- `components/FilterChips.js` · nuevo · coincide con Claude Design
- `components/FollowUpCard.js` · nuevo · coincide con Claude Design
- `components/FollowUpHeader.js` · nuevo · coincide con Claude Design
- `components/IconButton.js` · nuevo · coincide con Claude Design
- `components/InlineAlert.js` · nuevo · coincide con Claude Design
- `components/ListRow.js` · nuevo · coincide con Claude Design
- `components/OptionsMenu.js` · nuevo · coincide con Claude Design
- `components/Pager.js` · nuevo · coincide con Claude Design
- `components/ProcessSteps.js` · nuevo · coincide con Claude Design
- `components/README.md` · nuevo · coincide con Claude Design
- `components/RiskBadge.js` · nuevo · coincide con Claude Design
- `components/SegmentedControl.js` · nuevo · coincide con Claude Design
- `components/StatusChip.js` · nuevo · coincide con Claude Design
- `components/SummaryCard.js` · nuevo · coincide con Claude Design
- `components/TextField.js` · nuevo · coincide con Claude Design
- `components/TextLink.js` · nuevo · coincide con Claude Design
- `components/tokens.css` · nuevo · coincide con Claude Design

> La estructura del catálogo cambió (IDs, números o rutas de `data/guide.json`): Claude Design debe actualizar su mapa de pantallas y no renombrar nada por su cuenta.

## Diferencias con la versión de Claude Design

Comparación del 2026-10-14 (manifiesto de hashes).

- Con contenido distinto (2): `docs/scripts.md`, `dsbook.json`

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
