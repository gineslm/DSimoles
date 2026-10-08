# DSBook · instrucciones para agentes

## Finalidad
DSBook es un espacio para definir, documentar y seguir un Design System. Este repositorio contiene el de DSimoles; nació de una plantilla reutilizable ([docs/plantilla.md](docs/plantilla.md)). Cada copia representa un solo proyecto. La matriz reúne una guía por subsección y las páginas HTML que desarrollan el DS. El repositorio es la fuente compartida de verdad; Claude Design es el espacio de diseño y edición y Claude Code integra los archivos y sus cambios.

## Leer según la tarea
- [README: funcionamiento y arranque](README.md)
- [Guía para Claude Design](docs/claude-design.md): diseñar, crear páginas y mantener decisiones durante el trabajo.
- [Guía para Claude Code](docs/claude-code.md): integrar, validar y actualizar el repositorio.
- [Guía general de handoff](docs/handoff.md): contrato permanente de transferencia. No hay formulario por sesión.
- [Contrato de datos y rutas](docs/data-contract.md): identidades, estados y esquema.
- [Criterios de revisión](docs/quality.md): aceptación de contenido y aplicación.
- [Scripts de comprobación](docs/scripts.md): qué comprueban `npm run check` y `npm test`, cuándo ejecutarlos y cómo leer sus errores.
- [Propuestas y su registro](docs/propuestas/README.md): cambios acordados al sistema de trabajo y su estado (aplicada, descartada, pendiente).

## Reglas comunes
1. Lee `data/guide.json` y `data/project.json` antes de modificar una sección. Conserva sus IDs; el título visible puede cambiar.
2. Trabaja en castellano por defecto.
3. Sin paso de build ni servicios externos. Se permite el runtime vendorizado que necesitan las páginas `.dc.html`, versionado dentro del repo (`assets/_runtime/` y `sections/<categoria>/support.js`). No añadas backend, cuentas, sincronización remota ni gestores de proyectos sin una necesidad acordada.
4. Crea las páginas en el `suggestedPath` de cada subsección. Sus recursos van en `assets/<categoria>/<subseccion>/`. No uses rutas absolutas del equipo ni enlaces dependientes de un dominio local.
5. `data/guide.json` orienta; `data/project.json` registra decisiones; `sections/` contiene el desarrollo. No copies contenido del desarrollo dentro de la guía.
6. Los únicos estados son R (Ready), I (In process), P (Pending), N (No aplica). Una página existente no implica R. Ready exige revisión registrada, no una certificación automática.
7. No marques N sin motivo explícito. No excluyas requisitos de accesibilidad aplicables por conveniencia. Una fila transversal no sustituye las comprobaciones por elemento.
8. No inventes aprobaciones, resultados de pruebas, responsables o evidencia. Si hay trabajo o revisión pendiente, usa I y describe el pendiente.
9. No crees informes de handoff por sesión. Conserva decisiones en los campos de la sección; Git recoge los cambios.
10. Respeta cambios ajenos. Revisa diferencias antes de reemplazar archivos. No resetees el proyecto para integrar una sección.
11. Ejecuta `npm run check` y `npm test` antes de cerrar una integración. Estos comandos no requieren `npm install`.
12. Commit, push, publicación y resolución de conflictos siguen las instrucciones vigentes del equipo. No hagas push forzado ni publiques por defecto.
13. Ignora cualquier design system que Claude Design cargue o vincule al proyecto (por ejemplo `_ds/`), tanto en las páginas como en el contenedor, salvo que el responsable indique lo contrario.
14. Antes de modificar archivos, comprueba que tu base coincide con el repositorio. Sigue el protocolo de [handoff](docs/handoff.md).

## Mapa del repositorio
- `index.html`, `styles.css`, `app.js`, `model.js`: contenedor interactivo.
- `data/guide.json`: 14 categorías y 132 subsecciones con instrucciones y destinos.
- `data/project.json`: identidad del proyecto, estado, página, responsable, notas y revisión.
- `sections/`: desarrollo del DS; empieza vacío de contenido de proyecto.
- `templates/component.md`: ficha de componente. Las páginas de sección se crean en Claude Design como `.dc.html`; no hay plantilla de página.
- `assets/`: recursos de las páginas.
- `docs/`: guías permanentes. `docs/propuestas/`: propuestas de cambio y su registro.
- `scripts/`: comprobaciones del contrato y pruebas de lógica.

Al empezar otra copia, cambia `projectId` y `name`, conserva la guía y parte de estados P con páginas vacías. No heredes revisiones ni decisiones del proyecto anterior. Consulta README.
