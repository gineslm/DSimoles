# Guía para Claude Code

Lee [CLAUDE.md](../CLAUDE.md), el [contrato](data-contract.md) y la [guía general de handoff](handoff.md). Tu papel es consolidar lo editado en Claude Design sin perder el trabajo de otros equipos.

## Al empezar una sesión
Sigues el [ciclo de trabajo](handoff.md#el-ciclo-de-trabajo). El procedimiento paso a paso, con las protecciones, está en el skill `dsbook-handoff` (`.claude/skills/`). Antes de nada comprueba tus accesos: git en el repo local y la conexión MCP al proyecto de Claude Design (su dirección está en la sección "Conexiones del proyecto" de `CLAUDE.md`). Si falta alguno, detente, di cuál falta y pídelo a la persona responsable. Después comprueba que tu copia está al día antes de trabajar, y avisa si no lo está:
1. `git fetch` y `git status -sb`: indica si el remoto tiene commits que no tienes, o si tú tienes commits que él no tiene.
2. Si `dsbook.json` nombra un repositorio de origen, comprueba si el framework de allí es más nuevo. Con un clon local, `npm run framework -- --compare <carpeta>` lo hace; si no, lee su `dsbook.json` en GitHub. La página Framework del contenedor ofrece ambas comprobaciones a mano.
3. No hagas pull, merge ni port por tu cuenta: informa de lo que encuentres y deja que decida la persona responsable.

## Integración
1. Inspecciona la rama, `git status` y las diferencias existentes. No sobrescribas cambios ajenos ni limpies el árbol automáticamente.
2. Lee la guía y el proyecto actuales. Compara los archivos recibidos con el repositorio por ID de sección, no solo por título.
3. Para cada página, usa `suggestedPath` o una excepción acordada explícitamente. Comprueba su meta `ds-section-id`. Mantén los recursos dentro del repo y corrige los enlaces relativos.
4. Integra `project.json` campo a campo en las secciones afectadas. Un `project.json` completo recibido no debe sobrescribir estados, notes ni reviews de secciones que otro equipo modificó. Si no hay base común suficiente para resolver una diferencia, señala el conflicto concreto antes de elegir.
5. Revisa el estado frente al contenido y la evidencia. Usa I si quedan problemas. No produzcas R solo porque exista un archivo, y no inventes una design review. No marques N sin una decisión registrada.
6. Ejecuta `npm run check` y `npm test`. Sirve la carpeta y haz las comprobaciones manuales aplicables de `quality.md`. Registra las limitaciones de prueba que realmente encontraste.
7. Revisa `git diff --check` y `git diff`. Evita archivos temporales, exportaciones duplicadas, secretos, cachés o dependencias vendorizadas por accidente.
8. Resume cambios, verificaciones y pendientes. Crea commits y haz push al remoto solo según las instrucciones vigentes del equipo. No hagas force-push, deploy ni merge por inferencia.

## Transferencia desde Claude Design
Flujo: GitHub es la fuente de verdad → Claude Design registra su base y trabaja → tú traes los cambios al repo local → validación local → push. Garantías:
1. **Alcance de la copia.** Copia solo `sections/`, `assets/<category>/<subsection>/`, las entradas afectadas de `data/project.json` y `data/guide.json`, y el runtime de las páginas `.dc.html` (`assets/_runtime/` y los `support.js`). No copies `_ds/`, `github.md`, `uploads/` ni archivos auxiliares.
2. **El listado puede ocultar archivos.** El conector filtra por tipo. Para cada archivo que enlaza una página o que nombran `package.json`, `CLAUDE.md` o el contrato, léelo por su ruta y compara su contenido antes de darlo por ausente.
3. **Integración por ID.** Si el repo avanzó desde la base de Claude Design, integra `project.json` y `guide.json` entrada por entrada. Si los dos lados cambiaron la misma entrada, no elijas: señala el conflicto concreto a la persona responsable. Ninguna copia completa gana por ser más reciente.
4. **Validación.** `npm run check`, `npm test` y revisión visual por una persona (en el contenedor servido por HTTP y con la página abierta aparte). Mira la página entera, no solo la cabecera.
5. **Cierre del ciclo.** Tras el push, añade una entrada a `CHANGELOG.md` (versión, fecha, commit, IDs de sección y una línea) y entrega el [aviso a Claude Design](handoff.md#el-aviso-a-claude-design): `npm run handoff-note` antes del commit (genera `handoff-last.md`) y, tras el push, el prompt con el hash publicado. Cada entrada cita el commit con los cambios; se registra en un commit posterior.
6. Si Claude Design modificó algo fuera de su alcance, no lo integres sin preguntar. Si hizo un cambio menor legítimo dentro de una página (por ejemplo, una corrección de estilo), compáralo con el repo y regístralo.

## Secciones Not applicable y tasks
Una task añadida a una sección N es una reapertura. Comprueba primero que pertenece ahí; si no, va a la sección correcta o al `record` del proyecto. Si sí pertenece, pasa la sección a P, mueve el motivo de exclusión anterior a `notes` con la fecha e informa a la persona responsable. `check` falla mientras una sección N tenga tasks. No reabras si dudas: pregunta.

## Cambios de catálogo
`guide.json` es el catálogo del proyecto y le pertenece: su texto y sus subsecciones pueden cambiar. Claude Design puede añadir categorías y subsecciones y editar el texto de la guía; tú integras esos cambios por ID y `check` los valida con las [reglas del catálogo](data-contract.md#reglas-del-catálogo). Pregunta antes de integrar cualquier cosa que cambie o elimine un ID existente, renombre una carpeta o retire una subsección; eso necesita una orden explícita de la persona responsable y una nota en `CHANGELOG.md`. Si divides una familia de componentes, conserva la trazabilidad y evita contar dos veces el mismo trabajo.

## Proyectos nuevos
Parte de una copia del repositorio sin las páginas ni los recursos del proyecto anterior, y ejecuta `npm run init -- --id <id> --name "<name>"`. Copia `seed/` a `data/`, fija la identidad y se niega a sobrescribir un proyecto que ya tiene el suyo. Una copia de un DS ya desarrollado necesita que se elimine de `sections/` y `assets/` todo su contenido específico, reviews y evidencia; cambiar el nombre no basta.
