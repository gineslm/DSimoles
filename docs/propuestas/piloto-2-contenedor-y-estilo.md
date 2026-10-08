# Piloto 2 · Contenedor con barra lateral y directrices de estilo

Fecha: 2026-10-08 · Origen: petición del responsable tras el piloto 1. Estado de cada decisión en el [registro](README.md).

## E1 · El contenedor pasa a una barra lateral fija
**Estado: aplicada.**

**Motivo.** La cabecera acumulaba datos (título, texto de ayuda, tarjeta de avance, filtros) y el contenido útil quedaba lejos. Una barra lateral fija es accesible a cualquier nivel de scroll y permite navegar sin desplazarse.

**Estado y resultado.**
- Barra lateral fija con la marca (DSBook), el nombre del Design System, el avance, la búsqueda, los filtros R/I/P/N con recuentos, desplegar y plegar, y un menú con las 14 categorías y las 132 subsecciones.
- Cada subsección del menú muestra su estado (letra con texto accesible) y lleva directamente a ella: abre la categoría y la subsección y mueve el foco. Quedan enlaces directos (`#item-<id>`, `#cat-<id>`) que funcionan al cargar la página.
- El menú sigue la posición al hacer scroll (`aria-current`), y la búsqueda y los filtros también lo recortan.
- En pantallas de menos de 950 px la barra pasa a un cajón con botón «Menú», cierre con Escape y fondo atenuado.
- **Ajuste posterior (mismo día):**
  - La barra se comprime a una columna de iconos y se vuelve a expandir con el botón DSB de arriba (marca en tipografía condensada; no hay hamburguesa). Comprimida muestra las dos barras de progreso sin porcentaje, un selector de estado (all, R, I, P, N, equivalente a los filtros, con «Varios» si hay combinaciones), un icono de búsqueda y un icono de secciones. Ambos abren un panel con el buscador y el menú: se despliega con el ratón por encima, se fija con un clic y se cierra con Escape. Todos los controles de la columna miden 44 px de ancho.
  - **Dos barras de progreso:** *Avance* (listas R sobre las aplicables, es decir, no N) y *Complejidad* (subsecciones que no están en N sobre el total de la guía). `progressOf` devuelve ahora también `scope` y `total`.
  - Los enlaces «Desplegar/Plegar» de la barra desaparecen; se sustituyen por «Abrir todas las categorías» y «Cerrar todas», junto al recuento de la lista, que dejan claro que actúan sobre la lista y no sobre el menú.
- **Tres bloques con separadores (mismo día):** 1) DSB y nombre del Design System; 2) una cabecera «Avance / Complejidad» con el recuento de subsecciones mostradas a la derecha (por ejemplo `132/132`, que antes estaba en la cabecera de la lista) y debajo las dos líneas de progreso, sin textos añadidos (la explicación va en el tooltip); 3) contenido: búsqueda, estado y secciones. Comprimido, el tercer bloque son tres iconos (lupa, estado, secciones) con su panel. El panel de estado es un menú de casillas que permite combinar estados y sustituye al selector. El menú de secciones incorpora «Desplegar todo» y «Plegar todo» (actúan sobre el menú y sobre la lista), con lo que desaparece la cabecera de la lista.
- Se eliminan la cabecera con título, el texto de ayuda y la tarjeta de avance. Se mantienen el modo de solo lectura (D2 del piloto 1) y la comprobación de existencia de página.

## E2 · Directrices de estilo y tono para las páginas
**Estado: pendiente de aprobación del responsable.**

**Propuesta.** [docs/estilo-paginas.md](../estilo-paginas.md): tono visual primero, poco texto, estructura de página, márgenes, tipografía, base de color neutra con contrastes calculados y componentes recurrentes. Los valores salen de la página piloto y se ajustan; el responsable debe aprobarlos o cambiarlos.
