# Review criteria

## Ready for a section
- Purpose, decisions, rules, examples and the relationship with design/code are concrete.
- The applicable accessibility is checked in that section and the evidence is recorded.
- There are typical examples and edge cases; there are no hidden blocking pending items.
- It is identified who reviewed, when and which criteria/results support R.
- The necessary links and resources work. If the development lives outside the repo, the team has verified access.

## Available technical checks
`npm run check` and `npm test`. What each one verifies, when to run them and how to read their errors is in [scripts.md](scripts.md). In short: guide/project contract, a single page per section, I and R with a page, identity meta, local references, the vendored runtime of `.dc.html` pages and the logic of `model.js`. They do not download external content or test the browser.

## Manual review of the application
1. Load over HTTP, expand categories and items and operate with the keyboard. With the sidebar: walk through the menu, jump to a subsection and check the focus, the current status (`aria-current`) and the direct links (`#item-<id>`). Collapse and expand the sidebar with the DSB button; when collapsed, check the search, status (combining several) and sections panels with hover, click and Escape, and "Expand all" and "Collapse all". At mobile width, open and close the drawer (button and Escape).
2. Combine R/I/P/N and search; check empty results and counts.
3. Test the "Guide" switch with an internal page, an external page and no page (with no page, the switch stays on and disabled and the URL says "No page"). A subsection in I or R with a page must open showing the page; the rest, the guide. Check the open-in-a-new-tab icon. Walk through the **whole** page inside the container's iframe, not just the header, and compare it with opening it separately.
4. Check mobile/desktop widths, zoom, long texts and focus order.
5. Review labels and announcements with a screen reader, contrast and the project's accessibility criteria.

The original methodological guide proposes [WCAG](https://www.w3.org/TR/WCAG22/), [APG](https://www.w3.org/WAI/ARIA/apg/) and [DTCG](https://www.designtokens.org/tr/2025.10/format/) as references. Review their applicability when defining each project. The template does not claim certified conformance.

## Scope of the checks
The automated checks validate structure, contract and logic. Visual and functional review in the browser, accessibility and the content of each page are manual and belong to a person; no automated check equals a review. Moving to R requires that recorded review.
