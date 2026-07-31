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
4. **GitHub repo** — **done.** Private repo `harriet-portfolio` created and
   pushed successfully; confirmed via `git remote -v` / `git status` and a
   clean `git push`. **Netlify site / domain DNS** — not done yet, paused
   right at "Add new site → Import an existing project → GitHub" on Netlify's
   side. Confirmed with the user: **Netlify over GitHub Pages** is the right
   call here specifically because (a) GitHub Pages requires a paid Pro plan to
   publish from a private repo on a personal account, and (b) even on Pro, a
   Pages site is always public regardless of source-repo visibility — it
   doesn't solve "not ready to be public yet" at all. Netlify's `_headers` /
   custom gate approaches (see #8 below) work regardless of plan.
5. ~~Resume link~~ — **done.** User's resume PDF added at
   `files/Harriet-Wang-Resume.pdf`; all 10 nav + footer "Resume" links across
   all 8 pages (previously `href="#"`) now point to it.
6. **Squarespace images**: all 21 original project screenshots migrated off
   `images.squarespace-cdn.com`, present locally, confirmed by the user
   visually. **New**: 5 more added to the manifest for the new Design at Route
   page (see #9) — these have NOT been downloaded yet (sandbox has no network
   access to Squarespace's CDN at all, confirmed via direct curl test:
   `host_not_allowed`). User needs to run
   `python3 scripts/download-squarespace-images.py` once on a machine with
   normal internet access — safe to re-run, skips the 21 already-present files
   and only fetches the 5 new ones. Until then, `design-at-route.html`'s 5
   `<img>` tags will show broken locally — expected, not a bug.
7. Site-wide password/access-control system built out (see #8) and a new
   archived-project system (see #9) — both fresh this session, both verified
   with headless-browser tests (redirect behavior, wrong/right passcode, DOM
   contents of homepage grid + More Work carousels, direct-URL reachability of
   archived pages).

8. **Password/access-control system**:
   - `_headers` at repo root — Netlify-native Basic Auth, currently just a
     documented template with no active rule (kept for future use on some
     *other* page if wanted).
   - `pages/connection-reuse-gate.html` — a custom on-brand, single-field
     (passcode only, no username) client-side gate specifically for Connection
     Reuse, since the user didn't want a username field at all. Passcode is
     `IDX`. A synchronous guard script at the top of
     `pages/connection-reuse.html`'s `<head>` redirects any direct visit to the
     gate unless `sessionStorage['cr_unlocked'] === 'true'`; correct passcode
     sets that flag and redirects through. Wrong passcode shows an inline error
     + shake animation, no navigation. This is explicitly **not real security**
     (passcode sits in plaintext in the page source) — a friction-reducer for a
     shared preview link, documented as such in both files' comments.
   - Gate styling lives in `css/style.css` under the `PASSWORD GATE` section
     comment near the end of the file (`.gate-*` classes), built from the
     site's existing CSS variables (fonts/colors) so it matches the brand.

9. **Archived-projects system** (new, general-purpose, not just for these 3):
   `js/projects-data.js` entries can now carry `archived: true` — see the
   field-guide comment at the top of that file. An archived project's page
   still exists and is fully reachable by direct link, but `main.js`'s
   `renderProjectGrid()` and `renderMoreWork()` (in `js/main.js`) both now
   filter `!p.archived` before rendering, so it disappears from the homepage
   grid AND from every other project's "More work" carousel simultaneously —
   one flag, no per-page editing needed. Currently applied to `connection-reuse`,
   `smart-account-linking`, and `locale-hackathon` per the user's request (they
   want to keep developing these before making them public). Also added
   `<meta name="robots" content="noindex, nofollow"/>` to those 3 pages' `<head>`
   and removed them from `sitemap.xml`, so search engines won't surface them
   either. To un-archive later: delete the `archived: true` line, remove the
   `noindex` meta tag, re-add the sitemap entry — that's it.

10. **New page — Product Design at Route** (`pages/design-at-route.html`):
    ported over from the user's original Squarespace page at
    `harrietwang.com/designatroute`. Content adapted (not copy-pasted
    verbatim) to match this site's case-study template/tone — hero, 4 sections
    (Onboarding, Checkout, Add Card, Year in Review), stats row, More Work
    carousel, footer. The Year in Review section links out to the existing
    dedicated `route-year-in-review.html` case study rather than duplicating
    that narrative. Added to `js/projects-data.js` (not archived — shows on
    homepage) and to `sitemap.xml`. Its 5 images are in the download-script
    manifest but not yet fetched — see #6.

11. **Homepage hero copy rewritten** (`index.html`): combined the user's new
    bio lines ("banking and app connection platform team", "6 years... B2C...
    enterprise platforms... growth startups") with the existing headline into
    a more concise, scannable version. **Intuit** and **Route** are now both
    real links (`intuit.com`, `route.com`) since a reader unfamiliar with
    either company previously had no way to learn more. New `.link-inline`
    CSS class added (underlined, accent-color, no button styling) since no
    inline-body-text link style existed yet.

12. **"Currently leading" banner removed** from the homepage entirely (was
    `.wip-banner` — the IDX Developer Portal callout above the project grid).

13. **Homepage project grid simplified to a plain, uniform 2-col grid**
    (1-col on mobile, unchanged). Removed the `.project-card--star` full-width
    "featured" row-layout override that applied when a project had `star:
    true` in `projects-data.js` — user didn't like the mixed-size layout.
    The `star` flag still exists in the data file and still drives the
    "★ Featured" tag text and a wider card in the "More work" *carousel*
    specifically — only the homepage **grid** treatment changed. Verified via
    Playwright that all 4 homepage cards now render at identical widths, both
    desktop (500px) and mobile (350px) viewports.

14. **Two images directly replaced** with user-provided, already-retouched
    versions (same filenames, same usage sites, no code changes needed):
    - `img/harriet.jpg` (used on homepage hero + about page) — new version has
      a stray hair fixed.
    - `img/projects/route-year-in-review/prototyping.png` — new version has
      no rounded corner. **Important**: before replacing, re-ran the same
      OpenCV contour-detection used originally to position the video overlay
      (see #2) against the NEW image — confirmed it's the exact same
      composition just exported at higher resolution (7680×4320 vs
      2500×1406, identical aspect ratio, phone screen contour landed at the
      same percentages: 13.97/17.52/17.47/67.45 vs the original 14/17.5/17.7/
      67.5). No CSS changes needed; just dropped the resized replacement in.

15. **About page overhaul**:
    - Removed the ferris-wheel photo section (`.about-photo`, `ferris-wheel.png`)
      entirely.
    - About-hero photo replaced with `img/more-harriet.jpg` (new user upload),
      restructured from a plain `<div><img></div>` into an
      `.about-hero__photo-outer` wrapper (mirrors the homepage hero photo
      pattern) so it can carry floating decorative stickers. User's Kirby
      plushie photo and Sims "Plumbob" diamond icon are now those floating
      decos (`img/kirby.png`, `img/plumbob.png`) — both source uploads already
      had clean alpha transparency (confirmed via ImageMagick pixel check
      before using them, no cutout/background-removal work needed).
    - The "Life outside work" Instagram-style grid (previously 3 placeholder
      cells with fake captions like "SDXD talk") now has **7 real photos**:
      `img/lifestyle/{park,my-cat,sdcc,musicals,baking,fun,img-4380}.jpg`. 6 of
      the 7 source files were HEIC (converted via ImageMagick, which handles
      HEIC natively — no extra library needed) and metadata-stripped after
      one (`img-4380.jpg`) initially failed to decode in Chrome for an
      unrelated reason (see caveat below).
    - **Caveat the user should double check**: only 2 of the 7 lifestyle
      photos were visually confirmed by Claude directly (the ones shown
      inline in the chat message: the Japanese garden photo → `park.jpg`, and
      the "more_harriet" photo used for the hero). The other 6 (converted from
      HEIC) were captioned **from filename alone** — `sdcc.jpg` → "San Diego
      Comic-Con", `musicals.jpg` → "Catching a musical", `baking.jpg` →
      "Weekend baking project", `my-cat.jpg` → "My cat", `fun.jpg` → generic
      "Good times" (filename gave no real signal), `img-4380.jpg` → generic
      "A moment I liked" (zero filename signal — user should replace this
      caption with what it actually is). Captions live as `data-cursor`
      attributes on each `.ig-cell` in `pages/about.html`.
    - Debugged an apparent broken-image issue on `img-4380.jpg` (loaded as
      0×0 in automated checks) — turned out to be normal `loading="lazy"`
      behavior (that photo is alone in the grid's last row, just past the
      browser's lazy-load prefetch distance in a headless test that doesn't
      scroll) rather than a real bug. Confirmed by explicitly scrolling it
      into view in a Playwright check — loads correctly. No fix needed, just
      worth knowing this is expected and not something to "fix" later.

16. **Design at Route — cover + supporting images swapped in** (user follow-up):
    the placeholder hero-cover image (still pending Squarespace download,
    never actually fetched) was wrong — replaced entirely with a
    user-uploaded `cover.jpg` (now the homepage card thumbnail; the old
    `hero-cover.png` Squarespace URL was removed from
    `download-squarespace-images.py`'s manifest, not just left in place).
    Two more user-uploaded images were woven into the article itself rather
    than just saved on the side: `boxes-tracking.png` (Route app + shipped
    packages) is now a new "Overview" section/lead visual at the very top of
    the page (added to the sidebar TOC too), and `package-protection.png`
    (Route's Package Protection checkout add-on) was added into the existing
    Checkout section, with that section's body copy updated to explicitly
    mention Package Protection since it's now shown. Verified all three new
    images decode correctly in a headless-browser check (not just
    present-on-disk). The other 4 Design at Route images (onboarding/
    checkout/add-card/year-in-review) are still pending the Squarespace
    download script — only the cover was user-replaced, not those.

17. **App Integration + Document Auto Import cover images replaced** with
    user-uploaded versions (`hero-mc-showcase.png`, `hero-multi-channel.png`)
    — same filenames as before, direct swap, no other files needed to
    change. Each is used in 2 places (homepage thumbnail + case-study page
    lead image) — verified all 4 spots load correctly.

18. **About page simplified significantly** at the user's request — it
    "didn't read very high-end or minimal." Removed the "What I do" section
    (6-item emoji skills grid) and "Outside work" section (2 emoji cards with
    a Star Trek quote) entirely. About page is now just: About text →
    Experience → the "Life outside work" photo grid. Nothing subtle here —
    both sections were deleted wholesale, not trimmed. The `.skills-grid`,
    `.skill-item`, `.outside-grid`, `.outside-card` CSS rules in `style.css`
    are now unused dead code (left in place, harmless, in case any of this
    layout is wanted again later — not cleaned up since nothing currently
    references them).
19. **Design at Route no longer depends on the Squarespace download script at
    all**: user uploaded their own 4 feature screenshots directly
    (`onboarding.png`, `checkout.png`, `add-card.png`, `year-in-review.png` —
    each a multi-screen montage, not single screens) with filenames that
    already matched what the code expected, so no HTML/data changes were
    needed, just dropped the files in. Removed all 4 corresponding
    Squarespace URLs from `download-squarespace-images.py`'s manifest
    (not just left unused) since they'll never be fetched from there again.
    Combined with the earlier cover/package-protection/boxes-tracking direct
    uploads, this page is now 100% user-sourced images, zero Squarespace
    dependency remaining.

20. **Fixed unintended homepage photo cropping**: user noticed their photo
    looked cropped/repositioned differently than the original and asked
    directly whether Claude was doing something to it. Root cause: the
    `.hero__photo-wrap` box was set to an old aspect ratio (`1 / 1.05`,
    inherited from before the harriet.jpg swap a few sessions back) while the
    actual current photo is a clean 4:5 (1100×1375). That mismatch forced
    `object-fit: cover` to crop the image to fit the wrong-shaped box.
    Fixed by changing the box to `aspect-ratio: 4 / 5` (exact match to the
    photo) and simplifying `object-position` from `center 22%` to `center`
    — with an exact aspect match, cover produces zero cropping regardless of
    object-position, so the full original photo now shows exactly as
    uploaded. Verified via computed bounding-box ratio in a headless check
    (both box and image report the same 0.8 ratio). **Note**: the About
    page's `.about-hero__photo` (different photo, `more-harriet.jpg`) was
    NOT touched — user's question was specifically about the homepage, and
    that photo's box already happened to be 4/5 with a 3/4-ish source image,
    a smaller mismatch that wasn't raised. Worth a look if it ever comes up.

21. **Removed the dark border around all article images site-wide**: user
    felt images looked "too boxed in." Changed `.project-img { border: 1.5px
    solid var(--ink); }` to `border: none`. This is a single shared rule used
    by every case-study page's images, so one change fixed it everywhere.
    Note this reverses an earlier explicit user preference from a prior
    session (they'd previously rejected a *rounded-corner + shadow* version
    of this same treatment and asked to keep the black border) — this time
    they're asking to remove the border entirely rather than restyle it, so
    treating this as the current, up-to-date preference. Left border-radius
    at 0 and background/margin untouched since only the border itself was
    called out.


Current delivered zip: **harriet-portfolio-v38.zip**
