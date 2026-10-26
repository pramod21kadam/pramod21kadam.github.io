# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pramod Kadam's personal portfolio, a single page served as-is by GitHub Pages (`.nojekyll`). It's plain HTML, CSS and vanilla JS. There is no build step, no package manager, no tests and no linter. Keep it dependency-free: no frameworks, third-party scripts, web fonts, analytics or cookies.

Read `CONTEXT.md` before changing content or layout. It defines the terms used for the page's parts: intro strip, role, level, case study, recognition and personal project.

## Product decisions (agreed with Pramod, Oct 2026)

- **Readers.** Recruiters skim the page; data engineering hiring managers judge the depth of the work. Pramod is employed and **not job-hunting**, so the page has no "open to opportunities", no "hire me" calls to action, and no location.
- **Look.** Apple product-page style (Pramod asked for this after a plain résumé look felt tasteless):
  - big bold system type, a centred intro and a key-figures band
  - rounded tiles for case studies and skills, alternating `--bg`/`--bg-alt` section bands
  - blue links with chevrons, a thin translucent nav, and a gentle fade-up on scroll (off for reduced motion)
  - Pramod also asked for data-themed motion and a minimal background. The intro has a faint dot grid and a soft accent glow, a canvas animation where raw records pass through a transform stage, become rows, and are stored in a warehouse cylinder, and key figures that count up.

  Keep it restrained. Do not add gradient blobs, glassy cards, extra decorative widgets or Apple branding.
- **Copy.** Write only specifics Pramod has confirmed. Never invent numbers or results. Generic lines like "designed scalable data architectures" are exactly what this redesign removed.
- **Projects.** Work lives inside each role as case studies, so there is no separate Projects section. The three old college projects were removed. A personal project comes back only if it is real data engineering work with a public repo.

## Running locally

```bash
python -m http.server 8765
```

`.claude/launch.json` defines this as the `portfolio` preview server, so use `preview_start {name: "portfolio"}` to check changes in the browser pane. Python's server doesn't serve `404.html` for missing paths, so open `/404.html` directly to check it. To check the print résumé, render it to a PDF with headless Chrome (`--print-to-pdf=<absolute path>`).

## Architecture

- **`content.js` holds all page content.** It defines a global `SITE` object with three parts:
  - `profile`: name, title, employer, career dates and links
  - `intro`: the summary and key figures (`figures`) shown in the intro strip
  - `sections[]`: everything below the intro strip

  The comment block at the top of the file documents every field.
- **`script.js` is the renderer.** It's an IIFE that reads `SITE` and replaces everything inside `<main>` and the nav menu. Load order matters: `content.js` must come before `script.js` (both `defer`).
  - `renderIntro` builds the intro strip and `renderFigures` builds the key-figures band.
  - Each section's `type` maps to a function in `renderers` (`text`, `tags`, `timeline`, `contact`). `timeline` renders both roles and education. A role's `caseStudies` and `recognition` become tiles through the shared `tile()` helper.
  - Each section gets the class `section-<type>`, which CSS uses for the alternating bands.
  - `setupFlow` draws the data-flow canvas (`intro.flow`).
    - Colours are read from the CSS tokens and re-read when `data-theme-active` changes.
    - It pauses when the canvas is off-screen or the tab is hidden.
    - For reduced motion it draws a single still frame.
  - `setupCountUp` animates key figures below 1000. Screen readers get the final value through a visually hidden copy.
  - Elements with the class `.reveal` fade in through `setupReveal`. The pane's screenshots can catch them mid-fade, or blank while the pane is hidden. To check the layout, use headless Chrome with `--force-prefers-reduced-motion`.
  - `fill()` replaces the `{years}` and `{name}` placeholders. `{years}` is the number of completed years since `profile.careerStart`.
  - The DOM is built with `textContent` and `createElement` only, never `innerHTML`.
- **`index.html` needs hand-updating.** Its `<head>` metadata (title, description, OG/Twitter tags, JSON-LD with `worksFor`) and its no-JS fallback inside `<main>` are not generated from `content.js`. When the title or employer changes, update them, and also update `tools/og-image.html`. An inline script in `<head>` applies the saved `localStorage.theme` before first paint.
- **`style.css`.**
  - **Dark tokens are duplicated:** once in `@media (prefers-color-scheme: dark)` and once in `:root[data-theme="dark"]`. Keep the two in sync.
  - The `@media print` block at the end turns the page into a black-on-white résumé on one page. It hides the nav, the footer, the intro links, the background, the flow animation and the key figures, flattens the tiles, and moves `#contact` up under the intro. After changing the content, check that it still fits on one page.
- **`404.html`** uses root-absolute paths (`/style.css`, `/`) because GitHub Pages serves it at any depth.
- **`assets/og-image.png`** is generated from `tools/og-image.html` with headless Chrome. Use **absolute** paths: a relative `--screenshot` path fails silently on this machine.

  ```bash
  "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --screenshot="D:/workspace/pramod21kadam.github.io/assets/og-image.png" "file:///D:/workspace/pramod21kadam.github.io/tools/og-image.html"
  ```

## Conventions

- The JS style is `"use strict"`, `const`/`let`, `function` expressions with `forEach` (no arrow functions), and short JSDoc-style comments above helpers.
- Keep the accessibility features: skip link, `aria-expanded` mobile menu with Esc to close, and `aria-current` on the active nav link. External links get `target="_blank" rel="noopener noreferrer"` plus an "(opens in new tab)" label.
