# Guía general de handoff

Este es el contrato permanente entre Claude Design y Claude Code. No se rellena una plantilla por sesión y no se generan informes adicionales de transferencia.

## Qué se transfiere
| Archivo | Destino y uso |
| --- | --- |
| Página de sección | Ruta `suggestedPath` de su entrada en `data/guide.json`. |
| Recursos propios | `assets/<categoria>/<subseccion>/`. |
| Configuración actualizada | Entradas afectadas de `data/project.json`. |
| Runtime de las páginas `.dc.html` | `assets/_runtime/` (React vendorizado) y `sections/<categoria>/support.js` (generado, idéntico en todas las carpetas). |
| Cambios de la guía o del contenedor | Solo cuando sean parte explícita del trabajo. |

Los propios archivos son el entregable. `notes`, `review` y `exclusionReason` recogen las decisiones que no pueden deducirse del código. Git registra las diferencias una vez integradas. Una carpeta, ZIP o acceso MCP son medios válidos si contienen los mismos archivos y conservan sus rutas.

## Contrato estable
- El ID une guía, configuración y página.
- Las rutas internas son relativas y portables. No se necesita un dominio fijo.
- Crear o vincular una página no cambia automáticamente el estado.
- La vista Guía/Desarrollo es una preferencia de consulta, independiente de R/I/P/N.
- El contenedor web es de solo lectura: lo que muestra es el estado del repo.

## Flujo y garantías
1. GitHub es la fuente de verdad.
2. Claude Design lee el repo, registra su base en `github.md` (commit, versión de `CHANGELOG.md`, recuento de archivos) y compara con el repo al inicio de cada sesión. Si el repo avanzó, se detiene y sincroniza.
3. Claude Design solo modifica `sections/`, `assets/<categoria>/<subseccion>/` y las entradas afectadas de `project.json`.
4. Claude Code trae esas rutas y el runtime al repo local por MCP o por archivos. No copia `_ds/`, `github.md` ni `uploads/`.
5. Si el repo avanzó, `project.json` se integra entrada a entrada y los conflictos se señalan, no se resuelven por antigüedad.
6. Validación local: `npm run check`, `npm test` y revisión visual por una persona. Después, push según las instrucciones del equipo.
7. Claude Code registra la integración en `CHANGELOG.md` y Claude Design sincroniza antes de la siguiente sesión.

El detalle de cada lado está en [claude-design.md](claude-design.md) y [claude-code.md](claude-code.md).

## Estados
| Transición | Condición |
| --- | --- |
| P → I | Desarrollo iniciado. |
| I → R | Criterios satisfechos y revisión registrada. |
| R → I | Cambios o incidencias pendientes de revisión. |
| Cualquiera → N | Exclusión explícita justificada. |
| N → P o I | Se reincorpora al alcance; nota que explica la decisión. |
| I o R → P | Reinicio explícito; revisar qué contenido y evidencia siguen vigentes. |

## Cierre de trabajo
1. Claude Design deja los archivos modificados disponibles y actualiza su configuración.
2. Claude Code compara e integra sobre el repo vigente siguiendo su guía.
3. Claude Code comprueba la integración y describe el resultado. Si faltan archivos o revisión, mantiene el pendiente visible.

Instrucción de cierre reutilizable: **«Integra los cambios disponibles siguiendo docs/handoff.md y docs/claude-code.md».**

No es necesario transmitir toda la conversación. Sí deben quedar registradas las decisiones relevantes en los archivos. Un conflicto entre dos decisiones requiere resolver esa diferencia; ninguna guía puede deducir una aprobación ausente.
