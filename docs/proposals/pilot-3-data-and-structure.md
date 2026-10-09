# Pilot 3 · Project-owned data, new sections and container structure

Date: 2026-10-09 · Origin: request from the responsible person after pilot 2. Status of each decision in the [registry](README.md).

This proposal records the confirmed decisions and makes explicit what remains open. Only F10 (English) has been applied so far; the rest is not implemented.

---

## F1 · Data becomes the project's ("inherit and own")
**Status: approved, not applied.**

**Reason.** Today `data/guide.json` is a frozen methodological base: `validateProject` requires `project.json` to match it exactly and checks `guideVersion`. That prevents customizing the guide and adding sections without inventing override layers.

**Decision.** The initial data lives in an installation folder (`seed/`). When a project is started, it is copied to `data/` and from then on it belongs to the project: the text of a guide is edited, a subsection is added or retired, with no link to the originals. No record of "original values" is kept; Git keeps the history.

## F2 · Structure: two project files
**Status: approved, not applied.**

- `data/guide.json`: catalog (categories and subsections) and the guide text of each one.
- `data/project.json`: status and record of each subsection (`status`, `page`, `owner`, `notes`, `review`, `exclusionReason`).

It is the same shape as today, no longer frozen. The subsection ID remains the key that joins them. A single catalog (it collides on the same entries between whoever edits the guide and whoever edits the status) and a folder per subsection (it needs a generated index) are discarded. If simultaneous work becomes a problem, it can migrate to a folder per subsection without undoing what was done.

## F3 · The seed lives in this repository
**Status: approved, not applied.**

- `seed/guide.json` (the catalog of 14 categories and 132 subsections) and `seed/project.json` (everything in P, with no page, owner, notes or review).
- `npm run init` (`scripts/init.mjs`) copies the seed to `data/`, sets `projectId` and `name`, and records the origin seed version.
- **Safety:** `init` refuses if `data/project.json` already has its own identity (different from the seed's) and does not overwrite anything without explicit confirmation.
- `check` and `test` also validate `seed/` so that a new project starts valid.
- Splitting the template into its own repository remains a later step (continuation of D6 of pilot 1); it does not change the data.

## F4 · No template update policy
**Status: approved, not applied.**

Improvements to the seed are not propagated to existing projects. `project.json` records `seedVersion` (informational only, for traceability). A command that compares the project with a newer seed and reports what is new, without merging anything, remains a future possibility.

## F5 · Claude Design can generate sections and subsections
**Status: approved, not applied.**

Claude Design can create **new categories (sections) and subsections**, and edit the text of guides. This extends its write scope (D4 of pilot 1) and requires rules, which `check` validates.

**Claude Design's scope after the change**
- It may: add categories and subsections to `data/guide.json`; edit the text of guides; add and modify entries in `data/project.json`; create pages in `sections/` and resources in `assets/<category>/<subsection>/`; and all of it **entry by entry**, never regenerating a whole file.
- It may not, unless explicitly ordered: change or delete existing IDs, rename folders, retire subsections, or touch the container, `docs/` or `scripts/`.

**Data rules** (validated by `check`)
1. IDs are stable, unique and never reused. Format `category.slug` for subsections and `slug` for categories; lowercase, digits, hyphen and underscore.
2. Every subsection in `guide.json` has exactly one entry in `project.json`, and there are no entries without a subsection.
3. A new subsection is born in P, with no page, owner, notes or review.
4. A subsection's `suggestedPath` is `sections/<category>/<slug>.html` (`.dc.html` is accepted, as today) and is unique. A new category implies the folder `sections/<category>/` and, if it carries `.dc.html` pages, its `support.js` (identical to the rest).
5. Visible numbers (`1.11`, `15`) are assigned after the last one in their category or catalog, and are not repeated.
6. Retiring a subsection is not done by deleting it: it is marked N with a reason. Deleting it from the catalog requires an explicit order and is noted in the `CHANGELOG`.
7. Totals (132, 14) come from the data, not from fixed text.

**Process when adding**
1. Claude Design creates the guide entry, the `project.json` entry and, if applicable, the page.
2. Claude Code integrates **by ID** (also `guide.json`, not only `project.json`), runs `check` and `test` and reviews the result.
3. The `CHANGELOG` records the added IDs, and Claude Design synchronizes before the next session.

## F6 · Navigation: sticky header, hash routes and a summary home
**Status: approved, not applied.**

- The sticky header lives in the shell (`index.html`), not inside each page: `.dc.html` pages cannot read `project.json` from the sandbox and would show fixed data.
- Header: breadcrumb (`DSimoles › 01 Visual foundations and primitive tokens › 1.1 Color`), R/I/P/N status and navigation among the three views.
- Hash routes: `#/<id>` (content), `#/<id>/guide`, `#/<id>/record`. Old links `#item-<id>` and `#cat-<id>` are translated.
- Home: summary by category, without accordions, with R/I/P/N counts and bars. Each category has a light view with its subsections and statuses.
- Previous and next buttons in the guide's order. The sidebar only affects the menu; "Expand all" and "Collapse all" act on the menu.
- The iframe takes the window height minus the header and the page scrolls inside. On mobile, the top bar and the header become one.
- Nothing is stored in the browser.

## F7 · Three views per subsection
**Status: approved, not applied.**

- **Content:** the DS page (`.dc.html`). It is the default view if there is a page and the status is I or R; otherwise the Guide opens. With no page, it shows "No page" with the expected path.
- **Guide:** the guide text of the subsection. It is initialized from the seed and belongs to the project (F1), so it is customized as the DS evolves.
- **Record:** owner, notes, review and status. It is read-only (F8).
- Navigation among the three is in the header. The current Guide/Page switch disappears.
- `.dc.html` pages stop carrying the hand-written context line and status label (they drift from `project.json`); the header shows them from the data. `page-style.md` is updated and Claude Design redoes its pages' headers.

## F8 · Status is changed in Claude Design; the container is read-only
**Status: approved, not applied.**

The R/I/P/N status keeps being changed where it is changed today: Claude Design edits the `data/project.json` entry, Claude Code integrates it and it goes to Git. The header and the Record view **show** it and do not modify it. The form that generates the order, the local editing server and the per-subsection record file are discarded for now. They remain possible later.

## F9 · Task queue per subsection (non-blocking)
**Status: approved in essence; details to confirm.**

**Reason.** Today `notes` mixes decisions and pending work (in Color, "pending: dark theme, device test, corrections for iMoles…"). The program does not know what a task is, cannot count or show them separately, and does not distinguish what prevents publishing from what will be done later.

**Decision.**
- Each subsection has its own **task queue**, shown as a specific section of the Record, associated with its page.
- A task is one of two types: `pending` (short term) or `future` (later).
- **Tasks never block the move to Ready.** A section may be R with open tasks (for example, the dark theme, which does not prevent publishing the rest). What does prevent R is blocking work, and that is expressed with status I and its reason in `notes`, not with a task.
- `notes` now describes **current decisions and context**, not tasks.

**Data.** One new field per `data/project.json` entry:

```json
"tasks": [
  {"text": "Define the dark theme", "when": "future"},
  {"text": "Approve the interaction values", "when": "pending"}
]
```

- `tasks` is required (it may be `[]`), like the other fields. `text` is non-empty; `when` is `pending` or `future`.
- When a task is done, it is removed from the list (the history is in Git, rule 9). There is no completed field.
- `validateProject` validates the shape and does **not** relate tasks to the status: R still requires a recorded review, with or without tasks. A test covers it.
- It goes in the same migration to `schemaVersion: 2` (F1–F5), without adding files.

**How it is shown.**
- **Record** of the subsection: a "Tasks" section, with `pending` first and `future` after.
- **Tasks are not counted** anywhere: not in Home, not in categories, not in Progress or Complexity. They are only shown, in each subsection's Record. There is no global view of the queue.

**Effect on pages.** The final "Pending" section of each `.dc.html` stops existing: it moves to `tasks`, so there are no two copies that drift. The "Pending · …" boxes inside a block, which mark a content gap, are kept. `page-style.md` is updated.

**Effect on Color's migration.** Today the final "Pending" section of `color.dc.html` has **one** entry ("Dark theme and high-contrast mode: out of scope for now"), which would move to `tasks` as `future`. There are also three "Pending · …" boxes inside blocks (approve the interaction values and validate on a device the difference between normal and pressed; device test), and the `project.json` notes repeat part of that. Claude Design proposes what is a task and what is decision or context; the responsible person decides which ones block.

**Documentation changes.** `data-contract.md` (the `tasks` field), `quality.md` (the criterion "no hidden blocking pending items" becomes "blocking work keeps the section in I; tasks do not block R"), `claude-design.md` (how to write tasks) and `handoff.md`.

## F10 · The whole repository is in English
**Status: applied (0.10.0), except the content of the Color page and its notes, which are pending in Claude Design.**

**Decision of the responsible person (2026-10-09).** English only, applied to everything; the conversation with the agents may stay in another language. Keeping two languages was discarded: it would duplicate `guide.json` (about 130 KB), every page, `notes` and `tasks`, add a language layer to the container, and double the tokens and review effort of every future change. English also usually costs fewer tokens than Spanish for the same content.

**What was done.**
- `data/guide.json` translated (14 categories, 132 subsections). The objective and deliverable follow fixed templates built from the title.
- IDs, folders and suggested paths renamed to English in one controlled migration while only one page existed (`visuales.color` → `visuals.color`, `sections/visuales/` → `sections/visuals/`). The full correspondence is in [pilot-3-id-map.md](pilot-3-id-map.md). `project.json` keys were renamed with the same IDs and their content untouched.
- Container interface, script messages, test names, documentation (`CLAUDE.md`, `README.md`, `docs/`, proposals, `CHANGELOG.md`) translated. Files and folders in `docs/` renamed (`page-style.md`, `template.md`, `proposals/`).
- `check` now requires `lang="en"` on `.dc.html` pages. Rule 2 of `CLAUDE.md` states that everything in the repository is written in English, including commit messages.
- Statuses read Ready, In process, Pending and Not applicable (N).
- **The `visuals.color` page was only adapted structurally** (new ID in its meta and screen label, `lang="en"`). Its prose, its data and the `notes` of its `project.json` entry are still in Spanish: they are Claude Design's content and need decisions that a mechanical translation would get wrong. Claude Design must translate them, keeping verbatim (a) the iMoles interface copy used as examples (for example the button labels shown in the screenshots) and (b) the iMoles CSS variable names (`--imoles-*`), marking quoted Spanish with `lang="es"`. The English names of the DS tokens (`marca.600`, `texto.principal`, `fondo.pagina`…) are a decision for the responsible person; Claude Design proposes them and the responsible person confirms before they are applied.

**Not done here.** A `language` field in `project.json` (it belongs to the `schemaVersion: 2` migration).

## Open decisions
- **F9 details:** the names of the types (`pending`/`future`).
- **Search.** It is undefined how it should work. With routes it could go straight to the subsection instead of filtering a list.
