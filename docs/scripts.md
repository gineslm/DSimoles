# Scripts de comprobación

Dos comandos, sin dependencias que instalar (basta Node.js 18 o superior):

```sh
npm run check
npm test
```

Ejecútalos siempre antes de cerrar una integración y después de cualquier cambio en `data/`, `sections/`, `assets/_runtime/` o `scripts/`. Si fallan, no hagas push.

## `npm run check`
Comprueba el repositorio real. Imprime `OK: …` si todo está bien o `Error: …` con el motivo y se detiene en el primer fallo.

| Qué comprueba | Cómo suena el error | Qué hacer |
| --- | --- | --- |
| `project.json` cumple el contrato con `guide.json` (versión, IDs, estados, campos, rutas seguras, R y N con su registro). | `Estado no válido: <id>`, `Ready requiere revisión: <id>`, `Versión de configuración incompatible`. | Corrige esa entrada. Si cambió la guía, sube `guideVersion`. |
| Los IDs y las rutas sugeridas de la guía son únicos y cada entrada está completa. | `ID o destino duplicado`, `Guía incompleta: <id>`. | Revisa `guide.json`; no reutilices IDs. |
| Existen los archivos principales. | `ENOENT … <archivo>`. | Restaura el archivo que falta. |
| Cada sección tiene como máximo una página: `<ruta>.html` o `<ruta>.dc.html`. | `<id> tiene dos páginas: … y …`. | Elimina la antigua (pregunta antes si no es tuya). |
| Una sección en I o R tiene página (en la ruta sugerida o en `page`), y si `page` está rellena el archivo existe. | `<id> está en I y no tiene página en …`, `La página de <id> no existe: …`. | Crea o integra la página, o vuelve la sección a P si aún no hay desarrollo. |
| La página lleva `<meta name="ds-section-id">` con su ID. | `Meta de identidad ausente: <archivo>`. | Colócala en el `<head>` con el ID exacto de la guía. |
| Las referencias locales (`href` y `src`) de las páginas existen y no salen del repo. | `Referencia fuera del repo: …`, `ENOENT …`. | Corrige la ruta relativa. |
| Páginas `.dc.html`: cargan `react.production.min.js` y `react-dom.production.min.js` de `assets/_runtime/` **antes** de `./support.js`; no hay scripts externos. | `… debe cargar assets/_runtime/… antes de support.js`, `… enlaza scripts externos`, `… no enlaza support.js`. | Añade o reordena las tres líneas `<script>`. |
| Páginas `.dc.html`: no hay `<sc-for>` ni `<sc-if>` como hijos directos de `table`, `thead`, `tbody`, `tfoot`, `tr`, `colgroup`, `select` ni `optgroup`. | `<sc-for> dentro de <tbody>…`. | Usa `div` con `role="table"`, `row` y `cell`. En el iframe del contenedor el runtime no puede recuperar esas etiquetas. |
| El runtime vendorizado coincide (SHA-384) con el que declara `support.js`. | `assets/_runtime/<archivo> no coincide con la versión que espera …/support.js`. | Claude Design ha cambiado de versión de React: actualiza los archivos de `assets/_runtime/` y su README. |
| Todas las copias de `support.js` son idénticas. | `Las copias de support.js no son idénticas: <carpetas>`. | Copia la versión más reciente generada por Claude Design a todas las carpetas. No la edites a mano. |

No descarga contenido externo ni abre el navegador.

## `npm test`
Pruebas automáticas, en dos archivos:
- `scripts/model.test.mjs`: la lógica de `model.js` (`validateProject`, `safePage`, `pageCandidates`, `progressOf`). Cubre estados, N fuera del avance, importaciones incompletas, rutas peligrosas y versiones divergentes.
- `scripts/check.test.mjs`: copia el repo a un directorio temporal, lo rompe de una manera concreta y comprueba que `check` falla con el mensaje esperado (y que pasa cuando debe). Es la prueba de las reglas de `check` anteriores. No modifica tu repo.

Lectura de un fallo: `not ok N - <nombre>` indica la prueba; debajo aparece el resultado esperado frente al obtenido. Si falla una prueba de `check.test.mjs` tras un cambio tuyo, o la regla ya no hace lo que dice la tabla o el cambio la rompe: decide cuál de las dos cosas es y corrige la que corresponda.

## Lo que no cubren
No prueban el navegador, ni el contenedor, ni la accesibilidad, ni el contenido de las páginas. Para eso están las comprobaciones manuales de [quality.md](quality.md).
