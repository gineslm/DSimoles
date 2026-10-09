# Guide for Claude Code

Read [CLAUDE.md](../CLAUDE.md), the [contract](data-contract.md) and the [general handoff guide](handoff.md). Your role is to consolidate what was edited in Claude Design without losing other teams' work.

## Integration
1. Inspect the branch, `git status` and existing differences. Do not overwrite unrelated changes or clean the tree automatically.
2. Read the current guide and project. Compare the received files with the repository by section ID, not only by title.
3. For each page, use `suggestedPath` or an explicitly agreed exception. Check its `ds-section-id` meta. Keep resources inside the repo and fix relative links.
4. Integrate `project.json` field by field in the affected sections. A complete `project.json` received must not overwrite statuses, notes or reviews of sections that another team modified. If there is not enough common base to resolve a difference, point out the specific conflict before choosing.
5. Review the status against the content and evidence. Use I if issues remain. Do not produce R just because a file exists, and do not invent a design review. Do not mark N without a recorded decision.
6. Run `npm run check` and `npm test`. Serve the folder and perform the applicable manual checks from `quality.md`. Record the testing limitations you actually encountered.
7. Review `git diff --check` and `git diff`. Avoid temporary files, duplicate exports, secrets, caches or accidentally vendored dependencies.
8. Summarize changes, verifications and pending items. Create commits and push to the remote only according to the team's current instructions. Do not force-push, deploy or merge by inference.

## Transfer from Claude Design
Flow: GitHub is the source of truth → Claude Design records its base and works → you bring the changes to the local repo → local validation → push. Guarantees:
1. **Copy scope.** Copy only `sections/`, `assets/<category>/<subsection>/`, the affected entries of `data/project.json` and the runtime of `.dc.html` pages (`assets/_runtime/` and the `support.js` files). Do not copy `_ds/`, `github.md`, `uploads/` or auxiliary files.
2. **The listing may hide files.** The connector filters by type. For every file that a page links or that `package.json`, `CLAUDE.md` or the contract names, read it by path and compare its content before treating it as absent.
3. **Integration by ID.** If the repo advanced since Claude Design's base, merge `project.json` entry by entry. If two sides changed the same entry, do not choose: point out the specific conflict to the responsible person. No complete copy wins for being more recent.
4. **Validation.** `npm run check`, `npm test` and visual review by a person (in the container served over HTTP and with the page opened separately). Look at the whole page, not just the header.
5. **Closing the cycle.** After pushing, add an entry to `CHANGELOG.md` (version, date, commit, section IDs and one line) and notify Claude Design of the new base. Each entry cites the commit with the changes; it is recorded in a later commit.
6. If Claude Design modified something outside its scope, do not integrate it without asking. If it made a legitimate minor change inside a page (a style fix, for example), compare it with the repo and record it.

## Catalog changes
`guide.json` is shared between copies as a methodological base; do not rewrite it to reflect only the available content. Adding a subsection requires a stable unique ID, its own guide and path, an entry in `project.json` and a version/compatibility update. Do not reuse removed IDs. If you split a component family, keep traceability and avoid counting the same work twice.

## New projects
Start from the clean template, change `projectId` and `name` and keep P as the initial status. A copy of an already developed DS needs all its specific content and evidence cleaned; changing the name is not enough.
