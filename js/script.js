/* ============================================================
   Nativa Salvador – Tourism Landing Page JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Utilities
  ---------------------------------------------------------- */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ----------------------------------------------------------
     1. Sticky header + active nav link highlight
  ---------------------------------------------------------- */
  const header = qs('#header');

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Highlight active nav link based on scroll position
  const sections  = qsa('section[id]');
  const navLinks  = qsa('.nav__link');

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('nav__link--active', href === current);
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ----------------------------------------------------------
     2. Mobile hamburger menu
  ---------------------------------------------------------- */
  const hamburger = qs('#hamburger');
  const nav       = qs('#nav');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  nav.addEventListener('click', e => {
    if (e.target.closest('.nav__link')) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ----------------------------------------------------------
     3. Smooth scroll for anchor links
  ---------------------------------------------------------- */
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = qs(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     4. Scroll-reveal animation
  ---------------------------------------------------------- */
  const revealEls = qsa('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     5. Animated counter (Highlights section)
  ---------------------------------------------------------- */
  const counterEls = qsa('.highlight-card__number[data-count]');

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counterEls.forEach(el => counterObserver.observe(el));

  /* ----------------------------------------------------------
     6. Gallery lightbox
  ---------------------------------------------------------- */
  const lightbox        = qs('#lightbox');
  const lightboxClose   = qs('#lightboxClose');
  const lightboxImage   = qs('#lightboxImage');
  const lightboxCaption = qs('#lightboxCaption');
  const galleryItems    = qsa('.gallery__item');

  function openLightbox(item) {
    const caption   = item.dataset.caption || '';
    const emoji     = item.querySelector('.gallery__placeholder').textContent.trim();
    lightboxImage.textContent   = emoji;
    lightboxCaption.textContent = caption;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  // Close on backdrop click
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) closeLightbox();
  });

  /* ----------------------------------------------------------
     7. Testimonials slider
  ---------------------------------------------------------- */
  const slider    = qs('#testimonialsSlider');
  const cards     = qsa('.testimonial-card', slider);
  const dotsWrap  = qs('#testimonialDots');
  const prevBtn   = qs('#testimonialPrev');
  const nextBtn   = qs('#testimonialNext');
  let   current   = 0;
  let   autoTimer = null;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className  = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
    dot.dataset.index = i;
    dotsWrap.appendChild(dot);
  });

  const dots = qsa('.testimonial-dot', dotsWrap);

  function goTo(index) {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dotsWrap.addEventListener('click', e => {
    const dot = e.target.closest('.testimonial-dot');
    if (!dot) return;
    goTo(parseInt(dot.dataset.index, 10));
    resetAuto();
  });

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  startAuto();

  /* ----------------------------------------------------------
     8. Contact form validation
  ---------------------------------------------------------- */
  const contactForm   = qs('#contactForm');
  const formSuccess   = qs('#formSuccess');

  function validateField(id, errorId, check, message) {
    const field = qs(`#${id}`);
    const error = qs(`#${errorId}`);
    if (!field) return true;
    const valid = check(field.value.trim());
    field.classList.toggle('error', !valid);
    error.textContent = valid ? '' : message;
    return valid;
  }

  function validateForm() {
    const nameOk = validateField(
      'name', 'nameError',
      v => v.length >= 3,
      'Por favor, informe seu nome completo.'
    );
    const emailOk = validateField(
      'email', 'emailError',
      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      'Por favor, informe um e-mail válido.'
    );
    const messageOk = validateField(
      'message', 'messageError',
      v => v.length >= 10,
      'Sua mensagem deve ter pelo menos 10 caracteres.'
    );
    return nameOk && emailOk && messageOk;
  }

  if (contactForm) {
    // Live validation on blur
    ['name', 'email', 'message'].forEach(id => {
      const el = qs(`#${id}`);
      if (el) el.addEventListener('blur', validateForm);
    });

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm()) return;

      // Simulate async submission
      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Enviando…';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Enviar Mensagem ✉️';
        formSuccess.removeAttribute('hidden');
        setTimeout(() => formSuccess.setAttribute('hidden', ''), 6000);
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     9. Back-to-top button
  ---------------------------------------------------------- */
  const backToTop = qs('#backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.removeAttribute('hidden');
    } else {
      backToTop.setAttribute('hidden', '');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     10. Footer – current year
  ---------------------------------------------------------- */
  const yearEl = qs('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
