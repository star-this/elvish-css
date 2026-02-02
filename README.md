# Elvish - Intrinsic CSS Layout System

An implementation of a design system with custom elements, with **Elvish names** from Tolkien's Sindarin language. Extended with modern CSS features including `@function`, `if()`, `sibling-index()`, and typed `attr()`.

*Mae govannen!* (Well met!)

## Philosophy

Elvish is built on three principles:

1. **Intrinsic design** - Layouts that respond to their content and context, not arbitrary breakpoints
2. **Composition over inheritance** - Simple primitives that combine to create complex layouts
3. **Algorithmic CSS** - Let the browser calculate optimal layouts

## Sindarin Naming Convention

All layout primitives use Sindarin (Grey-Elvish) names:

| Sindarin | English | Meaning |
|----------|---------|---------|
| `<i-hath>` | Stacked | "row, series" |
| `<i-bau>` | Quad | "container" |
| `<i-enedh>` | Centered | "middle" |
| `<i-tiniath>` | Clustered | "small sparks" |
| `<i-glan-veleg>` | Sidebar | "clear + mighty" |
| `<i-gwistindor>` | Switching | "change-watcher" |
| `<i-esgal>` | Covering | "screen, hiding" |
| `<i-vircantie>` | Grid | "jewel-pattern" |
| `<i-gant-thala>` | Aspect | "harp-foot (ratio)" |
| `<i-glan-tholl>` | Side-Scrolling | "open + hollow" |
| `<i-fano>` | Overcast | "white phantom" |
| `<i-thann>` | Icon | "sign, token" |
| `<i-adleithian>` | Container | "liberator" |
| `<i-him>` | Sticky | "steadfast" |
| `<i-miriant>` | Grid-placed | "jewel-work" |
| `<i-gonath>` | Masonry | "stone collection" |

**Special attributes for `<i-thann>` (Icon):**
- `echuiol` = "awakening" (active state)
- `dhoren` = "hidden" (visually hidden)

## Installation

### CDN (Quickest)

```html
<!-- unpkg -->
<link rel="stylesheet" href="https://unpkg.com/elvish-css@1.2.0/dist/elvish.min.css">
<script src="https://unpkg.com/elvish-css@1.2.0/dist/elvish.iife.js"></script>

<!-- jsDelivr -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/elvish-css@1.2.0/dist/elvish.min.css">
<script src="https://cdn.jsdelivr.net/npm/elvish-css@1.2.0/dist/elvish.iife.js"></script>
```

### npm

```bash
npm install elvish-css
```

```javascript
// ES Modules
import 'elvish-css/dist/elvish.css';
import { transition, transitionTheme } from 'elvish-css';
```

### Self-Hosted / Ignition

Download the `dist/` folder and serve from your own CDN or Ignition gateway. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions including Ignition Perspective integration.

### Development (Source Files)

```html
<link rel="stylesheet" href="global/global.css">
<link rel="stylesheet" href="elvish.css">
<script type="module" src="elvish.js"></script>
```

## Modern CSS Features

Elvish includes support for cutting-edge CSS features. Browser support as of January 2026:

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| `light-dark()` | ✅ 123+ | ✅ | ✅ 17.5+ | ✅ 120+ |
| Relative Colors | ✅ 119+ | ✅ | ✅ 16.4+ | ✅ 128+ |
| `@function` | ✅ 139+ | ✅ 139+ | ❌ | ❌ |
| `if()` | ✅ 137+ | ✅ 137+ | ❌ | ❌ |
| `sibling-index()` | ✅ 138+ | ✅ 138+ | ❌ | ❌ |
| Typed `attr()` | ✅ 133+ | ✅ 133+ | ⚠️ | ❌ |
| View Transitions | ✅ 111+ | ✅ 111+ | ✅ 18+ | ✅ 144+ |

### `light-dark()` - Automatic Theme Colors

Single declarations that respond to color scheme:

```css
:root {
  color-scheme: light dark;
  --color-surface: light-dark(#ffffff, #1a1a2e);
  --color-text: light-dark(#1a1a2e, #f0f0f5);
}
```

### Relative Color Syntax - Derived Palettes

Define one brand color, derive entire palettes:

```css
:root {
  --brand: oklch(55% 0.18 250);
  
  /* Lighten/darken */
  --brand-light: oklch(from var(--brand) calc(l + 0.15) c h);
  --brand-dark: oklch(from var(--brand) calc(l - 0.1) c h);
  
  /* Hue shift for complementary */
  --brand-complement: oklch(from var(--brand) l c calc(h + 180));
  
  /* Transparency */
  --brand-ghost: oklch(from var(--brand) l c h / 0.1);
}
```

### `@function` - Reusable CSS Logic (Chrome 139+)

Define custom functions for reusable calculations:

```css
@function --neg(--value) {
  result: calc(-1 * var(--value));
}

@function --alpha(--color, --opacity) {
  result: oklch(from var(--color) l c h / var(--opacity));
}

.element {
  margin-left: --neg(20px);           /* -20px */
  background: --alpha(var(--brand), 0.5); /* 50% opacity */
}
```

### `if()` - Inline Conditionals (Chrome 137+)

Conditional values without class toggling:

```css
.card {
  --variant: default;
  
  padding: if(
    style(--variant: compact): var(--s-1);
    style(--variant: spacious): var(--s2);
    else: var(--s1)
  );
}

.grid {
  grid-template-columns: if(
    media(width >= 900px): repeat(4, 1fr);
    media(width >= 600px): repeat(2, 1fr);
    else: 1fr
  );
}
```

### `sibling-index()` - Position Awareness (Chrome 138+)

Elements know their position. No JavaScript needed for staggers:

```css
.stagger > * {
  animation-delay: calc((sibling-index() - 1) * 100ms);
}

.rainbow > * {
  --hue: calc(sibling-index() * (360 / sibling-count()));
  background: oklch(70% 0.15 var(--hue));
}
```

### Typed `attr()` - HTML to CSS Bridge (Chrome 133+)

Use HTML attributes as typed CSS values:

```html
<div data-columns="4">Grid with 4 columns</div>
<div data-color="oklch(60% 0.2 250)">Blue text</div>
<div data-progress="65%">Progress bar</div>
```

```css
[data-columns] {
  --columns: attr(data-columns type(<number>), 1);
  grid-template-columns: repeat(var(--columns), 1fr);
}

[data-color] {
  color: attr(data-color type(<color>), currentColor);
}

[data-progress] {
  --progress: attr(data-progress type(<percentage>), 0%);
  background: linear-gradient(to right, accent var(--progress), gray var(--progress));
}
```

### View Transitions - Buttery Smooth Layout Changes

**Baseline Newly Available** since October 2025 (Firefox 144). Smooth, animated transitions between layout states without JavaScript animation libraries:

```css
/* Enable in transitions.css */
@view-transition {
  navigation: auto;
}

/* Named elements animate independently */
.sidebar { view-transition-name: glan-veleg; }
.grid { view-transition-name: vircantie; }

/* Auto-naming for lists/grids - each item gets unique name */
.card-grid > * {
  view-transition-name: match-element;
  view-transition-class: card;  /* Group styling */
}

/* Style all cards at once */
::view-transition-group(.card) {
  animation-duration: 300ms;
  animation-timing-function: var(--transition-ease-spring);
}

/* Customize specific animations */
::view-transition-old(glan-veleg) {
  animation: 300ms ease-out slide-out-left;
}
::view-transition-new(glan-veleg) {
  animation: 300ms ease-out slide-in-left;
}
```

```javascript
// Wrap DOM changes in a transition
import { transition, transitionTheme, transitionRatio } from './global/transitions.js';

// Basic usage
transition(() => {
  sidebar.classList.toggle('collapsed');
});

// With typed transitions for CSS targeting
transition(() => {
  grid.setAttribute('columns', '4');
}, { types: ['layout'] });

// Built-in Elvish helpers
transitionTheme('dark');   // Smooth theme switch
transitionRatio('golden'); // Smooth ratio change

// Auto-naming for grid items
import { enableAutoNaming } from './global/transitions.js';
enableAutoNaming(gridElement, 'card'); // Each child animates independently
```

**Included transition animations:** fade, slide (up/down/left/right), scale, flip

**New features:** `match-element` auto-naming, `view-transition-class` group styling, `:active-view-transition` pseudo-class

**Fallback:** Browsers without View Transitions get CSS `transition` fallbacks on common properties.

## Layout Primitives

### Core Elements (16)

| Sindarin | English | Key Props |
|----------|---------|-----------|
| `<i-hath>` | Stacked | `space`, `recursive`, `split-after` |
| `<i-bau>` | Quad | `padding`, `border-width`, `invert` |
| `<i-enedh>` | Centered | `max`, `gutters`, `intrinsic` |
| `<i-tiniath>` | Clustered | `space`, `justify`, `align` |
| `<i-glan-veleg>` | Sidebar | `side`, `side-width`, `content-min` |
| `<i-gwistindor>` | Switching | `threshold`, `space`, `limit` |
| `<i-esgal>` | Covering | `centered`, `space`, `min-height` |
| `<i-vircantie>` | Grid | `min`, `space` |
| `<i-gant-thala>` | Ascpect | `ratio` |
| `<i-glan-tholl>` | Side-Scrolling | `item-width`, `space`, `no-bar` |
| `<i-fano>` | Overcast | `fixed`, `contain`, `margin` |
| `<i-thann>` | Icon | `space`, `label`, `echuiol`, `dhoren` |
| `<i-adleithian>` | Container | `name` |
| `<i-him>` | Sticky | `to`, `offset`, `sentinel` |
| `<i-miriant>` | Grid-placed | `columns`, `space`, `dense` |
| `<i-gonath>` | Masonry | `columns`, `space` |

## Usage Examples

### Basic Hath (Stack)

```html
<i-hath space="var(--s2)">
  <h1>Title</h1>
  <p>Paragraph</p>
</i-hath>
```

### Responsive Vircantie (Grid)

```html
<i-vircantie min="250px" space="var(--s1)">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</i-vircantie>
```

### Composition

```html
<i-enedh max="80ch" gutters="var(--s1)">
  <i-hath space="var(--s3)">
    <i-glan-veleg side-width="200px">
      <nav>Sidebar</nav>
      <main>
        <i-vircantie min="200px">
          <i-bau>Card</i-bau>
          <i-bau>Card</i-bau>
        </i-vircantie>
      </main>
    </i-glan-veleg>
  </i-hath>
</i-enedh>
```

### Staggered Animation (Modern)

```html
<ul class="stagger-enter">
  <li>Animates first</li>
  <li>Then this</li>
  <li>Then this</li>
</ul>
```

## Design Tokens

### Modular Scale Ratios

Elvish uses a modular scale for harmonious spacing and typography. Choose the ratio that fits your design:

| Ratio | Value | Character | Best For |
|-------|-------|-----------|----------|
| **Golden (φ)** | 1.618 | Dramatic, organic | Marketing, CTAs, hero sections |
| **Silver (√2)** | 1.414 | Subtle, refined | Documentation, dashboards, dense content |
| **Fifth** | 1.5 | Balanced, musical | General purpose |

**Default:** Perfect Fifth (1.5) for balanced harmony.

```css
/* Switch globally */
:root {
  --ratio: var(--ratio-golden);  /* For dramatic impact */
}

/* Switch per-section */
.marketing-hero {
  --ratio: var(--ratio-golden);
}
.documentation {
  --ratio: var(--ratio-silver);
}

/* Use utility classes */
<div class="ratio:silver">Subtle scale</div>
<div class="ratio:golden">Dramatic scale</div>

/* Or data attributes (for JS toggling) */
<div data-ratio="golden">...</div>
```

**Scale values at 16px base:**

```
              Golden (φ)    Silver (√2)    Fifth (1.5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
s-2           6px           8px            7px
s-1           10px          11px           11px
s0            16px          16px           16px      ← base
s1            26px          23px           24px
s2            42px          32px           36px
s3            68px          45px           54px
s4            110px         64px           81px
s5            178px         91px           122px
```

### Token Reference

```css
:root {
  /* Ratio presets */
  --ratio-golden: 1.618;
  --ratio-silver: 1.414;
  --ratio-fifth: 1.5;
  --ratio: var(--ratio-fifth);  /* Active ratio (default: Fifth) */
  
  /* Modular scale */
  --s-2, --s-1, --s0, --s1, --s2, --s3, --s4, --s5
  
  /* MEASURE vs LAYOUT THRESHOLDS
   * --measure: For TEXT readability (ch units)
   * --layout-threshold-*: For LAYOUT decisions (rem units)
   * 
   * Text is about characters; layout is about physical space.
   */
  --measure: 70ch;  /* Golden=60ch, Fifth=70ch, Silver=80ch */
  
  /* Layout thresholds */
  --layout-threshold-sm: 30rem;   /* ~480px - phone landscape */
  --layout-threshold-md: 45rem;   /* ~720px - tablet portrait */
  --layout-threshold-lg: 60rem;   /* ~960px - tablet landscape */
  --layout-threshold-xl: 75rem;   /* ~1200px - small desktop */
  
  /* Brand + derived colors (relative color syntax) */
  --brand, --brand-light, --brand-dark, --brand-complement
  
  /* Semantic (auto light/dark) */
  --color-surface, --color-text, --color-accent, --color-border
  
  /* Timing */
  --duration-fast, --duration-normal, --duration-slow
  
  /* Easing */
  --ease-out, --ease-in, --ease-bounce
}
```

### Measure vs Layout Thresholds

Elvish distinguishes between two types of "widths":

| Token | Purpose | Unit | Example |
|-------|---------|------|---------|
| `--measure` | Text readability | `ch` | `max-inline-size: var(--measure)` |
| `--layout-threshold-*` | Layout switching | `rem` | `<i-gwistindor threshold="45rem">` |

**Why the distinction?**
- Text measure is about *characters per line* for readability (45-75ch optimal)
- Layout thresholds are about *physical space* for comfortable item widths
- A 70ch measure at 16px ≈ 560px—too narrow for layout decisions!

```html
<!-- TEXT: Use measure -->
<article style="max-inline-size: var(--measure)">
  Readable prose...
</article>

<!-- LAYOUT: Use layout thresholds -->
<i-gwistindor threshold="var(--layout-threshold-md)">
  <div>Horizontal until 720px</div>
  <div>Then vertical</div>
</i-gwistindor>
```

## File Structure

```
elvish/
├── global/
│   ├── tokens.css       # Design tokens, light-dark(), relative colors
│   ├── reset.css        # Reset + measure axiom
│   ├── utilities.css    # Utility classes
│   ├── modern.css       # @function, if(), sibling-index(), attr()
│   ├── transitions.css  # View Transitions API
│   ├── transitions.js   # View Transitions helpers
│   └── global.css       # Imports all CSS
├── primitives/          # Sindarin-named layout primitives
│   ├── hath/            # Stacked
│   ├── bau/             # Quad
│   ├── enedh/           # Centered
│   ├── tiniath/         # Clustered
│   ├── glan-veleg/      # Sidebar
│   ├── gwistindor/      # Switching
│   ├── esgal/           # Covering
│   ├── vircantie/       # Grid
│   ├── gant-thala/      # Aspect (ratio)
│   ├── glan-tholl/      # Side-Scrolling
│   ├── fano/            # Overcast
│   ├── thann/           # Icon
│   ├── adleithian/      # Container
│   ├── him/             # Sticky
│   ├── miriant/         # Grid-placed
│   └── gonath/          # Masonry
├── examples/
│   └── complete-demo.html
├── elvish.css           # All primitive styles
├── elvish.js            # All primitive JS + SINDARIN vocabulary
└── README.md
```

## Progressive Enhancement

Elvish includes fallbacks for browsers without modern feature support:

```css
/* Fallback for sibling-index() */
@supports not (animation-delay: calc(sibling-index() * 1ms)) {
  .stagger-enter > :nth-child(1) { --i: 0; }
  .stagger-enter > :nth-child(2) { --i: 1; }
  /* ... */
}

/* Fallback for if() */
@supports not (color: if(style(--x: y): red; else: blue)) {
  .theme-aware { background: var(--fallback); }
  .theme-aware.is-dark { background: var(--dark-fallback); }
}
```
