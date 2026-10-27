# DESIGN.md

The design system for Pramod Kadam's portfolio. `CONTEXT.md` defines the content terms. The product rules in `CLAUDE.md` still apply: confirmed facts only, no job-hunting language, no location, no dependencies.

## 1. Thesis: from the ground to the cloud

The page is one small illustrated world that tells Pramod's real story.

- On-premise Hadoop is a warehouse and a table silo on a floating island.
- Google Cloud is a building on a cloud.
- Data parcels ride a pipe from one to the other. That is literally the migration he leads.
- The page moves through a day: dawn in the intro, warm daylight through the work, dusk at the contact heading, night at the footer.

The flow follows anubhuti.design, which Pramod chose as the reference: illustrated full-screen intro, scroll into the scene, a carousel of illustrated work cards, a timeline with big outlined years, About with floating trait pills, and a playful contact. We follow the *flow*. The artwork, copy and metaphor are our own.

## 2. Tokens (`style.css`, `:root`)

One light theme. There is no dark mode: the page brings its own night.

| Token | Value | Use |
|---|---|---|
| `--cream` | `#fbf3ea` | Work, About |
| `--sand` | `#f6e7d9` | Path |
| `--paper` | `#fffcf8` | Cards, chips, pills |
| `--text` | `#2a2420` | Headings, body |
| `--muted` | `#6b5d53` | Secondary text |
| `--line` | `#ead6c4` | Borders, dashed rules |
| `--accent` | `#c8643b` | Terracotta: big figures, arrows, markers, graphics |
| `--accent-ink` | `#a14b28` | Terracotta for small text and badges |
| `--sky` | peach → apricot → rose → lilac | Intro and the About arch |
| night | `#8d6bb3` → `#4a3a8c` → `#1d1a45` | Contact |

Measured WCAG contrast:

- `--text` on cream: 13.9:1
- `--muted`: 5.8:1 on cream, 5.2:1 on sand, 5.1:1 on the sky
- `--accent-ink`: 5.4:1 on cream, 4.9:1 on sand
- white on the `--accent-ink` badge: 5.9:1
- `--accent` on paper is 3.8:1, so it is used **only** for text 24px and larger (figures) and for graphics
- night text `#e6def8` on `#4a3a8c` and darker: over 7:1. The dusk band sits above the heading, so no text lands on the lighter purples.

**Type.** System sans only (no web fonts, a `CLAUDE.md` rule): `system-ui, -apple-system, "Segoe UI Variable Display", "Segoe UI", Roboto…`.

- Display headings are 700–800 weight with tight tracking (−0.045em to −0.05em), sized `clamp(36px, 5.4vw, 72px)` in the intro and `clamp(42px, 6.4vw, 84px)` for section titles.
- Figures are big, bold and terracotta, always with a label beside them.
- Body is 17px at 1.55 line height.

**Shapes.**

| Element | Radius |
|---|---|
| Pills (nav, chips, buttons) | 999px |
| Cards | 32px outer, 22px on the art panel |
| Dialog | 28px |
| About figure | an arch, 210px top corners |
| Path illustration | a circle |

Shadows are warm brown, never grey: `--shadow-card` and `--shadow-pill`.

**Glass.** Only the frosted pills (nav, brand, scroll hint) use backdrop blur, at 74% opacity. With `prefers-reduced-transparency` they turn solid.

## 3. Artwork

- **Source.** Every drawing is hand-written SVG in the `<template id="art">` in `index.html`. `script.js` clones them by name.
- **Style.** Flat shapes with soft vertical gradients, light from above, a soft ground shadow (an ellipse) under every object, and terracotta, apricot, sage and sky-blue on cream.
- **Labels.** No text inside drawings. The text next to each one carries the facts, and every drawing is `aria-hidden` (the intro scene has an `aria-label`).
- **Gradient ids** are prefixed per drawing (`h-`, `m-`) because all drawings share one document.
- **Adding a drawing.** Add an `<svg data-art="name">` to the template and refer to it by `art: "name"` in `content.js`.

## 4. Motion

Motion serves the story (data moving, the camera rising into the cloud) and stops when nobody is looking.

- **Scroll zoom.** The intro is pinned for about 1.1 extra screens. `--p` goes from 0 to 1: the headline fades and rises, the scene scales up to 3.4× towards the cloud building, and the frame fades to cream to hand over to Work.
- **Parcels.** Six parcels travel the pipe on a 9-second loop, fading in at the warehouse and out at the cloud. They pause off-screen and in background tabs.
- **Small life.** The cloud platform floats, the spark twinkles, the seeds drift and the trait pills bob, each on a 5–9 second loop.
- **Contact.** A packet travels the pipe over 1.8 seconds, the mailbox flag goes up, and the email is copied.
- **Reveal.** Blocks fade up 24px once, as they enter.
- **Reduced motion.** No pinning or zoom, parcels sit still along the pipe, there are no loops or reveals, and the contact send jumps straight to "Delivered".

## 5. Layout

- **Container.** Max width 1200px, side margin `clamp(16px, 4vw, 48px)`.
- **Nav.** Two fixed frosted pills: the brand (monogram, name, role) on the left and the links on the right, with a "Résumé" button that prints. Below 820px the links fold into a Menu dropdown.
- **Work.** A horizontal scroll-snap row of cards. The first card aligns with the container and the row bleeds off the right edge. Previous and next buttons disable at the ends.
- **Path.** From 900px, a sticky circular illustration on the left (it changes for each era) beside the timeline. Below 900px the timeline is on its own.
- **About.** The arch figure with trait pills beside the text, stats and skill chips. They stack below 900px.
- **Phones.** The intro scene is 140vw wide, so the island and cloud fill the screen and their outer edges crop a little.

## 6. Accessibility

- Skip link, landmarks, `aria-current` in the nav, an `aria-expanded` menu with Esc to close, and "(opens in new tab)" labels on external links.
- Case studies open in a native `<dialog>`: focus moves to Close, Esc and backdrop clicks close it. Without `<dialog>` support the full case expands inline.
- The contact status is `aria-live="polite"`.
- Hit targets are 44px or more: pills, round buttons, the send button.
- The no-JS fallback in `index.html` shows the headline, the summary and the contact links.

## 7. Print

The "Résumé" button (or Ctrl+P) gives a one-page black-on-white résumé with:

- the name, role and contacts
- the summary
- each case study's full text
- roles and education with dates
- skills

All artwork, the contact section and the nav are hidden.

## 8. Waiting on Pramod

These would bring the page closer to the reference's warmth, and none can be invented:

- a portrait or photo (the About arch could hold it)
- a personal line or two: what he enjoys about data work, a hobby
- details for "Read the case": constraints, decisions, before/after numbers
- what the Blue Box Award was given for
