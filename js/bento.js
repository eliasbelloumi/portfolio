/**
 * bento.js — Overlay open/close for bento grid tiles
 * Each tile opens a fullscreen overlay showing only its own section.
 */
(function () {
  const overlay = document.getElementById('overlay');
  const overlayBody = document.getElementById('overlay-body');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayClose = document.getElementById('overlay-close');
  const overlayBack = document.getElementById('overlay-back');
  const sections = overlayBody ? Array.from(overlayBody.querySelectorAll('section')) : [];
  let lastFocused = null;

  // Hide all sections initially (shown one-at-a-time in overlay)
  sections.forEach(function (s) { s.hidden = true; });

  function openOverlay(sectionId, label) {
    lastFocused = document.activeElement;
    overlayTitle.textContent = label;
    // Show only the target section
    sections.forEach(function (s) { s.hidden = true; });
    const target = document.getElementById(sectionId);
    if (target) {
      target.hidden = false;
      overlayBody.scrollTop = 0;
    }
    overlay.classList.add('open');
    overlayClose.focus();
  }

  function closeOverlay() {
    overlay.classList.remove('open');
    if (lastFocused) lastFocused.focus();
  }

  // Tile click listeners
  document.querySelectorAll('.bento-tile[data-section]').forEach(function (tile) {
    tile.addEventListener('click', function () {
      const titleEl = tile.querySelector('.bento-tile-title');
      const label = titleEl ? titleEl.textContent.trim() : (tile.dataset.section || '');
      openOverlay(tile.dataset.section, label);
    });
  });

  // Close handlers
  overlayClose.addEventListener('click', closeOverlay);
  if (overlayBack) overlayBack.addEventListener('click', closeOverlay);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });
})();
