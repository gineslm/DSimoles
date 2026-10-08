# Estilo y tono de las páginas de sección

> **Estado: propuesta pendiente de aprobación del responsable.** Los valores salen de la página piloto (`visuales.color`) y se ajustan aquí. Hasta que se aprueben, Claude Design los usa como base y avisa de cualquier desviación.

Estas directrices valen para las páginas `.dc.html` de `sections/`. No definen el Design System de DSimoles: son la base **neutra de documentación** (CLAUDE.md, regla 13). El sistema que se está definiendo se muestra dentro de ellas con sus propios valores, y estos se marcan como pendientes mientras no estén decididos.

## Tono: visual primero
- **Muestra antes de explicar.** Cada sección empieza con algo que se ve: muestras de color, escalas, ejemplos aplicados, diagramas, comparaciones correcto/incorrecto. El texto acompaña, no sustituye.
- **Poco texto.**
  - Propósito: una frase, máximo 25 palabras.
  - Párrafos: máximo 3 líneas. Si hace falta más, es una lista o una tabla.
  - Reglas: listas de frases cortas (una idea por línea), no párrafos.
  - Etiquetas y pies de ejemplo en lugar de explicaciones largas.
- **Lo pendiente se dice una vez y corto.** Una caja «Pendiente · …» por bloque, con lo que falta, sin justificar. No repitas la guía de `data/guide.json`: el contenedor ya la muestra.
- **Lenguaje directo.** Castellano, voz activa, sin relleno («es importante destacar…»).
- Nada de contenido inventado: sin valores, resultados ni comprobaciones que no existan. Lo no decidido se muestra como hueco, no como dato.

## Estructura de cada página
1. Cabecera: nombre de la sección, número, estado en una etiqueta.
2. Contenido visual principal (lo que define la sección).
3. Reglas breves.
4. Ejemplos habituales y al menos un caso límite.
5. Accesibilidad aplicable, en lista corta con los criterios que afectan.
6. Pendientes. Sin sección de revisión redundante si el estado ya está en `project.json`.

## Márgenes y ritmo
| Elemento | Valor |
| --- | --- |
| Ancho máximo del contenido | 1040 px (la página vive dentro de un iframe de ancho variable: debe ser fluida) |
| Relleno lateral | `clamp(20px, 4vw, 40px)` |
| Relleno superior | `clamp(24px, 5vw, 64px)` |
| Separación entre secciones | 48 px |
| Separación dentro de una sección | 12–16 px |
| Rejillas de muestras y tarjetas | huecos de 12 px (4 px entre pasos de una escala) |
| Ancho de lectura de texto corrido | 72 caracteres (`max-width: 72ch`) en párrafos y listas |

## Tipografía
- Familia: `system-ui, -apple-system, "Segoe UI", sans-serif`. Monoespaciada para nombres de tokens y rutas: `ui-monospace, Menlo, monospace`.
- Escala:

| Uso | Tamaño | Peso |
| --- | --- | --- |
| Título de página | `clamp(32px, 5vw, 44px)` | 600 |
| Título de sección (h2) | 22 px | 600 |
| Subtítulo (h3) | 17 px | 600 |
| Cuerpo | 16 px, interlineado 1,6 | 400 |
| Texto secundario | 14 px | 400 |
| Etiquetas, pies y avisos | 12–13 px | 400–600 |
| Tokens y rutas | 13 px mono | 400 |
- Mayúsculas con tracking solo en etiquetas cortas (cabecera, «Guía»).

## Color de la documentación (neutro)
Solo tonos neutros; el color de la página lo ponen las muestras del sistema que se define.

| Rol | Valor | Contraste sobre blanco |
| --- | --- | --- |
| Texto principal | `#1f1f1f` | 16,48 |
| Texto de cuerpo en tarjetas | `#3d3d3d` | 10,86 |
| Texto secundario | `#5a5a5a` | 6,90 (6,38 sobre `#f6f6f6`) |
| Fondo de página | `#ffffff` | — |
| Superficie de apoyo | `#f6f6f6` | — |
| Borde | `#d4d4d4` | 1,48 (solo borde decorativo) |
| Borde de hueco pendiente (discontinuo) | `#8a8a8a` | 3,45 (decorativo, nunca para texto) |

Contrastes calculados con la fórmula de WCAG 2.2 para texto normal; solo el texto, no los bordes, necesita 4,5:1. Si un borde transmite información (por ejemplo un campo con foco), debe llegar a 3:1 y llevar además otra señal.

## Componentes recurrentes
- **Etiqueta de estado** (R/I/P/N): borde de 1 px, 12 px, 600; sin salto de línea (`white-space: nowrap`).
- **Caja «Pendiente»**: borde discontinuo `#8a8a8a`, 13 px, relleno 8×12 px.
- **Tarjeta**: borde `#d4d4d4`, relleno 16 px, sin sombra.
- **Muestra de valor**: cuadrado con proporción 1:1 y su nombre en 11–13 px debajo o dentro; sin tooltip como única vía de información.
- **Tabla de datos**: con `div` y `role="table"`, `row`, `columnheader`, `cell` (regla de `sc-for`, ver [data-contract.md](data-contract.md)).

## Accesibilidad de la propia página
- Un solo `h1` por página y jerarquía sin saltos.
- El color nunca es la única señal: estado, error o selección llevan texto o forma.
- Contraste de texto de 4,5:1 como mínimo; verificar cualquier combinación nueva.
- Todo lo interactivo, alcanzable por teclado con foco visible.
- Sin animaciones; si las hubiera, respetar `prefers-reduced-motion`.
- `lang="es"` en el documento y títulos de página descriptivos.

## Qué no se decide aquí
Los valores del Design System de DSimoles (paletas, escalas, tipografía del producto, espaciado) se deciden en sus secciones (`visuales.color`, `visuales.tipografia`, `visuales.espaciado`…). Estas directrices solo fijan cómo se documentan.
