# The DSBook framework and its version

Every project built with DSBook is a copy of the same base: the container, the scripts, the seed, the vendored runtime and the permanent guides. That base is **the framework**. Several repositories can carry it (DSBook itself and each project), and over time they may drift apart. `dsbook.json` makes that visible.

## What `dsbook.json` records
```json
{ "framework": "DSBook", "version": "1.1.0", "released": "2026-10-10", "repository": "https://github.com/<owner>/DSBook", "files": { "app.js": "<sha-256>", … } }
```
- `version`: the framework version, `MAJOR.MINOR.PATCH`.
- `released`: the date that version was recorded.
- `repository`: the framework's source, where updates come from. `--release` keeps it from the previous manifest, or sets it with `--repository <url>`.
- `files`: the SHA-256 of every framework file (line endings normalized, so a Windows and a Linux checkout agree).

## What belongs to the framework
| Framework (shared, same in every repository) | Project (its own) |
| --- | --- |
| `index.html`, `styles.css`, `app.js`, `model.js` | `data/guide.json`, `data/project.json` |
| `scripts/` (checks, tests, fixtures), `package.json` | `sections/`, `assets/<category>/` |
| `seed/`, `assets/_runtime/`, `templates/component.md` | `README.md`, `CLAUDE.md`, `CHANGELOG.md`, `LICENSE` |
| `docs/*.md` (the permanent guides) and `.gitattributes` | `docs/proposals/` (the history of the method) |

The guides under `docs/` are written without any project name so that they stay identical. A project's specifics go in its `README.md` and `CLAUDE.md`.

## Commands
```sh
npm run framework                              # report the version and whether the files match it
npm run framework -- --release 1.1.0           # record a new version after an intended change (--repository <url> sets the source)
npm run framework -- --compare ../DSBook       # compare with another DSBook repository
```
`npm run check` runs the first one and **fails** if a framework file differs from what `dsbook.json` records, so a change to the container, a script or a guide can never go unnoticed.

## Versions
- **PATCH**: fixes and wording that change no behavior (a typo in a guide, a CSS correction).
- **MINOR**: new capabilities that keep existing projects valid (a new view, a new check, a new optional field).
- **MAJOR**: anything that requires a project to change its data or its pages (a new `schemaVersion`, renamed routes or IDs, a stricter check that existing pages may fail).

## Workflow
1. **Change the framework in one place.** The preferred place is the DSBook repository. If a project needs the change first, make it there, but treat it as a draft until it reaches DSBook.
2. Run `npm run check` and `npm test`. A framework change fails `check` until it is recorded.
3. Record it: `npm run framework -- --release <new version>`.
4. Add an entry to `CHANGELOG.md`: version, date, commit, summary. In DSBook the changelog **is** the framework history. A project notes in its own changelog which framework version it adopted.
5. **Port it** to the other repositories: copy the framework files (the left column above), run `npm run framework -- --compare <other>` to confirm both manifests are identical, then `check` and `test` there. Never copy `data/`, `sections/` or the project files.

## The Framework page
The DSB mark in the container opens `#/framework`. It is deliberately small and has two blocks:
- **DSBook framework**: version, release date and source (from `dsbook.json`), and a *Check for updates* button. The button reads the source's `dsbook.json` from GitHub and says whether the source is newer, this project is ahead of it, the same version has different files, or everything is current.
- **This project**: name, repository (the optional `repository` in `data/project.json`) and, after pressing its *Check for updates* button, the message of the latest commit on GitHub and whether this copy is current. The copy's own commit is read from `.git`, which a local static server serves; if it cannot be read, the page says so.

Both checks are manual and are the only network calls the container makes. Private repositories cannot be read from the browser. The page cannot see uncommitted changes. Agents do the equivalent check at the start of every session ([claude-code.md](claude-code.md)).

## Knowing whether two repositories differ
```sh
npm run framework -- --compare ../DSBook
```
It prints both versions and the files whose hash differs. Same version with different files means somebody changed the framework without recording it (check would have failed in that repository). Different versions mean one of them is ahead: the changelog of DSBook says by how much.

## Limits
- The manifest detects differences; it does not merge them. If two repositories changed the same framework file, decide by reading the diff.
- A project can adopt a newer framework version at its own pace, but until it does, the guides it carries describe the older one.
