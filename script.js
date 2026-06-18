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
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ----------------------------------------------------------
     3. SMOOTH NAV LINKS
     ---------------------------------------------------------- */
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
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
     ---------------------------------------------------------- */
  const heroEls = document.querySelectorAll('.hero .reveal');

  requestAnimationFrame(() => {
    setTimeout(() => {
      heroEls.forEach((el) => el.classList.add('in-view'));
    }, 80);
  });

  /* ----------------------------------------------------------
     6. CURSOR GLOW — works on ALL project cards
     ---------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach((card) => {
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
          )
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.backgroundImage = 'none';
      });
    });
  }

})();
