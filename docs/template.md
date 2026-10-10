# Starting a new project

DSBook is the framework: a container, a guide, a tracking matrix and the scripts that keep them honest. A project is one copy of it with its own data. This page explains how to start one. How the framework itself is versioned is in [framework.md](framework.md).

## From a clean copy
Copy the repository without its `.git` folder, then run:

```sh
npm run init -- --id my-ds --name "My Design System"
```

`init` copies `seed/` (the initial catalog and an all-Pending project) to `data/` and sets the identity. From then on `data/` belongs to the project: edit the guide text, add or retire subsections, and so on. `init` refuses to overwrite a project that already has its own identity. If the copy comes from a used project, first remove its pages and resources from `sections/` and `assets/`; changing the name is not enough. Improvements made to the seed later are not propagated to existing projects.

## Repository and remote
```sh
git init
git add .
git commit -m "Initialize DS workspace"
```
Connect your GitHub remote according to the team's flow. Each team must integrate on an up-to-date branch and review `project.json` conflicts by section ID; the most recent copy never wins automatically. Static hosting is optional.

## Files to adapt
`README.md`, `CLAUDE.md` and `CHANGELOG.md` describe the project, not the framework: write the project's own. `LICENSE` is the one that came with the framework unless the project decides otherwise. Everything else listed in [framework.md](framework.md) comes from DSBook and is not edited per project.
