# DSBook · instrucciones para agentes

## Propósito
DSBook es un workspace para definir, documentar y seguir un Design System. Este repositorio contiene el de DSimoles; empezó como una plantilla reutilizable ([docs/template.md](docs/template.md)). Cada copia representa un único proyecto. La matriz reúne una guía por subsección y las páginas HTML que desarrollan el DS. El repositorio es la fuente de verdad compartida; Claude Design es el espacio de diseño y edición, y Claude Code integra los archivos y sus cambios.

## El ciclo de trabajo
Es el mismo para todo el equipo y está detallado en [docs/handoff.md](docs/handoff.md#el-ciclo-de-trabajo):
1. **GitHub** es la única fuente de verdad.
2. **Claude Design** lee el repo, registra su base y construye y avanza los diseños.
3. **Claude Code** se conecta por MCP al proyecto de Claude Design y trae sus cambios.
4. **Claude Code** los implementa en local, con `npm run check` y `npm test`.
5. **La persona responsable valida** en local. Sin su visto bueno no se sube nada.
6. **Claude Code sube a GitHub**, registra la integración en `CHANGELOG.md` y entrega el aviso para Claude Design (`npm run handoff-note` antes del commit y un prompt con el hash tras el push).
7. **Claude Design confirma** la actualización en el repo y sigue desde la nueva base.

**Accesos.** Antes de trabajar, comprueba que tienes lo que tu papel necesita: git (`fetch`, `push`) y la conexión MCP al proyecto de Claude Design en el caso de Claude Code; el repo en GitHub en el caso de Claude Design. Si falta alguno, **detente, di cuál falta y pídelo a la persona responsable**. No trabajes con una copia que no sabes si está al día ni des por bueno un estado que no has podido leer.

## Lee según la tarea
- [README: cómo funciona y cómo empezar](README.md)
- [Guía para Claude Design](docs/claude-design.md): diseñar, crear páginas y mantener las decisiones mientras se trabaja.
- [Guía para Claude Code](docs/claude-code.md): integrar, validar y actualizar el repositorio.
- [Guía general de handoff](docs/handoff.md): contrato permanente de transferencia. No hay formulario por sesión.
- [Contrato de datos y rutas](docs/data-contract.md): identidades, estados y schema.
- [Criterios de review](docs/quality.md): aceptación del contenido y de la aplicación.
- [Estilo y tono de las páginas](docs/page-style.md): pautas visuales para Claude Design (aprobadas).
- [Glosario y regla de idioma](docs/glossary.md): qué se escribe en castellano y qué términos se quedan en inglés.
- [El framework y su versión](docs/framework.md): qué se comparte con otros repositorios DSBook, `dsbook.json` y cómo se registra y se porta un cambio del framework.
- [Scripts de comprobación](docs/scripts.md): qué verifican `npm run check` y `npm test`, cuándo ejecutarlos y cómo leer sus errores.
- [Propuestas y su registro](docs/proposals/README.md): cambios acordados en la forma de trabajar y su estado (applied, approved, discarded, pending).

## Reglas comunes
1. Lee `data/guide.json` y `data/project.json` antes de modificar una sección. Conserva los IDs existentes; el título visible puede cambiar. Los datos pertenecen al proyecto; las reglas del catálogo están en el [contrato de datos](docs/data-contract.md).
2. **Todo lo que se escribe en el repositorio va en castellano**: datos, documentación, páginas, textos de la interfaz, mensajes de los scripts y mensajes de commit. Los **términos y las etiquetas** se quedan en inglés (Ready, task, review, token, Content, Record…; la lista está en el [glosario](docs/glossary.md)). La conversación con la persona responsable también es en castellano. El historial anterior a la versión 2.0.0 del framework (`CHANGELOG.md`, `docs/proposals/`) se queda en el idioma en que se escribió.
3. Sin paso de build y sin servicios externos; las únicas llamadas de red son los dos botones manuales *Check for updates* de la página Framework. El runtime vendorizado que necesitan las páginas `.dc.html` está permitido, versionado dentro del repo (`assets/_runtime/` y `sections/<category>/support.js`). No añadas backend, cuentas, sincronización remota ni gestores de proyecto sin una necesidad acordada.
4. Crea las páginas en el `suggestedPath` de cada subsección. Sus recursos van en `assets/<category>/<subsection>/`. No uses rutas absolutas de equipo ni enlaces que dependan de un dominio local.
5. `data/guide.json` es el catálogo del proyecto y el texto de la guía; `data/project.json` registra estado, decisiones y tasks; `sections/` contiene el desarrollo. No copies contenido de desarrollo a la guía. Las tasks no bloquean y nunca impiden Ready; el trabajo bloqueante mantiene la sección en I. Una sección Not applicable no puede tener tasks: añadir una significa reabrirla (ver el [contrato de datos](docs/data-contract.md#notes-y-tasks)).
6. Los únicos estados son R (Ready), I (In process), P (Pending), N (Not applicable). Una página existente no implica R. Ready exige una review registrada, no una certificación automática.
7. No marques N sin un motivo explícito. No excluyas por comodidad requisitos de accesibilidad aplicables. Una fila transversal no sustituye las comprobaciones por elemento.
8. No inventes aprobaciones, resultados de pruebas, owners ni evidencia. Si el trabajo o la review están pendientes, usa I y describe lo que falta.
9. No crees informes de handoff por sesión. Las decisiones se guardan en los campos de la sección; Git registra los cambios.
10. Respeta los cambios ajenos. Revisa las diferencias antes de reemplazar archivos. No reinicies el proyecto para integrar una sección.
11. Ejecuta `npm run check` y `npm test` antes de cerrar una integración. Estos comandos no requieren `npm install`.
12. Commit, push, publicación y resolución de conflictos siguen las instrucciones vigentes del equipo. No hagas force-push ni publiques por defecto.
13. Ignora cualquier design system que Claude Design cargue o enlace al proyecto (por ejemplo `_ds/`), tanto en las páginas como en el contenedor, salvo que la persona responsable diga otra cosa.
14. Antes de modificar archivos, comprueba que tu base coincide con el repositorio. Sigue el protocolo de [handoff](docs/handoff.md).
15. El contenedor, `scripts/`, `seed/`, el runtime vendorizado y las guías de `docs/` son el **framework**, compartido con otros repositorios DSBook. Un cambio en ellos se registra con `npm run framework -- --release <version>` y se porta a los demás repositorios ([framework.md](docs/framework.md)); `npm run check` falla hasta que se registra. Claude Design no los edita.

## Mapa del repositorio
- `dsbook.json`: la versión del framework DSBook que lleva este repositorio y el hash de cada archivo del framework.
- `index.html`, `styles.css`, `app.js`, `model.js`: contenedor interactivo.
- `data/guide.json`: las categorías y subsecciones del proyecto con instrucciones y rutas de destino (empezó con 14 categorías y 132 subsecciones).
- `data/project.json`: identidad y record del proyecto (owner, notes, tasks) y, para cada sección, su estado, página, owner, notes, tasks y review.
- `seed/`: el catálogo inicial y un proyecto con todo en Pending. `npm run init` lo copia a `data/` para empezar un proyecto.
- `sections/`: desarrollo del DS; empieza sin contenido del proyecto.
- `templates/component.md`: ficha de componente. Las páginas de sección se crean en Claude Design como `.dc.html`; no hay plantilla de página.
- `assets/`: recursos de las páginas.
- `docs/`: guías permanentes. `docs/proposals/`: propuestas de cambio y su registro.
- `scripts/`: comprobaciones del contrato y pruebas de lógica.

Para empezar otro proyecto, ejecuta `npm run init -- --id <id> --name "<name>"` en una copia sin el contenido anterior. No heredes páginas, reviews ni decisiones de otro proyecto. Ver [docs/template.md](docs/template.md).

## Conexiones del proyecto
| Qué | Dónde |
| --- | --- |
| Repositorio (fuente de verdad) | https://github.com/gineslm/DSimoles, rama `main` |
| Proyecto de Claude Design | https://claude.ai/design/p/2d62264d-9d57-47c4-9fdb-3581d6ec7438 (id `2d62264d-9d57-47c4-9fdb-3581d6ec7438`, "DSimoles project inquiry") |
| Framework (origen de las actualizaciones) | https://github.com/gineslm/DSbook |

Si no tienes acceso a alguno de ellos, pídelo a la persona responsable antes de trabajar (ver "El ciclo de trabajo").
