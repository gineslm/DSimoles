# Guide for Claude Design

Read [CLAUDE.md](../CLAUDE.md) first. Your role is to develop the DS content and pages while keeping the repository contract.

## Before designing
1. Load the current version of the repository or the files provided by the team. If you do not have access to the repo, ask for the files you need; do not assume that a conversation reflects the latest state.
2. Identify the subsection in `data/guide.json`. Read the objective, what to define, accessibility, deliverable and criteria.
3. Review its entry in `data/project.json`: existing decisions, page, owner and review.
4. Read [page-style.md](page-style.md): visual-first tone, little text, measures and the neutral documentation color.
5. Look at pages already developed to keep the DS coherent. The container's appearance is a working tool, not the mandatory visual identity of each DS.

## Synchronization and scope
1. **Recorded base.** Write in `github.md` (root of your project) the commit and the `CHANGELOG.md` version you start from, and the count of expected files against the ones you see. The connector's listing filters files (for example `scripts/*.mjs`): cross-check the listing with the paths named by `package.json`, `CLAUDE.md` and `docs/data-contract.md`, and read missing ones by path.
2. **At the start of every session**, compare your base with the repo. If the repo has advanced, stop and synchronize before modifying anything.
3. **What you may modify:** `sections/`, `assets/<category>/<subsection>/` and the affected entries of `data/project.json`. Do not modify `data/guide.json`, the container (`index.html`, `app.js`, `model.js`, `styles.css`), `docs/` or `scripts/` unless explicitly asked.
4. **What is not transferred:** `_ds/`, `github.md`, `uploads/` and Claude Design's auxiliary files.
5. `data/project.json` is only touched in the affected entries; it is never regenerated as a whole. `owner` is optional.

## Visual system
Unless the responsible person says otherwise, ignore any design system that Claude Design loads or links to the project (today `_ds/`): do not apply it to pages or to the container. Section pages use a neutral documentation base and show the system being defined. Do not present values of that system as decided if they are not.

## Developing a section
- Create the page at the guide's `suggestedPath`, as `.dc.html`. Example: `visuals.color` → `sections/visuals/color.dc.html`. Do not also leave an `.html` for the same section.
- Before `./support.js`, load React from `../../assets/_runtime/` (see the [data contract](data-contract.md)). Do not link external scripts and do not edit `support.js`.
- The `ds-section-id` meta must stay in the `<head>`, and `<html>` must declare `lang="en"`.
- Do not put `<sc-for>` or `<sc-if>` directly inside `table`, `thead`, `tbody`, `tfoot`, `tr`, `colgroup`, `select` or `optgroup`. The browser moves them out when parsing the HTML and, inside the container's iframe, the runtime cannot recover them. For repeated table-like lists use `div` with `role="table"`, `role="row"` and `role="cell"`. `check` enforces this.
- Keep the ID in `<meta name="ds-section-id">`. Adjust title, purpose, decisions, examples, accessibility, implementation and review. Do not present placeholders as finished content.
- Put images, styles or scripts specific to the page in `assets/visuals/color/`; link them from the page with `../../assets/visuals/color/...`.
- Use semantic HTML and local resources where reasonable. Sections must be openable independently or inside the container.
- Do not change the container globally to solve a section's design.
- If you develop components, also use the [component sheet](../templates/component.md).

## Status and decisions while working
Update only the affected entries of `project.json`; never regenerate the whole file. P becomes I when development starts. If an R section is left with unreviewed changes, it returns to I and the pending items are recorded. Keep R only if the review is still valid and up to date.

To propose R, record `review.by`, `review.date` and `review.evidence`: the person or role who actually reviewed, the date and a summary or links of what was checked. Do not attribute an approval to the user that they have not given. If there is no review, keep I. N requires an explicit decision and `exclusionReason`.

## Closing the work
Do not write a new handoff. Follow the [general guide](handoff.md): leave the pages, their resources and the updated `project.json` available. You may say "Integrate the changes following docs/handoff.md".

If you can only produce downloadable files, keep the folder structure in a ZIP. If the environment allows writing through MCP, use those same paths. The transfer mechanism is configured by the team; this guide does not create it or guarantee automatic access.

It is not enough for the page to exist inside the Claude Design session: Claude Code must be able to read its bytes and resources when integrating it.
