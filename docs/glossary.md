# Glosario y regla de idioma

Todo lo que se escribe en el repositorio va en **castellano**: los textos descriptivos, las guías, las notas, los mensajes de commit y los mensajes de los scripts. Los **términos y las etiquetas** se quedan en inglés, igual que en desarrollo de software. La conversación con las personas responsables también es en castellano.

## Se quedan en inglés
| Grupo | Términos |
| --- | --- |
| Estados | Ready (R), In process (I), Pending (P), Not applicable (N) |
| Vistas y etiquetas del contenedor | Content, Info, Record, Sections, Progress, Complexity, Framework, Check for updates |
| Trabajo y registro | task, tasks, notes, owner, review, record, project record, exclusionReason, `pending`, `future` |
| Proceso | handoff, seed, init, check, framework, release, changelog, commit, push, merge, pull, branch |
| Diseño | design system (DS), token, design review, breadcrumb, badge, hover, focus, responsive, placeholder |
| Datos y código | claves JSON, IDs, rutas, nombres de archivo, comandos, nombres de tokens |

## Se traduce
Todo lo demás: títulos y textos de la guía, descripciones, explicaciones, criterios de aceptación, errores de validación y documentación. Nombres comunes como contenedor, página, sección, subsección, categoría, guía, catálogo, ruta o estado van en castellano.

## Cómo se combinan
- Una frase en castellano que menciona un término en inglés no lo traduce ni lo declina: "la task queda en `pending`", "la sección vuelve a In process".
- El plural de un término inglés se escribe en inglés: tasks, tokens, reviews.
- Un texto citado de otro producto (por ejemplo, las etiquetas de interfaz de iMoles) se conserva literal en su idioma original.
- Las páginas `.dc.html` declaran `lang="es"`. Un fragmento citado en otro idioma lleva su propio `lang`.

## Qué no cambia
IDs, rutas, carpetas y claves de los datos siguen siendo los mismos slugs en inglés (por ejemplo `visuals.color`). El historial (`CHANGELOG.md` anterior a 2.0.0 y `docs/proposals/`) se queda en el idioma en que se escribió.
