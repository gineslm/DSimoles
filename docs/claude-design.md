# Guía para Claude Design

Lee primero [CLAUDE.md](../CLAUDE.md). Tu papel es desarrollar el contenido y las páginas del DS manteniendo el contrato del repositorio.

## Antes de diseñar
Sigues el [ciclo de trabajo](handoff.md#el-ciclo-de-trabajo): el repositorio es la única fuente de verdad y, cuando Claude Code publica una actualización, tú confirmas en el repo que contiene lo integrado y partes de esa base.

1. Carga la versión actual del repositorio o los archivos que te dé el equipo. Si no tienes acceso al repo, pide los archivos que necesites; no asumas que una conversación refleja el último estado.
2. Identifica la subsección en `data/guide.json`. Lee el objetivo, qué definir, accesibilidad, entregable y criterios.
3. Revisa su entrada en `data/project.json`: decisiones existentes, página, owner y review.
4. Lee [page-style.md](page-style.md): tono visual, poco texto, medidas y el color neutro de la documentación.
5. Mira las páginas ya desarrolladas para mantener la coherencia del DS. La apariencia del contenedor es una herramienta de trabajo, no la identidad visual obligatoria de cada DS.

## Sincronización y alcance
1. **Base registrada.** Escribe en `github.md` (raíz de tu proyecto) el commit y la versión de `CHANGELOG.md` de los que partes, y el número de archivos esperados frente a los que ves. El listado del conector filtra archivos (por ejemplo `scripts/*.mjs`): contrasta el listado con las rutas que nombran `package.json`, `CLAUDE.md` y `docs/data-contract.md`, y lee por ruta los que falten.
2. **Al empezar cada sesión**, compara tu base con el repo. Si el repo ha avanzado, detente y sincroniza antes de modificar nada.
3. **Qué puedes modificar:** `sections/`, `assets/<category>/<subsection>/`, las entradas afectadas de `data/project.json` y las entradas afectadas de `data/guide.json` (texto de la guía, subsecciones nuevas, categorías nuevas; ver [Crear secciones](#crear-secciones-y-subsecciones)). No modifiques el contenedor (`index.html`, `app.js`, `model.js`, `styles.css`), `docs/`, `scripts/` ni `seed/` salvo que se te pida explícitamente. No cambies ni elimines IDs existentes, no renombres carpetas ni retires subsecciones salvo petición explícita.
4. **Qué no se transfiere:** `_ds/`, `github.md`, `uploads/` y los archivos auxiliares de Claude Design.
5. `data/project.json` y `data/guide.json` solo se tocan en las entradas afectadas; nunca se regeneran enteros. `owner` es opcional.

## Proteger tu trabajo y entregar el manifiesto
- Cuando Claude Code te lo pida con un prompt de `design-diff --request`, genera `design-manifest.json` en la raíz de tu proyecto con el SHA-256 de cada archivo (el prompt trae el algoritmo exacto y un nonce que debes copiar tal cual). No cambies ningún otro archivo. Si no puedes calcular un hash real, dilo; no lo inventes.
- **Antes de adoptar cambios del repositorio**, compara el hash de cada archivo tuyo con el campo `design` de `design-baseline.json` (raíz del repo). Si tu archivo cambió desde la última integración y el contenido del repo difiere del tuyo, **no lo sobrescribas**: guarda tu copia en `_backup/<fecha>/<ruta>` y avisa a la persona responsable. Nunca des por perdido ni por integrado un trabajo sin comprobarlo.
- `_backup/` no se transfiere al repositorio.

## Sistema visual
Salvo que la persona responsable diga otra cosa, ignora cualquier design system que Claude Design cargue o enlace al proyecto (hoy `_ds/`): no lo apliques a las páginas ni al contenedor. Las páginas de sección usan una base neutra de documentación y muestran el sistema que se está definiendo. No presentes valores de ese sistema como decididos si no lo están.

## Desarrollar una sección
- Crea la página en el `suggestedPath` de la guía, como `.dc.html`. Ejemplo: `visuals.color` → `sections/visuals/color.dc.html`. No dejes además un `.html` para la misma sección.
- Antes de `./support.js`, carga React desde `../../assets/_runtime/` (ver el [contrato de datos](data-contract.md)). No enlaces scripts externos y no edites `support.js`.
- La meta `ds-section-id` debe permanecer en el `<head>`, y `<html>` debe declarar `lang="es"`.
- No pongas `<sc-for>` ni `<sc-if>` directamente dentro de `table`, `thead`, `tbody`, `tfoot`, `tr`, `colgroup`, `select` u `optgroup`. El navegador los saca al analizar el HTML y, dentro del iframe del contenedor, el runtime no puede recuperarlos. Para listas repetidas tipo tabla usa `div` con `role="table"`, `role="row"` y `role="cell"`. `check` lo hace cumplir.
- La cabecera del contenedor ya muestra el breadcrumb y el estado de la sección, y tiene pestañas para Info (el texto de la guía) y Record: no pongas en la página una línea de contexto, una etiqueta de estado, una caja de guía ni una lista de tasks (ver [page-style.md](page-style.md)).
- Mantén el ID en `<meta name="ds-section-id">`. Ajusta título, propósito, decisiones, ejemplos, accesibilidad, implementación y review. No presentes placeholders como contenido terminado.
- Pon las imágenes, estilos o scripts propios de la página en `assets/visuals/color/`; enlázalos desde la página con `../../assets/visuals/color/...`.
- Usa HTML semántico y recursos locales cuando sea razonable. Las secciones deben poder abrirse de forma independiente o dentro del contenedor.
- No cambies el contenedor globalmente para resolver el diseño de una sección.
- Si desarrollas componentes, usa además la [ficha de componente](../templates/component.md).

## Crear secciones y subsecciones
Puedes añadir categorías y subsecciones a `data/guide.json`. Sigue las reglas del catálogo del [contrato de datos](data-contract.md); `check` las hace cumplir:
1. Elige un ID estable: `slug` para la categoría y `<category-id>.<slug>` para la subsección (letras minúsculas, dígitos, guion y guion bajo). No reutilices ni renombres nunca un ID.
2. Rellena todos los campos de la guía (título, objetivo, qué definir, accesibilidad, entregable, criterios de aceptación) y fija `suggestedPath` exactamente a `sections/<category-id>/<slug>.html`. Dale el siguiente número visible de su categoría.
3. Añade su entrada a `data/project.json`, en P, con page, owner, notes, tasks y review vacíos.
4. Crea la página y sus recursos solo cuando empiece el desarrollo, y entonces sigue los pasos de abajo.
5. No elimines una subsección: para retirarla, márcala N con un motivo.

## Estado y decisiones mientras trabajas
Actualiza solo las entradas afectadas de `project.json`; nunca regeneres el archivo entero. P pasa a I cuando empieza el desarrollo. Si una sección R se queda con cambios sin revisar, vuelve a I y los puntos bloqueantes se registran en `notes`. Mantén R solo si la review sigue siendo válida y está al día.

**Notes y tasks.** `notes` guarda las decisiones y el contexto actuales. El trabajo que no bloquea va en `tasks`, cada una con `when: "pending"` (corto plazo) o `when: "future"` (más adelante). Las tasks nunca bloquean Ready: una sección puede ser R con tasks abiertas. El trabajo que sí bloquea la publicación mantiene la sección en I, con su motivo en `notes`. Elimina una task cuando esté hecha. No dupliques tasks en la página; la página muestra contenido, el Record muestra las tasks. Una task no puede ir en una sección Not applicable: comprueba primero que pertenece ahí. Si pertenece a otra sección o al proyecto, ponla allí. Si sí pertenece, reabre la sección (P), mueve su motivo de exclusión a `notes` con la fecha e infórmalo en tu informe; nunca reabras en silencio. Puedes editar el `record` propio del proyecto (owner, notes y tasks del proyecto) para el trabajo que no pertenece a ninguna subsección; el trabajo sobre el framework mismo no va ahí.

Para proponer R, registra `review.by`, `review.date` y `review.evidence`: la persona o rol que realmente revisó, la fecha y un resumen o enlaces de lo comprobado. No atribuyas a la persona usuaria una aprobación que no ha dado. Si no hay review, mantén I. N requiere una decisión explícita y `exclusionReason`.

## Cierre del trabajo
No escribas un handoff nuevo. Sigue la [guía general](handoff.md): deja disponibles las páginas, sus recursos y el `project.json` actualizado. Puedes decir "Integra los cambios siguiendo docs/handoff.md".

Si solo puedes producir archivos descargables, conserva la estructura de carpetas en un ZIP. Si el entorno permite escribir por MCP, usa esas mismas rutas. El mecanismo de transferencia lo configura el equipo; esta guía no lo crea ni garantiza un acceso automático.

No basta con que la página exista dentro de la sesión de Claude Design: Claude Code debe poder leer sus bytes y recursos al integrarla.
