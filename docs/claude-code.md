# Guide for Claude Code

Read [CLAUDE.md](../CLAUDE.md), the [contract](data-contract.md) and the [general handoff guide](handoff.md). Your role is to consolidate what was edited in Claude Design without losing other teams' work.

## At the start of a session
Check that your copy is current before working, and say so if it is not:
1. `git fetch` and `git status -sb`: report whether the remote has commits you do not have, or you have commits it does not.
2. If `dsbook.json` names a source repository, check whether the framework there is newer. With a local clone of it, `npm run framework -- --compare <folder>` does it; otherwise read its `dsbook.json` on GitHub. The Framework page of the container offers both checks by hand.
3. Never pull, merge or port on your own: report what you found and let the responsible person decide.

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
1. **Copy scope.** Copy only `sections/`, `assets/<category>/<subsection>/`, the affected entries of `data/project.json` and `data/guide.json`, and the runtime of `.dc.html` pages (`assets/_runtime/` and the `support.js` files). Do not copy `_ds/`, `github.md`, `uploads/` or auxiliary files.
2. **The listing may hide files.** The connector filters by type. For every file that a page links or that `package.json`, `CLAUDE.md` or the contract names, read it by path and compare its content before treating it as absent.
3. **Integration by ID.** If the repo advanced since Claude Design's base, merge `project.json` and `guide.json` entry by entry. If two sides changed the same entry, do not choose: point out the specific conflict to the responsible person. No complete copy wins for being more recent.
4. **Validation.** `npm run check`, `npm test` and visual review by a person (in the container served over HTTP and with the page opened separately). Look at the whole page, not just the header.
5. **Closing the cycle.** After pushing, add an entry to `CHANGELOG.md` (version, date, commit, section IDs and one line) and notify Claude Design of the new base. Each entry cites the commit with the changes; it is recorded in a later commit.
6. If Claude Design modified something outside its scope, do not integrate it without asking. If it made a legitimate minor change inside a page (a style fix, for example), compare it with the repo and record it.

## Catalog changes
`guide.json` is the project's catalog and belongs to the project: its text and its subsections can change. Claude Design can add categories and subsections and edit guide text; you integrate those changes by ID and `check` validates them against the [catalog rules](data-contract.md#catalog-rules). Ask before integrating anything that changes or deletes an existing ID, renames a folder or removes a subsection; those need an explicit order from the responsible person and a note in `CHANGELOG.md`. If you split a component family, keep traceability and avoid counting the same work twice.

## New projects
Start from a copy of the repository without the previous project's pages and resources, and run `npm run init -- --id <id> --name "<name>"`. It copies `seed/` to `data/`, sets the identity and refuses to overwrite a project that already has its own. A copy of an already developed DS needs all its specific content, reviews and evidence removed from `sections/` and `assets/`; changing the name is not enough.
