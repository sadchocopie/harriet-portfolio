/* ============================================
   HARRIET WANG — JS v3
   Fade-in on scroll · Footer canvas · TOC · Nav
   (no hero text animation)
   ============================================ */

/* ============================================================
   PROJECT CARD RENDERING
   Reads PROJECTS from js/projects-data.js and builds:
     - the homepage "Selected work" grid   (#projectGrid)
     - the "More work" carousel on every case-study page (#projectTrack)
   Edit js/projects-data.js to add/remove/reorder projects — both
   places above update automatically, nothing to touch here.
   ============================================================ */

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Local (non-CDN) image paths in projects-data.js are stored root-relative
// (e.g. "img/projects/xyz.png"), same convention as the rest of the site.
// Since project cards render on both the homepage (root) and case-study
// pages (/pages/), this prefixes the right "../" when needed — same trick
// Clippy and the nav already use.
function pageImgBase() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

function projectThumbHTML(p, mini, imgBase) {
  if (p.thumb.type === 'image') {
    const src = /^https?:\/\//.test(p.thumb.src) ? p.thumb.src : (imgBase || '') + p.thumb.src;
    return `<div class="project-card__thumb"><img src="${src}" alt="${escapeHTML(p.thumb.alt || p.title)}" loading="lazy"/></div>`;
  }
  const dashed = p.thumb.dashed ? 'border:1px dashed var(--mid);' : '';
  if (mini) {
    return `<div class="project-card__thumb"><div style="display:flex;align-items:center;justify-content:center;height:100%;${dashed}">
      <span style="font-family:var(--mono);font-size:0.65rem;color:${p.thumb.color || 'var(--mid)'};opacity:0.6;letter-spacing:0.04em;">${escapeHTML(p.title.toUpperCase())}</span>
    </div></div>`;
  }
  const textStyle = p.thumb.mono
    ? `font-family:var(--mono);font-size:0.75rem;color:${p.thumb.color || 'var(--mid)'};letter-spacing:0.06em;opacity:0.6;`
    : `font-family:var(--serif);font-size:1.25rem;color:${p.thumb.color || 'var(--mid)'};opacity:0.4;letter-spacing:-0.02em;`;
  return `<div class="project-card__thumb" style="display:flex;align-items:center;justify-content:center;min-height:${p.star ? '' : '200px'};${dashed}">
    <span style="${textStyle}">${escapeHTML(p.thumb.text)}</span>
  </div>`;
}

function tagHTML(t) {
  return `<span class="tag${t.variant ? ' tag--' + t.variant : ''}">${escapeHTML(t.text)}</span>`;
}

function statsHTML(p) {
  if (!p.stats || !p.stats.length) return '<div></div>';
  return `<div class="project-card__stats">${p.stats.map(s =>
    `<div><span class="stat__num">${escapeHTML(s.num)}</span><span class="stat__label">${escapeHTML(s.label)}</span></div>`
  ).join('')}</div>`;
}

function ctaHTML(p) {
  const cls = p.cta.variant === 'wip' ? 'card-btn card-btn--wip' : 'card-btn card-btn--primary';
  return `<span class="${cls}">${escapeHTML(p.cta.label)}</span>`;
}

function fullCardHTML(p, base, imgBase) {
  const starCls = p.star ? ' project-card--star' : '';
  const cursorAttr = p.cursor ? ` data-cursor="${escapeHTML(p.cursor)}"` : '';
  return `<a href="${base}${p.href}" class="project-card${starCls} fade-in"${cursorAttr}>
    ${projectThumbHTML(p, false, imgBase)}
    <div class="project-card__body">
      <div class="project-card__tags">${p.tags.map(tagHTML).join('')}</div>
      <h3 class="project-card__title">${escapeHTML(p.title)}</h3>
      <p class="project-card__desc">${escapeHTML(p.desc)}</p>
      <div class="project-card__footer">
        ${statsHTML(p)}
        ${ctaHTML(p)}
      </div>
    </div>
  </a>`;
}

function miniCardHTML(p, base, imgBase) {
  const tag = p.tags.find(t => t.variant) || p.tags[0];
  return `<a href="${base}${p.href}" class="project-card project-card--mini" data-cursor="View →">
    ${projectThumbHTML(p, true, imgBase)}
    <div class="project-card__body">
      ${tagHTML(tag)}
      <h3 class="project-card__title">${escapeHTML(p.title)}</h3>
    </div>
  </a>`;
}

function renderProjectGrid() {
  const mount = document.getElementById('projectGrid');
  if (!mount || typeof PROJECTS === 'undefined') return;
  const imgBase = pageImgBase();
  mount.innerHTML = PROJECTS.map(p => fullCardHTML(p, 'pages/', imgBase)).join('\n');
}

function renderMoreWork() {
  const mount = document.getElementById('projectTrack');
  if (!mount || typeof PROJECTS === 'undefined') return;
  const currentId = document.body.dataset.projectId;
  const others = PROJECTS.filter(p => p.id !== currentId);
  const imgBase = pageImgBase();
  mount.innerHTML = others.map(p => miniCardHTML(p, '', imgBase)).join('\n');
}

function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  els.forEach((el, i) => {
    const delay = el.dataset.delay || (i * 60);
    el.style.transitionDelay = Math.min(delay, 400) + 'ms';
    obs.observe(el);
  });
}

function initFooterCanvas(id) {
  const canvas = document.getElementById(id || 'footer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const blobs = Array.from({ length: 7 }, (_, i) => ({
    x: Math.random(), y: Math.random(),
    r: 120 + Math.random() * 240,
    color: ['#1A56C4','#0D3A8C','#4D8AE8','#2D2D2B','#3A3835'][i % 5],
    phase: Math.random() * Math.PI * 2,
    speed: 0.003 + Math.random() * 0.004
  }));

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    blobs.forEach(b => {
      b.phase += b.speed;
      const x = (b.x + Math.sin(b.phase) * 0.07) * W;
      const y = (b.y + Math.cos(b.phase * 0.85) * 0.05) * H;
      const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      g.addColorStop(0, b.color + '55');
      g.addColorStop(1, b.color + '00');
      ctx.beginPath(); ctx.arc(x, y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function initAboutCanvas() {
  const canvas = document.getElementById('about-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const blobs = [
    { x: 0.8, y: 0.2, r: 320, color: '#1A56C4', phase: 0,   speed: 0.003 },
    { x: 0.1, y: 0.8, r: 220, color: '#4D8AE8', phase: 2.1, speed: 0.005 },
    { x: 0.5, y: 0.5, r: 200, color: '#0D3A8C', phase: 4.2, speed: 0.004 },
  ];
  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    blobs.forEach(b => {
      b.phase += b.speed;
      const x = (b.x + Math.sin(b.phase) * 0.1) * W;
      const y = (b.y + Math.cos(b.phase * 0.9) * 0.07) * H;
      const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      g.addColorStop(0, b.color + '28');
      g.addColorStop(1, b.color + '00');
      ctx.beginPath(); ctx.arc(x, y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function initNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href && href !== '#' && (path === href || (path === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

function initTOC() {
  const links = document.querySelectorAll('.toc-link');
  if (!links.length) return;
  const sections = Array.from(links).map(l => document.getElementById(l.getAttribute('href')?.replace('#',''))).filter(Boolean);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.toc-link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach(s => obs.observe(s));
}

function initCardTransitions() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      this.classList.add('is-leaving');
      setTimeout(() => { window.location.href = href; }, 320);
    });
  });
}

function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.documentElement.classList.add('has-custom-cursor');

  // Inject cursor element on every page
  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `<svg class="cursor__arrow" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2 L4 17 L7.5 13 L10 19 L12.5 18 L10 12.5 L15 12.5 Z"
          fill="#14140F" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
  </svg><span class="cursor__label"></span>`;
  document.body.appendChild(cursor);

  const label = cursor.querySelector('.cursor__label');
  let raf;

  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursor.style.opacity = '1';
    });
  });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });

  // Label + grow on ANY element carrying a data-cursor attribute — project
  // cards, photo grids, carousels, whatever gets added later. One mechanism,
  // reused everywhere: just add data-cursor="your label" to any element.
  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      label.textContent = el.dataset.cursor || 'Open →';
      cursor.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

function initScrollNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 48);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

function initHeroGlow() {
  const word = document.getElementById('gw-hero');
  const layer = document.getElementById('gl-hero');
  if (!word || !layer) return;

  // light, pastel palette — a fresh one is picked each time the cursor enters
  const palette = ['#F7B8D2','#B8D9F8','#FFE29E','#C6F0CA','#E3C6FA','#FFCFA6','#B9F1E8'];
  let current = palette[Math.floor(Math.random() * palette.length)];

  word.addEventListener('mouseenter', function() {
    current = palette[Math.floor(Math.random() * palette.length)];
  });

  word.addEventListener('mousemove', function(e) {
    const r = word.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    layer.style.background =
      `radial-gradient(circle 100px at ${x}% ${y}%, ${current} 0%, ${current}99 35%, transparent 70%)`;
    layer.style.webkitBackgroundClip = 'text';
    layer.style.backgroundClip = 'text';
    layer.style.webkitTextFillColor = 'transparent';
  });

  word.addEventListener('mouseleave', function() {
    layer.style.background = `radial-gradient(circle 0px at 50% 50%, ${current} 0%, transparent 100%)`;
  });
}

function initClipy() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(max-width: 720px)').matches) return; // hide Clippy entirely on mobile

  const base = window.location.pathname.includes('/pages/') ? '../' : '';
  const P = s => base + 'img/clippy/' + s;

  const style = document.createElement('style');
  style.textContent = `
    #clippy-paper {
      position:fixed; bottom:12px; right:14px; width:120px;
      transform:rotate(-8deg); pointer-events:none; z-index:9990; opacity:0.88;
      transform-origin:bottom right;
    }
    #clippy {
      position:fixed; bottom:48px; right:54px; width:35px;
      z-index:9995; cursor:none; user-select:none;
    }
    /* Swing animation lives on the character graphic only — NOT on #clippy
       itself — so the dialogue bubble (a sibling, anchored to #clippy) stays
       upright and doesn't swing along with Clippy. */
    .c-composite {
      position:relative; width:100%; transform-origin:bottom center;
      filter:drop-shadow(0 5px 10px rgba(0,0,0,0.15));
    }
    .c-composite.swinging { animation:c-swing 2s ease-in-out infinite; }
    #clippy.dragging .c-composite { animation:none !important; }
    @keyframes c-swing { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(5deg)} 75%{transform:rotate(-5deg)} }
    .c-composite::after {
      content:''; display:block;
      width:60%; height:5px; margin:-1px auto 0;
      background:radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%);
      border-radius:50%; pointer-events:none;
    }
    .c-body  { display:block; width:100%; height:auto; }
    .c-eyes  { position:absolute; top:0; left:0; width:100%; pointer-events:none; }
    #clippy-bubble {
      position:absolute; bottom:calc(100% + 6px); right:-16px;
      width:230px; z-index:10; display:none;
      background:#C0C0C0;
      border:2px solid;
      border-color:#FFFFFF #808080 #808080 #FFFFFF;
      box-shadow:1px 1px 0 #DFDFDF inset, -1px -1px 0 #404040 inset, 2px 2px 8px rgba(0,0,0,0.35);
      font-family:'Tahoma','Arial',sans-serif;
    }
    #clippy-bubble.open { display:block; animation:c-bpop .14s ease; }
    @keyframes c-bpop { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:none} }
    .cb-titlebar {
      background:linear-gradient(to right, #000080 0%, #1084D0 100%);
      padding:2px 3px 2px 4px; display:flex; align-items:center;
      justify-content:space-between; height:18px; gap:4px;
    }
    .cb-titlebar-text {
      color:#fff; font-size:11px; font-weight:700;
      font-family:'Tahoma','Arial',sans-serif; white-space:nowrap;
      display:flex; align-items:center; gap:4px; overflow:hidden;
    }
    .cb-titlebar-btns { display:flex; gap:2px; flex-shrink:0; }
    .cb-tbtn {
      width:15px; height:13px; background:#C0C0C0;
      border:1px solid; border-color:#FFFFFF #808080 #808080 #FFFFFF;
      font-size:9px; font-family:'Arial',sans-serif; font-weight:700;
      display:flex; align-items:center; justify-content:center;
      cursor:none; padding:0; line-height:1; color:#000;
    }
    .cb-tbtn:active { border-color:#808080 #FFFFFF #FFFFFF #808080; }
    .cb-body { padding:10px 10px 6px; display:flex; gap:8px; align-items:flex-start; }
    .cb-text { font-size:11px; line-height:1.45; color:#000; font-family:'Tahoma','Arial',sans-serif; }
    .cb-text strong { display:block; font-weight:500; margin-bottom:2px; }
    .cb-contact {
      display:none; margin:0 10px 4px; padding:6px;
      background:#FFFFFF; border:1px solid #808080;
      font-size:10px; line-height:1.8; color:#000;
      font-family:'Tahoma','Arial',sans-serif;
    }
    .cb-contact a { color:#000080; text-decoration:underline; }
    .cb-btnrow {
      padding:4px 8px 8px; display:flex; justify-content:center; gap:6px;
      border-top:1px solid #808080; margin-top:4px;
    }
    .cb-btn {
      min-width:68px; padding:2px 10px; height:22px;
      background:#C0C0C0; font-family:'Tahoma','Arial',sans-serif;
      font-size:11px; color:#000; cursor:none;
      border:2px solid; border-color:#FFFFFF #808080 #808080 #FFFFFF;
      box-shadow:1px 1px 0 #DFDFDF inset;
    }
    .cb-btn:active { border-color:#808080 #FFFFFF #FFFFFF #808080; box-shadow:none; }
    .cb-btn:focus  { outline:1px dotted #000; outline-offset:-3px; }
  `;
  document.head.appendChild(style);

  const paper = document.createElement('img');
  paper.id = 'clippy-paper'; paper.src = P('Paper.png'); paper.alt = '';
  document.body.appendChild(paper);

  const el = document.createElement('div');
  el.id = 'clippy';
  el.innerHTML = `
    <div id="clippy-bubble">
      <div class="cb-titlebar">
        <div class="cb-titlebar-text"></div>
        <div class="cb-titlebar-btns">
          <button class="cb-tbtn">_</button>
          <button class="cb-tbtn">□</button>
          <button class="cb-tbtn" id="cb-close">✕</button>
        </div>
      </div>
      <div class="cb-body">
        <div class="cb-text"><strong id="c-btitle"></strong><span id="c-bbody"></span></div>
      </div>
      <div class="cb-contact" id="c-bcontact">
        📧 <a href="mailto:harrietzzw@gmail.com">harrietzzw@gmail.com</a><br>
        💼 <a href="https://linkedin.com/in/harrietwang" target="_blank">linkedin.com/in/harrietwang</a><br>
        📄 Resume available on request
      </div>
      <div class="cb-btnrow"><button class="cb-btn" id="c-yes">OK</button></div>
    </div>
    <div class="c-composite">
      <img class="c-body" src="${P('Mask_Group.png')}" alt="Clippy"/>
      <img class="c-eyes" id="c-eyes" src="${P('Nice.png')}" alt=""/>
    </div>`;
  document.body.appendChild(el);

  const eyeImg  = document.getElementById('c-eyes');
  const composite = el.querySelector('.c-composite');
  const bubble  = document.getElementById('clippy-bubble');
  const yesBtn  = document.getElementById('c-yes');
  const contact = document.getElementById('c-bcontact');
  const bTitle  = document.getElementById('c-btitle');
  const bBody   = document.getElementById('c-bbody');
  document.getElementById('cb-close').addEventListener('click', e => { e.stopPropagation(); bubble.classList.remove('open'); });

  const EYES = { nice:P('Nice.png'), cheeky:P('Cheeky.png'), mad:P('Mad.png'), surprised:P('Surprised.png') };
  let isDragging = false, isHovering = false;
  const setEyes = s => eyeImg.src = EYES[s];
  const rand = a => a[Math.floor(Math.random()*a.length)];

  function scheduleSwing() {
    if (isDragging) { setTimeout(scheduleSwing, 800); return; }
    if (Math.random() > 0.5) {
      composite.classList.add('swinging');
      setTimeout(() => { composite.classList.remove('swinging'); setTimeout(scheduleSwing, 600+Math.random()*1400); }, 1800+Math.random()*2200);
    } else { composite.classList.remove('swinging'); setTimeout(scheduleSwing, 1500+Math.random()*3000); }
  }
  scheduleSwing();

  function scheduleIdleEye() {
    setTimeout(() => {
      if (!isDragging && !isHovering && Math.random() > 0.75) {
        setEyes('cheeky');
        setTimeout(() => { if (!isDragging && !isHovering) setEyes('nice'); scheduleIdleEye(); }, 900+Math.random()*700);
        return;
      }
      scheduleIdleEye();
    }, 3000+Math.random()*4500);
  }
  scheduleIdleEye();

  const cardMsgs = ["It looks like you're reading a case study.", "Ooh, a project. Click to learn more!", "This one's a banger. Just saying."];
  const footerMsgs = ["It looks like you're about to reach out. Good move.", "Sending an email? I can help. (I cannot.)"];

  document.querySelectorAll('.project-card').forEach(c => c.addEventListener('mouseenter', () => {
    bTitle.textContent = rand(cardMsgs); bBody.textContent=''; contact.style.display='none';
    yesBtn.style.display='none'; bubble.classList.add('open');
  }));
  const footer = document.querySelector('.footer');
  if (footer) new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { bTitle.textContent=rand(footerMsgs); bBody.textContent=''; contact.style.display='none'; yesBtn.style.display='none'; bubble.classList.add('open'); }
  }, {threshold:0.25}).observe(footer);

  el.addEventListener('mouseenter', () => { isHovering=true;  if (!isDragging) setEyes('cheeky'); });
  el.addEventListener('mouseleave', () => { isHovering=false; if (!isDragging) setEyes('nice'); });

  function revealContact() {
    bTitle.textContent="It looks like you want to work together.";
    bBody.textContent=" Here's how to reach Harriet:";
    contact.style.display='block'; yesBtn.style.display='none';
  }

  let ox=0, oy=0;
  el.addEventListener('mousedown', e => {
    if (e.target.closest('#clippy-bubble')||e.button) return;
    isDragging=true; bubble.classList.remove('open');
    const r=el.getBoundingClientRect();
    ox=e.clientX-r.left; oy=e.clientY-r.top;
    el.style.right='auto'; el.style.bottom='auto';
    el.style.left=r.left+'px'; el.style.top=r.top+'px';
    el.classList.add('dragging'); setEyes('surprised'); e.preventDefault();
  });
  document.addEventListener('mousemove', e => { if (!isDragging) return; el.style.left=(e.clientX-ox)+'px'; el.style.top=(e.clientY-oy)+'px'; });
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging=false; el.classList.remove('dragging'); setEyes(isHovering?'cheeky':'nice');
    setTimeout(() => {
      bTitle.textContent='Was that fun?'; bBody.textContent=' Go on, admit it.';
      contact.style.display='none'; yesBtn.style.display=''; yesBtn.textContent='OK';
      yesBtn.onclick=e=>{e.stopPropagation();revealContact();};
      bubble.classList.add('open');
    }, 280);
  });

  el.addEventListener('click', e => {
    if (isDragging||e.target.closest('#clippy-bubble')) return;
    if (bubble.classList.contains('open')) { bubble.classList.remove('open'); return; }
    bTitle.textContent="It looks like you're browsing a portfolio.";
    bBody.textContent=' Can I help?';
    contact.style.display='none'; yesBtn.style.display=''; yesBtn.textContent='Sure!';
    yesBtn.onclick=e=>{e.stopPropagation();revealContact();};
    bubble.classList.add('open'); setEyes('cheeky');
  });
  yesBtn.addEventListener('click', e => { e.stopPropagation(); revealContact(); });
}

function initProjectCarousel() {
  // Scoped to each .project-carousel container so a page can safely have more
  // than one (e.g. the "More work" carousel on a project page, plus a photo
  // carousel elsewhere) without them fighting over the same element IDs.
  document.querySelectorAll('.project-carousel').forEach(carousel => {
    const track = carousel.querySelector('.project-carousel__track');
    const bar = carousel.querySelector('.project-carousel__bar');
    const thumb = carousel.querySelector('.project-carousel__thumb');
    const prevBtn = carousel.querySelector('.carousel-btn--prev');
    const nextBtn = carousel.querySelector('.carousel-btn--next');
    if (!track || !bar || !thumb) return;

    function updateThumb() {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = max > 0 ? Math.min(track.scrollLeft / max, 1) : 0;
      const thumbWidth = Math.max((track.clientWidth / track.scrollWidth) * 100, 8);
      thumb.style.width = thumbWidth + '%';
      thumb.style.left = (ratio * (100 - thumbWidth)) + '%';
    }

    track.addEventListener('scroll', () => requestAnimationFrame(updateThumb), { passive: true });
    window.addEventListener('resize', updateThumb);
    updateThumb();

    function cardStep() {
      const card = track.querySelector('.project-card');
      return card ? card.getBoundingClientRect().width + 20 : 340;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -cardStep(), behavior: 'smooth' }));
    if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: cardStep(), behavior: 'smooth' }));

    bar.addEventListener('click', (e) => {
      const r = bar.getBoundingClientRect();
      const pct = (e.clientX - r.left) / r.width;
      const max = track.scrollWidth - track.clientWidth;
      track.scrollTo({ left: pct * max, behavior: 'smooth' });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjectGrid();
  renderMoreWork();
  initNav();
  initScrollNav();
  initCursor();
  initCardTransitions();
  initClipy();
  initFadeIn();
  initHeroGlow();
  initAboutCanvas();
  initTOC();
  initProjectCarousel();
});
