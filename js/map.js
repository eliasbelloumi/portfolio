/**
 * map.js — Leaflet map in the Education section
 * Shows Paris and Barcelona on a dark CartoDB tile layer.
 * Initializes lazily when the container enters the viewport.
 */
(function () {
  const container = document.getElementById('edu-map-container');
  if (!container || typeof L === 'undefined') return;

  let initialized = false;

  function initMap() {
    if (initialized) return;
    initialized = true;

    const map = L.map('edu-map-container', {
      center: [45.5, 2.25],
      zoom: 5,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      keyboard: false,
      attributionControl: true
    });

    // Dark basemap, no labels (we add our own)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Dashed line between the two cities
    L.polyline([[48.87, 2.35], [41.39, 2.17]], {
      color: 'rgba(139,144,158,0.6)',
      weight: 1.5,
      dashArray: '5 6'
    }).addTo(map);

    // Helper: glowing dot icon with CSS-animated pulse ring
    function dotIcon(hex, rgba) {
      return L.divIcon({
        className: '',
        html: `
          <div style="position:relative; width:10px; height:10px;">
            <div style="
              position:absolute; inset:0;
              background:${hex};
              border-radius:50%;
              box-shadow: 0 0 6px 2px ${rgba};
              z-index:1;
            "></div>
            <div style="
              position:absolute;
              top:50%; left:50%;
              width:10px; height:10px;
              margin:-5px 0 0 -5px;
              background:${hex};
              border-radius:50%;
              opacity:0.7;
              animation: map-pulse 2.2s ease-out infinite;
            "></div>
          </div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });
    }

    // Paris
    L.marker([48.87, 2.35], { icon: dotIcon('#4F8EF7', 'rgba(79,142,247,0.2)') })
      .addTo(map)
      .bindTooltip('Paris', {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
        className: 'map-label map-label--blue'
      });

    // Barcelona
    L.marker([41.39, 2.17], { icon: dotIcon('#7C5CBF', 'rgba(124,92,191,0.2)') })
      .addTo(map)
      .bindTooltip('Barcelona', {
        permanent: true,
        direction: 'bottom',
        offset: [0, 10],
        className: 'map-label map-label--violet'
      });

    // Recalculate tile layout after the container becomes fully visible
    setTimeout(() => map.invalidateSize(), 150);
  }

  // Lazy init — wait until the map section scrolls into view
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      initMap();
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  observer.observe(container);
})();
