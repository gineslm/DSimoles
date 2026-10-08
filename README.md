# DSBook · DSimoles

DSBook es el espacio de trabajo; DSimoles es el Design System que se define en él. Guía de definición, contenedor de documentación y matriz de seguimiento del Design System de DSimoles. Se diseña en Claude Design y se integra mediante Claude Code y Git. Nació de una plantilla reutilizable; sus instrucciones están en [docs/plantilla.md](docs/plantilla.md).

## Empezar
Necesitas Python 3 para servir la web. Node.js 18 o superior permite ejecutar las comprobaciones; no hay paquetes que instalar.

```sh
cd DSimoles
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre http://localhost:8000. No abras `index.html` directamente: la carga de JSON requiere HTTP. También puedes servir la carpeta desde cualquier hosting estático. No hay un despliegue ni una conexión con GitHub incluidos.

1. Consulta la matriz. Cada categoría se despliega; cada subsección tiene su estado y su contenido.
2. Activa **Mostrar guía** para consultar instrucciones. Desactívalo para ver el desarrollo asociado.
3. Crea las páginas en Claude Design, como `.dc.html`, en las rutas indicadas por la guía.
4. Integra los cambios siguiendo [la guía general de handoff](docs/handoff.md).

## Estados y filtros
| Estado | Significado |
| --- | --- |
| R · Ready | Desarrollo revisado, con persona, fecha y evidencia registrados. |
| I · In process | Elaboración o revisión en curso. |
| P · Pending | Desarrollo pendiente; estado inicial. |
| N · No aplica | Fuera de alcance con justificación explícita. |

Combina estados en la cabecera y busca por título, categoría o contenido. Los recuentos de categoría representan todos sus elementos; los filtros muestran solo las coincidencias. Hay dos barras de progreso. **Avance**: R / (R + I + P), es decir, las listas sobre las aplicables. **Complejidad**: las subsecciones que no están en N sobre el total de la guía. Si todo es N, el avance muestra «Sin secciones aplicables».

La barra lateral tiene tres bloques separados: **DSB** (marca; comprime y expande la barra), **progreso** (cabecera «Avance / Complejidad» con el recuento de subsecciones mostradas, por ejemplo 132/132, y las dos líneas de progreso) y **contenido** (búsqueda, estado y secciones). Comprimida, el bloque de contenido pasa a tres iconos —lupa, filtro de estado y secciones— que abren un panel al pasar el ratón; un clic lo fija y Escape lo cierra. El panel de estado permite combinar R, I, P y N, y el de secciones incluye «Desplegar todo» y «Plegar todo».

## Contenedor de solo lectura
La web muestra el estado del repositorio y no lo modifica: no guarda borradores ni importa o exporta configuración. Todo se edita en Claude Design; Claude Code integra los cambios en Git. Búsqueda, filtros, plegado y el conmutador Guía/Desarrollo son estado de consulta en memoria.

La página de cada sección se deduce de la ruta sugerida de la guía. `page` en `data/project.json` solo se rellena en excepciones (URL HTTPS externa o ruta distinta acordada). El contenedor comprueba si el archivo existe al desplegar la sección; si no, muestra «Sin página».

## Organización
Consulta [CLAUDE.md](CLAUDE.md) como entrada para los agentes. Las guías específicas son [Claude Design](docs/claude-design.md), [Claude Code](docs/claude-code.md) y [contrato de datos](docs/data-contract.md).

## Comprobar
```sh
npm run check
npm test
```
No requieren instalar dependencias. Hay además una lista de revisión manual en [docs/quality.md](docs/quality.md). Los tests automatizados no certifican accesibilidad ni sustituyen la revisión visual.

## Reutilizar la plantilla
Las instrucciones para crear otro proyecto a partir de esta estructura están en [docs/plantilla.md](docs/plantilla.md).

## Límites conocidos
- Las páginas externas pueden impedir su integración en iframe; siempre hay un enlace para abrirlas aparte.
- Los iframes usan sandbox con scripts, sin acceso al contenedor. Contenido que requiera cookies, almacenamiento o capacidades adicionales debe abrirse aparte o adaptarse conscientemente.
- La plantilla no edita visualmente el HTML de las secciones. Esa edición se realiza en Claude Design o en el código.
- R indica revisión registrada según los criterios del proyecto, no certificación de conformidad.
- Los archivos Markdown de documentación se pueden leer en el editor o GitHub; no se convierten a HTML automáticamente.
