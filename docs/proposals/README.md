# Proposals and their registry

A proposal is an agreed change to the **way of working** (container, contract, guides, scripts), not to the content of the Design System. It is drafted in Claude Design or with the responsible person, brought to this directory and applied by Claude Code. It does not replace `CHANGELOG.md` (which records integrations) and it is not a session report.

## Flow
1. The proposal is saved as `docs/proposals/<name>.md` with one decision per section (`D1`, `D2`…), its reason and its changes.
2. Claude Code applies them in blocks, with validation (`npm run check`, `npm test`) and review by the responsible person.
3. When each decision is finished, its **status** and what was actually done are written in its own section, including corrections to the original premise.
4. This table collects the status of all of them. Discarded ones are kept with their reason.

## Statuses
- **Applied**: done and validated.
- **Partial**: partly done; what is missing is in the note.
- **Discarded**: the responsible person decided not to apply it.
- **Approved**: decision confirmed by the responsible person, not yet applied.
- **Pending**: undecided, or not applied for lack of a decision.

## Registry
| Proposal | Decision | Status | Version | Note |
| --- | --- | --- | --- | --- |
| [pilot-1](pilot-1-decisions.md) | D1 · `.dc.html` pages | Applied | 0.3.0, 0.4.0 | React vendored in `assets/_runtime/`; the iframe sandbox does not change. |
| pilot-1 | D2 · Read-only container | Applied | 0.2.0 | |
| pilot-1 | D3 · Central `project.json` and the `page` rule | Applied | 0.2.0, 0.3.0 | |
| pilot-1 | D4 · Transfer protocol | Applied | 0.6.0 | Documented in `handoff.md`, `claude-design.md` and `claude-code.md`. |
| pilot-1 | D5 · `CHANGELOG.md` | Applied | 0.2.0 | |
| pilot-1 | D6 · Template versus project | Applied | 0.2.0, 0.6.0 | Repo renamed to DSimoles; the site is now called DSBook · DSimoles. |
| pilot-1 | D7 · Visual system | Applied with a nuance | 0.6.0 | Generalized: any DS that Claude Design loads is ignored. Pending: neutral base and unlinking the loaded DS (action for the responsible person). |
| pilot-1 | D8 · Ready status | Discarded | 0.6.0 | The responsible person decided not to add the clarification; the Ready contract does not change. |
| pilot-1 | D9 · Scripts | Applied | 0.6.0 | The scripts already existed; they were extended and documented in [scripts.md](../scripts.md). |
| [pilot-2](pilot-2-container-and-style.md) | E1 · Container with a sidebar | Applied | 0.7.0 | Menu of 14 categories and 132 subsections, direct links and a drawer on mobile. |
| pilot-2 | E2 · Style and tone guidelines | Partial | 0.9.0 | Guidelines approved on 2026-10-08 ([page-style.md](../page-style.md)). Pending: Claude Design redoing `visuals.color` with them. |
| [pilot-3](pilot-3-data-and-structure.md) | F1 · Project-owned data ("inherit and own") | Applied | 0.11.0 | `seed/` + `init`; `data/` becomes the project's. |
| pilot-3 | F2 · Two-file structure | Applied | 0.11.0 | `guide.json` and `project.json`, no longer frozen. |
| pilot-3 | F3 · Seed in this repository | Applied | 0.11.0 | Splitting the template into its own repo is left for later. |
| pilot-3 | F4 · No update policy | Applied | 0.11.0 | Only `seedVersion` is recorded. |
| pilot-3 | F5 · Claude Design creates sections and subsections | Applied | 0.11.0 | Extends its scope to `guide.json`, entry by entry, with rules validated by `check`. |
| pilot-3 | F6 · Sticky header, hash routes and a summary home | Approved | — | Header in the shell; home as a summary by category. |
| pilot-3 | F7 · Three views: Content, Guide, Record | Approved | — | Navigation among the three goes in the header. |
| pilot-3 | F8 · Status is changed in Claude Design | Approved | — | The container shows it and does not modify it. |
| pilot-3 | F9 · Task queue per subsection | Partial | 0.11.0 | `tasks` field (`pending`/`future`) in the data contract and validator; it does not block R and is not counted. Pending: showing it in the Record view (comes with F7) and Claude Design splitting Color's notes. |
| pilot-3 | F10 · English-only repository | Applied | 0.10.0 | All content, interface, docs and script messages in English; IDs and paths renamed (see [pilot-3-id-map.md](pilot-3-id-map.md)). |
| pilot-3 | Search | Pending | — | How it should work is undefined. |
