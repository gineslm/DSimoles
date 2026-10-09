# Style and tone of section pages

> **Status: approved by the responsible person (2026-10-08).** The values come from the pilot page (`visuals.color`). If something clashes with what you see in a page, say so instead of deciding on your own.

These guidelines apply to the `.dc.html` pages in `sections/`. They do not define the DSimoles Design System: they are the **neutral documentation base** (CLAUDE.md, rule 13). The system being defined is shown inside them with its own values, which are marked as pending while they are not decided.

## Tone: visual first
- **Show before explaining.** Every section starts with something you can see: color swatches, scales, applied examples, diagrams, correct/incorrect comparisons. Text accompanies, it does not replace.
- **Little text.**
  - Purpose: one sentence, at most 25 words.
  - Paragraphs: at most 3 lines. If more is needed, it is a list or a table.
  - Rules: lists of short sentences (one idea per line), not paragraphs.
  - Labels and example captions instead of long explanations.
- **Say what is pending once and briefly.** One "Pending · …" box per block (each h3 subtitle counts as a block), with what is missing, without justifying.
- **Do not repeat the guide.** No "Guide" box and no settings such as `showGuide`: the container already shows `data/guide.json`.
- **Direct language.** English, active voice, no filler ("it is important to note that…").
- No invented content: no values, results or checks that do not exist. What is not decided is shown as a gap, not as data.

## Structure of each page
1. Header: section name, number, status in a label. No preceding text: the visual comes first.
2. Main visual content (what defines the section), with the purpose in one sentence if needed.
3. Short rules.
4. Typical examples and at least one edge case.
5. Applicable accessibility, as a short list with the criteria that apply.
6. Pending: groups what is missing, including implementation (token format, file destination) while nothing is decided. There is no review section: the status is in `project.json`. "Implementation" becomes its own section only when it has real content.

## Margins and rhythm
| Element | Value |
| --- | --- |
| Maximum width of the page container | 1040 px, for grids, swatches and cards (the page lives inside an iframe of variable, full width: it must be fluid and manage its own margins) |
| Side padding | `clamp(20px, 4vw, 40px)` |
| Top padding | `clamp(24px, 5vw, 64px)` |
| Gap between sections | 48 px |
| Gap inside a section | 12–16 px |
| Swatch and card grids | 12 px gaps (4 px between steps of a scale) |
| Reading width of running text | 72 characters (`max-width: 72ch`) **only** in paragraphs, lists and "Pending" boxes, not on the whole container |

## Typography
- Family: `system-ui, -apple-system, "Segoe UI", sans-serif`. Monospace for token names and paths: `ui-monospace, Menlo, monospace`.
- Scale:

| Use | Size | Weight |
| --- | --- | --- |
| Page title | `clamp(32px, 5vw, 44px)` | 600 |
| Section title (h2) | 22 px | 600 |
| Subtitle (h3) | 17 px | 600 |
| Body | 16 px, line height 1.6 | 400 |
| Secondary text | 14 px | 400 |
| Labels, captions and notices | 12–13 px | 400–600 |
| Tokens and paths | 13 px mono | 400 |
- Uppercase with tracking only in short labels, such as the context line of the header (system · number · category).

## Documentation color (neutral)
Only neutral tones; the page's color comes from the swatches of the system being defined.

| Role | Value | Contrast on white |
| --- | --- | --- |
| Main text | `#1f1f1f` | 16.48 |
| Body text in cards | `#3d3d3d` | 10.86 |
| Secondary text | `#5a5a5a` | 6.90 (6.38 on `#f6f6f6`) |
| Page background | `#ffffff` | — |
| Supporting surface | `#f6f6f6` | — |
| Border | `#d4d4d4` | 1.48 (decorative border only) |
| Pending-gap border (dashed) | `#8a8a8a` | 3.45 (decorative, never for text) |

Contrasts are calculated with the WCAG 2.2 formula for normal text; only text, not borders, needs 4.5:1. If a border conveys information (for example a focused field), it must reach 3:1 and carry another cue as well.

## Recurring components
- **Status label** (R/I/P/N): 1 px border, 12 px, 600; no line break (`white-space: nowrap`).
- **"Pending" box**: dashed `#8a8a8a` border, 13 px, 8×12 px padding.
- **Card**: `#d4d4d4` border, 16 px padding, no shadow.
- **Value swatch**: square with a 1:1 ratio and its name at 11–13 px below or inside; no tooltip as the only way to convey information.
- **Data table**: with `div` and `role="table"`, `row`, `columnheader`, `cell` (the `sc-for` rule, see [data-contract.md](data-contract.md)).

## Accessibility of the page itself
- A single `h1` per page and a hierarchy without skips.
- Color is never the only cue: status, error or selection carry text or shape.
- Text contrast of at least 4.5:1; verify any new combination.
- Everything interactive is reachable by keyboard with visible focus.
- No animations; if there were any, respect `prefers-reduced-motion`.
- `lang="en"` on the document's `<html>` tag (enforced by `check`) and descriptive page titles.

## What is not decided here
The DSimoles Design System values (palettes, scales, product typography, spacing) are decided in their sections (`visuals.color`, `visuals.typography`, `visuals.spacing`…). These guidelines only fix how they are documented.
