/* ═══════════════════════════════════════════════
   NAVBAR SCROLL EFFECT
═══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  /* Hero height varies — turn solid after ~80px */
  navbar.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ═══════════════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.has-dropdown .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      link.closest('.has-dropdown').classList.toggle('open');
    }
  });
});

/* ═══════════════════════════════════════════════
   SMOOTH CLOSE ON LINK CLICK
═══════════════════════════════════════════════ */
document.querySelectorAll('.dropdown-item, .nav-links > .nav-item > .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
});

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   ANIMATED COUNTERS
═══════════════════════════════════════════════ */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutQuart(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-target]');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        animateCounter(counter, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ═══════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-primary');
    const original = btn.textContent;
    btn.textContent = '已送出 ✓';
    btn.style.background = 'var(--teal)';
    btn.style.color = 'var(--white)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

/* ═══════════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
═══════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--gold-light)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

/* ═══════════════════════════════════════════════
   PARALLAX HERO ORBS (subtle)
═══════════════════════════════════════════════ */
const orb1 = document.querySelector('.hero-orb-1');
const orb2 = document.querySelector('.hero-orb-2');

window.addEventListener('mousemove', (e) => {
  if (!orb1 || !orb2) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  orb1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
  orb2.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
}, { passive: true });

/* ═══════════════════════════════════════════════
   LANGUAGE TOGGLE (UI demonstration)
═══════════════════════════════════════════════ */
const langToggle = document.getElementById('langToggle');
let isEn = false;

langToggle.addEventListener('click', () => {
  isEn = !isEn;
  langToggle.textContent = isEn ? '中' : 'EN';
});
