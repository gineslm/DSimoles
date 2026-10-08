# Propuestas y su registro

Una propuesta es un cambio acordado al **sistema de trabajo** (contenedor, contrato, guías, scripts), no al contenido del Design System. Se redacta en Claude Design o con el responsable, se lleva a este directorio y Claude Code la aplica. No sustituye a `CHANGELOG.md` (que registra integraciones) ni es un informe de sesión.

## Flujo
1. La propuesta se guarda como `docs/propuestas/<nombre>.md` con una decisión por apartado (`D1`, `D2`…), su motivo y sus cambios.
2. Claude Code las aplica por bloques, con validación (`npm run check`, `npm test`) y revisión del responsable.
3. Al terminar cada decisión se anota en su propio apartado el **estado** y lo que realmente se hizo, incluidas las correcciones a la premisa original.
4. Esta tabla recoge el estado de todas. Las descartadas se conservan con su motivo.

## Estados
- **Aplicada**: hecha y validada.
- **Parcial**: hecha en parte; lo que falta está en la nota.
- **Descartada**: el responsable decidió no aplicarla.
- **Pendiente**: aceptada pero sin aplicar.

## Registro
| Propuesta | Decisión | Estado | Versión | Nota |
| --- | --- | --- | --- | --- |
| [piloto-1](piloto-1-decisiones.md) | D1 · Páginas `.dc.html` | Aplicada | 0.3.0, 0.4.0 | React vendorizado en `assets/_runtime/`; el sandbox del iframe no cambia. |
| piloto-1 | D2 · Contenedor de solo lectura | Aplicada | 0.2.0 | |
| piloto-1 | D3 · `project.json` central y regla de `page` | Aplicada | 0.2.0, 0.3.0 | |
| piloto-1 | D4 · Protocolo de transferencia | Aplicada | 0.6.0 | Documentado en `handoff.md`, `claude-design.md` y `claude-code.md`. |
| piloto-1 | D5 · `CHANGELOG.md` | Aplicada | 0.2.0 | |
| piloto-1 | D6 · Plantilla frente a proyecto | Aplicada | 0.2.0, 0.6.0 | Repo renombrado a DSimoles; la web pasa a llamarse DSBook · DSimoles. |
| piloto-1 | D7 · Sistema visual | Aplicada con matiz | 0.6.0 | Generalizada: se ignora cualquier DS que Claude Design cargue. Pendiente: base neutra y desvincular el DS cargado (acción del responsable). |
| piloto-1 | D8 · Estado Ready | Descartada | 0.6.0 | El responsable decide no añadir la precisión; el contrato de Ready no cambia. |
| piloto-1 | D9 · Scripts | Aplicada | 0.6.0 | Los scripts ya existían; se ampliaron y se documentaron en [scripts.md](../scripts.md). |
| [piloto-2](piloto-2-contenedor-y-estilo.md) | E1 · Contenedor con barra lateral | Aplicada | 0.7.0 | Menú de 14 categorías y 132 subsecciones, enlaces directos y cajón en móvil. |
| piloto-2 | E2 · Directrices de estilo y tono | Pendiente | — | Propuesta en [estilo-paginas.md](../estilo-paginas.md), a la espera de aprobación. |
