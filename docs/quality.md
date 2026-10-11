# Criterios de review

## Ready para una sección
- El propósito, las decisiones, las reglas, los ejemplos y la relación con diseño/código son concretos.
- La accesibilidad aplicable se comprueba en esa sección y la evidencia queda registrada.
- Hay ejemplos típicos y casos límite, y ningún trabajo bloqueante oculto: el trabajo bloqueante mantiene la sección en I. El trabajo no bloqueante vive en las `tasks` de la sección y no impide R (por ejemplo, un tema oscuro que queda fuera de alcance por ahora).
- Se identifica quién revisó, cuándo y qué criterios/resultados respaldan R.
- Los enlaces y recursos necesarios funcionan. Si el desarrollo vive fuera del repo, el equipo ha verificado el acceso.

## Comprobaciones técnicas disponibles
`npm run check` y `npm test`. Qué verifica cada una, cuándo ejecutarlas y cómo leer sus errores está en [scripts.md](scripts.md). En resumen: contrato guía/proyecto, una sola página por sección, I y R con página, meta de identidad, referencias locales, el runtime vendorizado de las páginas `.dc.html` y la lógica de `model.js`. No descargan contenido externo ni prueban el navegador.

## Review manual de la aplicación
1. Carga por HTTP y opera con el teclado. Rail: abre los paneles de estado y de secciones con hover, clic y Escape; pasa el puntero por una categoría y comprueba que todas sus subsecciones se abren en un submenú que sigue abierto mientras el puntero entra en él; elige una subsección y comprueba que el panel se cierra, el foco pasa al área principal, el elemento actual está marcado (`aria-current`) y el botón Atrás del navegador vuelve a la vista anterior. En ancho móvil, comprueba los chevrons en línea en lugar de la cascada por hover.
2. Combina R/I/P/N y la búsqueda; comprueba los resultados vacíos en la home y en una categoría, y que el menú sigue los filtros.
3. Abre una subsección con página, una sin página y una dirección errónea. Con página en I o R abre en Content; si no, en Info. Comprueba las tres vistas y la cabecera (enlaces del breadcrumb y estado a la izquierda; a la derecha las pestañas de vista, la lupa que despliega el campo de búsqueda y anterior/siguiente, con separadores). Content sin página debe decir "Aún no hay página". La home tiene las mismas tres vistas: Content (el resumen), Info (vacía a propósito por ahora) y Record (el project record y las tasks de todas las secciones, nunca filtradas). Recorre la página **entera** dentro del contenedor, no solo su parte superior, y compárala con abrirla aparte. Comprueba que la cabecera no ocupa demasiada altura en ancho móvil.
4. Comprueba los anchos móvil/escritorio, el zoom, los textos largos y el orden del foco.
5. Revisa etiquetas y anuncios con un lector de pantalla, el contraste y los criterios de accesibilidad del proyecto.

La guía metodológica original propone [WCAG](https://www.w3.org/TR/WCAG22/), [APG](https://www.w3.org/WAI/ARIA/apg/) y [DTCG](https://www.designtokens.org/tr/2025.10/format/) como referencias. Revisa su aplicabilidad al definir cada proyecto. La plantilla no afirma una conformidad certificada.

## Alcance de las comprobaciones
Las comprobaciones automáticas validan estructura, contrato y lógica. La review visual y funcional en el navegador, la accesibilidad y el contenido de cada página son manuales y corresponden a una persona; ninguna comprobación automática equivale a una review. Pasar a R exige esa review registrada.
