/**
 * typewriter.js — Rotating typewriter effect for hero titles
 */
(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const el = document.getElementById("typewriter");
  if (!el) return;

  let titles = (window.TYPEWRITER_TITLES && window.TYPEWRITER_TITLES.fr) || [
    "AI & Data Science",
  ];
  let currentLang = localStorage.getItem("portfolio-lang") || "fr";
  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId = null;
  let isPaused = false;

  function getTitles() {
    return (
      (window.TYPEWRITER_TITLES && window.TYPEWRITER_TITLES[currentLang]) ||
      titles
    );
  }

  function type() {
    if (isPaused) return;
    const list = getTitles();
    const current = list[currentIndex % list.length];

    if (prefersReducedMotion) {
      el.textContent = current;
      return;
    }

    if (!isDeleting) {
      // Type one character at a time
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        // Full phrase shown — pause 7.5s before starting deletion
        isDeleting = true;
        timeoutId = setTimeout(type, 500);
        return;
      }
      timeoutId = setTimeout(type, 100); // typing speed (ms per character)
    } else {
      // Erase one character at a time (roughly twice as fast as typing)
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        // Phrase erased — advance to next title and pause briefly
        isDeleting = false;
        currentIndex = (currentIndex + 1) % list.length;
        timeoutId = setTimeout(type, 500);
        return;
      }
      timeoutId = setTimeout(type, 55); // deletion speed (ms per character)
    }
  }

  // API for i18n.js to call on language change
  window.updateTypewriterLang = function (lang) {
    currentLang = lang;
    // Clear current and restart with the new language's titles at same index
    clearTimeout(timeoutId);
    charIndex = 0;
    isDeleting = false;
    el.textContent = "";
    timeoutId = setTimeout(type, 200);
  };

  // Start — guard against double-fire when i18n.js's DOMContentLoaded listener
  // has already called updateTypewriterLang() and set timeoutId before this one runs.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (!timeoutId) timeoutId = setTimeout(type, 800);
    });
  } else {
    if (!timeoutId) timeoutId = setTimeout(type, 800);
  }
})();
