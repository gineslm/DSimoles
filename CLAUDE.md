# DSBook · instructions for agents

## Purpose
DSBook is a workspace for defining, documenting and tracking a Design System. This repository holds the one for DSimoles; it started as a reusable template ([docs/template.md](docs/template.md)). Each copy represents a single project. The matrix gathers one guide per subsection and the HTML pages that develop the DS. The repository is the shared source of truth; Claude Design is the space for design and editing, and Claude Code integrates the files and their changes.

## Read according to the task
- [README: how it works and how to start](README.md)
- [Guide for Claude Design](docs/claude-design.md): design, create pages and keep decisions while working.
- [Guide for Claude Code](docs/claude-code.md): integrate, validate and update the repository.
- [General handoff guide](docs/handoff.md): permanent transfer contract. There is no per-session form.
- [Data and path contract](docs/data-contract.md): identities, statuses and schema.
- [Review criteria](docs/quality.md): acceptance of content and application.
- [Page style and tone](docs/page-style.md): visual guidelines for Claude Design (approved).
- [Check scripts](docs/scripts.md): what `npm run check` and `npm test` verify, when to run them and how to read their errors.
- [Proposals and their registry](docs/proposals/README.md): agreed changes to the way of working and their status (applied, approved, discarded, pending).

## Common rules
1. Read `data/guide.json` and `data/project.json` before modifying a section. Keep their IDs; the visible title may change.
2. **Everything in the repository is written in English**: data, documentation, pages, interface strings, script messages and commit messages. The conversation with the responsible person may be in another language; what is written to files is always English.
3. No build step and no external services. The vendored runtime that `.dc.html` pages need is allowed, versioned inside the repo (`assets/_runtime/` and `sections/<category>/support.js`). Do not add a backend, accounts, remote synchronization or project managers without an agreed need.
4. Create pages at each subsection's `suggestedPath`. Their resources go in `assets/<category>/<subsection>/`. Do not use absolute team paths or links that depend on a local domain.
5. `data/guide.json` guides; `data/project.json` records decisions; `sections/` holds the development. Do not copy development content into the guide.
6. The only statuses are R (Ready), I (In process), P (Pending), N (Not applicable). An existing page does not imply R. Ready requires a recorded review, not an automatic certification.
7. Do not mark N without an explicit reason. Do not exclude applicable accessibility requirements for convenience. A cross-cutting row does not replace per-element checks.
8. Do not invent approvals, test results, owners or evidence. If work or review is pending, use I and describe what is pending.
9. Do not create per-session handoff reports. Keep decisions in the section fields; Git records the changes.
10. Respect other people's changes. Review differences before replacing files. Do not reset the project to integrate a section.
11. Run `npm run check` and `npm test` before closing an integration. These commands do not require `npm install`.
12. Commit, push, publication and conflict resolution follow the team's current instructions. Do not force-push or publish by default.
13. Ignore any design system that Claude Design loads or links to the project (for example `_ds/`), both in pages and in the container, unless the responsible person says otherwise.
14. Before modifying files, check that your base matches the repository. Follow the [handoff](docs/handoff.md) protocol.

## Repository map
- `index.html`, `styles.css`, `app.js`, `model.js`: interactive container.
- `data/guide.json`: 14 categories and 132 subsections with instructions and target paths.
- `data/project.json`: project identity, status, page, owner, notes and review.
- `sections/`: development of the DS; it starts empty of project content.
- `templates/component.md`: component sheet. Section pages are created in Claude Design as `.dc.html`; there is no page template.
- `assets/`: page resources.
- `docs/`: permanent guides. `docs/proposals/`: change proposals and their registry.
- `scripts/`: contract checks and logic tests.

When starting another copy, change `projectId` and `name`, keep the guide and start with P statuses and empty pages. Do not inherit reviews or decisions from the previous project. See the README.
