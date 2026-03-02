/**
 * theme.js — Light/dark theme toggle
 * Priority: localStorage → system preference → dark (default)
 */
(function () {
  const KEY = 'portfolio-theme';
  const html = document.documentElement;

  function getPreferred() {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    // Notify other modules (particles, radar chart)
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  function toggle() {
    const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem(KEY, next);
    applyTheme(next);
  }

  // Apply on load
  applyTheme(getPreferred());

  // Wire button once DOM is ready
  function wireButton() {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButton);
  } else {
    wireButton();
  }
})();
