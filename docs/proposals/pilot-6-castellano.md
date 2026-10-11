# Pilot 6 · El repositorio pasa a castellano

Fecha: 2026-10-11 · Origen: la persona responsable trabaja los análisis con más facilidad en castellano. Estado de cada decisión en el [registro](README.md). Todas están aplicadas (framework 2.0.0).

## J1 · Todo se escribe en castellano
**Estado: aplicada.**

Revierte la decisión F10 de [pilot-3](pilot-3-data-and-structure.md#f10--the-whole-repository-is-in-english). Datos, documentación, páginas, textos de la interfaz, mensajes de los scripts y mensajes de commit pasan a castellano. La conversación con las personas responsables también.

Motivo: el coste de revisar y decidir sobre textos analíticos en un idioma que no es el de trabajo pesa más que el ahorro de tokens que justificó F10. La razón de F10 para no mantener dos idiomas sigue en pie, así que no se añade una capa de idiomas: el repositorio entero tiene un solo idioma, ahora el castellano.

## J2 · Los términos y las etiquetas se quedan en inglés
**Estado: aplicada.**

Igual que en desarrollo de software: la prosa va en castellano; los términos y las etiquetas, en inglés. La lista está en [glossary.md](../glossary.md) (estados, vistas del contenedor, task, notes, owner, review, record, token, handoff, seed…). Los IDs, rutas, carpetas y claves JSON siguen siendo los mismos slugs en inglés.

## J3 · La guía se restaura desde el castellano original
**Estado: aplicada.**

Las 14 categorías y las 132 subsecciones recuperan su texto en castellano a partir de la versión anterior a F10 (commit `45ac86c^`), emparejadas por posición y número, que coinciden con las actuales. Cambios sobre ese original:
- Se restauran las comas y los dos puntos de los títulos que la versión original había perdido (por ejemplo "Voz, tono y terminología").
- Se corrigen dos objetivos y entregables con mayúsculas erróneas: 4.5 (grid y Flexbox) y 11.3 (la API de componentes).
- `seed/guide.json` queda idéntico a `data/guide.json`, con `version` 2.0.0.

`data/project.json` conserva IDs, estados y decisiones; se traducen el motivo de exclusión común, el record del proyecto y las notes y tasks de `visuals.color` y `implementation.publishing-and-migration`. `language` pasa a `es`.

## J4 · Framework 2.0.0
**Estado: aplicada.**

Es un cambio MAJOR: `check` exige `lang="es"` en las páginas `.dc.html` y los proyectos con páginas en otro idioma tienen que adaptarlas. Cambian el contenedor (`index.html`, `app.js`, `model.js`), los scripts y sus pruebas, el seed, las guías de `docs/` (con el nuevo `glossary.md`) y `templates/component.md`. El cambio se registra con `npm run framework -- --release 2.0.0` y se porta al repositorio DSBook.

## J5 · El historial no se reescribe
**Estado: aplicada.**

`CHANGELOG.md` anterior a 2.0.0 y `docs/proposals/` (incluida esta página de F10) se quedan en el idioma en que se escribieron. Las entradas y propuestas nuevas van en castellano.

## J6 · La página Color se traduce aquí
**Estado: aplicada.**

La página `visuals.color` se tradujo en este repositorio, no en Claude Design, para mantener `check` en verde en el mismo cambio. Las etiquetas de interfaz de iMoles que citaba con `lang="es"` ya no necesitan esa marca, porque la página entera está en castellano. Los nombres de los tokens (`brand.600`, `text.primary`…) y los nombres de las propiedades CSS de iMoles (`--imoles-*`) no cambian. Claude Design debe partir de esta versión antes de volver a editarla.

## J7 · El ciclo de trabajo y los accesos quedan escritos
**Estado: aplicada** (framework 2.0.1).

El ciclo (GitHub como única fuente de verdad → Claude Design construye → Claude Code se conecta por MCP y trae los cambios → implementación local → validación de la persona responsable → push a GitHub → Claude Design confirma) estaba repartido entre tres guías y sin los pasos de validación humana y de confirmación. Ahora está en [handoff.md](../handoff.md#el-ciclo-de-trabajo) y resumido en el `CLAUDE.md` de cada repositorio. Se añade la regla de accesos: un agente al que le falta git o la conexión al proyecto de Claude Design se detiene y lo pide. Cada proyecto registra su repositorio y su proyecto de Claude Design en la sección "Conexiones del proyecto" de su `CLAUDE.md`. Tras cada push, Claude Code escribe el [aviso a Claude Design](../handoff.md#el-aviso-a-claude-design): commit, versión, lo cambiado agrupado por tipo (diseño, contenido hecho en Claude Code, framework, estructura) y qué debe comprobar.

## J8 · Scripts para el traspaso con Claude Design
**Estado: aplicada** (framework 2.1.0).

`npm run design-diff` compara un proyecto de Claude Design (una carpeta con sus archivos, o el listado de `list_files`) con el repositorio y lo agrupa por tipo. `npm run handoff-note` escribe `handoff-last.md` con lo que cambia respecto a lo último publicado. Orden: `design-diff` al traer los cambios y antes del commit; `handoff-note` antes del commit; el prompt, tras el push, con el hash publicado. El archivo vive en la raíz y no en `docs/` porque `docs/` es del framework y `check` exige que sus archivos estén registrados. Los scripts no se conectan a Claude Design: lo hace el agente por MCP. Verificado con el listado real de Claude Design: solo faltaban allí `docs/glossary.md` y `docs/proposals/pilot-6-castellano.md`.
