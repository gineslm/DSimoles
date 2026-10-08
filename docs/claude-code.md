# Guía para Claude Code

Lee [CLAUDE.md](../CLAUDE.md), el [contrato](data-contract.md) y la [guía general de handoff](handoff.md). Tu función es consolidar lo editado en Claude Design sin perder el trabajo de otros equipos.

## Integración
1. Inspecciona rama, `git status` y diferencias existentes. No sobrescribas cambios no relacionados ni limpies el árbol automáticamente.
2. Lee la guía y el proyecto vigentes. Compara los archivos recibidos con el repositorio por ID de sección, no solo por título.
3. Para cada página, usa `suggestedPath` o una excepción explícitamente acordada. Comprueba su meta `ds-section-id`. Conserva recursos dentro del repo y corrige enlaces relativos.
4. Integra `project.json` campo a campo en las secciones afectadas. Una exportación contiene el proyecto completo: no debe pisar estados, notas ni revisiones de secciones que otro equipo modificó. Si no hay base común suficiente para resolver una diferencia, señala el conflicto concreto antes de elegir.
5. Revisa estado frente al contenido y evidencia. Usa I si quedan incidencias. No generes R por comprobar que un archivo existe, ni inventes revisión de diseño. No marques N sin decisión registrada.
6. Ejecuta `npm run check` y `npm test`. Sirve la carpeta y realiza las comprobaciones manuales aplicables de `quality.md`. Registra las limitaciones de pruebas realmente encontradas.
7. Revisa `git diff --check` y `git diff`. Evita archivos temporales, exportaciones duplicadas, secretos, cachés o dependencias vendorizadas accidentales.
8. Resume cambios, verificaciones y pendientes. Crea commits y envía al remoto únicamente según las instrucciones vigentes del equipo. No hagas push forzado, deploy o merge por inferencia.

## Cambios en el catálogo
`guide.json` es compartido entre copias como base metodológica; no lo reescribas para reflejar solo el contenido disponible. Añadir una subsección requiere un ID único estable, guía y ruta propias, entrada en `project.json` y actualización de versión/compatibilidad. No reutilices IDs eliminados. Si divides una familia de componentes, conserva trazabilidad y evita contar dos veces el mismo trabajo.

## Nuevos proyectos
Parte de la plantilla limpia, cambia `projectId` y `name` y conserva P como estado inicial. Una copia de un DS ya desarrollado necesita limpiar todo su contenido específico y evidencia; no basta con cambiar el nombre.
