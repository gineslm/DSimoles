# El framework DSBook y su versión

Todo proyecto construido con DSBook es una copia de la misma base: el contenedor, los scripts, el seed, el runtime vendorizado y las guías permanentes. Esa base es **el framework**. Varios repositorios pueden llevarlo (el propio DSBook y cada proyecto) y con el tiempo pueden divergir. `dsbook.json` lo hace visible.

## Qué registra `dsbook.json`
```json
{ "framework": "DSBook", "version": "2.0.0", "released": "2026-10-11", "repository": "https://github.com/<owner>/DSBook", "files": { "app.js": "<sha-256>", … } }
```
- `version`: la versión del framework, `MAJOR.MINOR.PATCH`.
- `released`: la fecha en que se registró esa versión.
- `repository`: el origen del framework, de donde vienen las actualizaciones. `--release` lo conserva del manifiesto anterior, o lo fija con `--repository <url>`.
- `files`: el SHA-256 de cada archivo del framework (con los saltos de línea normalizados, para que coincidan un checkout de Windows y uno de Linux).

## Qué pertenece al framework
| Framework (compartido, igual en cada repositorio) | Proyecto (propio) |
| --- | --- |
| `index.html`, `styles.css`, `app.js`, `model.js` | `data/guide.json`, `data/project.json` |
| `scripts/` (comprobaciones, pruebas, fixtures), `package.json` | `sections/`, `assets/<category>/` |
| `seed/`, `assets/_runtime/`, `assets/_framework/` (el logo), `templates/component.md` | `README.md`, `CLAUDE.md`, `CHANGELOG.md`, `LICENSE` |
| `docs/*.md` (las guías permanentes) y `.gitattributes` | `docs/proposals/` (el historial del método) |

Las guías de `docs/` se escriben sin ningún nombre de proyecto para que sigan siendo idénticas. Lo específico de un proyecto va en su `README.md` y su `CLAUDE.md`.

## Comandos
```sh
npm run framework                              # informa de la versión y de si los archivos coinciden con ella
npm run framework -- --release 1.1.0           # registra una versión nueva tras un cambio intencionado (--repository <url> fija el origen)
npm run framework -- --compare ../DSBook       # compara con otro repositorio DSBook
```
`npm run check` ejecuta el primero y **falla** si un archivo del framework difiere de lo que registra `dsbook.json`, de modo que un cambio en el contenedor, un script o una guía nunca pasa inadvertido.

## Versiones
- **PATCH**: correcciones y redacción que no cambian el comportamiento (una errata en una guía, una corrección de CSS).
- **MINOR**: capacidades nuevas que mantienen válidos los proyectos existentes (una vista nueva, una comprobación nueva, un campo opcional nuevo).
- **MAJOR**: cualquier cosa que obligue a un proyecto a cambiar sus datos o sus páginas (un `schemaVersion` nuevo, rutas o IDs renombrados, una comprobación más estricta que las páginas existentes pueden incumplir, un cambio de idioma).

## Flujo de trabajo
1. **Cambia el framework en un solo sitio.** El lugar preferido es el repositorio DSBook. Si un proyecto necesita el cambio antes, hazlo allí, pero trátalo como borrador hasta que llegue a DSBook.
2. Ejecuta `npm run check` y `npm test`. Un cambio en el framework hace fallar `check` hasta que se registra.
3. Regístralo: `npm run framework -- --release <nueva versión>`.
4. Añade una entrada a `CHANGELOG.md`: versión, fecha, commit, resumen. En DSBook el changelog **es** el historial del framework. Un proyecto anota en su propio changelog qué versión del framework adoptó.
5. **Pórtalo** a los demás repositorios: copia los archivos del framework (la columna izquierda de arriba), ejecuta `npm run framework -- --compare <otro>` para confirmar que ambos manifiestos son idénticos, y luego `check` y `test` allí. No copies nunca `data/`, `sections/` ni los archivos del proyecto.

## La página Framework
El logo de DSBook en el contenedor abre `#/framework`. Es deliberadamente pequeña. A la izquierda, dos textos breves: qué es DSBook y cómo funciona (el sitio solo muestra el estado; el trabajo ocurre en Claude Design, lo integra Claude Code y se mantiene sincronizado mediante un repositorio de GitHub). A la derecha, dos bloques:
- **DSBook framework**: versión, fecha de publicación y origen (de `dsbook.json`), y un botón *Check for updates*. El botón lee el `dsbook.json` del origen en GitHub e indica si el origen es más nuevo, si este proyecto va por delante, si la misma versión tiene archivos distintos o si todo está al día.
- **This project**: nombre, repositorio (el `repository` opcional de `data/project.json`) y, tras pulsar su botón *Check for updates*, el mensaje del último commit en GitHub y si esta copia está al día. El commit de la propia copia se lee de `.git`, que un servidor estático local sirve; si no se puede leer, la página lo dice.

Mientras una copia aún tiene la identidad del seed (no se ha ejecutado `npm run init`) no hay proyecto todavía, así que la página muestra solo el bloque del framework y una nota que dice cómo empezar uno.

Ambas comprobaciones son manuales y son las únicas llamadas de red que hace el contenedor. Los repositorios privados no se pueden leer desde el navegador. La página no ve los cambios sin commitear. Los agentes hacen la comprobación equivalente al empezar cada sesión ([claude-code.md](claude-code.md)).

## Saber si dos repositorios difieren
```sh
npm run framework -- --compare ../DSBook
```
Imprime ambas versiones y los archivos cuyo hash difiere. La misma versión con archivos distintos significa que alguien cambió el framework sin registrarlo (`check` habría fallado en ese repositorio). Versiones distintas significan que uno va por delante: el changelog de DSBook dice por cuánto.

## Límites
- El manifiesto detecta diferencias; no las fusiona. Si dos repositorios cambiaron el mismo archivo del framework, decide leyendo el diff.
- Un proyecto puede adoptar una versión nueva del framework a su ritmo, pero hasta que lo haga, las guías que lleva describen la versión anterior.
