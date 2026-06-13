/* ===== NINA — Main JS ===== */

/* --- Service Worker registration --- */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(function() {});
}

/* --- PWA Install prompt --- */
var deferredPrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
  var btn = document.getElementById('install-btn');
  if (btn) btn.style.display = '';
});

document.addEventListener('DOMContentLoaded', () => {

  /* --- Install button --- */
  var installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.addEventListener('click', function() {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function() {
        deferredPrompt = null;
        installBtn.style.display = 'none';
      });
    });
  }

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

  /* --- Easter Egg: shake phone to activate --- */
  var easterEgg = document.getElementById('easter-egg');
  var easterQuote = easterEgg ? easterEgg.querySelector('.easter-egg-quote') : null;
  var easterActive = false;

  var easterQuotes = [
    '"The body is your temple. Keep it pure and clean for the soul to reside in." — B.K.S. Iyengar',
    '"Sound is the medicine of the future." — Edgar Cayce',
    '"The quieter you become, the more you can hear." — Ram Dass',
    '"Yoga is the journey of the self, through the self, to the self." — The Bhagavad Gita',
    '"Healing is a matter of time, but it is sometimes also a matter of opportunity." — Hippocrates',
    '"Where words fail, music speaks." — Hans Christian Andersen',
    '"The wound is the place where the light enters you." — Rumi',
    '"In the midst of movement and chaos, keep stillness inside of you." — Deepak Chopra',
    '"Music gives a soul to the universe, wings to the mind, flight to the imagination." — Plato',
    '"You should sit in meditation for twenty minutes every day — unless you\'re too busy. Then you should sit for an hour." — Zen Proverb'
  ];

  function activateEasterEgg() {
    if (easterActive || !easterEgg) return;
    easterActive = true;
    easterQuote.textContent = easterQuotes[Math.floor(Math.random() * easterQuotes.length)];
    easterEgg.classList.add('active');
    window.dispatchEvent(new CustomEvent('easter-egg-activate'));
  }

  function deactivateEasterEgg() {
    if (!easterActive || !easterEgg) return;
    easterActive = false;
    easterEgg.classList.remove('active');
    window.dispatchEvent(new CustomEvent('easter-egg-deactivate'));
  }


  /* Triple tap on "Open to everyone" to activate */
  var footerMsg = document.querySelector('.footer-message');
  var eeTapCount = 0;
  var eeTapTimer = null;

  if (footerMsg) {
    footerMsg.style.cursor = 'pointer';
    footerMsg.addEventListener('click', function(e) {
      e.stopPropagation();
      eeTapCount++;
      if (eeTapTimer) clearTimeout(eeTapTimer);
      eeTapTimer = setTimeout(function() { eeTapCount = 0; }, 800);
      if (eeTapCount >= 3) {
        eeTapCount = 0;
        activateEasterEgg();
      }
    });
  }

  /* Close Easter egg on tap */
  if (easterEgg) {
    easterEgg.addEventListener('click', deactivateEasterEgg);
    easterEgg.addEventListener('touchend', deactivateEasterEgg);
  }

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
