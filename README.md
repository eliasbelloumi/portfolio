# Portfolio — Elias Belloumi

Site portfolio personnel, bilingue FR/EN, en HTML, CSS et JavaScript vanilla.
Aucune dépendance, aucun framework — ouvrez simplement `index.html` dans un navigateur.

---

## Lancer le site

```bash
open index.html   # macOS
# ou double-cliquez sur index.html dans l'explorateur de fichiers
```

Aucun serveur ni build n'est nécessaire. Tous les assets sont locaux à l'exception des polices (Google Fonts, chargées via CDN).

---

## Structure des fichiers

```
portfolio/
├── index.html                  ← page unique (toutes les sections)
├── css/
│   ├── variables.css           ← tokens de design (couleurs, polices, espacements)
│   ├── reset.css               ← reset CSS minimal
│   ├── base.css                ← typographie et styles globaux
│   ├── layout.css              ← conteneurs et sections
│   ├── components.css          ← boutons, tags, timeline, tooltips
│   ├── responsive.css          ← breakpoints tablette (900px) et mobile (640px)
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
│   ├── i18n.js                 ← toggle FR/EN (doit être chargé en premier)
│   ├── particles.js            ← réseau de particules en canvas (hero)
│   ├── typewriter.js           ← effet machine à écrire des titres rotatifs
│   ├── animations.js           ← scroll reveals, compteurs animés, EEG path
│   ├── projects.js             ← filtre de la grille de projets
│   └── nav.js                  ← nav sticky, menu hamburger, scroll actif
└── assets/
    ├── icons/                  ← SVG (logos, pictos)
    └── images/                 ← image OG, photos éventuelles
```

---

## Fonctionnalités

### Bilingue FR / EN
Chaque texte porte des attributs `data-fr` et `data-en` sur son élément HTML.
`i18n.js` parcourt tous ces éléments et injecte le texte de la langue active à chaque bascule.
La préférence est sauvegardée dans `localStorage` et la langue du navigateur est détectée au premier chargement.

### Animations
- **Scroll reveals** — les éléments `.animate-on-scroll` apparaissent progressivement via `IntersectionObserver`.
- **Typewriter** — les titres du hero s'écrivent et s'effacent en boucle.
- **Particules** — réseau de points animés en canvas dans le hero.
- **Compteurs** — les statistiques de la section About comptent jusqu'à leur valeur cible (easeOutExpo).
- **EEG path** — le tracé SVG de la carte projet vedette se dessine à l'entrée dans le viewport.

Toutes les animations sont désactivées si `prefers-reduced-motion: reduce` est actif.

### Filtre de projets
Les boutons de filtre ajoutent la classe `.filtered-out` (opacité réduite) aux cartes non correspondantes, sans modifier l'ordre du DOM ni la mise en page.

### Tooltips de compétences
Les tags de compétences affichent une info-bulle au survol.
Chaque tag porte `data-used-in-fr` et `data-used-in-en` ; `i18n.js` copie la valeur active dans `data-tooltip`, que le pseudo-élément `::after` du CSS lit via `attr(data-tooltip)`.

---

## Personnalisation

### Modifier les textes
Tous les textes bilingues sont directement dans `index.html` via `data-fr` / `data-en`.
Les titres du typewriter se trouvent dans `js/i18n.js` (`TYPEWRITER_TITLES`).

### Modifier les couleurs
Éditez les variables CSS dans `css/variables.css` :
```css
--accent-blue:   #4F8EF7;
--accent-violet: #7C5CBF;
--accent-teal:   #2DD4A0;
--bg-primary:    #0D0F14;
```

### Ajouter un projet
Dans `index.html`, dupliquez une `.project-card` et renseignez les attributs `data-tags` avec les slugs correspondants (`ml`, `data`, `research`, `systems`).

---

## Accessibilité
- Navigation au clavier complète (Tab, Escape pour fermer le menu)
- `aria-label`, `aria-expanded`, `aria-live` sur les éléments interactifs
- `<html lang>` mis à jour à chaque changement de langue
- Animations désactivées pour `prefers-reduced-motion`
