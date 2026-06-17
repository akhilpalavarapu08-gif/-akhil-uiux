/* ============================================================
   AKHIL PALAVARAPU — PORTFOLIO
   Vanilla JS: scroll reveal · nav state · copy email
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAV — add "scrolled" class on scroll
     ---------------------------------------------------------- */
  const nav = document.getElementById('nav');

  function onScroll() {
    if (window.scrollY > 12) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ----------------------------------------------------------
     2. SCROLL REVEAL — IntersectionObserver
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ----------------------------------------------------------
     3. SMOOTH NAV LINKS — offset for fixed nav height
     ---------------------------------------------------------- */
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
    10
  ) || 52;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     4. COPY EMAIL BUTTON
     ---------------------------------------------------------- */
  const copyBtn = document.getElementById('copyEmailBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'akhilpalavarapu08@gmail.com';

      // Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(triggerCopied).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
        triggerCopied();
      }

      function triggerCopied() {
        copyBtn.classList.add('copied');
        copyBtn.setAttribute('aria-label', 'Email copied!');
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.setAttribute('aria-label', 'Copy email address');
        }, 2200);
      }
    });
  }

  /* ----------------------------------------------------------
     5. HERO ENTRANCE ANIMATION
        Stagger the hero elements in on first load
     ---------------------------------------------------------- */
  const heroEls = document.querySelectorAll('.hero .reveal');

  // Give a brief moment for page to paint, then trigger
  requestAnimationFrame(() => {
    setTimeout(() => {
      heroEls.forEach((el) => el.classList.add('in-view'));
    }, 80);
  });

  /* ----------------------------------------------------------
     6. CURSOR GLOW ON PROJECT CARD (desktop only)
        Subtle radial highlight that follows the mouse
     ---------------------------------------------------------- */
  const card = document.querySelector('.project-card');

  if (card && window.matchMedia('(pointer: fine)').matches) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--gx', `${x}%`);
      card.style.setProperty('--gy', `${y}%`);
      card.style.backgroundImage = `
        radial-gradient(
          circle 480px at var(--gx) var(--gy),
          rgba(0,113,227,0.045),
          transparent 60%
        ),
        none
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.backgroundImage = 'none';
    });
  }

})();
