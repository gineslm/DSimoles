# Guía para Claude Design

Lee primero [CLAUDE.md](../CLAUDE.md). Tu función es desarrollar el contenido y las páginas del DS conservando el contrato del repositorio.

## Antes de diseñar
1. Carga la versión vigente del repositorio o los archivos facilitados por el equipo. Si no tienes acceso al repo, solicita los archivos necesarios; no supongas que una conversación refleja el último estado.
2. Identifica la subsección en `data/guide.json`. Lee objetivo, qué definir, accesibilidad, entregable y criterios.
3. Revisa su entrada en `data/project.json`: decisiones existentes, página, responsable y revisión.
4. Lee [estilo-paginas.md](estilo-paginas.md): tono visual primero, poco texto, medidas y color neutro de la documentación.
5. Consulta páginas ya desarrolladas para mantener coherencia del DS. La apariencia del contenedor es una herramienta de trabajo, no la identidad visual obligatoria de cada DS.

## Sincronización y alcance
1. **Base registrada.** Anota en `github.md` (raíz de tu proyecto) el commit y la versión de `CHANGELOG.md` de los que partes, y el recuento de archivos esperados frente a los que ves. El listado del conector filtra archivos (por ejemplo `scripts/*.mjs`): cruza el listado con las rutas que nombran `package.json`, `CLAUDE.md` y `docs/data-contract.md`, y lee por ruta las que falten.
2. **Al inicio de cada sesión** compara tu base con el repo. Si el repo avanzó, detente y sincroniza antes de modificar nada.
3. **Qué puedes modificar:** `sections/`, `assets/<categoria>/<subseccion>/` y las entradas afectadas de `data/project.json`. No modifiques `data/guide.json`, el contenedor (`index.html`, `app.js`, `model.js`, `styles.css`), `docs/` ni `scripts/` salvo encargo explícito.
4. **Lo que no se transfiere:** `_ds/`, `github.md`, `uploads/` y los archivos auxiliares de Claude Design.
5. `data/project.json` solo se toca en las entradas afectadas; nunca se regenera completo. `owner` es opcional.

## Sistema visual
A menos que el responsable indique lo contrario, ignora cualquier design system que Claude Design cargue o vincule al proyecto (hoy `_ds/`): no lo apliques ni a las páginas ni al contenedor. Las páginas de sección usan una base de documentación neutra y muestran el sistema que se está definiendo. No presentes valores de ese sistema como decididos si no lo están.

## Desarrollar una sección
- Crea la página en el `suggestedPath` de la guía, como `.dc.html`. Ejemplo: `visuales.color` → `sections/visuales/color.dc.html`. No dejes también un `.html` de la misma sección.
- Antes de `./support.js`, carga React desde `../../assets/_runtime/` (ver [data-contract](data-contract.md)). No enlaces scripts externos y no edites `support.js`.
- La meta `ds-section-id` debe quedar en el `<head>`.
- No pongas `<sc-for>` ni `<sc-if>` directamente dentro de `table`, `thead`, `tbody`, `tfoot`, `tr`, `colgroup`, `select` ni `optgroup`. El navegador los saca de ahí al leer el HTML y, dentro del iframe del contenedor, el runtime no puede corregirlo. Para listas repetidas en forma de tabla usa `div` con `role="table"`, `role="row"` y `role="cell"`. `check` lo vigila.
- Conserva el ID en `<meta name="ds-section-id">`. Ajusta título, propósito, decisiones, ejemplos, accesibilidad, implementación y revisión. No presentes placeholders como contenido terminado.
- Pon imágenes, estilos o scripts específicos en `assets/visuales/color/`; enlaza desde la página con `../../assets/visuales/color/...`.
- Usa HTML semántico y recursos locales cuando sea razonable. Las secciones deben poder abrirse de forma independiente o dentro del contenedor.
- No cambies globalmente el contenedor para resolver el diseño de una sección.
- Si desarrollas componentes, utiliza también la [ficha de componente](../templates/component.md).

## Estado y decisiones durante el trabajo
Actualiza solo las entradas afectadas de `project.json`; nunca regeneres el archivo completo. P pasa a I cuando comienza el desarrollo. Si una sección R queda con cambios sin revisar, vuelve a I y registra los pendientes. Mantén R solo si la revisión sigue siendo válida y está actualizada.

Para proponer R, registra `review.by`, `review.date` y `review.evidence`: persona o rol que efectivamente revisó, fecha y resumen/enlaces de lo comprobado. No atribuyas una aprobación al usuario que no haya dado. Si no hay revisión, conserva I. N requiere una decisión explícita y `exclusionReason`.

## Cerrar el trabajo
No redactes un handoff nuevo. Sigue la [guía general](handoff.md): deja disponibles las páginas, sus recursos y el `project.json` actualizado. Puedes indicar «Integra los cambios siguiendo docs/handoff.md».

Si solo puedes producir archivos descargables, conserva la estructura de carpetas en un ZIP. Si el entorno permite escribir mediante MCP, usa esas mismas rutas. El mecanismo de transferencia lo configura el equipo; esta guía no lo crea ni garantiza acceso automático.

No basta con que la página exista dentro de la sesión de Claude Design: Claude Code debe poder leer sus bytes y recursos al integrarla.
