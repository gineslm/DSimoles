# Guía general de handoff

Es el contrato permanente entre Claude Design y Claude Code. No se rellena ninguna plantilla por sesión ni se generan informes de transferencia adicionales.

## Qué se transfiere
| Archivo | Destino y uso |
| --- | --- |
| Página de sección | El `suggestedPath` de su entrada en `data/guide.json`. |
| Recursos propios | `assets/<category>/<subsection>/`. |
| Configuración actualizada | Entradas afectadas de `data/project.json` y, cuando se crea una subsección o categoría o se edita el texto de la guía, de `data/guide.json`. |
| Runtime de las páginas `.dc.html` | `assets/_runtime/` (React vendorizado) y `sections/<category>/support.js` (generado, idéntico en cada carpeta). |
| Cambios del contenedor | Solo cuando son parte explícita del trabajo. |

Los archivos mismos son el entregable. `notes`, `tasks`, `review` y `exclusionReason` guardan las decisiones y el trabajo pendiente que no se pueden deducir del código. Git registra las diferencias una vez integradas. Una carpeta, un ZIP o el acceso por MCP son medios válidos si contienen los mismos archivos y conservan sus rutas.

## Contrato estable
- El ID une guía, configuración y página.
- Las rutas internas son relativas y portables. No hace falta ningún dominio fijo.
- Crear o enlazar una página no cambia el estado automáticamente.
- La vista Content/Info es una preferencia de visualización, independiente de R/I/P/N.
- El contenedor web es de solo lectura: lo que muestra es el estado del repo.

## El ciclo de trabajo
1. **GitHub es la única fuente de verdad.** Todo lo que no está en el repositorio no existe para el equipo.
2. **Claude Design** lee el repo, registra su base en `github.md` (commit, versión de `CHANGELOG.md`, número de archivos) y la compara con el repo al empezar cada sesión; si el repo ha avanzado, se detiene y sincroniza. Construye y avanza los diseños y solo modifica `sections/`, `assets/<category>/<subsection>/` y las entradas afectadas de `project.json` y `guide.json`.
3. **Claude Code se conecta por MCP al proyecto de Claude Design**, compara su contenido con el repo local y trae esas rutas y el runtime. No copia `_ds/`, `github.md` ni `uploads/`. Si no hay conexión MCP, la persona responsable le da una carpeta o un ZIP con los mismos archivos y las mismas rutas. Antes de integrar, Claude Code pide el manifiesto de hashes (`npm run design-diff -- --request`), lo lee con **un solo** `get_file` y `npm run design-diff -- --manifest` dice exactamente qué archivos de Claude Design faltan o difieren; solo esos se traen ([scripts.md](scripts.md#npm-run-design-diff)).
4. **Claude Code lo implementa en local.** Integra `project.json` y `guide.json` entrada por entrada (los conflictos se señalan, no se resuelven por antigüedad) y ejecuta `npm run check` y `npm test`. Justo antes del commit repite `design-diff --manifest`: no puede quedar nada sin integrar, y lo que cambió en ambos lados se confirma a propósito con `--record --confirm`, que deja la integración anotada en `design-baseline.json` (se versiona).
5. **La persona responsable valida en local**: el contenedor servido por HTTP y cada página abierta aparte. Sin su visto bueno no se sube nada.
6. **Claude Code sube a GitHub** (commit y push según las instrucciones del equipo), registra la integración en `CHANGELOG.md` en un commit posterior y **escribe el aviso para Claude Design**: `npm run handoff-note` antes del commit (el archivo entra en él) y el prompt después del push (ver [El aviso a Claude Design](#el-aviso-a-claude-design)).
7. **Claude Design confirma la actualización**: lee el repo, comprueba que el commit publicado contiene lo que dice el aviso, actualiza su base en `github.md` y sigue desde ahí.

### Protección del trabajo de Claude Design
El riesgo que se evita: Claude Design cambia una página, no llega al repo (o no se detecta), se sube, y al actualizar Claude Design desde el repo su versión se sobrescribe con la antigua. Hay cuatro frenos:
1. **Comparación a tres bandas** con `design-baseline.json`: un archivo que Claude Design cambió y que el repo no ha tocado se señala como *sin integrar* y bloquea.
2. **`--record` exige resolverlo**: integrar, confirmar o descartar con motivo. No hay forma silenciosa de dejarlo pasar.
3. **Control previo al push** (`npm run hooks:install`): sin una comparación reciente y limpia, `git push` se bloquea. `handoff-note` también se niega a avisar.
4. **Red de seguridad en Claude Design**: antes de adoptar nada del repo, compara el hash de cada archivo suyo con `design-baseline.json`; si cambió desde la última integración y difiere del repo, no lo sobrescribe: guarda su copia en `_backup/<fecha>/<ruta>` y lo avisa.

El `design-baseline.json` de la raíz lo escribe `design-diff --record` y lo leen los dos lados.

### El aviso a Claude Design
El aviso tiene dos partes. **`handoff-last.md`** (en la raíz; lo genera `npm run handoff-note` antes del commit y viaja en él; se reescribe en cada envío) es la descripción completa. El **prompt** es un texto corto que Claude Code entrega a la persona responsable tras el push, con el hash ya publicado, para pegarlo en Claude Design. El archivo debe llevar, sin que Claude Design tenga que deducirlo:
- el commit publicado y la versión de `CHANGELOG.md` (y del framework, si cambió);
- la lista de lo que cambió **agrupada por tipo** (tabla de abajo) y, para cada grupo, las rutas o IDs afectados;
- el origen del cambio (**diseño** de Claude Design que ahora está en el repo, o **cambio hecho en Claude Code** que Claude Design debe incorporar);
- qué debe comprobar o hacer Claude Design, y qué **no** debe tocar.

| Tipo de cambio | Quién lo origina | Qué hace Claude Design |
| --- | --- | --- |
| Diseño: `sections/`, `assets/<category>/<subsection>/`, entradas de `project.json` y `guide.json` | Claude Design | Confirma que el repo contiene su trabajo tal cual (o dice qué difiere, por ejemplo una traducción) y adopta esa versión como base. |
| Contenido hecho en Claude Code (traducción, correcciones, páginas integradas) | Claude Code | Reconcilia sus páginas con la versión del repo antes de seguir editando; no las sobrescribe con su copia anterior. |
| Framework: contenedor, `scripts/`, `seed/`, runtime, `docs/` | Claude Code | Actualiza su copia de referencia y lee las guías nuevas; no edita nada de eso. |
| Estructura: IDs, rutas, carpetas, categorías | Claude Code, con orden explícita | Actualiza su mapa de pantallas y sus rutas; no renombra por su cuenta. |

Plantilla del prompt (el hash y las versiones se rellenan tras el push):

> Actualiza el proyecto desde el repositorio. Commit publicado: `<hash>` en `main` (CHANGELOG `<versión>`, framework `<versión>`). Lee `handoff-last.md` en la raíz y sigue sus instrucciones: comprueba que el commit contiene lo que describe, adopta la versión del repositorio donde el archivo lo indique, actualiza `github.md` y responde con lo que comprobaste, lo que difiere y tu nueva base. No toques el framework ni IDs, rutas o carpetas.

Si un mismo push mezcla tipos, el aviso los separa. Claude Design responde con lo que comprobó y su nueva base, y la persona responsable la pega en la sesión de Claude Code si hay diferencias.

### Accesos
Antes de empezar, cada agente comprueba que tiene lo que su papel necesita. Si falta algo, **se detiene, dice qué falta y lo pide a la persona responsable**: no trabaja con una copia que no sabe si está al día ni da por válido un estado que no ha podido leer.

| Quién | Necesita |
| --- | --- |
| Claude Design | Lectura del repositorio en GitHub, para registrar su base y confirmar cada actualización. |
| Claude Code | git en el repo local (`fetch`, `status`, `push`) y la conexión MCP al proyecto de Claude Design. |
| Persona responsable | Poder servir el repo en local para validar, y autorizar el push. |

Los datos de conexión de cada proyecto (el repositorio y el proyecto de Claude Design) se registran en su `CLAUDE.md`, en la sección "Conexiones del proyecto".

El detalle de cada lado está en [claude-design.md](claude-design.md) y [claude-code.md](claude-code.md).

## Estados
| Transición | Condición |
| --- | --- |
| P → I | Desarrollo iniciado. |
| I → R | Criterios cumplidos y review registrada. |
| R → I | Cambios o problemas pendientes de review. |
| Cualquiera → N | Exclusión explícita y justificada. |
| N → P o I | Vuelve al alcance; una nota explica la decisión. |
| I o R → P | Reinicio explícito; revisa qué contenido y evidencia siguen siendo válidos. |

## Cierre del trabajo
1. Claude Design deja disponibles los archivos modificados y actualiza su configuración.
2. Claude Code compara e integra sobre el repo actual siguiendo su guía.
3. Claude Code comprueba la integración y describe el resultado. Si faltan archivos o review, mantiene visible el pendiente.

Instrucción de cierre reutilizable: **"Integra los cambios disponibles siguiendo docs/handoff.md y docs/claude-code.md."**

No hace falta transmitir toda la conversación. Las decisiones relevantes deben quedar registradas en los archivos. Un conflicto entre dos decisiones exige resolver esa diferencia; ninguna guía puede deducir una aprobación que no existe.
