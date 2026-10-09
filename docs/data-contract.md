# Data and path contract · v2

## Project-owned data
The data belongs to the project. It starts as a copy of `seed/` (see [Seed and init](#seed-and-init)) and from then on it is edited freely: the text of a guide, new subsections, retired ones. There is no link to the seed except the informational `seedVersion`.

`data/guide.json` contains `schemaVersion` (1), `version` and `categories`. Each category has an ID, a visible number, a title, an objective and `items`. Each item has a globally unique ID, a number, a title, an objective, a definition, accessibility, a deliverable, acceptance criteria and a suggested path.

`data/project.json` contains `schemaVersion: 2`, `projectId` (slug), `name`, `language` (for example `en`), `seedVersion` and `sections` (a map by ID). There must be exactly one entry per guide item and no entry without an item.

```json
{
  "status": "I",
  "page": "",
  "owner": "Design team",
  "notes": "Palette fixed by the owner; interaction values are a proposal.",
  "tasks": [
    {"text": "Define the dark theme", "when": "future"},
    {"text": "Approve the interaction values", "when": "pending"}
  ],
  "review": {"by": "", "date": "", "evidence": ""},
  "exclusionReason": ""
}
```

All the fields above are required, even if their value is empty (`tasks` may be `[]`). `owner` is optional in practice: it may stay empty and it does not condition any status. Allowed statuses: R/I/P/N. `review.date` uses YYYY-MM-DD or is empty. R needs the three review fields to be non-empty; N needs a reason. The validator checks presence, not the truthfulness or sufficiency of the review.

### Notes and tasks
- `notes` holds the **current decisions and context** of the section. It is not a to-do list.
- `tasks` is the section's queue of work that is **not blocking**: each task is `{"text", "when"}` with `when` either `pending` (short term) or `future` (later). When a task is done it is removed from the list; the history is in Git.
- **Tasks never block Ready.** A section can be R with open tasks. Work that does block publication keeps the section in I, with its reason in `notes`; it is not recorded as a task.
- The validator checks the shape of `tasks` only, never their relationship with the status. Tasks are shown in each section's record and are **not counted** anywhere (not in progress, not in complexity).

## Catalog rules
The guide is the project's catalog. These rules keep it coherent and are enforced by `check`:
1. Category IDs and subsection slugs use lowercase letters, digits, hyphen and underscore. A subsection ID is `<category-id>.<slug>`. IDs are stable, unique and never reused.
2. Every subsection has exactly one entry in `project.json`, and every entry belongs to a subsection.
3. A new subsection starts in P, with no page, owner, notes, tasks or review.
4. `suggestedPath` is exactly `sections/<category-id>/<slug>.html` and is unique (a `.dc.html` page is also accepted, see below).
5. Category numbers and subsection numbers are not repeated. A new one takes the next number in its category (or the next category number).
6. Retiring a subsection is done by marking it N with a reason, not by deleting it. Deleting it from the catalog needs an explicit order and a note in `CHANGELOG.md`.
7. Totals (number of categories and subsections) come from the data, never from fixed text.

A new category also means a new folder `sections/<category-id>/` and, once it has `.dc.html` pages, its own `support.js` (identical to the others).

## Seed and init
`seed/guide.json` is the initial catalog; `seed/project.json` is an all-Pending project (`projectId` `new-design-system`). `check` and `test` validate both, so a new project is born valid.

```sh
npm run init -- --id my-ds --name "My Design System" [--language en]
```

- Copies the seed to `data/`, sets `projectId`, `name` and `language`, and records the seed version in `seedVersion`.
- Does not touch `sections/` or `assets/`.
- Refuses if `data/project.json` already belongs to a project (a `projectId` other than the seed's), because it would overwrite its statuses, notes and reviews. `--force` overrides that on purpose.

Improvements made to the seed later are not propagated to existing projects.

## Paths
Complete example:
- ID: `visuals.color`.
- HTML: `sections/visuals/color.html`.
- Resources: `assets/visuals/color/`.
- From that page: `../../assets/visuals/color/palette.svg`.
- From the container: `sections/visuals/color.html`.

An empty `page` means "use the guide's suggested path if the file exists". It is only filled in for exceptions. When filled in, it accepts a `sections/...html` or `sections/...dc.html` path with lowercase alphanumeric, hyphen or underscore segments, or an HTTPS URL without credentials. It does not accept `javascript:`, `data:`, disk paths, `../` or HTTP URLs. The suggested path stays reserved without creating an empty file for every subsection. A section in I or R needs a page, at the suggested path or in `page`.

The page contains `<meta name="ds-section-id" content="visuals.color">`. The container does not need to read its internal data. It is shown in an isolated iframe with `allow-scripts`; a separate link exists as an alternative. Do not copy external pages or assume permission to embed them.

## `.dc.html` pages
Section pages are created as Design Components. The guide's suggested path admits two variants: `sections/visuals/color.html` and `sections/visuals/color.dc.html`. `guide.json` does not change. A section has **one** page: if both variants exist, `check` fails.

A `.dc.html` page loads, in this order and with relative paths, `../../assets/_runtime/react.production.min.js`, `../../assets/_runtime/react-dom.production.min.js` and `./support.js`. `support.js` is generated by Claude Design in each `sections/` folder: it is not edited and all its copies must be identical. External scripts are not allowed. `<sc-for>` and `<sc-if>` tags cannot be direct children of table elements or `select`: inside the container's iframe, which does not allow `fetch` of the page itself, they are not recovered. Images cited by the page, in its HTML or in its data, must exist. The `<meta name="ds-section-id">` goes in the `<head>` and `<html>` carries `lang` equal to the project's `language`.

## Viewing state
Search, filters, expandable panels and the Guide/Page mode are in-memory viewing state; they are not written to the repository. Progress is computed and not stored. Category statuses are summarized and not editable.
