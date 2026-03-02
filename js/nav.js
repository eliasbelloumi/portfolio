/**
 * nav.js — Sticky nav, hamburger, active section tracking, smooth scroll offset
 */
document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // ===================== SCROLL EFFECTS =====================
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===================== HAMBURGER MENU =====================
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      navLinks.classList.toggle('mobile-open', isOpen);
    });

    // Close menu on link click
    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        navLinks.classList.remove('mobile-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('mobile-open')) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        navLinks.classList.remove('mobile-open');
      }
    });

    // Trap focus when menu open (accessibility)
    navLinks.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        navLinks.classList.remove('mobile-open');
        hamburger.focus();
      }
    });
  }

  // ===================== SMOOTH SCROLL WITH OFFSET =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===================== ACTIVE SECTION HIGHLIGHTING =====================
  function highlightActiveLink() {
    let current = '';
    const scrollY = window.scrollY + navbar.offsetHeight + 60;

    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        current = section.id;
      }
    });

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
  }
});
