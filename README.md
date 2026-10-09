# DSBook · DSimoles

DSBook is the workspace; DSimoles is the Design System defined in it. It provides a definition guide, a documentation container and a tracking matrix for the DSimoles Design System. It is designed in Claude Design and integrated through Claude Code and Git. It started as a reusable template; its instructions are in [docs/template.md](docs/template.md).

## Getting started
You need Python 3 to serve the site. Node.js 18 or later runs the checks; there are no packages to install.

```sh
cd DSimoles
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000. Do not open `index.html` directly: loading the JSON files requires HTTP. You can also serve the folder from any static host. No deployment or GitHub connection is included.

1. Browse the matrix. Each category expands; each subsection has its status and content.
2. Turn on **Guide** to read the instructions. Turn it off to see the associated page.
3. Create pages in Claude Design, as `.dc.html`, at the paths the guide indicates.
4. Integrate changes following the [general handoff guide](docs/handoff.md).

## Statuses and filters
| Status | Meaning |
| --- | --- |
| R · Ready | Reviewed development, with person, date and evidence recorded. |
| I · In process | Work or review in progress. |
| P · Pending | Development pending; initial status. |
| N · Not applicable | Out of scope with an explicit justification. |

Combine statuses in the sidebar and search by title, category or content. Category counts represent all their items; filters show only the matches. There are two progress bars. **Progress**: R / (R + I + P), that is, ready subsections over the applicable ones. **Complexity**: subsections that are not N over the total in the guide. If everything is N, progress shows "No applicable sections".

The sidebar has three separated blocks: **DSB** (brand; collapses and expands the sidebar), **progress** (a "Progress / Complexity" header with the ready-over-applicable count, for example 0/132, and the two progress lines) and **content** (search, status and sections). When collapsed, the content block becomes three icons (magnifier, status filter and sections) that open a panel on hover; a click pins it and Escape closes it. The status panel lets you combine R, I, P and N, and the sections panel includes "Expand all" and "Collapse all".

## Read-only container
The site shows the state of the repository and does not modify it: it does not keep drafts or import or export configuration. Everything is edited in Claude Design; Claude Code integrates the changes into Git. Search, filters, expansion and the Guide/Page switch are in-memory viewing state.

Each section's page is deduced from the guide's suggested path. `page` in `data/project.json` is only filled in for exceptions (an external HTTPS URL or an agreed different path). The container checks whether the file exists when a section is expanded; if it does not, it shows "No page".

## Organization
See [CLAUDE.md](CLAUDE.md) as the entry point for agents. The specific guides are [Claude Design](docs/claude-design.md), [Claude Code](docs/claude-code.md) and the [data contract](docs/data-contract.md).

## Checking
```sh
npm run check
npm test
```
They need no dependencies. There is also a manual review list in [docs/quality.md](docs/quality.md). Automated tests do not certify accessibility and do not replace visual review.

## Reusing the template
A new project starts with `npm run init -- --id <id> --name "<name>"`, which copies `seed/` to `data/`. After that the data belongs to the project. The instructions are in [docs/template.md](docs/template.md).

## Known limits
- External pages may prevent embedding in an iframe; there is always a link to open them separately.
- Iframes use a sandbox with scripts and no access to the container. Content that needs cookies, storage or additional capabilities must be opened separately or consciously adapted.
- The template does not visually edit section HTML. That editing happens in Claude Design or in code.
- R indicates a recorded review according to the project's criteria, not a conformance certification.
- Markdown documentation files can be read in the editor or on GitHub; they are not converted to HTML automatically.
