# Contrato de datos y rutas · v2

## Datos propiedad del proyecto
Los datos pertenecen al proyecto. Empiezan como una copia de `seed/` (ver [Seed e init](#seed-e-init)) y desde ahí se editan libremente: el texto de una guía, subsecciones nuevas, subsecciones retiradas. No hay más vínculo con el seed que el `seedVersion` informativo.

`data/guide.json` contiene `schemaVersion` (1), `version` y `categories`. Cada categoría tiene un ID, un número visible, un título, un objetivo e `items`. Cada item tiene un ID único global, un número, un título, un objetivo, una definición, accesibilidad, un entregable, criterios de aceptación y una ruta sugerida.

`data/project.json` contiene `schemaVersion: 2`, `projectId` (slug), `name`, `language` (por ejemplo `es`), `seedVersion`, un `repository` opcional (la URL de GitHub del proyecto, `https://github.com/<owner>/<repo>`, que se muestra en la página Framework), un `record` opcional (el registro propio del proyecto, ver [Project record](#project-record)) y `sections` (un mapa por ID). Debe haber exactamente una entrada por item de la guía y ninguna entrada sin item.

```json
{
  "status": "I",
  "page": "",
  "owner": "Design team",
  "notes": "Paleta fijada por el owner; los valores de interacción son una propuesta.",
  "tasks": [
    {"text": "Definir el tema oscuro", "when": "future"},
    {"text": "Aprobar los valores de interacción", "when": "pending"}
  ],
  "review": {"by": "", "date": "", "evidence": ""},
  "exclusionReason": ""
}
```

Todos los campos anteriores son obligatorios, aunque su valor esté vacío (`tasks` puede ser `[]`). `owner` es opcional en la práctica: puede quedar vacío y no condiciona ningún estado. Estados permitidos: R/I/P/N. `review.date` usa YYYY-MM-DD o está vacío. R necesita que los tres campos de review no estén vacíos; N necesita un motivo. El validador comprueba la presencia, no la veracidad ni la suficiencia de la review.

### Notes y tasks
- `notes` guarda las **decisiones y el contexto actuales** de la sección. No es una lista de pendientes.
- `tasks` es la cola de trabajo de la sección que **no bloquea**: cada task es `{"text", "when"}` con `when` igual a `pending` (corto plazo) o `future` (más adelante). Cuando una task está hecha se elimina de la lista; el historial está en Git.
- **Las tasks nunca bloquean Ready.** Una sección puede ser R con tasks abiertas. El trabajo que sí bloquea la publicación mantiene la sección en I, con su motivo en `notes`; no se registra como task.
- El validador comprueba la forma de `tasks`. La única relación con el estado que hace cumplir es que **una sección Not applicable no puede tener tasks**. Las tasks se muestran en el Record de cada sección y **no se cuentan** en ningún sitio (ni en Progress ni en Complexity).
- **Reabrir una sección Not applicable.** Una task que pertenece a una sección N significa que se está reconsiderando la exclusión. Comprueba primero que realmente pertenece ahí; si pertenece a otra sección o al proyecto, ponla allí y deja la N en paz. Si sí pertenece, la sección se **reabre**: estado P, el motivo de exclusión anterior se mueve a `notes` con la fecha, y se informa a la persona responsable. Una reapertura nunca es silenciosa. `check` falla mientras una sección N tenga tasks, así que una olvidada no puede colarse.

### Project record
`record` es el registro propio del proyecto, que se muestra en la vista Record de la home: `{"owner": "", "notes": "", "tasks": []}`, con exactamente esas tres claves. No tiene estado ni review, porque Progress se calcula a partir de las secciones. Sus `tasks` tienen la misma forma que las de una sección. Úsalas para el trabajo que no pertenece a ninguna subsección (trabajo administrativo del proyecto). El trabajo sobre el framework mismo pertenece al repositorio del framework, no a este. Un proyecto puede omitir `record`; el seed lo empieza vacío.

La vista Record de la home reúne además, en solo lectura, las tasks de todas las secciones, agrupadas por categoría y subsección y sin filtrar. Cada una se edita en su propia sección.

## Reglas del catálogo
La guía es el catálogo del proyecto. Estas reglas lo mantienen coherente y las hace cumplir `check`:
1. Los IDs de categoría y los slugs de subsección usan letras minúsculas, dígitos, guion y guion bajo. El ID de una subsección es `<category-id>.<slug>`. Los IDs son estables, únicos y nunca se reutilizan.
2. Cada subsección tiene exactamente una entrada en `project.json`, y cada entrada pertenece a una subsección.
3. Una subsección nueva empieza en P, sin page, owner, notes, tasks ni review.
4. `suggestedPath` es exactamente `sections/<category-id>/<slug>.html` y es único (también se acepta una página `.dc.html`, ver más abajo).
5. Los números de categoría y de subsección no se repiten. Una nueva toma el siguiente número de su categoría (o el siguiente número de categoría).
6. Una subsección se retira marcándola N con un motivo, no borrándola. Borrarla del catálogo necesita una orden explícita y una nota en `CHANGELOG.md`.
7. Los totales (número de categorías y subsecciones) salen de los datos, nunca de un texto fijo.

Una categoría nueva significa también una carpeta nueva `sections/<category-id>/` y, cuando tenga páginas `.dc.html`, su propio `support.js` (idéntico a los demás).

## Seed e init
`seed/guide.json` es el catálogo inicial; `seed/project.json` es un proyecto con todo en Pending (`projectId` `new-design-system`). `check` y `test` validan ambos, así que un proyecto nuevo nace válido.

```sh
npm run init -- --id my-ds --name "My Design System" [--language es]
```

- Copia el seed a `data/`, fija `projectId`, `name` y `language`, y registra la versión del seed en `seedVersion`.
- No toca `sections/` ni `assets/`.
- Se niega si `data/project.json` ya pertenece a un proyecto (un `projectId` distinto del del seed), porque sobrescribiría sus estados, notes y reviews. `--force` lo permite a propósito.

Las mejoras que se hagan después al seed no se propagan a los proyectos existentes.

## Rutas
Ejemplo completo:
- ID: `visuals.color`.
- HTML: `sections/visuals/color.html`.
- Recursos: `assets/visuals/color/`.
- Desde esa página: `../../assets/visuals/color/palette.svg`.
- Desde el contenedor: `sections/visuals/color.html`.

Un `page` vacío significa "usa la ruta sugerida de la guía si el archivo existe". Solo se rellena para excepciones. Cuando se rellena, acepta una ruta `sections/...html` o `sections/...dc.html` con segmentos alfanuméricos en minúscula, guion o guion bajo, o una URL HTTPS sin credenciales. No acepta `javascript:`, `data:`, rutas de disco, `../` ni URLs HTTP. La ruta sugerida queda reservada sin crear un archivo vacío para cada subsección. Una sección en I o R necesita una página, en la ruta sugerida o en `page`.

La página contiene `<meta name="ds-section-id" content="visuals.color">`. El contenedor no necesita leer sus datos internos. Se muestra en un iframe aislado con `allow-scripts`; existe un enlace aparte como alternativa. No copies páginas externas ni asumas permiso para incrustarlas.

## Páginas `.dc.html`
Las páginas de sección se crean como Design Components. La ruta sugerida de la guía admite dos variantes: `sections/visuals/color.html` y `sections/visuals/color.dc.html`. `guide.json` no cambia. Una sección tiene **una** página: si existen las dos variantes, `check` falla.

Una página `.dc.html` carga, en este orden y con rutas relativas, `../../assets/_runtime/react.production.min.js`, `../../assets/_runtime/react-dom.production.min.js` y `./support.js`. `support.js` lo genera Claude Design en cada carpeta de `sections/`: no se edita y todas sus copias deben ser idénticas. No se permiten scripts externos. Las etiquetas `<sc-for>` y `<sc-if>` no pueden ser hijas directas de elementos de tabla ni de `select`: dentro del iframe del contenedor, que no permite `fetch` de la propia página, no se recuperan. Las imágenes que cita la página, en su HTML o en sus datos, deben existir. La `<meta name="ds-section-id">` va en el `<head>` y `<html>` lleva un `lang` igual al `language` del proyecto.

## Rutas del contenedor
El contenedor usa rutas hash: `#/` (home), `#/home/<content|info|record>` (las vistas de la home), `#/framework` (la página Framework; `home` y `framework` están reservados: ninguna categoría puede usar esos IDs), `#/<category-id>` y `#/<subsection-id>[/content|info|record]`. Un ID de categoría no tiene punto; un ID de subsección es `<category-id>.<slug>`. Los enlaces antiguos `#item-<id>` y `#cat-<id>` se traducen. Sin una vista explícita, una subsección en I o R con página abre su página (Content); cualquier otra abre su vista Info (el texto de la guía).

## Estado de visualización
La búsqueda, los filtros, el estado expandido del menú y la dirección actual son estado de visualización en memoria; no se escriben en el repositorio. Progress se calcula y no se almacena. Los estados de categoría se resumen y no son editables.
