# DSBook · DSimoles

DSBook is the workspace; DSimoles is the Design System defined in it. It provides a definition guide, a documentation container and a tracking matrix for the DSimoles Design System. It is designed in Claude Design and integrated through Claude Code and Git. It started as a reusable template; its instructions are in [docs/template.md](docs/template.md).

## Getting started
You need Python 3 to serve the site. Node.js 18 or later runs the checks; there are no packages to install.

```sh
cd DSimoles
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000. Do not open `index.html` directly: loading the JSON files requires HTTP. You can also serve the folder from any static host. No deployment or GitHub connection is included.

1. Browse the home page (a summary by category) or pick a subsection in the Sections menu of the rail. Each subsection has its own address, for example `#/visuals.color`.
2. A subsection has three views, chosen in the header: **Content** (its page), **Info** (the section's guide: what to define and the acceptance criteria) and **Record** (status, owner, notes, tasks and review).
3. Create pages in Claude Design, as `.dc.html`, at the paths the guide indicates.
4. Integrate changes following the [general handoff guide](docs/handoff.md).

## Statuses and filters
| Status | Meaning |
| --- | --- |
| R · Ready | Reviewed development, with person, date and evidence recorded. |
| I · In process | Work or review in progress. |
| P · Pending | Development pending; initial status. |
| N · Not applicable | Out of scope with an explicit justification. |

Filter by status from the filter icon in the rail (statuses can be combined) and search by title, category or content from the box in the header. Category counts represent all their items; filters show only the matches. The home page shows two progress bars. **Progress**: R / (R + I + P), that is, ready subsections over the applicable ones. **Complexity**: subsections that are not N over the total in the guide. If everything is N, progress shows "No applicable sections".

The left side is a narrow rail with the **DSB** mark (a link to the home page) and two icons: **status** and **sections**. Each opens a dropdown panel on hover; a click pins it and Escape closes it. In the Sections panel, hovering a category opens all its subsections in a submenu; on touch screens each category has a chevron that expands them inline. A dot on the filter icon shows that a filter or a search is active.

## Read-only container
The site shows the state of the repository and does not modify it: it does not keep drafts or import or export configuration. Everything is edited in Claude Design; Claude Code integrates the changes into Git. Search, filters, the expanded state of the menu and the current address are in-memory viewing state.

The main area shows one thing at a time, chosen by the address (hash routes): `#/` is the home page, `#/<category>` lists a category's subsections and `#/<subsection>[/content|info|record]` shows a subsection. A sticky header carries the breadcrumb and the status (read-only) on the left, and on the right the view tabs, a magnifier that unfolds the search field, and previous/next buttons, with separators between the groups. A subsection in I or R with a page opens on **Content**; any other opens on **Info**. Old `#item-<id>` and `#cat-<id>` links are translated.

The page of each subsection is deduced from the guide's suggested path. `page` in `data/project.json` is only filled in for exceptions (an external HTTPS URL or an agreed different path). The container checks whether the file exists when a subsection is opened; if it does not, the Content view says "No page yet" with the expected path.

## Organization
See [CLAUDE.md](CLAUDE.md) as the entry point for agents. The specific guides are [Claude Design](docs/claude-design.md), [Claude Code](docs/claude-code.md) and the [data contract](docs/data-contract.md).

## Checking
```sh
npm run check
npm test
```
They need no dependencies. There is also a manual review list in [docs/quality.md](docs/quality.md). Automated tests do not certify accessibility and do not replace visual review.

## Framework version
The container, the scripts, the seed and the guides in `docs/` are the DSBook framework, shared with other repositories. `dsbook.json` records its version, and `npm run check` fails if a framework file changes without a new version being recorded. `npm run framework -- --compare <folder>` compares this repository with another one. See [docs/framework.md](docs/framework.md).

## Reusing the template
A new project starts with `npm run init -- --id <id> --name "<name>"`, which copies `seed/` to `data/`. After that the data belongs to the project. The instructions are in [docs/template.md](docs/template.md).

## Known limits
- External pages may prevent embedding in an iframe; there is always a link to open them separately.
- Iframes use a sandbox with scripts and no access to the container. Content that needs cookies, storage or additional capabilities must be opened separately or consciously adapted.
- The template does not visually edit section HTML. That editing happens in Claude Design or in code.
- R indicates a recorded review according to the project's criteria, not a conformance certification.
- Markdown documentation files can be read in the editor or on GitHub; they are not converted to HTML automatically.
