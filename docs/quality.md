# Review criteria

## Ready for a section
- Purpose, decisions, rules, examples and the relationship with design/code are concrete.
- The applicable accessibility is checked in that section and the evidence is recorded.
- There are typical examples and edge cases, and no hidden blocking work: blocking work keeps the section in I. Non-blocking work lives in the section's `tasks` and does not prevent R (for example, a dark theme that is out of scope for now).
- It is identified who reviewed, when and which criteria/results support R.
- The necessary links and resources work. If the development lives outside the repo, the team has verified access.

## Available technical checks
`npm run check` and `npm test`. What each one verifies, when to run them and how to read their errors is in [scripts.md](scripts.md). In short: guide/project contract, a single page per section, I and R with a page, identity meta, local references, the vendored runtime of `.dc.html` pages and the logic of `model.js`. They do not download external content or test the browser.

## Manual review of the application
1. Load over HTTP and operate with the keyboard. Sidebar: walk through the menu, open a subsection and check that the focus moves to the main area, the current item is marked (`aria-current`) and the browser's back button returns to the previous view. Collapse and expand the sidebar with the DSB button; when collapsed, check the search, status (combining several) and sections panels with hover, click and Escape, and "Expand all" and "Collapse all". At mobile width, open and close the drawer (button and Escape) and check that choosing a subsection closes it.
2. Combine R/I/P/N and search; check empty results on the home page and in a category, and that the menu follows the filters.
3. Open a subsection with a page, one without a page and a wrong address. With a page in I or R it opens on Content; otherwise on Guide. Check the three views and the header (breadcrumb links, status, view tabs, open-in-a-new-tab icon, previous/next). Content with no page must say "No page yet". Walk through the **whole** page inside the container, not just its top, and compare it with opening it separately. Check that the header does not take too much height at mobile width.
4. Check mobile/desktop widths, zoom, long texts and focus order.
5. Review labels and announcements with a screen reader, contrast and the project's accessibility criteria.

The original methodological guide proposes [WCAG](https://www.w3.org/TR/WCAG22/), [APG](https://www.w3.org/WAI/ARIA/apg/) and [DTCG](https://www.designtokens.org/tr/2025.10/format/) as references. Review their applicability when defining each project. The template does not claim certified conformance.

## Scope of the checks
The automated checks validate structure, contract and logic. Visual and functional review in the browser, accessibility and the content of each page are manual and belong to a person; no automated check equals a review. Moving to R requires that recorded review.
