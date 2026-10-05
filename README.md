# Wechirok website

A small personal website with an interactive text interface and ordinary pages for about, work, projects and public profiles. Built with Astro, TypeScript and CSS.

## Local development

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open the local address printed by Astro. Nothing is published by these commands.

```sh
npm run check
npm run format:check
npm run build
npm run preview
```

The build includes type checking and writes the static website to `dist/`.

## Content

English copy, public profile URLs and projects live in `src/data/en.ts`. Commands are defined in `src/data/commands.ts`. The conversation and ordinary pages share the same content component.

Source Serif 4 is served locally with Latin and Cyrillic subsets, including Ukrainian characters. Roman and italic variable fonts support weights from 200 to 900 and optical sizes from 8 to 60. Font settings live in `src/styles/global.css`; the license is included in `public/fonts/`.

Icons are local SVG assets from Simple Icons and Lucide. `src/components/Icon.astro` renders them inline at build time; colors and sizes follow the site styles. Public profiles use their brand marks, while commands and work areas use outline icons. Original vectors live in `src/assets/icons/`, with collection versions, source URLs and licenses in `public/icons/`. The Weblate logo retains its separate GPL license and a distributed copy of its editable SVG source.

## Deployment

The website is hosted at https://wechirok.github.io/wechirok-website/ using GitHub Pages. The workflow in `.github/workflows/pages.yml` checks pull requests and publishes successful builds from `main`.

Set `SITE_URL` to the production origin to generate canonical URLs. If the site is hosted below a path, set `BASE_PATH` before building. For example, a GitHub Pages project site can use `BASE_PATH=/wechirok-website`. Internal links and bundled assets must continue to work at that base path.

Project scripts only run locally. Publication is performed by the GitHub Actions workflow, with Node.js 24 and the dependencies pinned in `package-lock.json`.
