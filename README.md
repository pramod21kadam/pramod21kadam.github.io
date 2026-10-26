# Pramod Kadam — Data Engineer Portfolio

A fast, accessible, single-page portfolio built with plain HTML, CSS and vanilla JavaScript.
No build step, no frameworks, no external requests, no tracking — designed for GitHub Pages.

The page is styled like an Apple product page. At the top is an intro strip a recruiter can scan in
seconds, followed by a band of key figures. Below that are your roles with the actual work shown as
case-study tiles, then skills, education and contact.

## Structure

```
.
├── content.js     # ← ALL page content: profile, intro strip, roles, case studies, sections
├── script.js      # Renderer: builds the page from content.js (no need to edit)
├── index.html     # Page shell, <head> metadata (SEO / social preview), no-JS fallback
├── style.css      # Design tokens, light/dark theme, layout, print résumé
├── CONTEXT.md     # Glossary: intro strip, role, level, case study, recognition
├── favicon.svg    # Site icon
├── assets/
│   └── og-image.png   # 1200×630 link-preview image (LinkedIn, WhatsApp, X …)
├── tools/
│   └── og-image.html  # Source for og-image.png (see "Share preview image")
├── 404.html       # Custom not-found page (served by GitHub Pages)
├── .nojekyll      # Tells GitHub Pages to serve files as-is (skip Jekyll)
└── README.md
```

## Editing content

Open **`content.js`**. Everything you see on the page comes from the `SITE` object there.
The comment block at the top of the file documents every field.

Only write what you can defend in an interview: real scale, real problems, real results.
A specific sentence beats a long generic one.

### Years of experience

`profile.careerStart` (`"2021-08-19"`) drives the `{years}` placeholder, which is recalculated
from today's date on every page load (completed years). To freeze the count at a date, set
`profile.careerEnd` (`"YYYY-MM-DD"`); leave it `null` to count up to today.

### Change jobs

1. Update `profile.title` and `profile.employer` (shown in the intro strip).
2. Set the old role's `period` end date, and add the new role at the **top** of the
   `experience` section's `items`:

   ```js
   {
     title: "Data Engineer",
     org: "Company Name",
     level: "Internal grade",          // optional, shown as "<level> level"
     period: "Jan 2027 – Present",
     caseStudies: [],
   },
   ```

3. Update `<title>`, the description and social tags and the JSON-LD in `index.html`, the no-JS
   fallback text there, and `tools/og-image.html` (then regenerate the PNG).

### Key figures

`intro.figures` is the band of big numbers under the intro: `{ value: "~30", label: "..." }`.
Keep it to four, keep values short (they sit in four columns), and only use confirmed facts.

### Add a case study

Add to a role's `caseStudies`. `scale` is the one-line size of the work; `body` is the problem,
what you did and the result:

```js
{
  title: "What the system or project was",
  scale: "~30 jobs · tables of ~500 GB",
  body: "One to three sentences: problem, what you did, result.",
  stack: ["Spark", "BigQuery"],
},
```

### Add an award

Add to a role's `recognition`: `{ name: "Award", year: "2026", note: "what it was for" }`.

### Add a skill

Add a string to a group's `items` in the `skills` section, or add a `{ name, items }` group.

### Add a contact link

Add to `profile.links`; it appears in the intro strip and the contact section:

```js
{ label: "Twitter", url: "https://x.com/handle", display: "@handle" },
```

### Add a new section

Add an object to `sections` in the position you want it to appear. The navigation link is
generated automatically. Built-in types:

| `type`     | Fields                                                                    | Good for                     |
|------------|---------------------------------------------------------------------------|------------------------------|
| `text`     | `paragraphs: ["..."]`                                                     | A short note                 |
| `tags`     | `groups: [{ name, items: [] }]` (grouped list)                            | Skills, Tools                |
| `timeline` | `items: [{ title, org, level, period, caseStudies, recognition, notes }]` | Experience, Education        |
| `contact`  | `intro`                                                                   | Contact (uses `profile.links`) |

Other section options: `nav: false` keeps it out of the top menu; `hidden: true` hides it without
deleting it. To support a brand-new layout, add a function to the `renderers` object in
`script.js` and use its name as the `type`.

### Theme and metadata

- Colours live in `style.css`: light tokens in `:root`, dark tokens below it. Dark colours appear
  twice (system-dark block and `[data-theme="dark"]` block) — keep them in sync. There is one
  accent colour (`--accent`, link blue). Tiles use `--tile`; the Skills and Contact bands use
  `--bg-alt`.
- Content fades up gently as it scrolls into view (`.reveal`). It is off when the OS asks for
  reduced motion.
- **Data-flow animation:** under the intro, raw records drift into a transform stage, leave as
  evenly spaced rows, and are stored in a warehouse cylinder that glows as rows arrive. The four
  captions are `intro.flow.stages` in `content.js` (the middle two hide on narrow phones); delete
  `intro.flow` to remove the animation. It pauses off-screen and shows a still frame for reduced
  motion.
- **Background:** the intro has a faint dot grid and a soft glow (`--dot`, `--glow` tokens).
- Key figures under 1000 count up when they scroll into view; years are left as they are.
- **Theme toggle:** the sun/moon button in the nav switches light/dark and remembers the choice in
  the visitor's browser. With no saved choice the site follows the system setting.
- Search/social metadata (title, description, canonical URL, JSON-LD) lives in the `<head>` of
  `index.html`, with a small no-JavaScript fallback inside `<main>`. It is not generated from
  `content.js` — update it by hand when your title or employer changes.

### Print / Save as PDF

Printing the page (Ctrl/Cmd + P → *Save as PDF*) produces a one-page black-on-white résumé. The
navigation, key figures and tile styling are dropped, and the contact details move up under your
name. Print styles are the `@media print` block at the end of `style.css`.

### Share preview image

`assets/og-image.png` is what LinkedIn, WhatsApp, X and others show when the URL is shared. Its
source is `tools/og-image.html`; edit that, then regenerate the PNG with Chrome. Chrome needs
**absolute** paths here — a relative `--screenshot` path fails silently:

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --screenshot="D:/workspace/pramod21kadam.github.io/assets/og-image.png" "file:///D:/workspace/pramod21kadam.github.io/tools/og-image.html"
```

LinkedIn caches previews; after changing the image, refresh it with LinkedIn's Post Inspector.

## Run locally

Opening `index.html` directly in a browser works. For behaviour closer to GitHub Pages, serve the
folder over HTTP:

```bash
python -m http.server 8765
```

Then visit <http://localhost:8765>. Python's server does not serve `404.html` for missing paths;
open `/404.html` directly to check it.

## Deploy to GitHub Pages

### User site (`https://<username>.github.io/`)

1. On GitHub, create a **public** repository named exactly `<username>.github.io`.
2. Push this folder to its `main` branch.
3. In the repository go to **Settings → Pages**. Under *Build and deployment*, choose
   **Source: Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. Wait for the *pages build and deployment* workflow in the **Actions** tab to finish (usually
   under a minute), then open `https://<username>.github.io/`.

### Project site (`https://<username>.github.io/<repo>/`)

Same steps with any repository name. `index.html` uses relative asset paths, so it works under a
sub-path. `404.html` uses root-absolute paths (`/style.css`) because GitHub serves it for any missing
URL at any depth — for a project site, change those to `/<repo>/style.css` and `/<repo>/`.

### Custom domain (optional)

Add the domain in **Settings → Pages → Custom domain** (this creates a `CNAME` file), configure DNS
as described in GitHub's documentation, and enable **Enforce HTTPS**. Update the canonical and
`og:url` tags to match.

## Verify a deployment

After the Pages workflow succeeds:

- [ ] The live URL loads with styles and the favicon.
- [ ] Browser DevTools console shows no errors; Network tab shows no 404s.
- [ ] Navigation links scroll to each section; the mobile menu opens and closes (also with `Esc`).
- [ ] A made-up path (e.g. `/does-not-exist`) shows the custom 404 page.
- [ ] Print preview shows the résumé layout.
- [ ] Social preview tags look right (paste the URL into a link-preview checker).

## Accessibility & privacy notes

- Semantic landmarks, skip link, visible focus styles, `aria-expanded` menu, keyboard `Esc` support.
- The scroll fade-in, count-up, data-flow animation and smooth scrolling are disabled when the OS
  requests reduced motion; the data-flow canvas then shows a still frame.
- No analytics, cookies, third-party scripts, fonts or API keys. Keep it that way unless you
  deliberately add something — and never commit secrets to a Pages repository (it is public).
