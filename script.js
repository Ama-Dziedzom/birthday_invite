/* ── Intersection Observer — fade-in on scroll ─────────────── */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

/* ── Stagger children of fade-in containers ────────────────── */
document.querySelectorAll('.about__details, .dresscode__grid, .palette__swatches, .gallery__grid').forEach((parent) => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
  });
});

/* ── RSVP Form ─────────────────────────────────────────────── */
const form = document.getElementById('rsvpForm');
const successMsg = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const attendance = form.querySelector('input[name="attendance"]:checked');

    if (!name) {
      shakeField(form.querySelector('#name'));
      return;
    }

    if (!attendance) {
      shakeField(form.querySelector('.radio-group'));
      return;
    }

    /* Simulate submission */
    const btn = form.querySelector('.btn');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.querySelectorAll('input, textarea, .btn').forEach((el) => {
        el.disabled = true;
      });
      btn.style.display = 'none';
      successMsg.classList.add('visible');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 900);
  });
}

function shakeField(el) {
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 380, easing: 'ease-in-out' }
  );
}

/* ── Soft parallax on hero ─────────────────────────────────── */
const hero = document.querySelector('.hero');

if (hero && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const heroInner = hero.querySelector('.hero__inner');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroInner.style.transform = `translateY(${scrollY * 0.18}px)`;
      hero.style.setProperty('--parallax-offset', `${scrollY * 0.08}px`);
    }
  }, { passive: true });
}

/* ── Smooth active nav highlight (optional, future nav) ────── */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => navObserver.observe(s));

/* ── Swatch tooltip ripple ─────────────────────────────────── */
document.querySelectorAll('.swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    const hex = swatch.querySelector('.swatch__hex').textContent;
    navigator.clipboard?.writeText(hex).catch(() => {});

    const ripple = document.createElement('span');
    ripple.textContent = 'Copied!';
    ripple.style.cssText = `
      position:absolute;
      font-size:0.65rem;
      letter-spacing:0.08em;
      font-family:var(--font-sans);
      color:var(--text-mid);
      pointer-events:none;
      animation:rippleFade 1.2s ease forwards;
    `;
    swatch.style.position = 'relative';
    swatch.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1200);
  });
});

const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes rippleFade {
    0%   { opacity:0; transform:translateY(0); }
    20%  { opacity:1; }
    100% { opacity:0; transform:translateY(-20px); }
  }
`;
document.head.appendChild(styleEl);
