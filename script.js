/* =====================================================
   SESAM · Landing Page Interactions
   - Sticky header on scroll
   - Mobile nav toggle (with hamburger animation)
   - IntersectionObserver reveal (sections below the fold)
   - Hero counter animation
   - Gallery horizontal carousel (prev/next, drag, progress)
   - Smooth scroll for in-page anchors
   ===================================================== */

(function () {
  'use strict';

  // ===== Mark html as JS-enabled so .reveal can hide elements safely =====
  // (Without this class, .reveal is a no-op and all content stays visible.)
  document.documentElement.classList.add('js-revealing');

  // ===== Sticky header on scroll =====
  const header = document.getElementById('siteHeader');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          header.classList.toggle('is-scrolled', y > 24);
          header.classList.toggle('shadow-sm', y > 24);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== Mobile nav toggle =====
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.classList.add('hidden');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      mobileMenu.classList.remove('hidden');
      navToggle.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
    };
    navToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      isOpen ? closeMenu() : openMenu();
    });
    // Close menu when a link inside it is clicked
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    // Close menu when window resizes to desktop
    const mq = window.matchMedia('(min-width: 1024px)');
    mq.addEventListener('change', e => { if (e.matches) closeMenu(); });
    // Close menu on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) closeMenu();
    });
  }

  // ===== Reveal on scroll (below-the-fold elements) =====
  // Find all elements that ALREADY have the .reveal class in the HTML
  // (works regardless of which Tailwind/styling classes they're using).
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Slight stagger for siblings of the same parent
            const parent = entry.target.parentElement;
            const siblings = parent
              ? Array.from(parent.children).filter(c => c.classList.contains('reveal'))
              : [];
            const idx = siblings.indexOf(entry.target);
            const delay = idx > 0 ? Math.min(idx * 50, 250) : 0;
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    revealEls.forEach(el => io.observe(el));

    // Safety net: if the user has scrolled past sections quickly
    // (e.g. anchor jump) the IO might not fire. After 4s, force-show
    // any remaining hidden elements so nothing is permanently invisible.
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 4000);
  } else {
    // No IO support or no elements — just show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ===== Hero counter animation =====
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (!target) return;
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();
    const fmt = (n) => {
      const rounded = Math.round(n);
      return target >= 1000
        ? rounded.toLocaleString('en-US') + suffix
        : rounded + suffix;
    };
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  };

  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length) {
    if ('IntersectionObserver' in window) {
      const co = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counterEls.forEach(el => co.observe(el));
    } else {
      counterEls.forEach(animateCount);
    }
  }

  // ===== Light parallax for hero background =====
  const heroBgImg = document.querySelector('.hero-pan');
  if (heroBgImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY * 0.15, 60);
      // Compose with the existing pan animation's transform origin
      heroBgImg.style.translate = `0 ${y}px`;
    }, { passive: true });
  }

  // ===== Gallery horizontal carousel =====
  const scroller = document.getElementById('galleryScroller');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const progressBar = document.getElementById('galleryProgress');
  if (scroller && prevBtn && nextBtn) {
    const cardWidth = () => {
      const card = scroller.querySelector('article');
      if (!card) return scroller.clientWidth * 0.8;
      const gap = parseFloat(getComputedStyle(scroller).columnGap || getComputedStyle(scroller).gap) || 16;
      return card.getBoundingClientRect().width + gap;
    };

    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const cur = Math.max(0, Math.min(scroller.scrollLeft, max));
      const pct = max > 0 ? (cur / max) * 100 : 0;
      if (progressBar) progressBar.style.width = `${Math.max(15, pct + 15)}%`;
      const atStart = cur <= 2;
      const atEnd = cur >= max - 2;
      prevBtn.toggleAttribute('disabled', atStart);
      nextBtn.toggleAttribute('disabled', atEnd);
    };

    prevBtn.addEventListener('click', () => scroller.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => scroller.scrollBy({ left: cardWidth(), behavior: 'smooth' }));

    scroller.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();

    // Drag-to-scroll on desktop
    let isDown = false, startX = 0, startScroll = 0, dragged = false;
    scroller.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button')) return;
      isDown = true;
      dragged = false;
      startX = e.clientX;
      startScroll = scroller.scrollLeft;
      scroller.classList.add('is-dragging');
      try { scroller.setPointerCapture(e.pointerId); } catch (_) {}
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
    scroller.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => { if (dragged) { e.preventDefault(); dragged = false; } });
    });
    scroller.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') scroller.scrollBy({ left: cardWidth(), behavior: 'smooth' });
      if (e.key === 'ArrowLeft') scroller.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });
  }

  // ===== Smooth scroll for in-page anchors =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
