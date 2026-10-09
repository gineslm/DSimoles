# Reusing the template

This repository started as a template (DSBook) and is now the DSimoles project. These instructions are for creating another project from its structure.

Copy this folder, without the pages or the DSimoles content, to a new repository. Edit `projectId` (unique slug) and `name` in `data/project.json`; keep all statuses at P until decisions are made. If you start from a used project, empty pages, owners, notes, reviews and exclusions in `project.json`, remove its specific content from `sections/` and `assets/` and return statuses to P. Keep the guide's structure.

To create a local repository from a copy without history:
```sh
git init
git add .
git commit -m "Initialize DS workspace"
```
Connect your GitHub remote according to the team's flow. Each team must integrate on an up-to-date branch and review `project.json` conflicts by section ID; the most recent copy never wins automatically. Static hosting is optional.
