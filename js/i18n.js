/**
 * i18n.js — Bilingual toggle (FR / EN)
 * Must be the first script loaded.
 */

const TYPEWRITER_TITLES = {
  fr: ['Étudiant-Ingénieur en Informatique', 'IA pour la Science & le Vivant', 'Passionné de Recherche Scientifique', 'Spécialiste IA & Data Science'],
  en: ['Computer Engineering Student', 'AI for Science & Life Sciences', 'Passionate about Scientific Research', 'AI & Data Science Specialist']
};

// Expose to other scripts
window.TYPEWRITER_TITLES = TYPEWRITER_TITLES;

function setLanguage(lang) {
  if (lang !== 'fr' && lang !== 'en') lang = 'fr';

  // Persist
  localStorage.setItem('portfolio-lang', lang);

  // Update <html lang>
  document.documentElement.lang = lang;

  // Swap all [data-fr] / [data-en] elements
  document.querySelectorAll('[data-fr], [data-en]').forEach(el => {
    const text = el.dataset[lang];
    if (text === undefined) return;

    // Handle specific element types
    if (el.tagName === 'META' && el.getAttribute('name') === 'description') {
      // Update <meta name="description"> content attribute
      el.setAttribute('content', text);
    } else if (el.tagName === 'TITLE') {
      el.textContent = text;
    } else {
      el.textContent = text;
    }
  });

  // Skill tag tooltips: the CSS ::after pseudo-element reads `data-tooltip`.
  // We copy the right language's value into it on each lang switch.
  document.querySelectorAll('[data-used-in-fr]').forEach(el => {
    const tooltip = lang === 'fr' ? el.dataset.usedInFr : el.dataset.usedInEn;
    el.dataset.tooltip = tooltip || '';
  });

  // Toggle button states
  const btnFr = document.getElementById('btn-fr');
  const btnEn = document.getElementById('btn-en');
  if (btnFr && btnEn) {
    btnFr.classList.toggle('active', lang === 'fr');
    btnEn.classList.toggle('active', lang === 'en');
    btnFr.setAttribute('aria-pressed', lang === 'fr');
    btnEn.setAttribute('aria-pressed', lang === 'en');
  }

  // Update hamburger aria-label
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.setAttribute('aria-label', lang === 'fr' ? 'Ouvrir le menu' : 'Open menu');
  }

  // Notify typewriter to update if it's running
  if (window.updateTypewriterLang) {
    window.updateTypewriterLang(lang);
  }

  // Dispatch event for other scripts
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

// Initialize on load
(function init() {
  const saved = localStorage.getItem('portfolio-lang');
  const browserLang = navigator.language && navigator.language.startsWith('fr') ? 'fr' : 'en';
  const lang = saved || browserLang;
  // Slight delay to let DOM be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setLanguage(lang));
  } else {
    setLanguage(lang);
  }
})();

// Expose globally
window.setLanguage = setLanguage;

// Email obfuscation — never written as a complete address in source
(function () {
  const p = ['elias.belloumi', 'etu.utc.fr'];
  const el = document.getElementById('contact-email');
  if (!el) return;
  const addr = p[0] + '\u0040' + p[1];
  el.href = 'mailto:' + addr;
})();
