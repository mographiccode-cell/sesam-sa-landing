/* =====================================================
   SESAM · Landing Page Interactions
   - Sticky header on scroll
   - Mobile nav toggle
   - IntersectionObserver reveal
   - Smooth scroll for in-page anchors
   ===================================================== */

(function () {
  'use strict';

  // ===== Sticky header on scroll =====
  const header = document.getElementById('siteHeader');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 24) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile nav toggle =====
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.querySelector('.primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close nav when clicking a link
    primaryNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    // Close nav on resize past breakpoint
    const mq = window.matchMedia('(min-width: 721px)');
    mq.addEventListener('change', e => {
      if (e.matches) {
        primaryNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
      }
    });
  }

  // ===== Reveal on scroll =====
  const revealTargets = [
    '.section-head',
    '.craft-card',
    '.reel',
    '.gallery-item',
    '.why-item',
    '.about-text',
    '.about-images',
    '.visit-info',
    '.visit-hours',
    '.hero-content > *',
    '.final-cta-inner > *',
    '.footer-grid > *',
    '.faq-list details',
    '.hero-meta li'
  ];
  const elements = document.querySelectorAll(revealTargets.join(','));
  elements.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach(el => io.observe(el));
  } else {
    // Fallback for very old browsers
    elements.forEach(el => el.classList.add('is-visible'));
  }

  // ===== Stagger reveals in grids =====
  document.querySelectorAll(
    '.craft-grid, .reels-grid, .why-grid, .gallery-grid, .hero-meta, .footer-grid, .faq-list'
  ).forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = `${Math.min(i * 60, 320)}ms`;
    });
  });

  // ===== Light parallax for hero background =====
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY * 0.18, 80);
      heroBgImg.style.transform = `scale(1.05) translateY(${y}px)`;
    }, { passive: true });
  }

  // ===== Gallery horizontal carousel =====
  const scroller = document.getElementById('galleryScroller');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const progressBar = document.getElementById('galleryProgress');
  if (scroller && prevBtn && nextBtn) {
    const isRTL = getComputedStyle(scroller).direction === 'rtl';
    // In RTL, the "next" button (visually right) means scroll to higher scrollLeft.
    // We always treat scrollLeft positive as "forward" in the DOM, so flipping
    // direction is just inverting the delta.
    const cardWidth = () => {
      const card = scroller.querySelector('.gallery-card');
      if (!card) return 360;
      const gap = parseFloat(getComputedStyle(scroller).columnGap || getComputedStyle(scroller).gap) || 24;
      return card.getBoundingClientRect().width + gap;
    };

    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const cur = Math.max(0, Math.min(scroller.scrollLeft, max));
      const pct = max > 0 ? (cur / max) * 100 : 0;
      if (progressBar) progressBar.style.width = `${Math.max(12, pct + 12)}%`;
      const atStart = cur <= 2;
      const atEnd = cur >= max - 2;
      prevBtn.toggleAttribute('disabled', atStart);
      nextBtn.toggleAttribute('disabled', atEnd);
    };

    prevBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });

    scroller.addEventListener('scroll', () => {
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Drag-to-scroll on desktop
    let isDown = false, startX = 0, startScroll = 0, dragged = false;
    scroller.addEventListener('pointerdown', (e) => {
      // Don't drag if user clicked an interactive element inside a card
      if (e.target.closest('a, button, iframe')) return;
      isDown = true;
      dragged = false;
      startX = e.clientX;
      startScroll = scroller.scrollLeft;
      scroller.classList.add('is-dragging');
      scroller.setPointerCapture(e.pointerId);
    });
    scroller.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragged = true;
      scroller.scrollLeft = startScroll - dx;
    });
    const endDrag = (e) => {
      if (!isDown) return;
      isDown = false;
      scroller.classList.remove('is-dragging');
      try { scroller.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    scroller.addEventListener('pointerup', endDrag);
    scroller.addEventListener('pointercancel', endDrag);

    // Suppress accidental click on links after a drag
    scroller.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        if (dragged) { e.preventDefault(); dragged = false; }
      });
    });

    // Keyboard nav when the scroller is focused
    scroller.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { scroller.scrollBy({ left: cardWidth(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft')  { scroller.scrollBy({ left: -cardWidth(), behavior: 'smooth' }); }
    });
  }

  // ===== Smooth scroll fallback for older browsers =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ===== Lazy-load images natively (extra safety) =====
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
    });
  }
})();
