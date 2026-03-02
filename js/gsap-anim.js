/**
 * gsap-anim.js — GSAP + ScrollTrigger enhancements
 * Handles:
 *   1. Section labels — slide-in from left (they lack .animate-on-scroll)
 *   2. Experience timeline track — draws as user scrolls through the section
 *   3. Skills graph container — fade in on scroll
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // ── 1. Section labels entrance ────────────────────────────────
  // .section-label elements are aria-hidden and don't use .animate-on-scroll,
  // so GSAP can animate them without conflicts.
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      x: -18,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 93%',
        once: true,
      },
    });
  });

  // ── 2. Timeline track draw ────────────────────────────────────
  // .timeline-track is an explicit div (not a ::before) that GSAP
  // scales from 0 → 1 on the Y axis as the user scrolls.
  const track = document.querySelector('.timeline-track');
  if (track) {
    gsap.fromTo(track,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 72%',
          end: 'bottom 28%',
          scrub: 1.5,
        },
      }
    );
  }

  // ── 3. Skills graph fade-in ───────────────────────────────────
  const graph = document.getElementById('skills-graph');
  if (graph) {
    gsap.from(graph, {
      opacity: 0,
      y: 24,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: graph,
        start: 'top 87%',
        once: true,
      },
    });
  }

})();
