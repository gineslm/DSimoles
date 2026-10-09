# Changelog

One entry per integration pushed. Maintained by Claude Code. It is a record, not a session report.

Each entry cites the commit that contains the changes; the entry itself is added in a later commit.

Format: version · date (YYYY-MM-DD) · commit · affected section IDs · summary.

## 0.13.0 · 2026-10-09 · (filled in after the commit)
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
