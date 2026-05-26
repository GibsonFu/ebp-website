'use strict';

/* ════════════════════════════════════════════════
   東竹藥品 — Interactive Animation Engine
════════════════════════════════════════════════ */

/* ── 1. PRELOADER ─────────────────────────────── */
function initPreloader() {
  const loader = document.getElementById('preloader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 900);
  });
  // Fallback
  setTimeout(() => loader.classList.add('done'), 2500);
}

/* ── 2. SCROLL PROGRESS BAR ───────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - innerHeight) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── 3. NAVBAR SCROLL ─────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

/* ── 4. HAMBURGER MOBILE MENU ─────────────────── */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    const [s1, s2, s3] = btn.querySelectorAll('span');
    s1.style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
    s2.style.opacity   = open ? '0' : '';
    s3.style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
  });

  // Dropdown on mobile
  document.querySelectorAll('.has-dropdown .nav-link').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.closest('.has-dropdown').classList.toggle('open');
      }
    });
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        links.classList.remove('open');
        btn.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      }
    });
  });
}

/* ── 5. HERO PARTICLE CANVAS ──────────────────── */
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, rafId;

  const resize = () => {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particle class
  class P {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : (Math.random() > 0.5 ? -5 : H + 5);
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r  = Math.random() * 2 + 0.5;
      this.a  = Math.random() * 0.45 + 0.08;
      this.life = 0;
      this.maxLife = 400 + Math.random() * 300;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10)
        this.reset();
    }
    draw() {
      const fade = Math.min(this.life / 60, 1) * Math.min((this.maxLife - this.life) / 60, 1);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.a * fade})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 60 }, () => new P());
  const MAX_DIST = 110;

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.09;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(tick);
  }
  tick();
}

/* ── 6. HERO MOUSE GLOW ───────────────────────── */
function initHeroGlow() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const glow = document.createElement('div');
  glow.id = 'hero-glow';
  glow.style.cssText = 'left:-9999px;top:-9999px;';
  hero.appendChild(glow);

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - r.left) + 'px';
    glow.style.top  = (e.clientY - r.top)  + 'px';
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    glow.style.left = '-9999px';
    glow.style.top  = '-9999px';
  });
}

/* ── 7. HERO TITLE WORD ANIMATION ─────────────── */
function initHeroTitle() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  // Walk TEXT nodes only — never touch element nodes like <br> or <em>
  const textNodes = [];
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) textNodes.push(n);

  textNodes.forEach(node => {
    const parts = node.nodeValue.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach(part => {
      if (!part || /^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement('span');
        span.className = 'hero-word';
        span.textContent = part;
        frag.appendChild(span);
      }
    });
    node.parentNode.replaceChild(frag, node);
  });

  const words = title.querySelectorAll('.hero-word');
  words.forEach((w, i) => {
    setTimeout(() => w.classList.add('in'), 500 + i * 80);
  });
}

/* ── 8. SCROLL REVEAL (multi-direction) ───────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  ).forEach(el => obs.observe(el));

  // Animate section-tag lines when visible
  const tagObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        tagObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.8 });
  document.querySelectorAll('.section-tag').forEach(t => tagObs.observe(t));
}

/* ── 9. COUNTER ANIMATION ─────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-target]').forEach(el => {
        const target   = +el.dataset.target;
        const duration = 2200;
        const start    = performance.now();
        el.classList.add('counting');
        const tick = now => {
          const p     = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
          else { el.textContent = target; el.classList.remove('counting'); }
        };
        requestAnimationFrame(tick);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });

  const bar = document.querySelector('.hero-stats');
  if (bar) obs.observe(bar);
}

/* ── 10. 3D CARD TILT ─────────────────────────── */
function init3DTilt() {
  const sel = '.cap-card, .value-card, .gp-card, .career-card, .office-card, .lc-body';
  document.querySelectorAll(sel).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = ((e.clientX - r.left) / r.width  - 0.5) * 12;
      const y  = ((e.clientY - r.top)  / r.height - 0.5) * 12;
      card.style.transform  = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(8px) scale(1.01)`;
      card.style.boxShadow  = `${-x * 1.5}px ${y * 1.5}px 28px rgba(11,29,53,0.14)`;
      card.style.transition = 'box-shadow 0.1s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.boxShadow  = '';
      card.style.transition = 'transform 0.45s ease, box-shadow 0.45s ease';
    });
  });
}

/* ── 11. BUTTON RIPPLE ────────────────────────── */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const r    = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const el   = document.createElement('span');
      el.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:rgba(255,255,255,0.32);
        left:${e.clientX - r.left - size / 2}px;
        top:${e.clientY - r.top  - size / 2}px;
        transform:scale(0);
        animation:rippleAnim .7s ease-out forwards;
        pointer-events:none;
        z-index:10;
      `;
      this.appendChild(el);
      setTimeout(() => el.remove(), 750);
    });
  });
}

/* ── 12. CARD SHINE SWEEP ─────────────────────── */
function initCardShine() {
  document.querySelectorAll('.cap-card, .gp-card, .value-card').forEach(card => {
    const shine = document.createElement('div');
    shine.className = 'shine-layer';
    card.style.position = 'relative';
    card.appendChild(shine);

    card.addEventListener('mouseenter', () => {
      shine.style.transition = 'left .55s ease';
      shine.style.left = '160%';
    });
    card.addEventListener('mouseleave', () => {
      shine.style.transition = 'none';
      shine.style.left = '-120%';
    });
  });
}

/* ── 13. TIMELINE LINE DRAW ───────────────────── */
function initTimelineDraw() {
  const tl = document.querySelector('.timeline');
  if (!tl) return;

  // Hide the ::before pseudo via a real element
  tl.style.setProperty('--tl-pseudo', 'none');
  const line = document.createElement('div');
  line.className = 'tl-drawn-line';
  tl.appendChild(line);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => line.classList.add('active'), 200);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  obs.observe(tl);
}

/* ── 14. FLOATING ELEMENTS ────────────────────── */
function initFloating() {
  const map = {
    '.about-img-badge': 'float 4s ease-in-out infinite',
    '.about-cert-card': 'float 5s ease-in-out .7s infinite',
    '.gv-center':       'float 4.5s ease-in-out .3s infinite',
  };
  Object.entries(map).forEach(([sel, anim]) => {
    const el = document.querySelector(sel);
    if (el) el.style.animation = anim;
  });
}

/* ── 15. PARALLAX ORBS (hero mouse) ───────────── */
function initParallax() {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const hero  = document.querySelector('.hero');
  if (!hero) return;

  let mx = 0, my = 0, ox1 = 0, oy1 = 0, ox2 = 0, oy2 = 0;

  hero.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth  - 0.5) * 40;
    my = (e.clientY / innerHeight - 0.5) * 28;
  }, { passive: true });

  function lerp(a, b, t) { return a + (b - a) * t; }

  (function animOrbs() {
    ox1 = lerp(ox1, mx * 0.45, 0.06);
    oy1 = lerp(oy1, my * 0.45, 0.06);
    ox2 = lerp(ox2, -mx * 0.28, 0.06);
    oy2 = lerp(oy2, -my * 0.28, 0.06);
    if (orb1) orb1.style.transform = `translate(${ox1}px, ${oy1}px)`;
    if (orb2) orb2.style.transform = `translate(${ox2}px, ${oy2}px)`;
    requestAnimationFrame(animOrbs);
  })();
}

/* ── 16. ACTIVE NAV HIGHLIGHT ─────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => {
          l.classList.toggle('nav-active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.38 });

  sections.forEach(s => obs.observe(s));
}

/* ── 17. CONTACT FORM ─────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    const orig = btn.textContent;
    btn.textContent = '已送出 ✓';
    btn.style.background = '#6BAFC2';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

/* ── 18. LANG TOGGLE ──────────────────────────── */
function initLang() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  let en = false;
  btn.addEventListener('click', () => {
    en = !en;
    btn.textContent = en ? '中' : 'EN';
  });
}

/* ── 19. SMOOTH SCROLL OFFSET (sticky nav) ─────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ── 20. STAGGER GP CARDS ON ENTER ────────────── */
function initStaggerCards() {
  const grid = document.querySelector('.gp-grid');
  if (!grid) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.gp-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity   = '1';
          card.style.transform = 'none';
        }, i * 80);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1 });

  // Initially hide them (override reveal)
  grid.querySelectorAll('.gp-card').forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity .5s ease, transform .5s ease';
  });
  obs.observe(grid);
}

/* ── 21. PRODUCTS TABLE ROW STAGGER ───────────── */
function initTableAnim() {
  const tbody = document.querySelector('.products-table tbody');
  if (!tbody) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('tr').forEach((row, i) => {
        row.style.opacity   = '0';
        row.style.transform = 'translateX(-16px)';
        row.style.transition = `opacity .4s ease ${i * 60}ms, transform .4s ease ${i * 60}ms`;
        setTimeout(() => {
          row.style.opacity   = '1';
          row.style.transform = 'none';
        }, 100 + i * 60);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  obs.observe(tbody);
}

/* ── 22. VALUE CARD ICON HOVER ────────────────── */
function initValueIconBounce() {
  document.querySelectorAll('.value-card').forEach(card => {
    const icon = card.querySelector('.vc-icon');
    if (!icon) return;
    card.addEventListener('mouseenter', () => {
      icon.style.animation = 'none';
      requestAnimationFrame(() => {
        icon.style.animation = 'iconBounce .55s cubic-bezier(.36,.07,.19,.97)';
      });
    });
  });
}

/* ── INIT ALL ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgress();
  initNavbar();
  initHamburger();
  initParticles();
  initHeroGlow();
  initHeroTitle();
  initReveal();
  initCounters();
  init3DTilt();
  initRipple();
  initCardShine();
  initTimelineDraw();
  initFloating();
  initParallax();
  initActiveNav();
  initContactForm();
  initLang();
  initSmoothScroll();
  initStaggerCards();
  initTableAnim();
  initValueIconBounce();
});
