# Pilot 4 · Container refinements

Date: 2026-10-09 · Origin: review of the new container by the responsible person. Status of each decision in the [registry](README.md). All of them are applied (0.13.0).

## G1 · The sidebar is an icon rail only
**Status: applied.**

The expanded mode is gone. The sidebar is a fixed rail (56 px, 48 px on narrow screens) with the DSB mark and two icons: status filter and sections. The DSB mark is now a link to the home page. The two icons open dropdown panels (hover to preview, click to pin, Escape to close). The icons are smaller (18 px in a 36 px button). The rail has no footer: the read-only note and the links to the README and the agent guide moved to the home page.

## G2 · Search lives in the header
**Status: applied.**

The search box moved from the sidebar to the content header (right side). It keeps its meaning: it filters the Sections menu, the home page and the category lists (by number, title, what to define and category). On a section page only the menu reacts; what search should do beyond that remains undecided.

## G3 · Progress bars leave the sidebar
**Status: applied.**

The two progress lines are removed from the sidebar. *Progress* (ready over applicable) and *Complexity* (applicable, that is not N, over the total) are now shown at the top of the home page, with their counts. The categories keep their own bar and counts.

## G4 · Sections menu with a cascading submenu
**Status: applied.**

The Sections panel lists the categories only. Hovering a category (or focusing it with the keyboard) opens all its subsections in a submenu next to the panel; moving the pointer between the two keeps it open and hovering another category replaces it. Clicking a category opens its list page; clicking a subsection opens it. On touch devices and narrow screens there is no hover: each category has a chevron that expands its subsections inline. The current category and subsection are marked. The "Expand all" and "Collapse all" controls, which no longer make sense, were removed.

## G5 · Header order
**Status: applied.**

For a section: breadcrumb, then the status, then the view tabs (Content, Guide, Record), then previous/next and the search. The icon that opened the page in a new tab was removed.

## G6 · Neutral palette and a full border for the active element
**Status: applied.**

All the container chrome uses neutral grays (the same family as the page style guide) so that it does not compete with the colors the DS defines. The status labels are neutral too and differ by fill and border, not by color: Ready is solid dark, In process is mid-gray, Pending is outlined with a dashed border and Not applicable is light gray. The active element (current menu item, current category, active view tab, open rail panel) is marked with a **full 1.5 px border** and a light gray fill, instead of the wider side bar used before. Focus rings are dark. A small dot on the filter icon shows that a status filter or a search is active.

## Verification
The new container was checked in a headless Chrome with real mouse events: rail geometry, hover and cascade, the panel closing after navigation, header order, mobile layout and the neutral palette (no green left in the stylesheet). The browser smoke test (`scripts/container.test.mjs`) covers the main paths.
