# Guía general de handoff

Este es el contrato permanente entre Claude Design y Claude Code. No se rellena una plantilla por sesión y no se generan informes adicionales de transferencia.

## Qué se transfiere
| Archivo | Destino y uso |
| --- | --- |
| Página de sección | Ruta `suggestedPath` de su entrada en `data/guide.json`. |
| Recursos propios | `assets/<categoria>/<subseccion>/`. |
| Configuración actualizada | Entradas afectadas de `data/project.json`. |
| Cambios de la guía o del contenedor | Solo cuando sean parte explícita del trabajo. |

Los propios archivos son el entregable. `notes`, `review` y `exclusionReason` recogen las decisiones que no pueden deducirse del código. Git registra las diferencias una vez integradas. Una carpeta, ZIP o acceso MCP son medios válidos si contienen los mismos archivos y conservan sus rutas.

## Contrato estable
- El ID une guía, configuración y página.
- Las rutas internas son relativas y portables. No se necesita un dominio fijo.
- Crear o vincular una página no cambia automáticamente el estado.
- La vista Guía/Desarrollo es una preferencia de consulta, independiente de R/I/P/N.
- Los cambios de sesión no están sincronizados por el hecho de exportarlos o mostrarlos en el navegador.

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
