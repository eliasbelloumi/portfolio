/**
 * skills-graph.js — D3 v7 interactive force-directed skill graph
 * Nodes = skills, edges = "used together in a project"
 * Hover a node to highlight its connections.
 * Hidden on mobile (≤ 700px) — tag grid shows instead.
 */
(function () {
  'use strict';

  if (typeof d3 === 'undefined') return;

  const container = document.getElementById('skills-graph');
  if (!container) return;

  if (window.innerWidth <= 700) {
    container.style.display = 'none';
    return;
  }

  // ── Palette ────────────────────────────────────────────────────
  const COLORS = {
    prog: '#0EA5C9',  // languages
    ds:   '#2DD4A0',  // AI / data science
    bio:  '#7C5CBF',  // biology / research
    sys:  '#8A909E',  // tools / systems
  };

  // ── Data ──────────────────────────────────────────────────────
  const nodesData = [
    // Programming
    { id: 'Python',           cat: 'prog', r: 14 },
    { id: 'R',                cat: 'prog', r: 11 },
    { id: 'Go',               cat: 'prog', r: 10 },
    { id: 'SQL',              cat: 'prog', r: 10 },
    { id: 'MATLAB',           cat: 'prog', r: 10 },
    { id: 'C++',              cat: 'prog', r:  8 },
    { id: 'Docker',           cat: 'prog', r:  8 },
    { id: 'LaTeX',            cat: 'prog', r:  7 },
    // AI / Data Science
    { id: 'Machine Learning', cat: 'ds',   r: 13 },
    { id: 'Scikit-learn',     cat: 'ds',   r: 10 },
    { id: 'PySpark',          cat: 'ds',   r: 10 },
    { id: 'Pandas',           cat: 'ds',   r: 10 },
    { id: 'Streamlit',        cat: 'ds',   r:  8 },
    { id: 'Data Viz',         cat: 'ds',   r:  9 },
    { id: 'Stats',            cat: 'ds',   r: 12 },
    // Biology / Research
    { id: 'Flask',            cat: 'bio',  r:  9 },
    { id: 'PostgreSQL',       cat: 'bio',  r:  9 },
    { id: 'Bioconductor',     cat: 'bio',  r:  9 },
    { id: 'DESeq2',           cat: 'bio',  r:  9 },
    // Systems / Tools
    { id: 'Goroutines',       cat: 'sys',  r:  8 },
    { id: 'ETL',              cat: 'sys',  r:  8 },
  ];

  const linksData = [
    // Sleep Arousal
    { source: 'Python',          target: 'Machine Learning' },
    { source: 'Python',          target: 'Scikit-learn'     },
    { source: 'Python',          target: 'MATLAB'           },
    { source: 'MATLAB',          target: 'Stats'            },
    { source: 'Scikit-learn',    target: 'Machine Learning' },
    { source: 'Machine Learning',target: 'Stats'            },
    // RNA-Seq
    { source: 'R',               target: 'Bioconductor'     },
    { source: 'R',               target: 'DESeq2'           },
    { source: 'R',               target: 'Stats'            },
    { source: 'R',               target: 'LaTeX'            },
    { source: 'Bioconductor',    target: 'DESeq2'           },
    // Multi-Agent
    { source: 'Go',              target: 'Goroutines'       },
    // Carbon Dashboard
    { source: 'Python',          target: 'PySpark'          },
    { source: 'Python',          target: 'SQL'              },
    { source: 'PySpark',         target: 'Streamlit'        },
    { source: 'PySpark',         target: 'ETL'              },
    { source: 'SQL',             target: 'ETL'              },
    { source: 'Streamlit',       target: 'Data Viz'         },
    { source: 'Data Viz',        target: 'Stats'            },
    // MNHN internship
    { source: 'Python',          target: 'Flask'            },
    { source: 'Python',          target: 'PostgreSQL'       },
    { source: 'Flask',           target: 'PostgreSQL'       },
    { source: 'SQL',             target: 'PostgreSQL'       },
    // Cross-project
    { source: 'Python',          target: 'Pandas'           },
    { source: 'Python',          target: 'Docker'           },
    { source: 'Python',          target: 'LaTeX'            },
    { source: 'Stats',           target: 'Data Viz'         },
  ];

  // ── SVG ────────────────────────────────────────────────────────
  const W = container.clientWidth || 800;
  const H = 340;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', H)
    .attr('viewBox', `0 0 ${W} ${H}`);

  // Glow filter for hover highlight
  const defs = svg.append('defs');
  const glow  = defs.append('filter').attr('id', 'sg-glow');
  glow.append('feGaussianBlur').attr('stdDeviation', '5').attr('result', 'blur');
  const fm = glow.append('feMerge');
  fm.append('feMergeNode').attr('in', 'blur');
  fm.append('feMergeNode').attr('in', 'SourceGraphic');

  // ── Simulation ─────────────────────────────────────────────────
  const simulation = d3.forceSimulation(nodesData)
    .force('link',    d3.forceLink(linksData).id(d => d.id).distance(88).strength(0.5))
    .force('charge',  d3.forceManyBody().strength(-300))
    .force('center',  d3.forceCenter(W / 2, H / 2))
    .force('collide', d3.forceCollide(d => d.r + 26))
    .force('x',       d3.forceX(W / 2).strength(0.04))
    .force('y',       d3.forceY(H / 2).strength(0.06));

  // ── Links ──────────────────────────────────────────────────────
  const link = svg.append('g')
    .selectAll('line')
    .data(linksData)
    .join('line')
    .attr('stroke', 'rgba(255,255,255,0.22)')
    .attr('stroke-width', 1.5);

  // ── Nodes ──────────────────────────────────────────────────────
  const node = svg.append('g')
    .selectAll('g')
    .data(nodesData)
    .join('g')
    .style('cursor', 'grab')
    .call(
      d3.drag()
        .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end',   (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
    );

  node.append('circle')
    .attr('r', d => d.r)
    .attr('fill',         d => COLORS[d.cat] + '40')
    .attr('stroke',       d => COLORS[d.cat])
    .attr('stroke-width', 1.5);

  node.append('text')
    .attr('text-anchor',    'middle')
    .attr('y',              d => d.r + 13)
    .attr('fill',           '#D4D8E2')
    .attr('font-family',    'Inter, system-ui, sans-serif')
    .attr('font-size',      '10px')
    .attr('font-weight',    '500')
    .attr('pointer-events', 'none')
    .style('user-select',   'none')
    .text(d => d.id);

  // ── Hover ──────────────────────────────────────────────────────
  function connected(d) {
    const ids = new Set([d.id]);
    linksData.forEach(l => {
      const s = l.source.id ?? l.source;
      const t = l.target.id ?? l.target;
      if (s === d.id) ids.add(t);
      if (t === d.id) ids.add(s);
    });
    return ids;
  }

  node
    .on('mouseenter', function (e, d) {
      const conn = connected(d);
      node.style('opacity', n => conn.has(n.id) ? 1 : 0.12);
      link
        .attr('stroke', l => {
          const s = l.source.id ?? l.source, t = l.target.id ?? l.target;
          return (s === d.id || t === d.id) ? COLORS[d.cat] : 'rgba(255,255,255,0.07)';
        })
        .attr('stroke-width', l => {
          const s = l.source.id ?? l.source, t = l.target.id ?? l.target;
          return (s === d.id || t === d.id) ? 2.5 : 1.5;
        });
      d3.select(this).select('circle')
        .attr('filter', 'url(#sg-glow)')
        .attr('stroke-width', 2.5)
        .attr('fill', d => COLORS[d.cat] + '44');
    })
    .on('mouseleave', function () {
      node.style('opacity', 1);
      link
        .attr('stroke',       'rgba(255,255,255,0.22)')
        .attr('stroke-width', 1.5);
      d3.select(this).select('circle')
        .attr('filter',       null)
        .attr('stroke-width', 1.5)
        .attr('fill',         d => COLORS[d.cat] + '40');
    });

  // ── Tick ───────────────────────────────────────────────────────
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node.attr('transform', d =>
      `translate(${Math.max(d.r, Math.min(W - d.r, d.x))},${Math.max(d.r, Math.min(H - d.r, d.y))})`
    );
  });

  // ── Legend ─────────────────────────────────────────────────────
  const legendData = [
    { cat: 'prog', fr: 'Langages',        en: 'Languages'    },
    { cat: 'ds',   fr: 'IA & Data',       en: 'AI & Data'    },
    { cat: 'bio',  fr: 'Bio & Recherche', en: 'Bio & Research'},
    { cat: 'sys',  fr: 'Outils',          en: 'Tools'        },
  ];

  const legend = svg.append('g').attr('transform', 'translate(14,14)');
  const legendTexts = [];
  legendData.forEach((d, i) => {
    const g = legend.append('g').attr('transform', `translate(0,${i * 20})`);
    g.append('circle').attr('r', 4.5).attr('cx', 5).attr('fill', COLORS[d.cat]);
    const txt = g.append('text')
      .attr('x', 14).attr('y', 0)
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#8A909E')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('font-size', '10px')
      .text(d.fr);
    legendTexts.push({ el: txt, d });
  });

  document.addEventListener('langchange', e => {
    const lang = e.detail.lang;
    legendTexts.forEach(({ el, d }) => el.text(lang === 'fr' ? d.fr : d.en));
  });

})();
