/**
 * PROJECTS — single source of truth for every project card on the site.
 *
 * This file is read by js/main.js to build:
 *   1. The homepage "Selected work" grid  (mount: <div id="projectGrid"> in index.html)
 *   2. The "More work" carousel at the bottom of every case-study page
 *      (mount: <div id="projectTrack"> in pages/*.html)
 *
 * TO ADD A NEW PROJECT:
 *   1. Copy one of the objects below and edit the fields (see the field guide underneath).
 *   2. Add it to the PROJECTS array, in whatever order you want it to appear.
 *   3. If it has its own case-study page, create pages/your-project.html (copy an
 *      existing case-study page as a starting template) and set `href` to match.
 *   4. That's it — it will automatically appear in the homepage grid AND in the
 *      "More work" carousel on every OTHER project's page (a project never lists
 *      itself in its own "more work" row — see renderMoreWork() in main.js).
 *
 * FIELD GUIDE
 *   id       (required) unique slug, no spaces. Used to exclude "self" from More Work.
 *   href     (required) filename of the case-study page, relative to /pages/.
 *            If there's no case-study page yet, point it at "#" and set cta.variant to 'wip'.
 *   star     (optional) true = full-width featured layout on the homepage grid.
 *   cursor   (optional) text shown in the custom cursor label when hovering this card.
 *   thumb    (required) either:
 *              { type: 'image', src: '<url>', alt: '<description>' }
 *            or
 *              { type: 'placeholder', text: '<label>', color: '<css color/var>', mono: bool, dashed: bool }
 *   tags     (required) array of { text, variant } — variant is optional: 'featured' | 'accent' | 'green'
 *   title    (required) card + page heading
 *   desc     (required) one-sentence summary shown on the homepage card
 *   stats    (optional) array of { num, label } — up to 2 reads best
 *   cta      (required) { label, variant } — variant is 'primary' or 'wip'
 */

const PROJECTS = [

  {
    id: 'app-integration',
    href: 'app-integration.html',
    star: true,
    cursor: '5 min read →',
    thumb: {
      type: 'image',
      src: 'img/projects/app-integration/hero-mc-showcase.png',
      alt: 'App Integration — Mailchimp showcase',
    },
    tags: [
      { text: '★ Featured', variant: 'featured' },
      { text: 'Shipped · 2025', variant: 'accent' },
      { text: 'Intuit · QuickBooks · Mailchimp' },
    ],
    title: 'App Marketplace Integration',
    desc: 'Redesigned 700+ custom integration flows into one standardized template — cutting drop-off and rollout time.',
    stats: [
      { num: '↓15%', label: 'drop-off' },
      { num: '9→5wk', label: 'rollout time' },
    ],
    cta: { label: 'Case Study ↗', variant: 'primary' },
  },

  {
    id: 'route-year-in-review',
    href: 'route-year-in-review.html',
    star: true,
    cursor: 'A personal fave ✦',
    thumb: {
      type: 'image',
      src: 'img/projects/route-year-in-review/hero-route-summary.png',
      alt: 'Route Year in Review',
    },
    tags: [
      { text: '★ Featured', variant: 'featured' },
      { text: 'Route · 2021–22' },
    ],
    title: 'Route: Year in Review',
    desc: 'A Spotify Wrapped–inspired experience that turned passive tracking data into viral social content. Led end to end — concept, animation, engineering collaboration, A/B testing, and a second edition the following year.',
    stats: [
      { num: '50k+', label: 'social shares' },
      { num: '+75%', label: 'in-app sharing YoY' },
    ],
    cta: { label: 'Case Study ↗', variant: 'primary' },
  },

  {
    id: 'doc-auto-import',
    href: 'doc-auto-import.html',
    cursor: '4 min read →',
    thumb: {
      type: 'image',
      src: 'img/projects/doc-auto-import/hero-multi-channel.png',
      alt: 'Document Auto Import — multi channel',
    },
    tags: [
      { text: 'Shipped · 2025', variant: 'green' },
      { text: 'Intuit · TurboTax · QBO' },
    ],
    title: 'Document Auto Import',
    desc: 'Reduced double-login friction at a critical auth experience — shifting user mental models to increase automated document import opt-in.',
    stats: [
      { num: '~100%', label: 'user preference in testing' },
    ],
    cta: { label: 'Learn More ↗', variant: 'primary' },
  },

  {
    id: 'connection-reuse',
    href: 'connection-reuse.html',
    cursor: '3 min read →',
    thumb: { type: 'placeholder', text: 'IDX · Connection Reuse', color: 'var(--accent)' },
    tags: [
      { text: 'Shipped · Feb 2025', variant: 'green' },
      { text: 'IDX · Credit Karma · TurboTax' },
    ],
    title: 'IDX Connection Reuse',
    desc: 'One connection. Two products. Zero re-authentication. Carousel + bulk multi-select patterns, now standard IDX reuse UI.',
    stats: [
      { num: '0', label: 're-authentications' },
    ],
    cta: { label: 'Under Construction', variant: 'wip' },
  },

  {
    id: 'smart-account-linking',
    href: 'smart-account-linking.html',
    cursor: 'Research-heavy →',
    thumb: { type: 'placeholder', text: 'IDX · Smart Account Linking', color: 'var(--mid)' },
    tags: [
      { text: 'Shipped', variant: 'green' },
      { text: 'IDX · QBO · TurboTax' },
    ],
    title: 'IDX Smart Account Linking',
    desc: 'Intelligent deduplication at the connection point. Designed and research-led end to end — patterns in IDX design system.',
    stats: [
      { num: 'Research-led', label: 'I ran the interviews' },
    ],
    cta: { label: 'Learn More ↗', variant: 'primary' },
  },

  {
    id: 'locale-hackathon',
    href: 'locale-hackathon.html',
    cursor: 'Made this for fun ✦',
    thumb: { type: 'placeholder', text: 'FIGMA PLUGIN + CLAUDE AGENT', mono: true, dashed: true },
    tags: [
      { text: 'For fun · Hackathon' },
      { text: '3X AI · fr-CA' },
    ],
    title: 'Locale — AI Localization QA',
    desc: 'Audits Canadian French content in Figma before dev touches a string. Built with Samantha Kirby (Content Systems).',
    stats: [],
    cta: { label: 'Under Construction', variant: 'wip' },
  },

];
