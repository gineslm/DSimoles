# Empezar un proyecto nuevo

DSBook es el framework: un contenedor, una guía, una matriz de seguimiento y los scripts que los mantienen honestos. Un proyecto es una copia suya con datos propios. Esta página explica cómo empezar uno. Cómo se versiona el framework mismo está en [framework.md](framework.md).

## Desde una copia limpia
Copia el repositorio sin su carpeta `.git` y ejecuta:

```sh
npm run init -- --id my-ds --name "My Design System"
```

`init` copia `seed/` (el catálogo inicial y un proyecto con todo en Pending) a `data/` y fija la identidad. Desde ese momento `data/` pertenece al proyecto: edita el texto de la guía, añade o retira subsecciones, etcétera. `init` se niega a sobrescribir un proyecto que ya tiene identidad propia. Si la copia viene de un proyecto usado, elimina primero sus páginas y recursos de `sections/` y `assets/`; cambiar el nombre no basta. Las mejoras que se hagan después al seed no se propagan a los proyectos existentes.

## Repositorio y remoto
```sh
git init
git add .
git commit -m "Inicializar el workspace del DS"
```
Conecta tu remoto de GitHub según el flujo del equipo. Cada equipo debe integrar sobre una rama al día y revisar los conflictos de `project.json` por ID de sección; la copia más reciente nunca gana automáticamente. El alojamiento estático es opcional.

## Archivos que hay que adaptar
`README.md`, `CLAUDE.md` y `CHANGELOG.md` describen el proyecto, no el framework: escribe los propios. `LICENSE` es la que vino con el framework salvo que el proyecto decida otra cosa. Todo lo demás que lista [framework.md](framework.md) viene de DSBook y no se edita por proyecto.
