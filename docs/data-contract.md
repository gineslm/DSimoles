# Contrato de datos y rutas · v1

## Fuente compartida
`data/guide.json` contiene `schemaVersion`, `version` y `categories`. Cada categoría posee ID, número visible, título, objetivo y `items`. Cada item tiene ID global único, número, título, objetivo, definición, accesibilidad, entregable, criterios de aceptación y ruta sugerida.

`data/project.json` contiene `schemaVersion: 1`, `guideVersion`, `projectId` (slug), `name` y `sections` (mapa por ID). Debe haber exactamente una entrada por item de la guía.

```json
{
  "status": "I",
  "page": "sections/visuales/color.html",
  "owner": "Equipo de diseño",
  "notes": "Pendiente comprobar las combinaciones del tema oscuro.",
  "review": {"by": "", "date": "", "evidence": ""},
  "exclusionReason": ""
}
```

Todos los campos anteriores son obligatorios, incluso si su valor es vacío. Estados permitidos: R/I/P/N. `review.date` usa AAAA-MM-DD o vacío. R necesita los tres campos de revisión no vacíos; N necesita motivo. El validador comprueba presencia, no veracidad ni suficiencia de la revisión.

## Rutas
Ejemplo completo:
- ID: `visuales.color`.
- HTML: `sections/visuales/color.html`.
- Recursos: `assets/visuales/color/`.
- Desde esa página: `../../assets/visuales/color/paleta.svg`.
- Desde el contenedor: `sections/visuales/color.html`.

`page` admite vacío, una ruta `sections/...html` con segmentos en minúsculas alfanuméricas/guion/guion bajo o una URL HTTPS sin credenciales. No acepta `javascript:`, `data:`, rutas de disco, `../` ni URLs HTTP. La ruta sugerida queda reservada sin crear un archivo vacío por cada subsección.

La página contiene `<meta name="ds-section-id" content="visuales.color">`. El contenedor no necesita leer sus datos internos. Se muestra en iframe aislado con `allow-scripts`; existe un enlace independiente como alternativa. No copies páginas externas ni presupongas permiso de embedding.

## Estado de sesión
El borrador se almacena en `sessionStorage` por ID del proyecto y ruta del contenedor. Incluye una copia del JSON base para detectar divergencias al recargar. Es temporal, no una base de datos ni sincronización entre dispositivos. La exportación produce un JSON completo; la integración en Git se hace por sección y campo.

Búsqueda, filtros, desplegables y modo Guía/Desarrollo son estado de consulta en memoria; no se escriben al repositorio. El progreso se calcula y no se almacena. Los estados de categorías se resumen y no son editables.
