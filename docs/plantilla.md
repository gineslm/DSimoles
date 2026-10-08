# Reutilizar la plantilla

Este repositorio nació como una plantilla de DS Workspace y hoy es el proyecto DSimoles. Estas instrucciones sirven para crear otro proyecto a partir de su estructura.

Copia esta carpeta sin las páginas ni el contenido de DSimoles a un nuevo repositorio. Edita `projectId` (slug único) y `name` en `data/project.json`; conserva todos los estados P hasta tomar decisiones. Si partes de un proyecto usado, vacía páginas, responsables, notas, revisiones y exclusiones en `project.json`, retira su contenido específico de `sections/` y `assets/` y devuelve estados a P. Conserva la estructura de la guía.

Para crear un repositorio local desde una copia sin historial:
```sh
git init
git add .
git commit -m "Initialize DS workspace"
```
Conecta tu remoto de GitHub según el flujo del equipo. Cada equipo debe integrar sobre una rama actualizada y revisar los conflictos de `project.json` por ID de sección; nunca gana automáticamente la copia más reciente. El hosting estático es opcional.

