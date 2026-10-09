# General handoff guide

This is the permanent contract between Claude Design and Claude Code. No template is filled in per session and no additional transfer reports are generated.

## What is transferred
| File | Destination and use |
| --- | --- |
| Section page | The `suggestedPath` of its entry in `data/guide.json`. |
| Own resources | `assets/<category>/<subsection>/`. |
| Updated configuration | Affected entries of `data/project.json` and, when a subsection or category is created or its guide text edited, of `data/guide.json`. |
| Runtime of `.dc.html` pages | `assets/_runtime/` (vendored React) and `sections/<category>/support.js` (generated, identical in every folder). |
| Container changes | Only when they are an explicit part of the work. |

The files themselves are the deliverable. `notes`, `tasks`, `review` and `exclusionReason` hold the decisions and pending work that cannot be deduced from the code. Git records the differences once integrated. A folder, a ZIP or MCP access are valid means if they contain the same files and keep their paths.

## Stable contract
- The ID links guide, configuration and page.
- Internal paths are relative and portable. No fixed domain is needed.
- Creating or linking a page does not change the status automatically.
- The Guide/Page view is a viewing preference, independent of R/I/P/N.
- The web container is read-only: what it shows is the repo's state.

## Flow and guarantees
1. GitHub is the source of truth.
2. Claude Design reads the repo, records its base in `github.md` (commit, `CHANGELOG.md` version, file count) and compares it with the repo at the start of every session. If the repo has advanced, it stops and synchronizes.
3. Claude Design only modifies `sections/`, `assets/<category>/<subsection>/` and the affected entries of `project.json` and `guide.json`.
4. Claude Code brings those paths and the runtime to the local repo through MCP or files. It does not copy `_ds/`, `github.md` or `uploads/`.
5. If the repo has advanced, `project.json` and `guide.json` are integrated entry by entry and conflicts are pointed out, not resolved by recency.
6. Local validation: `npm run check`, `npm test` and visual review by a person. Then push according to the team's instructions.
7. Claude Code records the integration in `CHANGELOG.md` and Claude Design synchronizes before the next session.

The detail of each side is in [claude-design.md](claude-design.md) and [claude-code.md](claude-code.md).

## Statuses
| Transition | Condition |
| --- | --- |
| P → I | Development started. |
| I → R | Criteria met and review recorded. |
| R → I | Changes or issues pending review. |
| Any → N | Explicit, justified exclusion. |
| N → P or I | Brought back into scope; a note explains the decision. |
| I or R → P | Explicit restart; review which content and evidence remain valid. |

## Closing the work
1. Claude Design leaves the modified files available and updates its configuration.
2. Claude Code compares and integrates on top of the current repo following its guide.
3. Claude Code checks the integration and describes the result. If files or review are missing, it keeps the pending item visible.

Reusable closing instruction: **"Integrate the available changes following docs/handoff.md and docs/claude-code.md."**

There is no need to transmit the whole conversation. Relevant decisions must be recorded in the files. A conflict between two decisions requires resolving that difference; no guide can deduce an approval that is absent.
