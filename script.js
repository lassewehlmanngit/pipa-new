/* ============================================
   PIPA — Interactive Experience
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-ready');

  initHeader();
  initMobileNav();
  initAccordion();
  initFadeIn();
  initCalculator();
  initCardTilt();
  initCountUp();
  initParallax();
  initCardReveal();
});

/* ---- Sticky Header with progress ---- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);

    // Auto-hide header on scroll down, show on scroll up
    if (y > 300) {
      if (y > lastScroll && y - lastScroll > 5) {
        header.style.transform = 'translateY(-100%)';
      } else if (lastScroll - y > 5) {
        header.style.transform = 'translateY(0)';
      }
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = y;
  }, { passive: true });

  header.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, box-shadow 0.3s ease';
}

/* ---- Mobile Navigation ---- */
function initMobileNav() {
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Accordion / FAQ ---- */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasActive = item.classList.contains('active');
      const body = item.querySelector('.accordion-body');

      // Close all siblings
      item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        const b = i.querySelector('.accordion-body');
        if (b) b.style.maxHeight = '0';
      });

      if (!wasActive) {
        item.classList.add('active');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ---- Fade-In on Scroll with stagger ---- */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, .stagger-children');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small delay for staggered reveal
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach((el, i) => {
    // Stagger sibling fade-ins within the same parent
    observer.observe(el);
  });
}

/* ---- Vacancy Cost Calculator ---- */
function initCalculator() {
  const calc = document.querySelector('.calculator-card');
  if (!calc) return;

  const salarySlider = calc.querySelector('#salary');
  const daysSlider = calc.querySelector('#days-open');
  const impactSelect = calc.querySelector('#revenue-impact');
  const salaryValue = calc.querySelector('#salary-value');
  const daysValue = calc.querySelector('#days-value');
  const outputDays = calc.querySelector('#output-days');
  const outputCost = calc.querySelector('#output-cost');

  if (!salarySlider || !daysSlider) return;

  function calculate() {
    const salary = parseInt(salarySlider.value);
    const days = parseInt(daysSlider.value);
    const impactMultiplier = impactSelect ? parseFloat(impactSelect.value) : 1;

    const dailyCost = salary / 220;
    const loss = Math.round(dailyCost * days * impactMultiplier);

    if (salaryValue) salaryValue.textContent = salary.toLocaleString('de-DE') + ' €';
    if (daysValue) daysValue.textContent = days + ' Tage';
    if (outputDays) outputDays.textContent = `Offene Rolle seit ${days} Tagen`;

    // Animated counter for cost
    if (outputCost) {
      animateNumber(outputCost, loss);
    }
  }

  salarySlider.addEventListener('input', calculate);
  daysSlider.addEventListener('input', calculate);
  if (impactSelect) impactSelect.addEventListener('change', calculate);

  // Update slider track fill
  [salarySlider, daysSlider].forEach(slider => {
    slider.addEventListener('input', () => updateSliderFill(slider));
    updateSliderFill(slider);
  });

  calculate();
}

function updateSliderFill(slider) {
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const val = parseFloat(slider.value);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, #2A1A74 0%, #7CDAD9 ${pct}%, #e4e5ed ${pct}%)`;
}

function animateNumber(el, target) {
  const current = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
  const diff = target - current;
  const steps = 20;
  const stepSize = diff / steps;
  let step = 0;

  function tick() {
    step++;
    const val = step === steps ? target : Math.round(current + stepSize * step);
    el.textContent = '€' + val.toLocaleString('de-DE');
    if (step < steps) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ---- Smooth parallax for hero image ---- */
function initParallax() {
  const heroImg = document.querySelector('.hero-image');
  if (!heroImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroImg.style.transform = `translateY(${y * 0.08}px)`;
    }
  }, { passive: true });
}

/* ---- Hover reveal for cards ---- */
function initCardReveal() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.card, .offer-card, .insight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

/* ---- Subtle card tilt on hover ---- */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.offer-card, .case-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -1.5;
      const rotateY = ((x - centerX) / centerX) * 1.5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- Count-up animation for stats ---- */
function initCountUp() {
  const statElements = document.querySelectorAll('.case-stat, [data-count]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/(\d+)\+?/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = text.replace(match[0], '').trim();
          const prefix = text.substring(0, text.indexOf(match[0]));
          const hasPlus = text.includes('+');
          let current = 0;
          const duration = 1200;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(eased * target);
            el.textContent = prefix + current + (hasPlus ? '+' : '') + (suffix ? ' ' + suffix : '');
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}

/* ---- Smooth scroll for anchor links ---- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href');
  if (id === '#') return;
  const target = document.querySelector(id);
  if (target) {
    e.preventDefault();
    const headerOffset = 80;
    const pos = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  }
});

/* ---- Cookie Consent (DSGVO) ---- */
function acceptCookies() {
  localStorage.setItem('pipa-cookies', 'accepted');
  hideCookieBanner();
}

function rejectCookies() {
  localStorage.setItem('pipa-cookies', 'rejected');
  hideCookieBanner();
}

function hideCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => { banner.style.display = 'none'; }, 400);
  }
}

(function initCookieBanner() {
  const consent = localStorage.getItem('pipa-cookies');
  if (consent) {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }
})();
