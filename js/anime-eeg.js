/**
 * anime-eeg.js — EEG path drawing animation via Anime.js
 * Replaces the basic .animated class approach with a proper
 * stroke-dashoffset draw triggered when the featured project enters view.
 */
(function () {
  'use strict';

  if (typeof anime === 'undefined') return;

  const path = document.querySelector('.eeg-path');
  if (!path) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    path.style.strokeDashoffset = '0';
    return;
  }

  // Initialise stroke-dash to full path length (invisible)
  const length = path.getTotalLength();
  path.style.strokeDasharray  = length;
  path.style.strokeDashoffset = length;

  const trigger = document.querySelector('.project-featured');
  if (!trigger) return;

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    anime({
      targets: path,
      strokeDashoffset: [length, 0],
      easing: 'easeInOutCubic',
      duration: 1400,
      delay: 120,
    });
  }, { threshold: 0.35 });

  obs.observe(trigger);
})();
