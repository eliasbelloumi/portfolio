/**
 * animations.js — Scroll reveals, counters, terminal, radar chart
 */
document.addEventListener('DOMContentLoaded', function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===================== SCROLL REVEALS =====================
  // Elements with .animate-on-scroll start invisible (opacity: 0 + translateY)
  // and receive .visible once they enter the viewport, triggering a CSS transition.
  const revealEls = document.querySelectorAll('.animate-on-scroll');
  if (!prefersReducedMotion && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ===================== COUNTER ANIMATION =====================
  // Animates .stat-number[data-target] from 0 to the target value using
  // an easeOutExpo curve — fast start, smooth finish.
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutExpo(progress) * target);
      el.textContent = value >= 1000 ? value.toLocaleString('fr-FR') : value;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.stat-number[data-target]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target, 10);
          const duration = target > 1000 ? 2000 : 1200;
          animateCounter(entry.target, target, duration);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  // ===================== TERMINAL TYPING =====================
  const terminalBody = document.getElementById('terminal-body');
  if (terminalBody) {
    let hasPlayed = false;

    const terminalLines = {
      fr: [
        { prompt: 'elias@portfolio:~$', cmd: 'whoami', output: null },
        { prompt: null, cmd: null, output: 'Étudiant ingénieur IA & Data Science' },
        { prompt: 'elias@portfolio:~$', cmd: 'cat interests.txt', output: null },
        { prompt: null, cmd: null, output: 'Machine Learning · Bioinformatique' },
        { prompt: null, cmd: null, output: 'Éthique de l\'IA · Recherche' },
        { prompt: 'elias@portfolio:~$', cmd: 'echo $STACK', output: null },
        { prompt: null, cmd: null, output: 'Python · R · Go · SQL · C++' },
        { prompt: 'elias@portfolio:~$', cmd: 'ping cnrs.fr', output: null },
        { prompt: null, cmd: null, output: 'Stagiaire Recherche @ CNRS/MNHN ✓' },
      ],
      en: [
        { prompt: 'elias@portfolio:~$', cmd: 'whoami', output: null },
        { prompt: null, cmd: null, output: 'AI & Data Science Engineering Student' },
        { prompt: 'elias@portfolio:~$', cmd: 'cat interests.txt', output: null },
        { prompt: null, cmd: null, output: 'Machine Learning · Bioinformatics' },
        { prompt: null, cmd: null, output: 'AI Ethics · Research' },
        { prompt: 'elias@portfolio:~$', cmd: 'echo $STACK', output: null },
        { prompt: null, cmd: null, output: 'Python · R · Go · SQL · C++' },
        { prompt: 'elias@portfolio:~$', cmd: 'ping cnrs.fr', output: null },
        { prompt: null, cmd: null, output: 'Research Intern @ CNRS/MNHN ✓' },
      ]
    };

    function getCurrentLang() {
      return localStorage.getItem('portfolio-lang') || 'fr';
    }

    function buildTerminalLine(lineData) {
      const span = document.createElement('span');
      span.className = 'terminal-line';
      if (lineData.prompt) {
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = lineData.prompt + ' ';
        span.appendChild(prompt);
        const cmd = document.createElement('span');
        cmd.className = 'terminal-cmd';
        cmd.textContent = lineData.cmd;
        span.appendChild(cmd);
      } else {
        span.className = 'terminal-line terminal-output';
        span.textContent = lineData.output;
      }
      return span;
    }

    async function playTerminal() {
      if (hasPlayed || prefersReducedMotion) {
        if (prefersReducedMotion) {
          const lang = getCurrentLang();
          terminalLines[lang].forEach(line => {
            terminalBody.appendChild(buildTerminalLine(line));
          });
        }
        return;
      }
      hasPlayed = true;
      const lang = getCurrentLang();
      const lines = terminalLines[lang];

      for (let i = 0; i < lines.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 180));
        terminalBody.appendChild(buildTerminalLine(lines[i]));
      }
    }

    const terminalObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        playTerminal();
        terminalObserver.disconnect();
      }
    }, { threshold: 0.3 });
    terminalObserver.observe(terminalBody);
  }

  // EEG PATH ANIMATION — handled by anime-eeg.js (Anime.js stroke-dashoffset)

  // ===================== RADAR CHART =====================
  // Unused in current layout (no #radar-svg in the DOM).
  // Kept here in case the skills section is extended in a future version.
  const radarSvg = document.getElementById('radar-svg');
  if (radarSvg) {
    const axes = [
      { label: { fr: 'Programmation', en: 'Programming' }, score: 0.88 },
      { label: { fr: 'ML / IA', en: 'ML / AI' }, score: 0.82 },
      { label: { fr: 'Data Eng', en: 'Data Eng' }, score: 0.78 },
      { label: { fr: 'Recherche', en: 'Research' }, score: 0.85 },
      { label: { fr: 'Systèmes', en: 'Systems' }, score: 0.70 },
    ];

    const cx = 150, cy = 150, maxR = 100;
    const n = axes.length;

    function angle(i) {
      return (2 * Math.PI * i / n) - Math.PI / 2;
    }

    function polarToCart(r, i) {
      return {
        x: cx + r * Math.cos(angle(i)),
        y: cy + r * Math.sin(angle(i))
      };
    }

    function getRadarColors() {
      const s = getComputedStyle(document.documentElement);
      return {
        grid:        s.getPropertyValue('--text-tertiary').trim()  || '#4A5060',
        label:       s.getPropertyValue('--text-secondary').trim() || '#8A909E',
        polyFill:    s.getPropertyValue('--accent-blue-dim').trim()|| 'rgba(14,165,201,0.15)',
        polyStroke:  s.getPropertyValue('--accent-blue').trim()    || '#0EA5C9',
      };
    }

    // Draw grid rings
    const gridPolys = [0.25, 0.5, 0.75, 1].map(frac => {
      const points = axes.map((_, i) => {
        const p = polarToCart(maxR * frac, i);
        return `${p.x},${p.y}`;
      }).join(' ');
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', points);
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', getRadarColors().grid);
      poly.setAttribute('stroke-width', '0.8');
      poly.setAttribute('opacity', '0.5');
      radarSvg.appendChild(poly);
      return poly;
    });

    // Draw axis lines
    const axisLines = axes.map((_, i) => {
      const p = polarToCart(maxR, i);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx); line.setAttribute('y1', cy);
      line.setAttribute('x2', p.x); line.setAttribute('y2', p.y);
      line.setAttribute('stroke', getRadarColors().grid);
      line.setAttribute('stroke-width', '0.8');
      line.setAttribute('opacity', '0.5');
      radarSvg.appendChild(line);
      return line;
    });

    // Score polygon (animated)
    const scorePoints = axes.map((ax, i) => {
      const p = polarToCart(0, i); // start at center
      return `${p.x},${p.y}`;
    });

    const scorePoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    scorePoly.setAttribute('points', scorePoints.join(' '));
    scorePoly.setAttribute('fill', getRadarColors().polyFill);
    scorePoly.setAttribute('stroke', getRadarColors().polyStroke);
    scorePoly.setAttribute('stroke-width', '2');
    radarSvg.appendChild(scorePoly);

    // Axis dots
    const dotEls = axes.map((ax, i) => {
      const p = polarToCart(0, i);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', p.x);
      circle.setAttribute('cy', p.y);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', getRadarColors().polyStroke);
      radarSvg.appendChild(circle);
      return circle;
    });

    // Axis labels
    function getCurrentLang() {
      return localStorage.getItem('portfolio-lang') || 'fr';
    }

    const labelEls = axes.map((ax, i) => {
      const p = polarToCart(maxR + 22, i);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', p.x);
      text.setAttribute('y', p.y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', getRadarColors().label);
      text.setAttribute('font-family', 'Inter, sans-serif');
      text.setAttribute('font-size', '11');
      text.textContent = ax.label[getCurrentLang()];
      radarSvg.appendChild(text);
      return { el: text, ax };
    });

    // Update labels on lang change
    document.addEventListener('langchange', (e) => {
      labelEls.forEach(({ el, ax }) => {
        el.textContent = ax.label[e.detail.lang];
      });
    });

    // Update colors on theme change
    document.addEventListener('themechange', () => {
      const c = getRadarColors();
      gridPolys.forEach(p => p.setAttribute('stroke', c.grid));
      axisLines.forEach(l => l.setAttribute('stroke', c.grid));
      scorePoly.setAttribute('fill', c.polyFill);
      scorePoly.setAttribute('stroke', c.polyStroke);
      dotEls.forEach(d => d.setAttribute('fill', c.polyStroke));
      labelEls.forEach(({ el }) => el.setAttribute('fill', c.label));
    });

    // Animate in on scroll
    let radarAnimated = false;
    function animateRadar() {
      if (radarAnimated) return;
      radarAnimated = true;
      const duration = 900;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic

        const pts = axes.map((ax, i) => {
          const r = maxR * ax.score * ease;
          const p = polarToCart(r, i);
          return `${p.x},${p.y}`;
        });
        scorePoly.setAttribute('points', pts.join(' '));

        dotEls.forEach((dot, i) => {
          const r = maxR * axes[i].score * ease;
          const p = polarToCart(r, i);
          dot.setAttribute('cx', p.x);
          dot.setAttribute('cy', p.y);
        });

        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (prefersReducedMotion) {
      // Draw immediately
      const pts = axes.map((ax, i) => {
        const p = polarToCart(maxR * ax.score, i);
        return `${p.x},${p.y}`;
      });
      scorePoly.setAttribute('points', pts.join(' '));
      dotEls.forEach((dot, i) => {
        const p = polarToCart(maxR * axes[i].score, i);
        dot.setAttribute('cx', p.x);
        dot.setAttribute('cy', p.y);
      });
    } else {
      const radarObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animateRadar();
          radarObserver.disconnect();
        }
      }, { threshold: 0.4 });
      radarObserver.observe(radarSvg);
    }
  }
});
