# Piloto 1 · Decisiones para aplicar en el repositorio

Fecha: 2026-10-08 · Origen: sesión piloto en Claude Design sobre el repositorio (entonces `gineslm/DSiomles@main`, hoy `gineslm/DSimoles`).
Destinatario: Claude Code. Estado de cada decisión en el [registro](README.md).

Este documento se ha corregido tras aplicar el piloto. Cada decisión conserva su motivo original y añade un apartado **Estado y resultado** con lo que realmente se hizo. Donde la premisa original resultó errónea, se indica.

---

## D1 · Las páginas de sección se crean como Design Components (`.dc.html`)
**Estado: aplicada.**

**Motivo.** El HTML plano impide en Claude Design la edición estructurada, los controles de variantes y la reutilización de componentes entre páginas.

**Propuesta original.** `safePage` acepta `.dc.html`; `guide.json` no cambia (la ruta sugerida admite las dos variantes); regla 3 de `CLAUDE.md` permite el runtime vendorizado; identificar el runtime en la primera transferencia; el sandbox del iframe no cambia de antemano; la meta `ds-section-id` en el `<head>`.

**Estado y resultado.**
- `safePage` y `pageCandidates` admiten `.html` y `.dc.html`. Si coexisten para una misma sección, `check` falla.
- **Runtime identificado:** `support.js` (generado por Claude Design, uno por carpeta de `sections/`, idéntico en todas) y React 18.3.1 y React-DOM, que `support.js` descargaba de unpkg. Se vendorizó React en `assets/_runtime/` y cada página lo carga antes de `support.js`. `check` verifica el orden, que no haya scripts externos, que las copias de `support.js` sean idénticas y que el SHA-384 del runtime coincida con el que declara `support.js`. Detalle en [data-contract.md](../data-contract.md) y [scripts.md](../scripts.md).
- **Sandbox:** sin cambios (`allow-scripts`). La página piloto funciona dentro del iframe sin `allow-same-origin`.
- **Hallazgo no previsto:** dentro del iframe, `<sc-for>` y `<sc-if>` como hijos directos de elementos de tabla no se recuperan (el runtime los reparaba con `fetch(location.href)`, que el sandbox impide). La página debe evitarlos y `check` lo vigila. Se recorrió la página entera en el contenedor para comprobarlo; la primera revisión solo había mirado la cabecera.
- **Validación con `visuales.color`:** servida por HTTP, dentro del iframe, `safePage` y `check` correctos. La revisión visual por una persona sigue siendo del responsable.
- Las dos líneas `<script>` del runtime se añaden a mano en cada página: Claude Design no tiene un ajuste que las genere. Se conservan en ediciones parciales; una reescritura completa las perdería y `check` lo detecta.
- Aviso para Windows: el runtime vendorizado y los `support.js` están marcados como `-text` en `.gitattributes`, para que `core.autocrlf` no cambie sus saltos de línea y rompa el hash.

## D2 · El contenedor web pasa a ser de solo lectura
**Estado: aplicada.**

**Motivo.** Solo se edita en Claude Design. La web es una foto del estado del repo. Editar en el navegador creaba un segundo punto de edición, un borrador que parecía un guardado y exportaciones que podían pisar las 132 entradas.

**Estado y resultado.** Eliminados el nombre editable, importar, exportar, borradores y `sessionStorage`. Estado, página, responsable, notas y revisión se muestran como texto; el estado como etiqueta R/I/P/N. Se mantienen búsqueda, filtros combinables, plegado, conmutador Guía/Desarrollo, iframe con enlace aparte y barra de avance. README, `data-contract.md` y `quality.md` actualizados.

## D3 · `data/project.json` es el registro central, editado solo por Claude Design
**Estado: aplicada.**

**Propuesta.** Claude Design modifica solo las entradas afectadas. La ruta de página se deduce del ID con `suggestedPath` (`.html` o `.dc.html`); `page` solo para excepciones. El contenedor comprueba la existencia al desplegar un elemento; `check` exige página en las secciones I y R.

**Estado y resultado.** Implementado con `pageCandidates`; el contenedor comprueba con una petición `HEAD` y exige respuesta correcta de tipo `text/html`. Si en el futuro hay varios editores simultáneos se valorará el modelo B (estado en metadatos de cada página y `project.json` generado); hoy no se aplica.

## D4 · Protocolo de transferencia y garantías
**Estado: aplicada.**

**Flujo.** GitHub es la fuente de verdad; Claude Design lee el repo y fija un estado inicial; se trabaja en Claude Design; Claude Code traslada los cambios al repo local; validación local; push.

**Estado y resultado.** Documentado en [handoff.md](../handoff.md), [claude-design.md](../claude-design.md) y [claude-code.md](../claude-code.md): base registrada en `github.md`, comprobación al inicio de cada sesión, alcance de escritura de Claude Design, alcance de copia de Claude Code, integración por ID, validación y cierre de ciclo. Se añadió una garantía no prevista: **el listado del conector filtra archivos** (hizo invisible `scripts/*.mjs`), así que se cruza con las rutas que nombran `package.json`, `CLAUDE.md` y el contrato, y se lee por ruta lo que falte.

## D5 · Registro de versiones: `CHANGELOG.md`
**Estado: aplicada.**

**Estado y resultado.** Creado y mantenido por Claude Code, una entrada por integración. Cada entrada cita el commit con los cambios y se añade en un commit posterior. Es un registro, no un informe de sesión; la regla 9 de `CLAUDE.md` se mantiene.

## D6 · Plantilla frente a proyecto
**Estado: aplicada.**

**Estado y resultado.** Repo renombrado a `gineslm/DSimoles`; `projectId: "dsimoles"` y `name: "DSimoles"`; retirada la frase de iMoles de la regla 2; instrucciones de reutilización en [plantilla.md](../plantilla.md). Decisión posterior del responsable: la web y las guías se llaman **DSBook** (el espacio de trabajo) y muestran el nombre del Design System a continuación («DSBook · DSimoles»). Se retiró `templates/section.html`: las páginas se crean directamente como `.dc.html`.

## D7 · Sistema visual
**Estado: aplicada con matiz.**

**Propuesta original.** Ignorar el DS de Ginés López vinculado a Claude Design; usar una base de documentación neutra; capa de infraestructura reutilizable para la plantilla sin abordar.

**Matiz del responsable.** La regla es general: el proyecto ignora **cualquier** design system que Claude Design cargue o vincule, salvo indicación expresa. Recogido en `CLAUDE.md` (regla 13) y `claude-design.md`.

**Pendiente.** Definir la base neutra de las páginas de documentación a medida que se desarrollen secciones; desvincular el DS cargado en los ajustes del proyecto de Claude Design (acción del responsable).

## D8 · Estado Ready
**Estado: descartada.**

**Propuesta original.** Añadir a `claude-design.md` que R exige aprobación humana y que Claude Design solo lo registra con `review.by`, `review.date` y `review.evidence`.

**Decisión del responsable (2026-10-08).** No añadir la precisión. El contrato actual de Ready no cambia: sigue exigiendo los tres campos de revisión (`validateProject` y regla 6 de `CLAUDE.md`).

## D9 · `scripts/`
**Estado: aplicada.**

**Premisa errónea.** La propuesta decía que `scripts/` no existía. Sí existía en el commit inicial; Claude Design no lo veía porque el listado del conector filtra los `.mjs`. Se detectó por el diagnóstico de la sesión y se incorporó a D4.

**Estado y resultado.** `check` y `test` se ampliaron con las reglas de D1 y D3 y se documentan en [scripts.md](../scripts.md). Las reglas nuevas de `check` tienen pruebas automáticas en `scripts/check.test.mjs`.

---

## Orden aplicado
1. D6 y D2/D3 (0.2.0). 2. D1, piloto de `visuales.color` y reglas de `check` (0.3.0, 0.4.0, 0.5.0). 3. D4, D7, D9, DSBook y registro de propuestas (0.6.0). D8 descartada.

## Pendientes abiertos
- Base visual neutra de las páginas de documentación (D7).
- Desvincular el DS cargado en el proyecto de Claude Design (D7, acción del responsable).
- Revisión visual por una persona de `visuales.color` antes de cualquier paso a R.
