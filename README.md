# DS Workspace

Una plantilla web por proyecto: guía de definición, contenedor de documentación y matriz de seguimiento de un Design System. Preparada para diseñar en Claude Design e integrar mediante Claude Code y Git.

## Empezar
Necesitas Python 3 para servir la web. Node.js 18 o superior permite ejecutar las comprobaciones; no hay paquetes que instalar.

```sh
cd ds-workspace
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre http://localhost:8000. No abras `index.html` directamente: la carga de JSON requiere HTTP. También puedes servir la carpeta desde cualquier hosting estático. No hay un despliegue ni una conexión con GitHub incluidos.

1. Edita `projectId` (slug único) y `name` en `data/project.json`.
2. Consulta la matriz. Cada categoría se despliega; cada subsección tiene su estado y su contenido.
3. Activa **Mostrar guía** para consultar instrucciones. Desactívalo para ver el desarrollo asociado.
4. Crea las páginas desde `templates/section.html` en las rutas indicadas por la guía.
5. Integra los cambios siguiendo [la guía general de handoff](docs/handoff.md).

## Estados y filtros
| Estado | Significado |
| --- | --- |
| R · Ready | Desarrollo revisado, con persona, fecha y evidencia registrados. |
| I · In process | Elaboración o revisión en curso. |
| P · Pending | Desarrollo pendiente; estado inicial. |
| N · No aplica | Fuera de alcance con justificación explícita. |

Combina estados en la cabecera y busca por título, categoría o contenido. Los recuentos de categoría representan todos sus elementos; los filtros muestran solo las coincidencias. El avance es R / (R + I + P); si todo es N se muestra «Sin secciones aplicables».

## Guardado durante la sesión
Los cambios de nombre, estado, URL y metadatos se guardan como **borrador de la pestaña** mediante `sessionStorage`, cuando está disponible. No equivalen a modificar archivos del repositorio. Al recargar se ofrece recuperar el borrador. Si el archivo base cambió, aparece un aviso antes de recuperarlo.

Antes de cerrar, pulsa **Exportar project.json** y entrega ese archivo junto con las páginas y recursos modificados a Claude Code. La descarga no marca la integración en Git como realizada. El navegador puede perder el borrador al cerrar la pestaña; no lo uses como copia durable.

**Importar configuración** permite cargar un `project.json` completo compatible. Se comprueban IDs, estados, versiones, rutas y metadatos de R/N. Si hay cambios sin integrar, se pide confirmar su sustitución. No importa páginas ni recursos.

Claude Design también puede editar directamente los archivos si su entorno permite hacerlo. La plantilla no presupone una API o MCP concreto, ni automatiza la transferencia desde Claude Design.

## Organización
Consulta [CLAUDE.md](CLAUDE.md) como entrada para los agentes. Las guías específicas son [Claude Design](docs/claude-design.md), [Claude Code](docs/claude-code.md) y [contrato de datos](docs/data-contract.md).

## Comprobar
```sh
npm run check
npm test
```
No requieren instalar dependencias. Hay además una lista de revisión manual en [docs/quality.md](docs/quality.md). Los tests automatizados no certifican accesibilidad ni sustituyen la revisión visual.

## Reutilizar y colaborar
Copia esta carpeta limpia a un nuevo repositorio. Configura su identidad; conserva todos los estados P hasta tomar decisiones. Si partes de un proyecto usado, vacía páginas, responsables, notas, revisiones y exclusiones en `project.json`, retira su contenido específico de `sections/` y `assets/` y devuelve estados a P. Conserva la estructura de la guía.

Para crear un repositorio local desde una copia sin historial:
```sh
git init
git add .
git commit -m "Initialize DS workspace"
```
Conecta tu remoto de GitHub según el flujo del equipo. Cada equipo debe integrar sobre una rama actualizada y revisar los conflictos de `project.json` por ID de sección; nunca gana automáticamente la copia más reciente. El hosting estático es opcional.

## Límites conocidos
- Las páginas externas pueden impedir su integración en iframe; siempre hay un enlace para abrirlas aparte.
- Los iframes usan sandbox con scripts, sin acceso al contenedor. Contenido que requiera cookies, almacenamiento o capacidades adicionales debe abrirse aparte o adaptarse conscientemente.
- La plantilla no edita visualmente el HTML de las secciones. Esa edición se realiza en Claude Design o en el código.
- R indica revisión registrada según los criterios del proyecto, no certificación de conformidad.
- Los archivos Markdown de documentación se pueden leer en el editor o GitHub; no se convierten a HTML automáticamente.
