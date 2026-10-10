# Changelog

One entry per integration pushed. Maintained by Claude Code. It is a record, not a session report.

Each entry cites the commit that contains the changes; the entry itself is added in a later commit.

Format: version · date (YYYY-MM-DD) · commit · affected section IDs · summary.

## 0.16.3 · 2026-10-10 · f2f7cb6
Sections: none.
The Framework page is titled "DSBook framework" (heading, breadcrumb and tab title). Framework 1.1.0 was re-recorded with it; it had not been published.

## 0.16.2 · 2026-10-10 · af68c3a
Sections: none.
The Framework page puts two short texts (what DSBook is, how it works with Claude Design, Claude Code and GitHub) on the left and the framework and project blocks on the right. Framework 1.1.0 was re-recorded with it; it had not been published.

## 0.16.1 · 2026-10-10 · bc6d2fb
Sections: none.
The Framework page is more compact: the two blocks sit side by side, the check buttons are small, and an introduction to DSBook replaces the subtitle. Framework 1.1.0 was re-recorded with it; it had not been published.

## 0.16.0 · 2026-10-10 · d87e0de
Sections: none.
DSBook framework 1.1.0. The DSB mark opens a new Framework page (`#/framework`): the framework version, release date and source, the project's repository and the latest commit on GitHub, each with a manual *Check for updates* button. `dsbook.json` gains `released` and `repository`; `data/project.json` gains an optional `repository`; `framework --release` takes `--repository`. Agents check the remote at the start of a session (docs/claude-code.md). Tests for the page's logic (`scripts/about.test.mjs`) and its route.

## 0.15.1 · 2026-10-10 · 324f200
Sections: none.
The `init` test no longer depends on the project's identity, so it passes in a fresh DSBook copy. Framework 1.0.0 was re-recorded with this change; it had not been published.

## 0.15.0 · 2026-10-10 · 1c4a0b3
Sections: none.
DSBook framework 1.0.0 recorded (`dsbook.json`, `npm run framework`, `docs/framework.md`): the container, scripts, seed, vendored runtime and guides are versioned and hashed, and `check` fails if they change without a new version. The guides lose their project names, `docs/template.md` is rewritten, and the `check` tests use their own fixture page instead of the Color page.

## 0.14.0 · 2026-10-09 · 0880de2
Sections: none.
Header group on the right (view tabs, separator, a magnifier that unfolds the search field, separator, previous/next) and the Guide view renamed to Info (`#/<id>/info`).

## 0.13.0 · 2026-10-09 · cc219ae
Sections: none.
Container refinements (pilot-4 G1–G6): the sidebar is an icon rail with status and sections dropdowns (the Sections menu opens a submenu with all subsections on hover), search moves to the header, the progress bars move to the home page, the status follows the breadcrumb, the open-in-a-new-tab icon is gone, and the whole chrome is neutral gray with a full border marking the active element.

## 0.12.0 · 2026-10-09 · afd0455
Sections: none.
New container structure (pilot-3 F6–F8): one view per address with hash routes, a sticky header (breadcrumb, view tabs, read-only status, open-in-a-new-tab, previous/next), a home summary by category, category lists and three views per subsection (Content, Guide, Record with tasks). The accordions are gone. Pure routing functions in `model.js` with tests, and a browser smoke test (`scripts/container.test.mjs`, skipped without Chrome).

## 0.11.0 · 2026-10-09 · 51fc4c5
Sections: none.
Project-owned data contract (pilot-3 F1–F5, F9): `seed/` and `npm run init`; `schemaVersion` 2 with `language`, `seedVersion` and `tasks`; the guide validated on its own (`validateGuide`) with catalog rules for new categories and subsections; seed validated by `check`; tests for the guide, tasks and `init`. Documentation updated, including Claude Design's wider scope.

## 0.10.0 · 2026-10-09 · 45ac86c
Sections: visuals.color.
The whole repository moves to English: guide, interface, docs and script messages. IDs, folders and paths renamed (`visuales.*` → `visuals.*`, and the other 13 categories); the correspondence is in `docs/proposals/pilot-3-id-map.md`. The Color rework is integrated structurally, with its capture boxes left empty; its prose, data and notes are still Spanish and pending translation in Claude Design. Proposal pilot-3 recorded.

## 0.9.0 · 2026-10-08 · 00d2d99
Sections: visuals.color.
Style guidelines approved, `lang` mandatory on `.dc.html` pages (check and test) and `lang` added to the pilot page.

## 0.8.0 · 2026-10-08 · 381212a
Sections: none.
Default view of subsections (page in I or R, guide otherwise), compact row with URL and icon, and a page without container margins.

## 0.7.0 · 2026-10-08 · 2e0bb31
Sections: none.
Container with a sticky sidebar (three blocks, collapsed mode, sections menu, double progress) and proposal pilot-2 with the style guidelines, pending approval.

## 0.6.0 · 2026-10-08 · 4d48582
Sections: none.
Transfer protocol (D4), ignoring any loaded DS (D7), documentation and tests of the scripts (D9), DSBook · DSimoles branding and the proposals registry.

## 0.5.0 · 2026-10-08 · 7676ddc
Sections: visuals.color.
Status label without line breaks (fix made in Claude Design) and guides aligned with check.

## 0.4.0 · 2026-10-08 · 48459fb
Sections: visuals.color.
Roles table without table elements (the iframe does not recover sc-for inside tbody), a lint in check and the section template removed.

## 0.3.0 · 2026-10-08 · 6d87c86
Sections: visuals.color.
D1 pilot: `.dc.html` page with a vendored runtime and new checks in check.

## 0.2.0 · 2026-10-08 · 6d85d62
Sections: none.
Read-only container, dsimoles identity and page deduced from the suggested path.

## 0.1.0 · 2026-10-08 · 2f6a669
Sections: none.
Initial publication of the template on GitHub.
