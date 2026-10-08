# Guía para Claude Code

Lee [CLAUDE.md](../CLAUDE.md), el [contrato](data-contract.md) y la [guía general de handoff](handoff.md). Tu función es consolidar lo editado en Claude Design sin perder el trabajo de otros equipos.

## Integración
1. Inspecciona rama, `git status` y diferencias existentes. No sobrescribas cambios no relacionados ni limpies el árbol automáticamente.
2. Lee la guía y el proyecto vigentes. Compara los archivos recibidos con el repositorio por ID de sección, no solo por título.
3. Para cada página, usa `suggestedPath` o una excepción explícitamente acordada. Comprueba su meta `ds-section-id`. Conserva recursos dentro del repo y corrige enlaces relativos.
4. Integra `project.json` campo a campo en las secciones afectadas. Un `project.json` completo recibido no debe pisar estados, notas ni revisiones de secciones que otro equipo modificó. Si no hay base común suficiente para resolver una diferencia, señala el conflicto concreto antes de elegir.
5. Revisa estado frente al contenido y evidencia. Usa I si quedan incidencias. No generes R por comprobar que un archivo existe, ni inventes revisión de diseño. No marques N sin decisión registrada.
6. Ejecuta `npm run check` y `npm test`. Sirve la carpeta y realiza las comprobaciones manuales aplicables de `quality.md`. Registra las limitaciones de pruebas realmente encontradas.
7. Revisa `git diff --check` y `git diff`. Evita archivos temporales, exportaciones duplicadas, secretos, cachés o dependencias vendorizadas accidentales.
8. Resume cambios, verificaciones y pendientes. Crea commits y envía al remoto únicamente según las instrucciones vigentes del equipo. No hagas push forzado, deploy o merge por inferencia.

## Transferencia desde Claude Design
Flujo: GitHub es la fuente de verdad → Claude Design registra su base y trabaja → tú traes los cambios al repo local → validación local → push. Garantías:
1. **Alcance de copia.** Copia solo `sections/`, `assets/<categoria>/<subseccion>/`, las entradas afectadas de `data/project.json` y el runtime de las páginas `.dc.html` (`assets/_runtime/` y los `support.js`). No copies `_ds/`, `github.md`, `uploads/` ni archivos auxiliares.
2. **El listado puede ocultar archivos.** El conector filtra por tipo. Para cada archivo que una página enlace o que nombren `package.json`, `CLAUDE.md` o el contrato, léelo por ruta y compara su contenido antes de dar algo por ausente.
3. **Integración por ID.** Si el repo avanzó desde la base de Claude Design, fusiona `project.json` entrada a entrada. Si dos lados cambiaron la misma entrada, no elijas: señala el conflicto concreto al responsable. Ninguna copia completa gana por ser más reciente.
4. **Validación.** `npm run check`, `npm test` y revisión visual por una persona (en el contenedor servido por HTTP y con la página abierta aparte). Mira la página entera, no solo la cabecera.
5. **Cierre de ciclo.** Tras subir, añade una entrada a `CHANGELOG.md` (versión, fecha, commit, IDs de sección y una línea) y avisa a Claude Design de la nueva base. Cada entrada cita el commit con los cambios; se registra en un commit posterior.
6. Si Claude Design modificó algo fuera de su alcance, no lo integres sin preguntar. Si hizo un cambio menor legítimo dentro de una página (un arreglo de estilo, por ejemplo), compáralo con el repo y regístralo.

## Cambios en el catálogo
`guide.json` es compartido entre copias como base metodológica; no lo reescribas para reflejar solo el contenido disponible. Añadir una subsección requiere un ID único estable, guía y ruta propias, entrada en `project.json` y actualización de versión/compatibilidad. No reutilices IDs eliminados. Si divides una familia de componentes, conserva trazabilidad y evita contar dos veces el mismo trabajo.

## Nuevos proyectos
Parte de la plantilla limpia, cambia `projectId` y `name` y conserva P como estado inicial. Una copia de un DS ya desarrollado necesita limpiar todo su contenido específico y evidencia; no basta con cambiar el nombre.
