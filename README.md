# Harriet Wang — Portfolio

Plain HTML/CSS/JS portfolio site. 
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


## Project images — migrated off Squarespace

All project screenshots used to be hardcoded links to Squarespace's CDN
(`images.squarespace-cdn.com`). They're now organized locally instead.

## TODO

Analytics.
