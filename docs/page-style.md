# Estilo y tono de las páginas de sección

> **Estado: aprobado por la persona responsable (2026-10-08).** Los valores vienen de la página piloto del primer proyecto que usó DSBook. Si algo choca con lo que ves en una página, dilo en vez de decidir por tu cuenta.

Estas pautas se aplican a las páginas `.dc.html` de `sections/`. No definen el Design System del proyecto: son la **base neutra de documentación** (CLAUDE.md, regla 13). El sistema que se está definiendo se muestra dentro de ellas con sus propios valores, que se marcan como pendientes mientras no estén decididos.

## Tono: primero lo visual
- **Muestra antes de explicar.** Cada sección empieza con algo que se pueda ver: muestras de color, escalas, ejemplos aplicados, diagramas, comparaciones correcto/incorrecto. El texto acompaña, no sustituye.
- **Poco texto.**
  - Propósito: una frase, como máximo 25 palabras.
  - Párrafos: como máximo 3 líneas. Si hace falta más, es una lista o una tabla.
  - Reglas: listas de frases cortas (una idea por línea), no párrafos.
  - Etiquetas y pies de ejemplo en vez de explicaciones largas.
- **Di lo pendiente una vez y con brevedad.** Una caja "Pending · …" por bloque (cada subtítulo h3 cuenta como un bloque), con lo que falta, sin justificar.
- **No repitas la guía.** Sin caja "Guide" y sin ajustes como `showGuide`: el contenedor ya muestra `data/guide.json`.
- **Lenguaje directo.** Castellano, voz activa, sin relleno ("es importante señalar que…"). Los términos del [glosario](glossary.md) se quedan en inglés.
- Nada de contenido inventado: ni valores, ni resultados, ni comprobaciones que no existan. Lo que no está decidido se muestra como un hueco, no como un dato.

## Estructura de cada página
1. Cabecera: solo el título propio de la página (`h1`). La cabecera del contenedor ya muestra el breadcrumb (sistema, categoría, número) y el estado, leídos de los datos, así que la página no debe repetirlos: una etiqueta de estado escrita a mano se desviaría de `project.json`. Ningún texto previo: primero lo visual.
2. Contenido visual principal (lo que define la sección), con el propósito en una frase si hace falta.
3. Reglas cortas.
4. Ejemplos típicos y al menos un caso límite.
5. Accesibilidad aplicable, como una lista corta con los criterios que se aplican.
6. Pending: agrupa lo que falta, incluida la implementación (formato de tokens, destino de los archivos) mientras no haya nada decidido. No hay sección de review: el estado está en `project.json`. "Implementación" pasa a ser una sección propia solo cuando tiene contenido real.

## Márgenes y ritmo
| Elemento | Valor |
| --- | --- |
| Ancho máximo del contenedor de la página | 1040 px, para rejillas, muestras y tarjetas (la página vive en un iframe de ancho variable y completo: debe ser fluida y gestionar sus propios márgenes) |
| Padding lateral | `clamp(20px, 4vw, 40px)` |
| Padding superior | `clamp(24px, 5vw, 64px)` |
| Separación entre secciones | 48 px |
| Separación dentro de una sección | 12–16 px |
| Rejillas de muestras y tarjetas | 12 px de separación (4 px entre pasos de una escala) |
| Ancho de lectura del texto corrido | 72 caracteres (`max-width: 72ch`) **solo** en párrafos, listas y cajas "Pending", no en todo el contenedor |

## Tipografía
- Familia: `system-ui, -apple-system, "Segoe UI", sans-serif`. Monoespaciada para nombres de token y rutas: `ui-monospace, Menlo, monospace`.
- Escala:

| Uso | Tamaño | Peso |
| --- | --- | --- |
| Título de la página | `clamp(32px, 5vw, 44px)` | 600 |
| Título de sección (h2) | 22 px | 600 |
| Subtítulo (h3) | 17 px | 600 |
| Cuerpo | 16 px, interlineado 1.6 | 400 |
| Texto secundario | 14 px | 400 |
| Etiquetas, pies y avisos | 12–13 px | 400–600 |
| Tokens y rutas | 13 px mono | 400 |
- Mayúsculas con espaciado solo en etiquetas cortas (pocas palabras), nunca en texto corrido.

## Color de la documentación (neutro)
Solo tonos neutros; el color de la página viene de las muestras del sistema que se está definiendo.

| Rol | Valor | Contraste sobre blanco |
| --- | --- | --- |
| Texto principal | `#1f1f1f` | 16.48 |
| Texto de cuerpo en tarjetas | `#3d3d3d` | 10.86 |
| Texto secundario | `#5a5a5a` | 6.90 (6.38 sobre `#f6f6f6`) |
| Fondo de la página | `#ffffff` | — |
| Superficie de apoyo | `#f6f6f6` | — |
| Borde | `#d4d4d4` | 1.48 (solo borde decorativo) |
| Borde de hueco pendiente (discontinuo) | `#8a8a8a` | 3.45 (decorativo, nunca para texto) |

Los contrastes se calculan con la fórmula de WCAG 2.2 para texto normal; solo el texto, no los bordes, necesita 4.5:1. Si un borde transmite información (por ejemplo un campo con foco), debe llegar a 3:1 y llevar además otra señal.

## Componentes recurrentes
- **Caja "Pending"**: borde discontinuo `#8a8a8a`, 13 px, padding de 8×12 px.
- **Tarjeta**: borde `#d4d4d4`, padding de 16 px, sin sombra.
- **Muestra de valor**: cuadrado con proporción 1:1 y su nombre a 11–13 px debajo o dentro; sin tooltip como única forma de transmitir información.
- **Tabla de datos**: con `div` y `role="table"`, `row`, `columnheader`, `cell` (la regla de `sc-for`, ver [data-contract.md](data-contract.md)).

## Accesibilidad de la propia página
- Un solo `h1` por página y una jerarquía sin saltos.
- El color nunca es la única señal: el estado, el error o la selección llevan texto o forma.
- Contraste de texto de al menos 4.5:1; verifica cualquier combinación nueva.
- Todo lo interactivo se alcanza con el teclado y con foco visible.
- Sin animaciones; si las hubiera, respeta `prefers-reduced-motion`.
- `lang="es"` en la etiqueta `<html>` del documento (lo hace cumplir `check`) y títulos de página descriptivos.

## Qué no se decide aquí
Los valores del Design System (paletas, escalas, tipografía de producto, espaciado) se deciden en sus secciones (`visuals.color`, `visuals.typography`, `visuals.spacing`…). Estas pautas solo fijan cómo se documentan.
