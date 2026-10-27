# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pramod Kadam's personal portfolio, a single page served as-is by GitHub Pages (`.nojekyll`). It's plain HTML, CSS and vanilla JS. There is no build step, no package manager, no tests and no linter. Keep it dependency-free: no frameworks, third-party scripts, web fonts, analytics or cookies.

Read `CONTEXT.md` before changing content or layout. It defines the terms used for the page's parts: intro strip, role, level, case study, recognition and personal project.

## Product decisions (agreed with Pramod, Oct 2026)

- **Readers.** Recruiters skim the page; data engineering hiring managers judge the depth of the work. Pramod is employed and **not job-hunting**, so the page has no "open to opportunities", no "hire me" calls to action, and no location.
- **Look.** An illustrated, warm, story-led page. Pramod pointed at anubhuti.design (via wallofportfolios.in) as the flow to follow, after the Apple-style and dark "observatory" versions felt soulless. Follow its *flow*, never its artwork or copy. `DESIGN.md` has the full system. In short:
  - The page is one world: on-premise Hadoop is a warehouse on a floating island, Google Cloud is a building in the clouds, and data parcels ride a pipe between them. The page moves from dawn (the intro) to night (contact).
  - Full-screen illustrated intro with a big bold claim; scrolling zooms into the clouds. Then a work carousel of illustrated cards, a timeline with big outlined years, About with floating trait pills, and a night-time contact with a "send the packet" interaction.
  - All artwork is hand-written SVG in `index.html`. No raster illustrations, no portrait (none supplied), no dark theme.
- **Personal touches need Pramod's facts.** The reference site's charm comes from personal details (hobbies, opinions, a portrait). Add them only when Pramod supplies them; never invent a hobby, an opinion or a quote.
- **Copy.** Write only specifics Pramod has confirmed. Never invent numbers or results. Generic lines like "designed scalable data architectures" are exactly what this redesign removed.
- **Projects.** Case studies are the cards in Selected work; each names its role's employer and dates. The three old college projects were removed. A personal project comes back only if it is real data engineering work with a public repo.

## Running locally

```bash
python -m http.server 8765
```

`.claude/launch.json` defines this as the `portfolio` preview server, so use `preview_start {name: "portfolio"}` to check changes in the browser pane. Python's server doesn't serve `404.html` for missing paths, so open `/404.html` directly to check it. To check the print résumé, render it to a PDF with headless Chrome (`--print-to-pdf=<absolute path>`).

## Architecture

- **`content.js` holds all page content.** It defines a global `SITE` object with three parts:
  - `profile`: name, title, employer, career dates and links
  - `intro`: the headline, summary and scroll hint of the full-screen scene
  - `sections[]`: everything below it (`work`, `path`, `about`, `contact`)

  The comment block at the top of the file documents every field.
- **`script.js` is the renderer.** It's an IIFE that reads `SITE` and replaces everything inside `<main>` and the nav menu. Load order matters: `content.js` must come before `script.js` (both `defer`).
  - `renderStage` builds the scene; each section's `type` maps to a function in `renderers` (`work`, `path`, `about`, `contact`). Each section gets the class `section <type>`.
  - `art(name)` clones an `<svg data-art="name">` from the `<template id="art">` in `index.html`. That keeps the no-`innerHTML` rule and lets `style.css` animate inside the drawings.
  - `setupStage` pins the scene and sets `--p` (0 to 1) on scroll; CSS zooms and fades from it. `setupParcels` moves parcels along `.hero-pipe` and pauses off-screen. `setupContact` sends the packet and copies the email.
  - Reduced motion: no pinning, no zoom, parcels stand still, no reveal. Check layouts with headless Chrome and `--force-prefers-reduced-motion`. Headless virtual time doesn't run `requestAnimationFrame`, so shim it in a test copy when scripting interactions.
  - `fill()` replaces `{years}`, `{name}` and `{email}`; `rich()` turns `**text**` into `<strong>`.
  - The DOM is built with `textContent`, `createElement` and template clones only, never `innerHTML`.
- **`index.html` needs hand-updating.** Its `<head>` metadata (title, description, OG/Twitter tags, JSON-LD with `worksFor`) its no-JS fallback inside `<main>` and the artwork `<template>` are not generated from `content.js`. When the title or employer changes, update them, and also update `tools/og-image.html`. SVG gradient ids are prefixed per drawing (`h-`, `m-`) because every drawing lands in the same document.
- **`style.css`.**
  - One light theme; tokens on `:root`. Measured contrast is in `DESIGN.md`: use `--accent` only for large figures and graphics, `--accent-ink` for small text.
  - The `@media print` block at the end turns the page into a black-on-white one-page résumé (the "Résumé" nav button prints). It shows the hidden `.print-head` and each card's `.case-full`, and hides all artwork and the contact section. After changing the content, check that it still fits on one page.
- **`404.html`** uses root-absolute paths (`/style.css`, `/`) because GitHub Pages serves it at any depth.
- **`assets/og-image.png`** is generated from `tools/og-image.html` with headless Chrome. Use **absolute** paths: a relative `--screenshot` path fails silently on this machine.

  ```bash
  "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --screenshot="D:/workspace/pramod21kadam.github.io/assets/og-image.png" "file:///D:/workspace/pramod21kadam.github.io/tools/og-image.html"
  ```

## Conventions

- The JS style is `"use strict"`, `const`/`let`, `function` expressions with `forEach` (no arrow functions), and short JSDoc-style comments above helpers.
- Keep the accessibility features: skip link, `aria-expanded` mobile menu with Esc to close, and `aria-current` on the active nav link. External links get `target="_blank" rel="noopener noreferrer"` plus an "(opens in new tab)" label.
