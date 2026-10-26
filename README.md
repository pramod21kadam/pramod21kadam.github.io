# Pramod Kadam — Data Engineer Portfolio

A fast, accessible, single-page portfolio built with plain HTML, CSS and vanilla JavaScript.
No build step, no frameworks, no external requests, no tracking — designed for GitHub Pages.

## Structure

```
.
├── content.js     # ← ALL page content: profile, hero, skills, projects, experience, sections
├── script.js      # Renderer: builds the page from content.js (no need to edit)
├── index.html     # Page shell, <head> metadata (SEO / social preview), no-JS fallback
├── style.css      # Design tokens, theme, layout, reduced-motion handling
├── favicon.svg    # Site icon
├── 404.html       # Custom not-found page (served by GitHub Pages)
├── .nojekyll      # Tells GitHub Pages to serve files as-is (skip Jekyll)
└── README.md
```

## Editing content

Open **`content.js`**. Everything you see on the page comes from the `SITE` object there.
The comment block at the top of the file documents every field.

### Years of experience

`profile.careerStart` (`"2021-08-19"`) drives the `{years}` placeholder, which is recalculated
from today's date on every page load (completed years). Use `{years}` in any text, e.g.
`"{years}+ years of experience"`. To freeze the count at a date, set `profile.careerEnd`
(`"YYYY-MM-DD"`); leave it `null` to count up to today.

### Add a skill

Find the `skills` section and add a string to a group's `items`:

```js
{ name: "Cloud · GCP", items: ["BigQuery", "Cloud Storage", "Cloud Functions", "Dataproc", "Pub/Sub"] },
```

Add a whole new group by adding another `{ name, items }` object to `groups`.

### Add a job

Add an entry at the **top** of the `experience` section's `items` (most recent first):

```js
{
  title: "Data Engineer",
  org: "Company Name",
  period: "Jan 2026 – Present",
  points: [
    "What you were responsible for.",
    "A system or project you worked on.",
  ],
},
```

### Add a project

Add to the `projects` section's `items`. `featured: true` shows it as a large glass card;
otherwise it appears in the compact list under `moreTitle` ("Personal projects").
`links` can be empty or hold several links:

```js
{
  title: "Project name",
  label: "Personal",                 // or "Work · Company"
  featured: false,
  summary: "One or two sentences.",
  tags: ["Python", "Airflow"],
  links: [{ label: "Source", url: "https://github.com/pramod21kadam/repo" }],
},
```

### Add a contact link

Add to `profile.links`:

```js
{ label: "Twitter", url: "https://x.com/handle", display: "@handle" },
```

### Add a new section

Add an object to `sections` in the position you want it to appear. The navigation link is
generated automatically. Pick one of the built-in types:

| `type`     | Fields                                                              | Good for                         |
|------------|---------------------------------------------------------------------|----------------------------------|
| `text`     | `paragraphs: ["..."]`                                               | About, Currently learning        |
| `tags`     | `groups: [{ name, items: [] }]` (grouped list)                      | Skills, Certifications, Tools    |
| `cards`    | `items: [{ title, label, summary, tags, links, featured }]`, `moreTitle` | Projects, Talks, Articles   |
| `timeline` | `items: [{ title, org, period, points }]`                           | Experience, Education, Awards    |
| `contact`  | `intro`                                                             | Contact (uses `profile.links`)   |

Example — a certifications section:

```js
{
  id: "certifications",          // unique, used as the #anchor
  title: "Certifications",
  type: "timeline",
  items: [
    { title: "Certification name", org: "Issuer", period: "2026", points: [] },
  ],
},
```

Other section options: `nav: false` keeps it out of the top menu; `hidden: true` hides it without
deleting it. To support a brand-new layout, add a function to the `renderers` object in
`script.js` and use its name as the `type`.

### Theme and metadata

- The site follows the visitor's system **light / dark** setting. Colours live in `style.css`:
  light tokens in `:root`, dark tokens in the `prefers-color-scheme: dark` block right below it
  (`--accent`, `--flow` for pipeline dots, `--blob-*` for the backdrop colours).
- The frosted "liquid glass" look is the `.glass` class (blur, edge highlight, sheen). Add it to any
  element to make it a glass panel. Glass becomes solid when the OS asks for reduced transparency
  or the browser lacks `backdrop-filter`.
- The hero glass panel is configured in `content.js` (`hero.panelLabel`, `hero.pipeline`,
  `hero.facts`).
- Search/social metadata (title, description, canonical URL, JSON-LD) lives in the `<head>` of
  `index.html` — update it if your name, URL or headline changes. The small no-JavaScript
  fallback inside `<main>` is there too.

Only include facts you can stand behind.

## Run locally

Opening `index.html` directly in a browser works. For behaviour identical to GitHub Pages
(including `404.html`), serve the folder over HTTP:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>. Alternatively: `npx serve .`

## Deploy to GitHub Pages

### User site (`https://<username>.github.io/`)

1. On GitHub, create a **public** repository named exactly `<username>.github.io`.
2. From this folder:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<username>/<username>.github.io.git
   git push -u origin main
   ```

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
- [ ] Lighthouse (DevTools → Lighthouse) for Performance, Accessibility, Best Practices and SEO.
- [ ] Social preview tags look right (paste the URL into a link-preview checker).

## Accessibility & privacy notes

- Semantic landmarks, skip link, visible focus styles, `aria-expanded` menu, keyboard `Esc` support.
- Animations (section reveal, pipeline flow, backdrop drift) are disabled when the OS requests
  reduced motion.
- No analytics, cookies, third-party scripts, fonts or API keys. Keep it that way unless you
  deliberately add something — and never commit secrets to a Pages repository (it is public).
