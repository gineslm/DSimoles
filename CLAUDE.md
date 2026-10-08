# DS Workspace · instrucciones para agentes

## Finalidad
Este repositorio contiene una plantilla reutilizable para definir, documentar y seguir un Design System. Cada copia representa un solo proyecto. La matriz reúne una guía por subsección y las páginas HTML que desarrollan el DS. El repositorio es la fuente compartida de verdad; Claude Design es el espacio de diseño y edición y Claude Code integra los archivos y sus cambios.

## Leer según la tarea
- [README: funcionamiento y arranque](README.md)
- [Guía para Claude Design](docs/claude-design.md): diseñar, crear páginas y mantener decisiones durante el trabajo.
- [Guía para Claude Code](docs/claude-code.md): integrar, validar y actualizar el repositorio.
- [Guía general de handoff](docs/handoff.md): contrato permanente de transferencia. No hay formulario por sesión.
- [Contrato de datos y rutas](docs/data-contract.md): identidades, estados y esquema.
- [Criterios de revisión](docs/quality.md): aceptación de contenido y aplicación.

## Reglas comunes
1. Lee `data/guide.json` y `data/project.json` antes de modificar una sección. Conserva sus IDs; el título visible puede cambiar.
2. Trabaja en castellano por defecto.
3. Mantén HTML, CSS y JavaScript sin framework ni dependencias de ejecución. No añadas backend, cuentas, sincronización remota ni gestores de proyectos sin una necesidad acordada.
4. Crea las páginas en el `suggestedPath` de cada subsección. Sus recursos van en `assets/<categoria>/<subseccion>/`. No uses rutas absolutas del equipo ni enlaces dependientes de un dominio local.
5. `data/guide.json` orienta; `data/project.json` registra decisiones; `sections/` contiene el desarrollo. No copies contenido del desarrollo dentro de la guía.
6. Los únicos estados son R (Ready), I (In process), P (Pending), N (No aplica). Una página existente no implica R. Ready exige revisión registrada, no una certificación automática.
7. No marques N sin motivo explícito. No excluyas requisitos de accesibilidad aplicables por conveniencia. Una fila transversal no sustituye las comprobaciones por elemento.
8. No inventes aprobaciones, resultados de pruebas, responsables o evidencia. Si hay trabajo o revisión pendiente, usa I y describe el pendiente.
9. No crees informes de handoff por sesión. Conserva decisiones en los campos de la sección; Git recoge los cambios.
10. Respeta cambios ajenos. Revisa diferencias antes de reemplazar archivos. No resetees el proyecto para integrar una sección.
11. Ejecuta `npm run check` y `npm test` antes de cerrar una integración. Estos comandos no requieren `npm install`.
12. Commit, push, publicación y resolución de conflictos siguen las instrucciones vigentes del equipo. No hagas push forzado ni publiques por defecto.

## Mapa del repositorio
- `index.html`, `styles.css`, `app.js`, `model.js`: contenedor interactivo.
- `data/guide.json`: 14 categorías y 132 subsecciones con instrucciones y destinos.
- `data/project.json`: identidad del proyecto, estado, página, responsable, notas y revisión.
- `sections/`: desarrollo del DS; empieza vacío de contenido de proyecto.
- `templates/section.html`: base de una página; `templates/component.md`: ficha de componente.
- `assets/`: recursos de las páginas.
- `docs/`: guías permanentes.
- `scripts/`: comprobaciones del contrato y pruebas de lógica.

Al empezar otra copia, cambia `projectId` y `name`, conserva la guía y parte de estados P con páginas vacías. No heredes revisiones ni decisiones del proyecto anterior. Consulta README.
