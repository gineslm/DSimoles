---
name: dsbook-handoff
description: Traspaso entre Claude Design y este repositorio DSBook. Úsalo cuando haya que traer los cambios de Claude Design, integrarlos, subirlos a GitHub o avisar a Claude Design de una actualización. Aplica el ciclo de trabajo de docs/handoff.md con los scripts design-diff y handoff-note y las protecciones contra la pérdida de trabajo.
---

# Traspaso con Claude Design

Sigue este procedimiento sin improvisar. El detalle y los motivos están en `docs/handoff.md` y `docs/scripts.md`. **Nunca subas nada sin el visto bueno de la persona responsable** y **nunca hagas push por tu cuenta**: prepara los commits y pídelo.

## 0 · Accesos (si falta uno, detente y pídelo)
- `git fetch` y `git status -sb`: ¿el remoto tiene commits que no tienes?
- La conexión MCP al proyecto de Claude Design (dirección en `CLAUDE.md`, «Conexiones del proyecto»).
- Si falta algo, di qué falta. No trabajes con una copia que no sabes si está al día.

## 1 · Pedir el manifiesto a Claude Design
1. `npm run design-diff -- --request` imprime un prompt con un nonce. Dáselo a la persona responsable para que lo pegue en Claude Design.
2. Cuando Claude Design confirme, lee su `design-manifest.json` con `get_file` (un solo archivo) y guárdalo en disco.

## 2 · Comparar
`npm run design-diff -- --manifest <archivo>` compara a tres bandas con `design-baseline.json`.
- **SIN INTEGRAR / NUEVOS** (código de salida 2): trabajo de Claude Design que el repo no tiene. Trae solo esos archivos con `get_file`; no leas el resto.
- **POR CONFIRMAR**: cambiaron en ambos lados; revisa que la integración es intencionada.
- **El repo va por delante**: lo hecho en Claude Code; Claude Design debe adoptarlo.
- Ahorra tokens: no leas páginas que no aparecen en la lista.

## 3 · Integrar en local
- Escribe lo traído en las rutas de `suggestedPath`. El idioma del repositorio es castellano (`docs/glossary.md`).
- Integra `data/project.json` y `data/guide.json` entrada por entrada, nunca el archivo completo.
- Ejecuta `npm run check` y `npm test`.
- Repite `design-diff --manifest`: no debe quedar nada SIN INTEGRAR.

## 4 · Validación humana (parada obligatoria)
Pide a la persona responsable que valide en local (`npm start`, cada página abierta aparte). No sigas sin su visto bueno.

## 5 · Registrar y commitear
1. `npm run design-diff -- --record --confirm todo` (o rutas concretas) registra la integración en `design-baseline.json`. Si algo de Claude Design se descarta a propósito: `--discard <ruta> --reason "motivo"` (repite `--discard` para varias rutas). Nunca descartes sin que la persona responsable lo decida.
2. `npm run handoff-note` escribe `handoff-last.md`.
3. Reparte en commits por tipo (framework, documentación del proyecto, datos, contenido de Claude Design), cada uno validado con `check` y `test`. Mensajes en castellano.
4. Si cambiaste el framework: `npm run framework -- --release <versión>` y porta los archivos a DSbook (`npm run framework -- --compare ../DSbook`).

## 6 · Subir (solo si la persona responsable lo pide)
- `git push`. El hook `pre-push` (`npm run hooks:install`) bloquea el push si hay trabajo de Claude Design sin integrar o la comparación tiene más de 24 h.
- Después añade la entrada de `CHANGELOG.md` con los hashes publicados.

## 7 · Avisar a Claude Design
Entrega a la persona responsable el prompt de la plantilla de `docs/handoff.md` («El aviso a Claude Design») con el hash publicado. Claude Design debe proteger su trabajo antes de adoptar nada (paso 1 de `handoff-last.md`).

## Reglas que no se saltan
- No inventes aprobaciones ni resultados. No marques R sin una review registrada.
- Un archivo que Claude Design cambió y el repo no se ha tocado se perdería al actualizar Claude Design desde el repo: nunca lo ignores.
- `DSBOOK_SKIP_DESIGN_CHECK=1` para saltarse el hook es una decisión de la persona responsable, no tuya.
