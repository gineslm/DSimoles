# Reusing the template

This repository started as a template (DSBook) and is now the DSimoles project. These instructions are for creating another project from its structure.

Copy this folder, without the pages, resources or the DSimoles content, to a new repository and run:

```sh
npm run init -- --id my-ds --name "My Design System"
```

`init` copies `seed/` (the initial catalog and an all-Pending project) to `data/` and sets the identity. From then on `data/` belongs to the new project: edit the guide text, add or retire subsections, and so on. `init` refuses to overwrite a project that already has its own identity. If the copy comes from a used project, first remove its pages and resources from `sections/` and `assets/`; changing the name is not enough. Improvements made to the seed later are not propagated to existing projects.

To create a local repository from a copy without history:
```sh
git init
git add .
git commit -m "Initialize DS workspace"
```
Connect your GitHub remote according to the team's flow. Each team must integrate on an up-to-date branch and review `project.json` conflicts by section ID; the most recent copy never wins automatically. Static hosting is optional.
