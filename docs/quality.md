# Criterios de revisión

## Ready de una sección
- Propósito, decisiones, reglas, ejemplos y relación con diseño/código son concretos.
- La accesibilidad aplicable está comprobada en esa sección y se registra la evidencia.
- Hay ejemplos habituales y casos límite; no hay pendientes bloqueantes escondidos.
- Se identifica quién revisó, cuándo y qué criterios/resultados respaldan R.
- Los enlaces y recursos necesarios funcionan. Si el desarrollo está fuera del repo, el equipo ha comprobado el acceso.

## Comprobaciones técnicas disponibles
`npm run check`: contrato guía/proyecto, IDs y rutas únicas, archivos principales, metadatos de páginas asociadas y referencias locales de páginas HTML. No descarga contenido externo.

`npm test`: reglas de importación, estados, rutas seguras y cálculo del avance. No prueba el navegador.

## Revisión manual de la aplicación
1. Cargar por HTTP, desplegar categorías y elementos y operar con teclado.
2. Combinar R/I/P/N y búsqueda; comprobar resultados vacíos y recuentos.
3. Modificar estado y notas, recargar y recuperar el borrador; exportar/importar sin perder contenido.
4. Cambiar el JSON del repo tras crear un borrador y comprobar el aviso de divergencia.
5. Probar el toggle con página interna, página externa y sin página.
6. Comprobar anchos de móvil/escritorio, ampliación, textos largos y orden del foco.
7. Revisar etiquetas y anuncios con lector de pantalla, contraste y criterios de accesibilidad del proyecto.

La guía metodológica original propone como referencias [WCAG](https://www.w3.org/TR/WCAG22/), [APG](https://www.w3.org/WAI/ARIA/apg/) y [DTCG](https://www.designtokens.org/tr/2025.10/format/). Revisar su aplicabilidad al definir cada proyecto. La plantilla no declara conformidad certificada.

## Verificación de esta entrega
Se ejecutan comprobaciones de estructura y pruebas automatizadas de lógica. La revisión visual y funcional en navegador queda pendiente; no hay evidencia de prueba manual de accesibilidad ni de integración con el MCP del equipo.
