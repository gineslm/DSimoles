# Pilot 5 · The home as a record

Date: 2026-10-10 · Origin: the question of where general tasks live, answered in an analysis with the responsible person. Status of each decision in the [registry](README.md). All of them are applied (framework 1.2.0).

## H1 · The home page has three views
**Status: applied.**

The home page has the same tabs as a subsection: **Content** (the summary it always had, still the default), **Info** and **Record**. Their addresses are `#/home/<view>`; `#/` stays the summary. The first idea was `#/content`, `#/info` and `#/record`, but category 5 is called `content` and would have collided with its list page, so the views hang from a reserved `home`, like a subsection's views hang from its ID. `home` and `framework` are reserved category IDs.

## H2 · Info is implemented empty
**Status: applied.**

The tab exists and says there is no information yet. It is reserved for a guide to the project and the framework; it has no data field until it has content.

## H3 · Record: project tasks and the tasks of every section
**Status: applied.**

Record has two blocks. The project's own record (owner, notes and project tasks), editable in `data/project.json`; and the tasks of every section, read-only, grouped by category and subsection, each with a link to the Record of its section.

## H4 · The project record has no status or review
**Status: applied.**

`record` is `{owner, notes, tasks}`, optional, with exactly those keys. Progress is computed from the sections, so a project status would only contradict it.

## H5 · One task model
**Status: applied.**

A task is `{text, when}` everywhere. One validation (`validateTasks`), one grouping (`openTasks`), one list in the container (`tasksList`) and one collector (`collectTasks`) serve the sections and the project.

## H6 · Tasks are not filtered
**Status: applied.**

Neither the status filters nor the search touch the task lists. They are only grouped into pending and future.

## H7 · No task counter
**Status: applied.**

No number is shown next to the Record tab or anywhere else: tasks are not counted, as decided in F9.

## H8 · Tasks and Not applicable
**Status: applied, with a correction to the first idea.**

A Not applicable section cannot have tasks (`check` fails). The responsible person pointed out that triaging many sections to N and then receiving a task for one of them should be a signal, not a dead end. The agreed rule: adding a task to an N section is a **reopening**. First check that it belongs there; if it belongs elsewhere, move it. If it does belong, the section goes to P, the previous exclusion reason is moved into `notes` with the date, and the responsible person is told. The software never changes a status: the error is the safety net, the agent does the reopening, openly. No other rule links tasks and status.

## H9 · Tasks go where they belong
**Status: applied.**

The nine iMoles prototype tasks that sat in `visuals.color` moved to `implementation.publishing-and-migration`, which was reopened from N to P under H8 (the notes keep the previous reason). The administrative tasks live in the project record. Work on the framework lives in the framework's repository.

## H10 · Framework 1.2.0
**Status: applied.**

New view, new optional field and a new check rule: a MINOR version. The guides for Claude Design and Claude Code explain the reopening rule, and Claude Design may edit the project record.

## A fix made along the way
The cascade of the Sections menu depended on the media query `(hover:hover)`, which some touch-capable laptops do not report even with a mouse. It now uses `(any-hover:hover)`, and the browser smoke test hovers the menu so a regression is caught. The cause of the reported problem could not be reproduced in Chrome from 1024 to 1920 px wide, so this is the most plausible explanation, not a confirmed one.

## Verification
Checked on the real state of the project: the home Record lists the tasks of Color (4) and of Publishing and migration (9) next to the two project tasks, links lead to the sections' records, and no filter changes the list. The mobile layout has no horizontal scroll.
