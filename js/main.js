/* ===== NINA — Main JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar scroll effect --- */
  const nav = document.querySelector('.nav');
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --- Hero parallax --- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = 'translateY(' + (scrollY * 0.4) + 'px)';
    }, { passive: true });
  }

  /* --- Mobile menu toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });
  }

  /* --- Scroll fade-in animation --- */
  const faders = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    faders.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    faders.forEach(el => el.classList.add('visible'));
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = nav.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- About logo parallax --- */
  const aboutLogo = document.querySelector('.about-bg-logo');
  if (aboutLogo) {
    window.addEventListener('scroll', () => {
      const section = aboutLogo.parentElement;
      const rect = section.getBoundingClientRect();
      const speed = 0.15;
      const offset = rect.top * speed;
      aboutLogo.style.transform = 'translate(-50%, -50%) translateY(' + offset + 'px) rotate(' + (offset * 0.05) + 'deg)';
    }, { passive: true });
  }

  /* --- Tubes Interactive Background --- */
  var tubesCanvas = document.getElementById('tubes-canvas');
  if (tubesCanvas) {
    (async function() {
      try {
        var module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        var TubesCursor = module.default || module.Tubes1Cursor || module;
        if (typeof TubesCursor === 'function') {
          TubesCursor(tubesCanvas, {
            tubes: {
              colors: ['#7B3FA0', '#9B5FBB', '#D946A8'],
              lights: {
                intensity: 150,
                colors: ['#7B3FA0', '#D946A8', '#E06BB8', '#9B5FBB']
              }
            }
          });
        }
      } catch(e) {
        console.warn('Tubes background not available:', e);
      }
    })();
  }

  /* --- Back to Top button --- */
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      var scrolled = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      backToTop.classList.toggle('visible', scrolled > docHeight * 0.5);
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Cookie Consent Banner --- */
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  const consent = localStorage.getItem('cookie-consent');

  if (!consent) {
    setTimeout(() => banner.classList.add('visible'), 800);
  } else if (consent === 'declined') {
    document.querySelectorAll('link[href*="fonts.googleapis"]').forEach(el => el.remove());
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      banner.classList.remove('visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'declined');
      banner.classList.remove('visible');
      document.querySelectorAll('link[href*="fonts.googleapis"]').forEach(el => el.remove());
    });
  }

});
