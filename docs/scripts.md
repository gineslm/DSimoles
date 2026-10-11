# Scripts de comprobación

Dos comandos, sin nada que instalar (basta Node.js 18 o posterior):

```sh
npm run check
npm test
```

Ejecútalos siempre antes de cerrar una integración y después de cualquier cambio en `data/`, `sections/`, `assets/_runtime/` o `scripts/`. Si fallan, no hagas push.

## `npm run check`
Comprueba el repositorio real. Imprime `OK: …` si todo está bien o `Error: …` con el motivo, y se detiene en el primer fallo.

| Qué comprueba | Cómo se ve el error | Qué hacer |
| --- | --- | --- |
| `project.json` cumple el contrato con `guide.json` (schema, identidad, una entrada por subsección y ninguna de más, estados, campos, tasks, rutas seguras, R y N con su registro). | `Estado no válido: <id>`, `Ready exige una review: <id>`, `Falta la entrada de sección: <id>`, `Entrada sin subsección en la guía: <id>`, `Tasks no válidas: <id>`, `Una sección Not applicable no puede tener tasks: <id>`, `Project record no válido`, `Versión de configuración del proyecto incompatible`. | Corrige esa entrada. Al añadir una subsección, añade tanto su entrada en la guía como la del proyecto. |
| La guía es coherente por sí sola: formato de ID (`<category>.<slug>`), IDs y números únicos, `suggestedPath` exactamente `sections/<category>/<slug>.html`, entradas completas. | `ID de subsección duplicado: <id>`, `ID de subsección no válido (se esperaba <category>.<slug>): <id>`, `Ruta sugerida no válida o duplicada: <id>`, `Entrada de la guía incompleta: <id>`. | Revisa `guide.json`; no reutilices IDs. |
| El seed (`seed/guide.json`, `seed/project.json`) es válido y empieza vacío y en Pending. | `seed/: …`. | Restaura el seed; un proyecto nuevo nace de él. |
| Los archivos del framework coinciden con la versión registrada en `dsbook.json` (ver [framework.md](framework.md)). | `Los archivos del framework difieren de DSBook <version> (cambiados: …)`. | Si el cambio es intencionado, ejecuta `npm run framework -- --release <version>` y pórtalo; si no, restaura los archivos. |
| Existen los archivos principales. | `ENOENT … <file>`. | Restaura el archivo que falta. |
| Cada sección tiene como máximo una página: `<path>.html` o `<path>.dc.html`. | `<id> tiene dos páginas: … y …`. | Elimina la antigua (pregunta primero si no es tuya). |
| Una sección en I o R tiene página (en la ruta sugerida o en `page`) y, si `page` está rellena, el archivo existe. | `<id> está en I y no tiene página en …`, `La página de <id> no existe: …`. | Crea o integra la página, o devuelve la sección a P si aún no hay desarrollo. |
| La página lleva `<meta name="ds-section-id">` con su ID. | `Falta la meta de identidad: <file>`. | Colócala en el `<head>` con el ID exacto de la guía. |
| Las referencias locales de las páginas (`href` y `src`) existen y no salen del repo. | `Referencia fuera del repo: …`, `ENOENT …`. | Corrige la ruta relativa. |
| Páginas `.dc.html`: cargan `react.production.min.js` y `react-dom.production.min.js` desde `assets/_runtime/` **antes** de `./support.js`; no hay scripts externos. | `… debe cargar assets/_runtime/… antes de support.js`, `… enlaza scripts externos`, `… no enlaza support.js`. | Añade o reordena las tres líneas `<script>`. |
| Páginas `.dc.html`: `<html>` declara el `language` del proyecto (por ejemplo `lang="es"`). | `… debe declarar lang="es" en <html>`. | Añádelo a mano si el documento generado no lo trae; Claude Design debe conservarlo. |
| Páginas `.dc.html`: las imágenes que cita la página (en el HTML o en sus datos, con rutas relativas) existen y están dentro del repo. Los valores `src` con expresiones `{{ … }}` se ignoran. | `… cita una imagen que no existe: <path>`. | Copia la imagen a `assets/<category>/<subsection>/` o corrige la ruta. |
| Páginas `.dc.html`: no hay `<sc-for>` ni `<sc-if>` como hijo directo de `table`, `thead`, `tbody`, `tfoot`, `tr`, `colgroup`, `select` u `optgroup`. | `<sc-for> dentro de <tbody>…`. | Usa `div` con `role="table"`, `row` y `cell`. En el iframe del contenedor el runtime no puede recuperar esas etiquetas. |
| El runtime vendorizado coincide (SHA-384) con el que declara `support.js`. | `assets/_runtime/<file> no coincide con la versión que espera …/support.js`. | Claude Design cambió la versión de React: actualiza los archivos de `assets/_runtime/` y su README. |
| Todas las copias de `support.js` son idénticas. | `Las copias de support.js no son idénticas: <folders>`. | Copia la versión más reciente generada por Claude Design a todas las carpetas. No la edites a mano. |

No descarga contenido externo ni abre el navegador.

## `npm test`
Pruebas automáticas, en nueve archivos:
- `scripts/model.test.mjs`: la lógica de `model.js` (`validateGuide`, `validateProject`, `safePage`, `pageCandidates`, `progressOf`). Cubre estados, N excluido de Progress, importaciones incompletas, rutas peligrosas, las reglas del catálogo, añadir una subsección, tasks (que nunca bloquean R y no se cuentan) y la identidad del proyecto.
- `scripts/check.test.mjs`: copia el repo a un directorio temporal, instala una página fixture (`scripts/fixtures/`) para no depender de que el proyecto tenga páginas, la rompe de una forma concreta y verifica que `check` falla con el mensaje esperado (y que pasa cuando debe). Es la prueba de las reglas de `check` de arriba. No modifica tu repo.

Leer un fallo: `not ok N - <name>` identifica la prueba; debajo verás el resultado esperado frente al obtenido. Si falla una prueba de `check.test.mjs` tras un cambio tuyo, o la regla ya no hace lo que dice la tabla o tu cambio la rompe: decide cuál es el caso y corrige lo que corresponda.

- `scripts/init.test.mjs`: ejecuta `npm run init` en una copia temporal: imprime el uso sin argumentos, se niega a sobrescribir un proyecto con identidad propia, `--force` empieza un proyecto nuevo válido desde el seed sin tocar `sections/`, y funciona sin `--force` mientras `data/` aún tenga la identidad del seed.

- `scripts/about.test.mjs`: la lógica de la página Framework: su ruta (ID reservado), el `repository` opcional, el estado del framework (update, ahead, diverged, current), la lectura del commit local desde `.git` y la interpretación de la comparación de GitHub. No hace llamadas de red.

- `scripts/home.test.mjs`: la home como registro: sus rutas (`#/home/<view>`), los IDs de categoría reservados, la forma compartida de las tasks, el project record opcional, la regla de que una sección Not applicable no puede tener tasks, y las tasks reunidas de todas las secciones.

- `scripts/serve.test.mjs`: `npm start` sirve el repositorio, salta un puerto ocupado (dos proyectos pueden correr a la vez) y no sale de la carpeta del repositorio.

- `scripts/framework.test.mjs`: el manifiesto del framework. Un archivo del framework cambiado o añadido hace fallar el informe y `check`; los saltos de línea y los archivos del proyecto no importan; `--release` registra una versión y `--compare` distingue repositorios idénticos de distintos.

- `scripts/handoff.test.mjs`: la clasificación por tipo de los archivos, la comparación de `design-diff` con una copia de Claude Design (contenido y solo rutas) y el aviso que escribe `handoff-note`, en un repositorio git temporal.

- `scripts/container.test.mjs`: una prueba de humo en navegador. Arranca un servidor estático local y maneja un Chrome headless por el protocolo DevTools: la home, una subsección con página (iframe, pestañas, estado, sin scroll del documento), las vistas Info y Record, las tres vistas de la home (el Record reúne las tasks de todas las secciones y ningún filtro las oculta), el menú Sections abriéndose con hover (también cuando el navegador no informa de capacidad de hover, como en algunas configuraciones de Firefox), una subsección sin página, el filtro de estado, los enlaces antiguos y una dirección errónea, y falla ante cualquier error de consola. Necesita Chrome (define `DSBOOK_CHROME` con una ruta si no lo encuentra) y Node 22 o posterior; si no, se **omite**, no falla.

## `npm start`
Sirve el repositorio como archivos estáticos en el primer puerto libre desde 8000 (`npm start -- --port 9000` empieza desde otro) e imprime la dirección. No necesita Python ni paquetes.

## `npm run init`
Empieza un proyecto desde el seed. Ver el [contrato de datos](data-contract.md#seed-e-init).

```sh
npm run init -- --id my-ds --name "My Design System" [--language es] [--force]
```

## `npm run framework`
Informa, registra y compara la versión del framework DSBook. Ver [framework.md](framework.md).

```sh
npm run framework
npm run framework -- --release 1.1.0 [--repository https://github.com/<owner>/DSBook]
npm run framework -- --compare ../DSBook
```

## `npm run design-diff`
Compara lo que hay en un proyecto de Claude Design con este repositorio y lo agrupa por tipo (Diseño, Estructura, Framework, Proyecto). Sirve para saber, antes de integrar, qué tiene Claude Design que falta aquí, y, justo antes del commit, qué diferencias quedan a propósito (por ejemplo una traducción).

```sh
npm run design-diff -- <carpeta>                 # copia de los archivos de Claude Design: compara contenido y rutas
npm run design-diff -- --listing <lista.json>    # solo rutas: la salida de list_files (array de rutas o {"paths": […]})
npm run design-diff -- <carpeta> --json out.json # guarda el resultado para handoff-note
```

El script **no se conecta** a Claude Design: lo hace el agente por MCP y le entrega la lista (`list_files`, barata y suficiente para ver páginas nuevas o ausentes) o una carpeta con los archivos (`get_file` de los que haya que contrastar, o una exportación que haga la persona responsable). Ignora lo que no se transfiere (`_ds/`, `uploads/`, `github.md`, `scripts/`). Sale con código 1 si hay diferencias.

## `npm run handoff-note`
Escribe `handoff-last.md` en la raíz: el aviso para Claude Design con lo que cambia este envío respecto al último publicado.

```sh
npm run handoff-note                             # árbol de trabajo frente a origin/main
npm run handoff-note -- --base <ref>             # otra referencia de git
npm run handoff-note -- --divergences out.json   # incorpora el resultado de design-diff: marca lo hecho en Claude Code
npm run handoff-note -- --out otro.md            # otro destino
```

Agrupa los archivos cambiados por tipo, lista los IDs de `project.json` y `guide.json` afectados, avisa si cambió la estructura del catálogo e indica qué debe comprobar Claude Design. Se ejecuta **antes del commit** y el archivo entra en él; por eso no lleva el hash de su propio commit (ese va en el prompt que se escribe tras el push, ver [handoff.md](handoff.md#el-aviso-a-claude-design)). Solo lee git.

## Qué no cubren
No prueban la accesibilidad, el diseño visual ni el contenido de las páginas. La prueba de humo en navegador solo cubre los caminos principales del contenedor. Para el resto están las comprobaciones manuales de [quality.md](quality.md).
