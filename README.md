# Portfolio — Elias Belloumi

Personal bilingual (FR/EN) portfolio built with vanilla HTML, CSS, and JavaScript.
No dependencies, no framework — just open `index.html` in a browser.

---

## Running the site

```bash
open index.html   # macOS
# or double-click index.html in your file explorer
```

No server or build step required. All assets are local except for fonts (Google Fonts, loaded via CDN).

---

## File structure

```
portfolio/
├── index.html                  ← single page (all sections)
├── css/
│   ├── variables.css           ← design tokens (colors, fonts, spacing)
│   ├── reset.css               ← minimal CSS reset
│   ├── base.css                ← typography and global styles
│   ├── layout.css              ← containers and sections
│   ├── components.css          ← buttons, tags, timeline, tooltips
│   ├── responsive.css          ← tablet (900px) and mobile (640px) breakpoints
│   └── sections/
│       ├── nav.css
│       ├── hero.css
│       ├── about.css
│       ├── skills.css
│       ├── experience.css
│       ├── projects.css
│       ├── education.css
│       ├── engagement.css
│       └── contact.css
├── js/
│   ├── i18n.js                 ← FR/EN toggle (must be loaded first)
│   ├── particles.js            ← canvas particle network (hero)
│   ├── typewriter.js           ← rotating typewriter effect for hero titles
│   ├── animations.js           ← scroll reveals, animated counters, EEG path
│   ├── projects.js             ← project grid filter
│   └── nav.js                  ← sticky nav, hamburger menu, active scroll
└── assets/
    ├── icons/                  ← SVG icons and logos
    └── images/                 ← OG image, photos
```

---

## Features

### Bilingual FR / EN
Every text element carries `data-fr` and `data-en` attributes.
`i18n.js` iterates over all such elements and injects the active language's text on each toggle.
The preference is saved to `localStorage`; the browser language is detected on first load.

### Animations
- **Scroll reveals** — `.animate-on-scroll` elements fade in progressively via `IntersectionObserver`.
- **Typewriter** — hero titles are typed and erased in a loop.
- **Particles** — animated canvas dot network in the hero section.
- **Counters** — About section stats count up to their target value (easeOutExpo).
- **EEG path** — the SVG stroke on the featured project card draws itself when entering the viewport.

All animations are disabled when `prefers-reduced-motion: reduce` is active.

### Project filter
Filter buttons add the `.filtered-out` class (reduced opacity) to non-matching cards, without reordering the DOM or affecting layout.

### Skill tooltips
Skill tags display a tooltip on hover.
Each tag carries `data-used-in-fr` and `data-used-in-en`; `i18n.js` copies the active value into `data-tooltip`, which the CSS `::after` pseudo-element reads via `attr(data-tooltip)`.

---

## Customisation

### Editing text
All bilingual content lives directly in `index.html` via `data-fr` / `data-en` attributes.
Typewriter titles are defined in `js/i18n.js` (`TYPEWRITER_TITLES`).

### Changing colours
Edit the CSS custom properties in `css/variables.css`:
```css
--accent-blue:   #0EA5C9;
--accent-violet: #7C5CBF;
--accent-teal:   #10B981;
--accent-coral:  #C9A84C;
--bg-primary:    #08090C;
```

### Adding a project
In `index.html`, duplicate a `.project-card` and fill in the `data-tags` attribute with the relevant slugs (`ml`, `data`, `research`, `systems`).

---

## Accessibility
- Full keyboard navigation (Tab, Escape to close the menu)
- `aria-label`, `aria-expanded`, `aria-live` on interactive elements
- `<html lang>` updated on every language switch
- Animations disabled for `prefers-reduced-motion`
