# Harriet Wang — Portfolio

Plain HTML/CSS/JS portfolio site. No build step, no framework, no npm install —
open `index.html` in a browser (or run any static file server) and it works.

## Structure

```
index.html                 Homepage
pages/about.html            About page
pages/*.html                6 case-study pages
css/style.css               All styles (single file, organized in labeled sections)
js/main.js                  All behavior (single file, one function per feature)
js/projects-data.js         ★ Single source of truth for every project card — see below
img/                        Photos, icons, decorative illustrations
favicon.ico, robots.txt, sitemap.xml   Root-level SEO/browser files
```

## Adding or editing a project

This is the thing to know: **you only ever edit `js/projects-data.js`.**

Every project card — on the homepage grid AND in the "More work" carousel at the
bottom of every other case-study page — is rendered at runtime from the `PROJECTS`
array in that one file. Nothing is hardcoded per-page anymore.

To add a project:
1. Copy one of the existing objects in `js/projects-data.js` and edit the fields
   (the field guide is in that file's header comment).
2. If it has a full case-study page, duplicate an existing page in `pages/` as a
   starting template, save it under a new filename, and point `href` at that filename.
   Set `<body data-project-id="your-new-id">` in that new file to match the `id`
   you used in the data file (this is what lets "More work" correctly exclude a
   project from its own carousel).
3. Save. That's it — the homepage grid and every other page's "More work" row pick
   it up automatically on next page load.

To remove a project, delete its object from the array. To reorder, reorder the array.

## Project images — migrated off Squarespace

All project screenshots used to be hardcoded links to Squarespace's CDN
(`images.squarespace-cdn.com`). They're now organized locally instead:

```
img/projects/app-integration/
img/projects/doc-auto-import/
img/projects/route-year-in-review/
```

**One-time step to actually get the files**: run
```bash
python3 scripts/download-squarespace-images.py
```
from the repo root. No dependencies to install — it's plain Python standard
library. It downloads all 21 images and places each one at the exact local
path the site already expects (every HTML page and `projects-data.js` were
updated to point at these local paths already). Safe to re-run — it skips
anything already downloaded.

Until that script has been run once, these images will show as broken —
that's expected, not a bug. The repo ships with the folder structure and all
the code wired up, just not the actual image bytes (this Claude session's
sandbox couldn't reach Squarespace's CDN to fetch them directly).

## Editing everything else

- **Copy/content**: just edit the HTML directly, it's plain text in context.
- **Colors, fonts, spacing**: `css/style.css` — design tokens (colors, fonts, radius)
  are CSS variables at the top of the file under `:root`. Change them once, they
  cascade everywhere.
- **Interactive behavior** (custom cursor, Clippy, nav scroll, hero glow, card
  hover transitions, the project carousel): `js/main.js`, one clearly-named
  `initX()` function per feature, all wired up at the bottom in a single
  `DOMContentLoaded` listener.

## Known trade-off worth knowing about

Because there's no build step, project cards are rendered **client-side** — the
raw HTML you'd see in "view source" doesn't contain the card content, JavaScript
writes it in after the page loads. Google/Bing do execute JavaScript when indexing
pages today, so this isn't a dealbreaker, but it's not as robust for SEO as
plain static HTML, and it means the content briefly "pops in" for anyone with a
slow connection or JS disabled. If search ranking on the case studies becomes a
priority, the fix is to introduce a lightweight static site generator (11ty,
Astro) that reads the same `projects-data.js`-style file at *build time* and
outputs plain HTML — same editing workflow, better SEO. Not necessary today.

## Before going live: things with "your-domain-here.com" in them

Search the repo for `your-domain-here.com` — it appears in `robots.txt`,
`sitemap.xml`, and the `<link rel="canonical">` / Open Graph tags in every page's
`<head>`. Replace all of them with your real domain once you have one. Everything
else (favicons, images, internal links) uses relative paths and needs no changes.

## Accessibility & SEO — what's already handled

- Every page has one `<h1>`, a logical heading hierarchy below it, and a `<main>`
  landmark around the primary content.
- Color palette checked against WCAG AA contrast (4.5:1 for body text, 3:1 for
  large text/UI). The one color that didn't pass at small sizes (the orange) has
  a darker AA-safe variant (`--orange-text`) used anywhere it appears as running text.
- Keyboard users get a visible, on-brand focus ring (`:focus-visible`) on every
  interactive element — it doesn't show on mouse clicks, only keyboard nav.
- The custom cursor gracefully degrades: if `main.js` fails to load for any reason,
  people keep a normal system cursor instead of losing it entirely.
- Every image has an `alt` attribute (empty/decorative where appropriate, descriptive
  where the image is content).
- Meta description, canonical URL, Open Graph + Twitter Card tags, and favicons are
  set on every page.

## What's NOT done yet (see the "going to production" checklist you asked about)

Analytics, a real domain, and GitHub/hosting setup are account-level steps I can't
do from inside this session — see the write-up in chat for exactly what to do and
in what order.
