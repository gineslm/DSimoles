# Criterios de revisión

## Ready de una sección
- Propósito, decisiones, reglas, ejemplos y relación con diseño/código son concretos.
- La accesibilidad aplicable está comprobada en esa sección y se registra la evidencia.
- Hay ejemplos habituales y casos límite; no hay pendientes bloqueantes escondidos.
- Se identifica quién revisó, cuándo y qué criterios/resultados respaldan R.
- Los enlaces y recursos necesarios funcionan. Si el desarrollo está fuera del repo, el equipo ha comprobado el acceso.

## Comprobaciones técnicas disponibles
`npm run check` y `npm test`. Qué comprueba cada una, cuándo ejecutarlas y cómo leer sus errores está en [scripts.md](scripts.md). En resumen: contrato guía/proyecto, una sola página por sección, I y R con página, meta de identidad, referencias locales, runtime vendorizado de las páginas `.dc.html` y lógica de `model.js`. No descargan contenido externo ni prueban el navegador.

## Revisión manual de la aplicación
1. Cargar por HTTP, desplegar categorías y elementos y operar con teclado. Con la barra lateral: recorrer el menú, saltar a una subsección y comprobar el foco, el estado actual (`aria-current`) y los enlaces directos (`#item-<id>`). Comprimir y expandir la barra con el botón DSB; comprimida, comprobar los paneles de búsqueda, estado (combinando varios) y secciones con hover, clic y Escape, y «Desplegar todo» y «Plegar todo». En ancho de móvil, abrir y cerrar el cajón (botón y Escape).
2. Combinar R/I/P/N y búsqueda; comprobar resultados vacíos y recuentos.
3. Probar el toggle con página interna, página externa y sin página (mensaje «Sin página»). Recorrer la página **entera** dentro del iframe del contenedor, no solo la cabecera, y compararla con la apertura por separado.
4. Comprobar anchos de móvil/escritorio, ampliación, textos largos y orden del foco.
5. Revisar etiquetas y anuncios con lector de pantalla, contraste y criterios de accesibilidad del proyecto.

La guía metodológica original propone como referencias [WCAG](https://www.w3.org/TR/WCAG22/), [APG](https://www.w3.org/WAI/ARIA/apg/) y [DTCG](https://www.designtokens.org/tr/2025.10/format/). Revisar su aplicabilidad al definir cada proyecto. La plantilla no declara conformidad certificada.

## Alcance de las comprobaciones
Las comprobaciones automáticas validan estructura, contrato y lógica. La revisión visual y funcional en navegador, la accesibilidad y el contenido de cada página son manuales y corresponden a una persona; ninguna comprobación automática equivale a una revisión. Un paso a R requiere esa revisión registrada.
