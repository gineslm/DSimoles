# DSBook · DSimoles

DSBook es el workspace; DSimoles es el Design System que se define en él. Ofrece una guía de definición, un contenedor de documentación y una matriz de seguimiento para el Design System DSimoles. Se diseña en Claude Design y se integra con Claude Code y Git. Empezó como una plantilla reutilizable; sus instrucciones están en [docs/template.md](docs/template.md).

## Primeros pasos
Necesitas Node.js 18 o posterior; no hay paquetes que instalar.

```sh
cd DSimoles
npm start
```

`npm start` sirve el sitio en el primer puerto libre desde 8000 e imprime la dirección, de modo que varios proyectos pueden correr a la vez (`npm start -- --port 9000` empieza desde otro puerto). Abre esa dirección. No abras `index.html` directamente: cargar los archivos JSON requiere HTTP. También puedes servir la carpeta desde cualquier alojamiento estático. No se incluye despliegue ni conexión con GitHub.

1. Recorre la home (un resumen por categoría) o elige una subsección en el menú Sections del rail. Cada subsección tiene su propia dirección, por ejemplo `#/visuals.color`.
2. Una subsección tiene tres vistas, que se eligen en la cabecera: **Content** (su página), **Info** (la guía de la sección: qué definir y los criterios de aceptación) y **Record** (estado, owner, notes, tasks y review).
3. Crea las páginas en Claude Design, como `.dc.html`, en las rutas que indica la guía.
4. Integra los cambios siguiendo la [guía general de handoff](docs/handoff.md).

## Estados y filtros
| Estado | Significado |
| --- | --- |
| R · Ready | Desarrollo revisado, con persona, fecha y evidencia registradas. |
| I · In process | Trabajo o review en curso. |
| P · Pending | Desarrollo pendiente; estado inicial. |
| N · Not applicable | Fuera de alcance con una justificación explícita. |

Filtra por estado desde el icono de filtro del rail (los estados se pueden combinar) y busca por título, categoría o contenido desde el cuadro de la cabecera. Los contadores de categoría representan todos sus items; los filtros muestran solo las coincidencias. La home muestra dos barras de progreso. **Progress**: R / (R + I + P), es decir, las subsecciones Ready sobre las aplicables. **Complexity**: las subsecciones que no son N sobre el total de la guía. Si todo es N, Progress muestra "Sin secciones aplicables".

El lado izquierdo es un rail estrecho con el **logo de DSBook** (abre la página Framework; la home es el primer breadcrumb) y dos iconos: **estado** y **secciones**. Cada uno abre un panel desplegable con hover; un clic lo fija y Escape lo cierra. En el panel Sections, pasar el puntero por una categoría abre todas sus subsecciones en un submenú; en pantallas táctiles cada categoría tiene un chevron que las expande en línea. Un punto sobre el icono de filtro indica que hay un filtro o una búsqueda activos.

## Contenedor de solo lectura
El sitio muestra el estado del repositorio y no lo modifica: no guarda borradores ni importa o exporta configuración. Todo se edita en Claude Design; Claude Code integra los cambios en Git. La búsqueda, los filtros, el estado expandido del menú y la dirección actual son estado de visualización en memoria.

El área principal muestra una sola cosa cada vez, según la dirección (rutas hash): `#/` es la home, `#/<category>` lista las subsecciones de una categoría y `#/<subsection>[/content|info|record]` muestra una subsección. Una cabecera fija lleva el breadcrumb y el estado (solo lectura) a la izquierda y, a la derecha, las pestañas de vista, una lupa que despliega el campo de búsqueda y los botones anterior/siguiente, con separadores entre los grupos. Una subsección en I o R con página abre en **Content**; cualquier otra abre en **Info**. La home tiene las mismas tres vistas en `#/home/<view>`: **Content** es el resumen, **Info** está vacía por ahora (reservada para una guía del proyecto y del framework) y **Record** muestra el project record (owner, notes y las tasks propias del proyecto) y, en solo lectura, las tasks de todas las secciones. Los enlaces antiguos `#item-<id>` y `#cat-<id>` se traducen. Las tres vistas (Content, Info y Record) se presentan como pestañas, con una línea bajo la cabecera y la activa marcada con un indicador. La vista Content de la home se puede ver como **Lista** (por defecto: todas las categorías con sus subsecciones, cada una contraíble) o como **Tarjetas** (una por categoría); el selector está a la derecha de «N subsecciones en M categorías» y la elección se mantiene mientras navegas.

La página de cada subsección se deduce de la ruta sugerida de la guía. `page` en `data/project.json` solo se rellena para excepciones (una URL HTTPS externa o una ruta distinta acordada). El contenedor comprueba si el archivo existe al abrir una subsección; si no existe, la vista Content dice "Aún no hay página" con la ruta esperada.

## Organización
Consulta [CLAUDE.md](CLAUDE.md) como punto de entrada para los agentes. Las guías específicas son [Claude Design](docs/claude-design.md), [Claude Code](docs/claude-code.md) y el [contrato de datos](docs/data-contract.md). La regla de idioma y el glosario están en [docs/glossary.md](docs/glossary.md).

## Comprobaciones
```sh
npm run check
npm test
```
No necesitan dependencias. También hay una lista de review manual en [docs/quality.md](docs/quality.md). Las pruebas automáticas no certifican la accesibilidad y no sustituyen la revisión visual.

## Versión del framework
El logo de DSBook abre la página **Framework**: la versión del framework y su origen, el repositorio del proyecto, el último commit en GitHub y un botón *Check for updates* en cada bloque (manual, las únicas llamadas de red).

El contenedor, los scripts, el seed y las guías de `docs/` son el framework DSBook, compartido con otros repositorios. `dsbook.json` registra su versión, y `npm run check` falla si un archivo del framework cambia sin que se registre una versión nueva. `npm run framework -- --compare <folder>` compara este repositorio con otro. Ver [docs/framework.md](docs/framework.md).

Para el traspaso con Claude Design hay dos comandos: `npm run design-diff` (compara un proyecto de Claude Design con este repositorio) y `npm run handoff-note` (escribe `handoff-last.md`, el aviso para Claude Design). Ver [docs/scripts.md](docs/scripts.md).

## Reutilizar la plantilla
Un proyecto nuevo empieza con `npm run init -- --id <id> --name "<name>"`, que copia `seed/` a `data/`. Después, los datos pertenecen al proyecto. Las instrucciones están en [docs/template.md](docs/template.md).

## Límites conocidos
- Las páginas externas pueden impedir su incrustación en un iframe; siempre hay un enlace para abrirlas aparte.
- Los iframes usan un sandbox con scripts y sin acceso al contenedor. El contenido que necesite cookies, almacenamiento o capacidades adicionales debe abrirse aparte o adaptarse conscientemente.
- La plantilla no edita visualmente el HTML de las secciones. Esa edición ocurre en Claude Design o en código.
- R indica una review registrada según los criterios del proyecto, no una certificación de conformidad.
- Los archivos de documentación Markdown se pueden leer en el editor o en GitHub; no se convierten a HTML automáticamente.
