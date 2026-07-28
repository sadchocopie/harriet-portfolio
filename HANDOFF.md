# Handoff notes — Harriet Wang portfolio rebuild

Everything below is a record of what's been done so far, in order, so a new chat
can pick up without re-explaining context. This is a plain HTML/CSS/JS site,
no build step, no framework.

---

## 1. Visual redesign — "y2k brutalist"

Rebuilt the whole site from the original vanilla-JS portfolio into a new visual
language, referencing user-provided artboard mockups:
- **Fonts**: Ibarra Real Nova (serif display/headings), Inter (body text), a
  system `SF Mono` stack with DM Mono fallback (mono/labels/nav) — loaded via
  Google Fonts `@import` in `css/style.css`.
- **Palette**: cream background, near-black ink, blue accent (`#0D29BB`), orange
  accent (`#DF5B01`, plus a darker `#B84600` "text-safe" variant used anywhere
  the orange appears as small running text, since the bright orange fails WCAG
  AA contrast at small sizes).
- **Brutalist styling**: zero border-radius, hairline/1.5px borders, hard-edge
  hover states — EXCEPT the floating pill nav and CTA buttons, which stay
  fully rounded on purpose.
- Nav: a static, non-floating brand mark (two clover icons + dash) sits above
  everything and scrolls away normally; below it, a separate sticky nav
  containing "Harriet Wang" + a small "curious human" tagline (orange,
  AA-safe shade) on the left, heart-bulleted links on the right. The nav lifts
  into a blurred glass pill once you scroll — the brand mark does NOT
  participate in that, by design.
- Custom cursor (dark arrow + text label), Clippy (draggable Win95-style
  assistant, bottom-right, 35px), and cursor-tracked radial glow on the hero
  headline (random pastel color per hover, from a palette of 7) were all kept
  from the original site and re-skinned/adjusted along the way.
- Decorative illustration assets (blossom, butterfly, dandelion, lemon,
  berry-leaf, clover marks, hearts) are all in `img/`, sourced from
  user-provided artboard exports.

## 2. Content/architecture fixes

- **Centralized project data**: `js/projects-data.js` is now the single source
  of truth for every project card. `main.js` renders the homepage "Selected
  work" grid AND every case-study page's "More work" carousel from that one
  array at runtime — adding/editing/removing a project only ever touches that
  one file. Documented in the file's own header comment and in `README.md`.
- Fixed 3 case-study pages that had raw filename slugs as their `<title>`
  (e.g. "connection-reuse — Harriet Wang") instead of readable titles.
- Fixed the "next project" link at the bottom of every case-study page — the
  big headline text wasn't actually a link before; now it is.
- Homepage project grid: plain 2-column grid (decided against a homepage
  carousel for mobile-accessibility reasons — carousel treatment is reserved
  for the "More work" rows on case-study pages only).
- About page: added a real photo (see #3), added a "Life outside work"
  Instagram-style photo grid (3 square cells, hover shows a caption via the
  custom cursor tooltip — same mechanism project cards use). An alternate
  swipeable-carousel version of this section was built, compared, and then
  **removed** — the grid version won.
- Generalized two systems that were previously hardcoded/singleton:
  - The cursor-tooltip mechanism now triggers off any element with a
    `data-cursor` attribute (was hardcoded to `.project-card` only).
  - The carousel wiring (arrows, click-to-jump progress bar) now scopes to
    each `.project-carousel` container independently via class, instead of
    relying on page-global element IDs — so a page can have more than one
    carousel safely (this mattered once the about-page photo carousel
    existed; it's since been removed, but the more-robust code stayed).

## 3. Real photo

Cropped/resized the user's uploaded Venice photo to a 1000×1333 vertical
portrait (`img/harriet.jpg`), used on both the homepage hero and the about
page, with `object-position` tuned so the face frames well in both the
near-square hero box and the 4:5 about-page box.

## 4. Accessibility & SEO hygiene pass

- Every "section label" (Selected work / Experience / About / What I do /
  Outside work / More work) was a `<p>`, invisible to screen-reader heading
  navigation — promoted all of them to real `<h2>`s, demoted project-card
  titles to `<h3>` to nest correctly. Every page now has exactly one `<h1>`
  and a clean, unbroken heading hierarchy.
- Wrapped every page's primary content in a `<main>` landmark.
- Added `:focus-visible` styles (on-brand outline, keyboard-only, doesn't
  interfere with the custom cursor).
- Fixed a real robustness bug: `cursor: none` was applied unconditionally in
  CSS — if `main.js` ever failed to load, desktop users would lose their
  cursor entirely with no fallback. Now gated behind a `.has-custom-cursor`
  class that JS only adds once the custom cursor actually initializes.
- Added unique meta descriptions, canonical URLs, full Open Graph + Twitter
  Card tags (with a generated 1200×630 preview image), and
  favicon/apple-touch-icon (generated from the clover mark) to all 8 pages.
- Added `robots.txt` and `sitemap.xml` at the repo root.
- Confirmed every `<img>` has an `alt` attribute (empty for decorative,
  descriptive for content).

**Known trade-off, not yet resolved**: project cards render client-side (JS
writes them into the page after load) rather than being present in the raw
HTML. Fine for Google/Bing (they execute JS when indexing), not as robust as
static HTML. Documented in `README.md`. If it ever matters, the fix is
migrating to a lightweight static-site generator (11ty or Astro) that reads
the same data-file structure at *build* time instead of runtime — not
necessary today.

## 5. Route Year in Review — video-over-image treatment

On the "Origami prototyping" image specifically: kept the static image as a
back layer, added an autoplay/looped/muted video framed on top of it — 80%
of the image's height, positioned starting 20% in from the left (verified
both numbers render exactly right). Currently pointing at a small public
placeholder video; **user said they'd provide their own local video file to
swap in** — that hasn't happened yet. To swap it: replace the `<source src=...>`
in `pages/route-year-in-review.html` with the real file path. Position/size
are controlled by 3 CSS custom properties (`--frame-w`, `--frame-h`,
`--frame-left`) on `.project-img__video-frame` in `style.css` if it needs
nudging once the real photo/video are both in place (I built this without
being able to see the actual source image, since it's hosted on a domain my
sandbox can't reach — worth a visual sanity check once live).

## 6. Styling reverts / adjustments along the way

- Tried adding `border-radius: 20px` + soft diffused shadow to all
  `.project-img` elements (removing the black hairline border) — **user
  didn't like it, reverted to the original square/black-border/no-shadow
  treatment.** Current state: `.project-img { border-radius: 0; border: 1.5px
  solid var(--ink); box-shadow: none; }`.
- Clippy fixes (latest): the dialogue bubble was rotating along with Clippy's
  idle swing animation because the animation was applied to the whole
  `#clippy` wrapper (which contains both the character graphic AND the
  bubble as children). Fixed by moving the swing animation to target only
  `.c-composite` (the character graphic) — the bubble is a sibling and now
  stays upright regardless of swinging. Also removed the literal word
  "Clippy" from the dialogue's titlebar (just shows the 📎 icon now), and
  reduced the dialogue's main text weight from 700 to 500 (less bold).

## 7. Deployment planning (discussed, not yet executed)

Agreed plan:
- **GitHub** — code hosting + version control (free)
- **Netlify** — hosting, auto-deploy on push, custom domain + free SSL (free tier)
- **Cloudflare Web Analytics** — visit tracking, no cookie banner needed (free)
- **Domain registrar** — the only recurring cost (~$10–20/yr; Cloudflare
  Registrar sells at-cost, worth considering)

Drafted `netlify.toml` (static publish, no build command, security headers,
long-cache for `/css` `/js` `/img`, short-cache for HTML, commented-out
pretty-URL redirects and 404 page hooks for later).

Full step-by-step was written out in chat (push to GitHub → connect Netlify →
buy domain → point DNS → replace `your-domain-here.com` placeholder
everywhere → add Cloudflare Web Analytics snippet → verify). **Not yet done
by the user.**

---

## Open items / next steps for the new chat

1. **Domain placeholder**: `your-domain-here.com` still appears in
   `robots.txt`, `sitemap.xml`, and the canonical/OG tags on all 8 pages —
   needs a global find-and-replace once a real domain exists.
2. ~~Real video file~~ — **done.** User's own footage
   (`YIR2022_FirstScreenExample.mov`) converted to a web-friendly, audio-stripped
   `.mp4` (`img/projects/route-year-in-review/video/yir-2022-first-screen.mp4`,
   ~334KB) and wired into `pages/route-year-in-review.html`. Frame position was
   re-derived from scratch by contour-detecting the actual phone screen's pixel
   bounds in `prototyping.png` (OpenCV, cross-checked with tight crops) rather
   than the earlier eyeballed guess — new values: `--frame-left: 14%`,
   `--frame-top: 17.5%`, `--frame-w: 17.7%`, `--frame-h: 67.5%` in `style.css`.
   Verified with a headless-browser screenshot that the frame's edges land
   exactly on the phone's screen bezel with no bleed. The old
   `@media (max-width: 640px)` override that widened the frame on mobile was
   removed — no longer needed since the frame is now sized to the actual screen
   and scales proportionally with the image at any width.
3. **Cloudflare Web Analytics snippet** — not added yet, waiting on the user
   to actually create the Cloudflare property and hand over the script tag.
4. **GitHub repo / Netlify site / domain purchase** — none of this has
   actually been done yet, just planned. First real action item.
5. ~~Resume link~~ — **done.** User's resume PDF added at
   `files/Harriet-Wang-Resume.pdf`; all 10 nav + footer "Resume" links across
   all 8 pages (previously `href="#"`) now point to it.
6. **Squarespace images**: all 21 project screenshots have been migrated off
   `images.squarespace-cdn.com` — organized into `img/projects/{project-name}/`,
   all HTML/data-file references updated to point there. **Update: the images
   are now actually present locally** (confirmed while working on the video
   overlay task) — `scripts/download-squarespace-images.py` either was run
   already or the files were included directly; either way, nothing broken here
   anymore. IDX Connection Reuse and IDX Smart Account Linking still use
   text-placeholder thumbnails (no Squarespace image ever existed for those)
   and remain a separate, unrelated to-do.
7. Nothing else is currently mid-flight or half-finished — every request in
   this session was completed and verified (tag balance, JS/CSS syntax,
   headless-browser render + interaction tests) before moving on.


Current delivered zip: **harriet-portfolio-v30.zip**
