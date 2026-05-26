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
  // Words are pre-marked in HTML as .hero-word spans — just trigger the animation
  const words = document.querySelectorAll('.hero-title .hero-word');
  words.forEach((w, i) => {
    setTimeout(() => w.classList.add('in'), 500 + i * 120);
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

  const dict = {
    /* ── Navbar ── */
    'nav.about':           { zh:'關於東竹',       en:'About Us' },
    'nav.branded':         { zh:'原廠藥解決方案',  en:'Branded Solutions' },
    'nav.generic':         { zh:'學名藥',          en:'Generics' },
    'nav.history':         { zh:'歷史沿革',        en:'History' },
    'nav.careers':         { zh:'工作機會',        en:'Careers' },
    'nav.contact':         { zh:'聯絡我們',        en:'Contact' },
    'nav.dd.intro':        { zh:'公司簡介',        en:'Company Profile' },
    'nav.dd.values':       { zh:'價值與願景',      en:'Values & Vision' },
    'nav.dd.compliance':   { zh:'道德與合規',      en:'Ethics & Compliance' },
    'nav.dd.history':      { zh:'歷史沿革',        en:'History' },
    'nav.dd.capabilities': { zh:'核心能力',        en:'Core Capabilities' },
    'nav.dd.lifecycle':    { zh:'生命週期管理',    en:'Lifecycle Management' },
    'nav.dd.bproducts':    { zh:'原廠藥產品',      en:'Branded Products' },
    'nav.dd.gprocess':     { zh:'學名藥流程',      en:'Generic Process' },
    'nav.dd.gproducts':    { zh:'學名藥產品',      en:'Generic Products' },
    /* ── Hero ── */
    'hero.badge':     { zh:'成立於 1986 · 專業醫藥代理超過 40 年', en:'Est. 1986 · 40+ Years of Pharmaceutical Excellence' },
    'hero.title':     { zh:'守護每一個<br /><em>健康的未來</em>',  en:'Protecting Every<br /><em>Healthy Future</em>' },
    'hero.subtitle':  { zh:'業務行銷導向的整合性藥品公司<br />協助原研藥廠在台灣市場各階段最大化營收與市場聲量',
                        en:'An integrated pharmaceutical company driven by sales & marketing<br />Maximizing revenue and market presence for innovators in Taiwan' },
    'hero.cta1':      { zh:'了解東竹',  en:'About Us' },
    'hero.cta2':      { zh:'聯絡我們',  en:'Contact Us' },
    'hero.stat.unit.yr': { zh:'年', en:'Yrs' },
    'hero.stat1':     { zh:'深耕台灣醫藥市場',      en:'In Taiwan Pharma Market' },
    'hero.stat2':     { zh:'2024 年度營收（新台幣）', en:'2024 Revenue (TWD)' },
    'hero.stat3':     { zh:'代理原廠藥品項',         en:'Branded Drug Products' },
    'hero.stat4':     { zh:'自有學名藥品項',         en:'Generic Drug Products' },
    /* ── About ── */
    'about.tag':         { zh:'關於東竹', en:'About Us' },
    'about.title':       { zh:'業務行銷導向的<br /><em>整合性藥品公司</em>', en:'A Sales & Marketing<br /><em>Integrated Pharma Company</em>' },
    'about.p1':          { zh:'東竹藥品協助原研藥廠在產品生命週期各階段最大化營收與市場聲量，不論是計畫進入台灣市場、進入市場初期、快速成長期、成熟期乃至衰退期，我們均能提供量身訂製的策略與全方位執行支援。',
                           en:'EB Pharmaceutical helps innovators maximize revenue and market presence at every stage of the product lifecycle — from market entry planning and launch through rapid growth, maturity, and beyond — with tailored strategies and comprehensive execution support.' },
    'about.p2':          { zh:'除原廠藥代理業務外，東竹亦積極透過委託研發及製造方式開發自有學名藥，以嚴格品質標準與具競爭力的價格，為醫療院所與患者提供更多優質用藥選擇。',
                           en:'Beyond branded distribution, EB Pharma actively develops its own generic drugs through CMO/CDMO partnerships, providing medical institutions and patients with high-quality, competitively priced therapeutic options.' },
    'about.chip1':       { zh:'誠信',     en:'Integrity' },
    'about.chip2':       { zh:'積極',     en:'Proactivity' },
    'about.chip3':       { zh:'團隊合作', en:'Teamwork' },
    'about.badge_label': { zh:'2024 年度營收', en:'2024 Revenue' },
    'about.cert_title':  { zh:'財務透明',         en:'Financial Transparency' },
    'about.cert_sub':    { zh:'KPMG 審計 · 自 2017 年起', en:'KPMG Audited · Since 2017' },
    /* ── Values ── */
    'val.tag':    { zh:'價值與願景', en:'Values & Vision' },
    'val.title':  { zh:'我們的<em>核心承諾</em>', en:'Our <em>Core Commitments</em>' },
    'val.desc':   { zh:'與供應商、物流廠商、醫療機構緊密合作，提供給病患最優質的產品及醫療服務', en:'Partnering closely with suppliers, logistics providers, and medical institutions to deliver the best products and care to patients' },
    'val.v1':     { zh:'誠信',     en:'Integrity' },
    'val.v1d':    { zh:'全員簽署行為準則，每年進行合規複訓，以透明誠實建立長久夥伴關係', en:'All staff sign a Code of Conduct with annual compliance training, building lasting partnerships on honesty and transparency' },
    'val.v2':     { zh:'積極',     en:'Proactivity' },
    'val.v2d':    { zh:'主動掌握市場機會，以前瞻視野驅動業務成長，協助夥伴搶占市場先機', en:'Proactively seizing market opportunities, driving growth with forward-thinking vision to help partners capture market leadership' },
    'val.v3':     { zh:'團隊合作', en:'Teamwork' },
    'val.v3d':    { zh:'跨部門緊密協作，結合業務、醫學、法規、通路各專業，共創卓越成果', en:'Cross-functional collaboration across sales, medical, regulatory, and channel teams to deliver outstanding outcomes' },
    /* ── Branded Solutions ── */
    'br.tag':   { zh:'原廠藥解決方案', en:'Branded Solutions' },
    'br.title': { zh:'全生命週期<em>專業服務</em>', en:'Full Lifecycle <em>Professional Services</em>' },
    'br.desc':  { zh:'不論您的產品處於哪個階段，東竹提供量身定制的策略與全方位執行支援', en:'Whatever stage your product is in, EB Pharma provides tailored strategies and comprehensive execution support' },
    'lc.01t':   { zh:'市場進入規劃', en:'Market Entry Planning' },
    'lc.01d':   { zh:'市場分析、法規策略、定價規劃、健保申請輔導、准入策略', en:'Market analysis, regulatory strategy, pricing, NHI application guidance, access planning' },
    'lc.02t':   { zh:'初期進入',     en:'Launch Phase' },
    'lc.02d':   { zh:'醫學教育推廣、醫院開發、KOL關係建立、業務網絡佈局', en:'Medical education, hospital development, KOL engagement, sales network setup' },
    'lc.03t':   { zh:'快速成長',     en:'Rapid Growth' },
    'lc.03d':   { zh:'市場份額擴張、通路深化、品牌建立、業績最大化', en:'Market share expansion, channel deepening, brand building, revenue maximization' },
    'lc.04t':   { zh:'成熟期維護',   en:'Maturity Maintenance' },
    'lc.04d':   { zh:'收益保護、競爭防禦、適應症擴展、新客群開發', en:'Revenue protection, competitive defense, indication expansion, new segment development' },
    'lc.05t':   { zh:'衰退期下市',   en:'Decline & Exit' },
    'lc.05d':   { zh:'有序退場規劃、庫存管理、患者轉換方案', en:'Orderly exit planning, inventory management, patient transition programs' },
    /* ── Capabilities ── */
    'cap.tag':   { zh:'核心能力', en:'Core Capabilities' },
    'cap.title': { zh:'六大<em>專業核心</em>', en:'Six <em>Professional Pillars</em>' },
    'cap.01t':   { zh:'業務行銷', en:'Sales & Marketing' },
    'cap.01d':   { zh:'專業醫藥業務團隊遍布全台，與各層級醫療院所建立深厚信任關係', en:'Professional pharmaceutical sales teams across Taiwan, building deep trust with medical institutions at all levels' },
    'cap.02t':   { zh:'醫學教育', en:'Medical Education' },
    'cap.02d':   { zh:'規劃並執行醫學研討會、繼續教育活動，提升臨床知識應用與醫師認同', en:'Planning and executing medical symposiums and CME activities to enhance clinical knowledge and physician recognition' },
    'cap.03t':   { zh:'市場准入', en:'Market Access' },
    'cap.03d':   { zh:'健保申請、醫院藥事委員會公關、藥品列冊策略，加速產品進入市場', en:'NHI applications, hospital pharmacy committee relations, and formulary listing strategies to accelerate market entry' },
    'cap.04t':   { zh:'通路管理', en:'Channel Management' },
    'cap.04d':   { zh:'完善的物流配銷體系，確保藥品及時、安全、合規地送達各醫療院所', en:'A robust logistics and distribution system ensuring timely, safe, and compliant drug delivery to all medical institutions' },
    'cap.05t':   { zh:'數據分析', en:'Data Analytics' },
    'cap.05d':   { zh:'深度市場洞察與競爭情報分析，支援策略決策與資源精準配置', en:'In-depth market insights and competitive intelligence to support strategic decisions and precise resource allocation' },
    'cap.06t':   { zh:'績效管理', en:'Performance Management' },
    'cap.06d':   { zh:'完整 KPI 追蹤體系，透明呈現業績成果，確保目標如期達成', en:'A comprehensive KPI tracking system to transparently present performance results and ensure targets are met on schedule' },
    /* ── Branded Products table ── */
    'prod.tag':   { zh:'原廠藥產品', en:'Branded Products' },
    'prod.title': { zh:'代理<em>原廠藥品項</em>', en:'Our <em>Branded Portfolio</em>' },
    'prod.desc':  { zh:'東竹藥品代理多項知名原廠藥，涵蓋神經科、精神科等專科領域', en:'EB Pharma distributes renowned branded drugs covering neurology, psychiatry, and specialty fields' },
    'prod.col1':  { zh:'中文品名', en:'Chinese Name' },
    'prod.col2':  { zh:'英文品名', en:'Brand Name' },
    'prod.col3':  { zh:'劑型',     en:'Formulation' },
    'prod.col4':  { zh:'治療領域', en:'Therapeutic Area' },
    'prod.f1':    { zh:'膠囊・穿皮貼片・內服液劑', en:'Capsule · Patch · Oral Solution' },
    'prod.f2':    { zh:'錠劑・懸浮液劑',           en:'Tablet · Suspension' },
    'prod.f3':    { zh:'錠劑',   en:'Tablet' },
    'prod.f4':    { zh:'膠囊',   en:'Capsule' },
    'prod.f5':    { zh:'膠囊',   en:'Capsule' },
    'prod.f6':    { zh:'膜衣錠', en:'Film-Coated Tablet' },
    'prod.f7':    { zh:'糖衣錠', en:'Sugar-Coated Tablet' },
    'prod.f8':    { zh:'膠囊',   en:'Capsule' },
    'prod.ta.neuro': { zh:'神經科', en:'Neurology' },
    'prod.ta.psych': { zh:'精神科', en:'Psychiatry' },
    /* ── Generic Business ── */
    'gen.tag':   { zh:'學名藥事業', en:'Generic Drug Business' },
    'gen.title': { zh:'自主研發<br /><em>高品質學名藥</em>', en:'In-house Development of<br /><em>High-Quality Generics</em>' },
    'gen.p1':    { zh:'自 2003 年起，東竹藥品積極透過委託研發及製造方式開發自有學名藥，以嚴格品質標準與具競爭力的價格，為醫療院所與患者提供更多優質用藥選擇。',
                   en:'Since 2003, EB Pharma has actively developed its own generic drugs through CMO/CDMO partnerships, providing medical institutions and patients with high-quality, competitively priced alternatives.' },
    'gen.s1t':   { zh:'臨床研發', en:'Clinical Development' },
    'gen.s1d':   { zh:'挑選具市場潛力且專利近年將到期之標的，進行處方開發及生體相等性試驗', en:'Selecting off-patent targets with market potential and conducting formulation development and bioequivalence studies' },
    'gen.s2t':   { zh:'委託製造', en:'Contract Manufacturing' },
    'gen.s2d':   { zh:'依照劑型選定符合 GMP 標準的代工廠進行委託製造，確保品質穩定', en:'Partnering with GMP-certified CMOs by dosage form to ensure consistent product quality' },
    'gen.s3t':   { zh:'市場通路', en:'Market Distribution' },
    'gen.s3d':   { zh:'以價格敏感客群為主要銷售對象，再拓展醫院標案市場，建立完整銷售網路', en:'Targeting price-sensitive segments first, then expanding to hospital tender markets to build a complete sales network' },
    'gen.gv_label': { zh:'自 2003 年',  en:'Since 2003' },
    'gen.gv_sub':   { zh:'持續研發創新', en:'Continuous Innovation' },
    /* ── Generic Products ── */
    'gp.tag':    { zh:'學名藥產品', en:'Generic Products' },
    'gp.title':  { zh:'自有<em>學名藥品項</em>', en:'Our <em>Generic Portfolio</em>' },
    'gp.desc':   { zh:'涵蓋精神科、神經科、消化科等多元治療領域', en:'Covering psychiatry, neurology, gastroenterology, and more' },
    'gp.banner': { zh:'自主研發 · 嚴格品管 · 多元治療領域', en:'In-house R&D · Stringent QC · Diverse Therapeutic Areas' },
    'gp.tag.antidep':  { zh:'抗憂鬱',  en:'Antidepressant' },
    'gp.tag.psych':    { zh:'精神科',  en:'Psychiatry' },
    'gp.tag.gi':       { zh:'消化科',  en:'Gastroenterology' },
    'gp.tag.cardio':   { zh:'心臟科',  en:'Cardiology' },
    'gp.tag.cv':       { zh:'心血管',  en:'Cardiovascular' },
    'gp.tag.analgesic':{ zh:'止痛消炎',en:'Analgesic' },
    'gp.tag.git':      { zh:'腸胃科',  en:'GI' },
    /* ── History ── */
    'hist.tag':   { zh:'歷史沿革',          en:'Company History' },
    'hist.title': { zh:'40 年<em>醫藥傳承</em>', en:'40 Years of <em>Pharmaceutical Legacy</em>' },
    'hist.1986t': { zh:'東竹藥品創立', en:'EB Pharmaceutical Founded' },
    'hist.1986d': { zh:'以業務行銷為導向，深耕台灣醫藥市場，奠定長期發展基石', en:'Founded with a sales & marketing focus, establishing a strong foundation in the Taiwan pharmaceutical market' },
    'hist.90t':   { zh:'取得諾華系列產品經銷權', en:'Novartis Distribution Rights Acquired' },
    'hist.90d':   { zh:'陸續取得 Cibacen、Trileptal、Ritalin、Exelon、Gilenya 等重磅原廠藥之台灣經銷授權，成為台灣諾華最大經銷商', en:'Progressively acquired Taiwan distribution rights for Cibacen, Trileptal, Ritalin, Exelon, and Gilenya, becoming Novartis\'s largest distributor in Taiwan' },
    'hist.2003t': { zh:'學名藥事業啟動', en:'Generic Drug Business Launched' },
    'hist.2003d': { zh:'開始透過委託研發及製造方式開發自有學名藥產品線，拓展業務版圖', en:'Began developing its own generic drug product lines through CMO/CDMO partnerships, expanding the business scope' },
    'hist.2017t': { zh:'KPMG 財務審計合作', en:'KPMG Financial Audit Partnership' },
    'hist.2017d': { zh:'引入國際四大會計師事務所 KPMG 進行財務審計，強化公司治理透明度', en:'Engaged KPMG, one of the Big Four accounting firms, for annual financial audits to strengthen corporate governance transparency' },
    'hist.2024t': { zh:'營收突破 10 億新台幣', en:'Revenue Surpasses TWD 1 Billion' },
    'hist.2024d': { zh:'年度營收達成里程碑，見證東竹持續穩健的成長動能與市場地位', en:'A milestone annual revenue, demonstrating EB Pharma\'s steady growth momentum and market position' },
    'hist.2025t': { zh:'取得 Rosutor 與 Cospirit 系列許可證', en:'Rosutor & Cospirit Licenses Obtained' },
    'hist.2025d': { zh:'持續擴大產品組合，取得新系列藥品許可，強化未來成長動能', en:'Continually expanding the product portfolio with new drug licenses to strengthen future growth momentum' },
    /* ── Compliance ── */
    'comp.tag':   { zh:'道德與合規', en:'Ethics & Compliance' },
    'comp.title': { zh:'誠信是我們<br /><em>最重要的資產</em>', en:'Integrity is Our<br /><em>Most Valuable Asset</em>' },
    'comp.p1':    { zh:'東竹藥品要求全體員工簽署行為準則，並每年定期進行合規複訓。我們深信，唯有在誠信與透明的基礎上建立的商業關係，才能經得起時間的考驗，成就長久的夥伴情誼。',
                   en:'EB Pharma requires all employees to sign a Code of Conduct and participate in annual compliance training. We firmly believe that only business relationships built on integrity and transparency can stand the test of time and create lasting partnerships.' },
    'comp.cta':   { zh:'下載行為準則手冊', en:'Download Code of Conduct' },
    'comp.i1t':   { zh:'全員簽署行為準則', en:'Code of Conduct for All' },
    'comp.i1d':   { zh:'所有員工均須簽署並遵守東竹行為準則', en:'All employees must sign and adhere to the EB Pharma Code of Conduct' },
    'comp.i2t':   { zh:'年度合規複訓',   en:'Annual Compliance Training' },
    'comp.i2d':   { zh:'每年定期進行合規教育訓練，確保全員知法守法', en:'Regular annual compliance training ensures all staff remain informed and compliant' },
    'comp.i3t':   { zh:'KPMG 財務審計', en:'KPMG Financial Audit' },
    'comp.i3d':   { zh:'自 2017 年起由 KPMG 執行年度財務審計，維持高度透明', en:'Annual financial audits by KPMG since 2017, maintaining the highest level of transparency' },
    'comp.i4t':   { zh:'透明財務報告', en:'Transparent Financial Reporting' },
    'comp.i4d':   { zh:'定期公開財務資訊，讓夥伴與員工充分了解公司經營狀況', en:'Regular disclosure of financial information to keep partners and employees fully informed of company operations' },
    /* ── Careers ── */
    'car.tag':   { zh:'工作在東竹', en:'Work at EB Pharma' },
    'car.title': { zh:'與我們共同<em>守護健康</em>', en:'Join Us to <em>Protect Health Together</em>' },
    'car.desc':  { zh:'加入充滿熱忱、誠信、積極的醫藥專業團隊，共創更健康的台灣', en:'Join a passionate, ethical, and proactive pharmaceutical team to build a healthier Taiwan' },
    'car.c1tag': { zh:'業務部門',     en:'Sales' },
    'car.c1tit': { zh:'專業業務代表', en:'Professional Sales Representative' },
    'car.c1des': { zh:'建立醫療院所深厚關係，推廣優質藥品，實現醫療價值，達成業績目標', en:'Build strong relationships with medical institutions, promote quality drugs, and achieve sales targets' },
    'car.c2tag': { zh:'醫學部門',     en:'Medical Affairs' },
    'car.c2tit': { zh:'醫學事務專員', en:'Medical Affairs Specialist' },
    'car.c2des': { zh:'規劃醫學教育活動，傳遞臨床知識，支援業務推廣，深化醫師認知', en:'Plan medical education events, deliver clinical knowledge, support promotional activities, and deepen physician awareness' },
    'car.c3tag': { zh:'法規部門',     en:'Regulatory Affairs' },
    'car.c3tit': { zh:'法規事務專員', en:'Regulatory Affairs Specialist' },
    'car.c3des': { zh:'處理藥品查驗登記、健保申請及法規合規事務，確保產品合法上市', en:'Handle drug registration, NHI applications, and regulatory compliance to ensure lawful market access' },
    'car.cta':   { zh:'探索更多機會', en:'Explore More Opportunities' },
    /* ── Contact ── */
    'con.tag':         { zh:'聯絡我們',   en:'Contact Us' },
    'con.title':       { zh:'開啟合作<em>共創價值</em>', en:'Start a Partnership, <em>Create Value Together</em>' },
    'con.hq_badge':    { zh:'總公司',     en:'HQ' },
    'con.hq_title':    { zh:'台北總公司', en:'Taipei Headquarters' },
    'con.hq_fax':      { zh:'傳真：02-2559-4324', en:'Fax: 02-2559-4324' },
    'con.br_badge':    { zh:'辦事處',     en:'Branch' },
    'con.br_title':    { zh:'台中辦事處', en:'Taichung Branch Office' },
    'con.form_h':      { zh:'傳送訊息',   en:'Send a Message' },
    'con.f_name':      { zh:'姓名 *',     en:'Name *' },
    'con.f_company':   { zh:'公司 / 機構', en:'Company / Organization' },
    'con.f_email':     { zh:'電子郵件 *', en:'Email *' },
    'con.f_type':      { zh:'詢問類型',   en:'Inquiry Type' },
    'con.f_msg':       { zh:'訊息內容',   en:'Message' },
    'con.f_submit':    { zh:'送出訊息',   en:'Send Message' },
    'con.opt0':        { zh:'請選擇',     en:'Please select' },
    'con.opt1':        { zh:'原廠藥代理合作', en:'Branded Drug Distribution' },
    'con.opt2':        { zh:'學名藥採購詢價', en:'Generic Drug Procurement' },
    'con.opt3':        { zh:'工作機會',       en:'Career Opportunities' },
    'con.opt4':        { zh:'其他',           en:'Other' },
    'con.ph_name':     { zh:'您的姓名',       en:'Your name' },
    'con.ph_company':  { zh:'公司名稱',       en:'Company name' },
    'con.ph_msg':      { zh:'請描述您的需求或問題…', en:'Describe your inquiry or question…' },
    /* ── Footer ── */
    'ft.tagline':   { zh:'守護每一個健康的未來', en:'Protecting Every Healthy Future' },
    'ft.col1':      { zh:'關於東竹',    en:'About EB Pharma' },
    'ft.f.intro':   { zh:'公司簡介',    en:'Company Profile' },
    'ft.f.values':  { zh:'價值與願景',  en:'Values & Vision' },
    'ft.f.comp':    { zh:'道德與合規',  en:'Ethics & Compliance' },
    'ft.f.hist':    { zh:'歷史沿革',    en:'History' },
    'ft.col2':      { zh:'業務範疇',    en:'Business' },
    'ft.f.br':      { zh:'原廠藥解決方案', en:'Branded Solutions' },
    'ft.f.bprod':   { zh:'原廠藥產品',     en:'Branded Products' },
    'ft.f.gen':     { zh:'學名藥事業',     en:'Generic Business' },
    'ft.f.gprod':   { zh:'學名藥產品',     en:'Generic Products' },
    'ft.col3':      { zh:'聯絡資訊', en:'Contact Info' },
    'ft.careers':   { zh:'工作機會', en:'Careers' },
    'ft.privacy':   { zh:'隱私權政策', en:'Privacy Policy' },
    'ft.copy':      { zh:'© 2025 東竹藥品股份有限公司 EB Pharmaceutical Co., Ltd. All rights reserved.',
                      en:'© 2025 EB Pharmaceutical Co., Ltd. All rights reserved.' },
  };

  let isEn = false;

  function applyLang(lang) {
    // text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (dict[k]) el.textContent = dict[k][lang];
    });
    // html nodes (contain <br>, <em> etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const k = el.dataset.i18nHtml;
      if (dict[k]) el.innerHTML = dict[k][lang];
    });
    // placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const k = el.dataset.i18nPh;
      if (dict[k]) el.placeholder = dict[k][lang];
    });
    // hero title special: rebuild word spans
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && dict['hero.title']) {
      heroTitle.innerHTML = dict['hero.title'][lang];
      // re-trigger word animation
      heroTitle.querySelectorAll('.hero-word').forEach((w, i) => {
        w.classList.remove('in');
        setTimeout(() => w.classList.add('in'), 100 + i * 120);
      });
    }
  }

  btn.addEventListener('click', () => {
    isEn = !isEn;
    btn.textContent = isEn ? '中' : 'EN';
    applyLang(isEn ? 'en' : 'zh');
    document.documentElement.lang = isEn ? 'en' : 'zh-TW';
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
