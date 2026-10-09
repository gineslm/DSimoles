# Pilot 2 · Container with a sidebar and style guidelines

Date: 2026-10-08 · Origin: request from the responsible person after pilot 1. Status of each decision in the [registry](README.md).

## E1 · The container moves to a sticky sidebar
**Status: applied. The accordion list and the per-subsection panels described below were replaced by one view per address in pilot 3 (F6, F7), and the expanded sidebar by an icon rail in pilot 4 (G1–G6).**

**Reason.** The header accumulated data (title, help text, progress card, filters) and the useful content ended up far away. A sticky sidebar is reachable at any scroll level and lets you navigate without scrolling.

**Status and result.**
- Sticky sidebar with the brand (DSBook), the Design System's name, progress, search, R/I/P/N filters with counts, expand and collapse, and a menu with the 14 categories and the 132 subsections.
- Each subsection in the menu shows its status (a letter with accessible text) and takes you directly to it: it opens the category and the subsection and moves the focus. Direct links (`#item-<id>`, `#cat-<id>`) remain and work when the page loads.
- The menu follows the position while scrolling (`aria-current`), and search and filters also trim it.
- On screens narrower than 950 px the sidebar becomes a drawer with a "Menu" button, closing with Escape and a dimmed backdrop.
- **Later adjustment (same day):**
  - The sidebar collapses to a column of icons and expands again with the DSB button at the top (brand in a condensed typeface; there is no hamburger). When collapsed it shows the two progress bars without a percentage, a status selector (all, R, I, P, N, equivalent to the filters, with "Several" if there are combinations), a search icon and a sections icon. Both open a panel with the search box and the menu: it unfolds on hover, pins with a click and closes with Escape. All the controls in the column are 44 px wide.
  - **Two progress bars:** *Progress* (ready R over applicable, that is, not N) and *Complexity* (subsections that are not N over the total in the guide). `progressOf` now also returns `scope` and `total`.
  - The "Expand/Collapse" links in the sidebar disappear; they are replaced by "Open all categories" and "Close all", next to the list count, which make it clear that they act on the list and not on the menu.
- **Three blocks with separators (same day):** 1) DSB and the Design System's name; 2) a "Progress / Complexity" header with the count of ready over applicable sections on the right (for example `0/132`, which used to be in the list header) and the two progress lines below, without added texts (the explanation is in the tooltip); 3) content: search, status and sections. When collapsed, the third block is three icons (magnifier, status, sections) with their panel. The status panel is a menu of checkboxes that lets you combine statuses and replaces the selector. The sections menu includes "Expand all" and "Collapse all" (acting on the menu and on the list), which removes the list header.
- **Expanded subsections (same day):**
  - Default view: if there is no page, the guide is shown (with the "Guide" switch on and disabled); if there is a page and the status is I or R, the page is shown; otherwise, the guide. The reader's choice with the switch is kept while the page remains open.
  - The subsection row has two lines: button and status, and below (only when expanded) the switch, the page URL and an icon without text to open it in a new tab. The view bar, the Guide/Page label, the identifier and the help text disappear; the "Page" field is no longer repeated in the metadata.
  - The page container (`item-content`) has no padding or margin: the imported page takes the full width, without a border, and manages its own margins (to be defined, see [page-style.md](../page-style.md)). Side padding remains only in the guide and the metadata, which belong to the container.
- The header with title, help text and progress card are removed. Read-only mode (D2 of pilot 1) and the page existence check are kept.

## E2 · Style and tone guidelines for pages
**Status: partial. Guidelines approved (2026-10-08); pending redoing `visuals.color` with them.**

**Proposal.** [docs/page-style.md](../page-style.md): visual-first tone, little text, page structure, margins, typography, a neutral color base with calculated contrasts and recurring components. The values come from the pilot page. Decisions of the responsible person after Claude Design's analysis: separate the container width (1040 px) from running text (72ch); `lang` mandatory, enforced by `check`; visuals come before text; the "Guide" box and the `showGuide` setting are removed; "Review and pending" is removed and "Implementation" is merged into "Pending" until it has content; each h3 subtitle counts as a block for the "Pending" box.
