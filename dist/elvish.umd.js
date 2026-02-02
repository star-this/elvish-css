/**
 * Elvish Layout System v2.0.0
 * Custom Elements for intrinsic CSS layouts
 * 
 * https://github.com/yourusername/elvish-layout
 * License: MIT
 */


(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Elvish = {}));
})(this, function(exports) {
  'use strict';

  // Transitions
  /**
 * Elvish - View Transitions Helper
 * 
 * Utilities for smooth view transitions between layout states.
 * 
 * Usage:
 * 
 * import { transition, transitionTo } from './transitions.js';
 * 
 * // Wrap any DOM change in a transition
 * transition(() => {
 *   element.classList.toggle('collapsed');
 * });
 * 
 * // With custom options
 * transition(() => {
 *   sidebar.hidden = true;
 * }, { duration: 500 });
 * 
 * // Transition with callback after completion
 * transition(() => {
 *   grid.setAttribute('columns', '4');
 * }).then(() => {
 *   console.log('Transition complete!');
 * });
 */

/**
 * Check if View Transitions API is supported
 */
var supportsViewTransitions = () => 
  typeof document !== 'undefined' && 
  'startViewTransition' in document;

/**
 * Get the currently active view transition (if any)
 * @returns {ViewTransition|null}
 */
var getActiveTransition = () => 
  document.activeViewTransition ?? null;

/**
 * Wrap a DOM mutation in a view transition
 * 
 * @param {Function} updateCallback - Function that performs DOM changes
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Override transition duration (ms)
 * @param {string} options.easing - Override easing function
 * @param {string[]} options.types - Transition types for :active-view-transition-type()
 * @returns {Promise} Resolves when transition completes
 */
function transition(updateCallback, options = {}) {
  // If View Transitions not supported, just run the callback
  if (!supportsViewTransitions()) {
    updateCallback();
    return Promise.resolve();
  }
  
  // Apply custom duration/easing if provided
  var root = document.documentElement;
  var originalDuration = root.style.getPropertyValue('--transition-duration');
  var originalEasing = root.style.getPropertyValue('--transition-ease');
  
  if (options.duration) {
    root.style.setProperty('--transition-duration', `${options.duration}ms`);
  }
  if (options.easing) {
    root.style.setProperty('--transition-ease', options.easing);
  }
  
  // Start the view transition with optional types
  var transitionOptions = options.types 
    ? { update: updateCallback, types: options.types }
    : updateCallback;
  
  var viewTransition = document.startViewTransition(transitionOptions);
  
  // Restore original values after transition
  return viewTransition.finished.then(() => {
    if (options.duration) {
      root.style.setProperty('--transition-duration', originalDuration || '');
    }
    if (options.easing) {
      root.style.setProperty('--transition-ease', originalEasing || '');
    }
  });
}

/**
 * Transition an element to a new state by changing attributes/classes
 * 
 * @param {HTMLElement} element - Element to transition
 * @param {Object} changes - Attribute/class changes to apply
 * @param {Object} changes.attrs - Attributes to set (use null to remove)
 * @param {string[]} changes.addClass - Classes to add
 * @param {string[]} changes.removeClass - Classes to remove
 * @param {string[]} changes.toggleClass - Classes to toggle
 * @param {Object} changes.style - Inline styles to set
 * @param {Object} options - Transition options
 * @returns {Promise}
 */
function transitionTo(element, changes = {}, options = {}) {
  return transition(() => {
    // Apply attribute changes
    if (changes.attrs) {
      Object.entries(changes.attrs).forEach(([key, value]) => {
        if (value === null) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, value);
        }
      });
    }
    
    // Apply class changes
    if (changes.addClass) {
      element.classList.add(...changes.addClass);
    }
    if (changes.removeClass) {
      element.classList.remove(...changes.removeClass);
    }
    if (changes.toggleClass) {
      changes.toggleClass.forEach(cls => element.classList.toggle(cls));
    }
    
    // Apply style changes
    if (changes.style) {
      Object.entries(changes.style).forEach(([prop, value]) => {
        element.style.setProperty(prop, value);
      });
    }
  }, options);
}

/**
 * Transition between two elements (e.g., swap content)
 * 
 * @param {HTMLElement} outElement - Element leaving
 * @param {HTMLElement} inElement - Element entering
 * @param {Object} options - Transition options
 * @returns {Promise}
 */
function crossfade(outElement, inElement, options = {}) {
  return transition(() => {
    outElement.hidden = true;
    inElement.hidden = false;
  }, options);
}

/**
 * Create a named transition group for an element
 * Elements with the same view-transition-name animate together
 * 
 * @param {HTMLElement} element - Element to name
 * @param {string} name - Transition name
 */
function setTransitionName(element, name) {
  element.style.viewTransitionName = name;
}

/**
 * Remove transition name from element
 * 
 * @param {HTMLElement} element 
 */
function clearTransitionName(element) {
  element.style.viewTransitionName = '';
}

/**
 * Batch multiple elements with unique transition names
 * Useful for list/grid items that should animate independently
 * 
 * @param {NodeList|HTMLElement[]} elements - Elements to name
 * @param {string} prefix - Name prefix (will add index)
 */
function nameTransitionGroup(elements, prefix = 'item') {
  elements.forEach((el, i) => {
    el.style.viewTransitionName = `${prefix}-${i}`;
  });
}

/**
 * Enable auto-naming with match-element for a container's children
 * Each child gets a unique browser-generated name automatically
 * 
 * @param {HTMLElement} container - Parent element
 * @param {string} [transitionClass] - Optional view-transition-class for group styling
 */
function enableAutoNaming(container, transitionClass) {
  Array.from(container.children).forEach(child => {
    child.style.viewTransitionName = 'match-element';
    if (transitionClass) {
      child.style.viewTransitionClass = transitionClass;
    }
  });
}

/**
 * Disable auto-naming for a container's children
 * 
 * @param {HTMLElement} container - Parent element
 */
function disableAutoNaming(container) {
  Array.from(container.children).forEach(child => {
    child.style.viewTransitionName = '';
    child.style.viewTransitionClass = '';
  });
}

/**
 * Elvish-specific: Transition ratio change
 * 
 * @param {'golden'|'silver'|'fifth'} ratio - New ratio
 * @param {Object} options - Transition options
 */
function transitionRatio(ratio, options = {}) {
  var ratioVar = `var(--ratio-${ratio})`;
  var measures = { golden: '60ch', fifth: '70ch', silver: '80ch' };
  
  return transition(() => {
    var root = document.documentElement;
    root.style.setProperty('--ratio', ratioVar);
    root.style.setProperty('--measure', measures[ratio]);
    root.dataset.ratio = ratio;
  }, { duration: 400, types: ['layout', 'ratio'], ...options });
}

/**
 * Elvish-specific: Transition theme change
 * 
 * @param {'light'|'dark'|'auto'} theme - New theme
 * @param {Object} options - Transition options
 */
function transitionTheme(theme, options = {}) {
  return transition(() => {
    var root = document.documentElement;
    if (theme === 'auto') {
      root.style.colorScheme = 'light dark';
    } else {
      root.style.colorScheme = theme;
    }
    localStorage.setItem('elvish-theme', theme);
  }, { duration: 300, types: ['theme'], ...options });
}

/**
 * Elvish-specific: Transition layout primitive state
 * 
 * @param {HTMLElement} primitive - Elvish layout element
 * @param {Object} attrs - New attribute values
 * @param {Object} options - Transition options
 */
function transitionLayout(primitive, attrs, options = {}) {
  // Give the primitive a transition name if it doesn't have one
  if (!primitive.style.viewTransitionName) {
    primitive.style.viewTransitionName = primitive.tagName.toLowerCase();
  }
  
  return transitionTo(primitive, { attrs }, { types: ['layout'], ...options });
}

/**
 * Skip/cancel the currently active view transition
 */
function skipTransition() {
  var active = getActiveTransition();
  if (active) {
    active.skipTransition();
  }
}

// Default export for convenient importing
default {
  transition,
  transitionTo,
  crossfade,
  setTransitionName,
  clearTransitionName,
  nameTransitionGroup,
  enableAutoNaming,
  disableAutoNaming,
  transitionRatio,
  transitionTheme,
  transitionLayout,
  skipTransition,
  supportsViewTransitions,
  getActiveTransition,
};


  // Primitives
  // hath
/**
 * Stack Layout Custom Element
 * 
 * Injects vertical margin between successive child elements.
 * 
 * @property {string} space - A CSS margin value (default: var(--s1))
 * @property {boolean} recursive - Apply to all descendants, not just children
 * @property {number} splitAfter - Element index after which to split with auto margin
 * 
 * @example
 * <i-hath space="var(--s2)">
 *   <h2>Heading</h2>
 *   <p>Paragraph one</p>
 *   <p>Paragraph two</p>
 * </i-hath>
 */

class HathLayout extends HTMLElement {
  static get observedAttributes() {
    return ['space', 'recursive', 'split-after'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get recursive() {
    return this.hasAttribute('recursive');
  }

  set recursive(val) {
    if (val) {
      this.setAttribute('recursive', '');
    } else {
      this.removeAttribute('recursive');
    }
  }

  get splitAfter() {
    const val = this.getAttribute('split-after');
    return val ? parseInt(val, 10) : null;
  }

  set splitAfter(val) {
    if (val) {
      this.setAttribute('split-after', val);
    } else {
      this.removeAttribute('split-after');
    }
  }

  render() {
    // Generate unique identifier for this configuration
    const recursive = this.recursive ? '-recursive' : '';
    const split = this.splitAfter ? `-split${this.splitAfter}` : '';
    const id = `Hath-${this.space}${recursive}${split}`.replace(/[^\w-]/g, '');
    
    this.dataset.i = id;
    this.style.setProperty('--hath-space', this.space);

    // Check if styles already exist for this configuration
    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      let css = '';

      if (this.recursive) {
        css = `${selector} * + * { margin-block-start: ${this.space}; }`;
      } else {
        css = `${selector} > * + * { margin-block-start: ${this.space}; }`;
      }

      if (this.splitAfter) {
        css += `${selector} > :nth-child(${this.splitAfter}) { margin-block-end: auto; }`;
      }

      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
  }
}

// Define the custom element
if ('customElements' in window) {
  customElements.define('i-hath', HathLayout);
}




// bau
/**
 * Box Layout Custom Element
 * 
 * A simple container with padding and optional border/background.
 * 
 * @property {string} padding - A CSS padding value (default: var(--s1))
 * @property {string} borderWidth - A CSS border-width value (default: var(--border-thin))
 * @property {boolean} invert - Swap foreground and background colors
 * @property {boolean} borderless - Remove border
 * @property {boolean} compact - Remove padding
 * 
 * @example
 * <i-bau padding="var(--s2)" invert>
 *   <p>Content in a box</p>
 * </i-bau>
 */

class BauLayout extends HTMLElement {
  static get observedAttributes() {
    return ['padding', 'border-width', 'invert', 'borderless', 'compact'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get padding() {
    return this.getAttribute('padding') || 'var(--s1)';
  }

  set padding(val) {
    this.setAttribute('padding', val);
  }

  get borderWidth() {
    return this.getAttribute('border-width') || 'var(--border-thin)';
  }

  set borderWidth(val) {
    this.setAttribute('border-width', val);
  }

  get invert() {
    return this.hasAttribute('invert');
  }

  set invert(val) {
    if (val) {
      this.setAttribute('invert', '');
    } else {
      this.removeAttribute('invert');
    }
  }

  get borderless() {
    return this.hasAttribute('borderless');
  }

  set borderless(val) {
    if (val) {
      this.setAttribute('borderless', '');
    } else {
      this.removeAttribute('borderless');
    }
  }

  get compact() {
    return this.hasAttribute('compact');
  }

  set compact(val) {
    if (val) {
      this.setAttribute('compact', '');
    } else {
      this.removeAttribute('compact');
    }
  }

  render() {
    // Set CSS custom properties for this instance
    this.style.setProperty('--bau-padding', this.padding);
    this.style.setProperty('--bau-border-width', this.borderWidth);

    // Generate unique identifier
    const invertStr = this.invert ? '-invert' : '';
    const borderlessStr = this.borderless ? '-borderless' : '';
    const compactStr = this.compact ? '-compact' : '';
    const id = `Bau-${this.padding}-${this.borderWidth}${invertStr}${borderlessStr}${compactStr}`.replace(/[^\w-]/g, '');
    
    this.dataset.i = id;

    // Check if styles already exist
    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      let css = `${selector} { padding: ${this.padding}; border-width: ${this.borderWidth}; }`;
      
      if (this.borderless) {
        css += `${selector} { border-width: 0; }`;
      }
      
      if (this.compact) {
        css += `${selector} { padding: 0; }`;
      }

      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-bau', BauLayout);
}




// enedh
/**
 * Center Layout Custom Element
 * 
 * Horizontally centers content with a maximum width.
 * 
 * @property {string} max - Maximum width (default: var(--measure))
 * @property {string} gutters - Minimum space on sides (default: 0)
 * @property {boolean} intrinsic - Center children based on their content width
 * @property {boolean} andText - Also center text alignment
 * 
 * @example
 * <i-enedh max="40ch" gutters="var(--s1)">
 *   <p>Centered content</p>
 * </i-enedh>
 */

class EnedhLayout extends HTMLElement {
  static get observedAttributes() {
    return ['max', 'gutters', 'intrinsic', 'and-text'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get max() {
    return this.getAttribute('max') || 'var(--measure)';
  }

  set max(val) {
    this.setAttribute('max', val);
  }

  get gutters() {
    return this.getAttribute('gutters') || '0';
  }

  set gutters(val) {
    this.setAttribute('gutters', val);
  }

  get intrinsic() {
    return this.hasAttribute('intrinsic');
  }

  set intrinsic(val) {
    if (val) {
      this.setAttribute('intrinsic', '');
    } else {
      this.removeAttribute('intrinsic');
    }
  }

  get andText() {
    return this.hasAttribute('and-text');
  }

  set andText(val) {
    if (val) {
      this.setAttribute('and-text', '');
    } else {
      this.removeAttribute('and-text');
    }
  }

  render() {
    this.style.setProperty('--enedh-max', this.max);
    this.style.setProperty('--enedh-gutters', this.gutters);

    const intrinsicStr = this.intrinsic ? '-intrinsic' : '';
    const textStr = this.andText ? '-andText' : '';
    const id = `Enedh-${this.max}-${this.gutters}${intrinsicStr}${textStr}`.replace(/[^\w-]/g, '');
    
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      let css = `${selector} { max-inline-size: ${this.max}; padding-inline: ${this.gutters}; }`;
      
      if (this.intrinsic) {
        css += `${selector} { display: flex; flex-direction: column; align-items: center; }`;
      }
      
      if (this.andText) {
        css += `${selector} { text-align: center; }`;
      }

      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-enedh', EnedhLayout);
}




// tiniath
/**
 * Cluster Layout Custom Element
 * 
 * Groups elements that differ in length and wrap naturally.
 * 
 * @property {string} space - Gap between items (default: var(--s1))
 * @property {string} justify - justify-content value (default: flex-start)
 * @property {string} align - align-items value (default: center)
 * 
 * @example
 * <i-tiniath space="var(--s0)" justify="space-between">
 *   <button>Save</button>
 *   <button>Cancel</button>
 * </i-tiniath>
 */

class TiniathLayout extends HTMLElement {
  static get observedAttributes() {
    return ['space', 'justify', 'align'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get justify() {
    return this.getAttribute('justify') || 'flex-start';
  }

  set justify(val) {
    this.setAttribute('justify', val);
  }

  get align() {
    return this.getAttribute('align') || 'center';
  }

  set align(val) {
    this.setAttribute('align', val);
  }

  render() {
    this.style.setProperty('--tiniath-space', this.space);
    this.style.setProperty('--tiniath-justify', this.justify);
    this.style.setProperty('--tiniath-align', this.align);

    const id = `Tiniath-${this.space}-${this.justify}-${this.align}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      styleEl.textContent = `
        ${selector} {
          gap: ${this.space};
          justify-content: ${this.justify};
          align-items: ${this.align};
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-tiniath', TiniathLayout);
}




// glan-veleg
/**
 * GlanVeleg Layout Custom Element
 * 
 * A quantum layout with one fixed-width element and one fluid element.
 * 
 * @property {string} side - Which side is the sidebar: "left" or "right" (default: left)
 * @property {string} sideWidth - Width of sidebar when horizontal (default: 20rem)
 * @property {string} contentMin - Min width of content before wrapping (default: 50%)
 * @property {string} space - Gap between elements (default: var(--s1))
 * @property {boolean} noStretch - Disable equal height (default: false)
 * 
 * @example
 * <i-glan-veleg side-width="15rem" content-min="60%">
 *   <nav>GlanVeleg content</nav>
 *   <main>Main content</main>
 * </i-glan-veleg>
 */

class GlanVelegLayout extends HTMLElement {
  static get observedAttributes() {
    return ['side', 'side-width', 'content-min', 'space', 'no-stretch'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get side() {
    return this.getAttribute('side') || 'left';
  }

  set side(val) {
    this.setAttribute('side', val);
  }

  get sideWidth() {
    return this.getAttribute('side-width') || '20rem';
  }

  set sideWidth(val) {
    this.setAttribute('side-width', val);
  }

  get contentMin() {
    return this.getAttribute('content-min') || '50%';
  }

  set contentMin(val) {
    this.setAttribute('content-min', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get noStretch() {
    return this.hasAttribute('no-stretch');
  }

  set noStretch(val) {
    if (val) {
      this.setAttribute('no-stretch', '');
    } else {
      this.removeAttribute('no-stretch');
    }
  }

  render() {
    this.style.setProperty('--glan-veleg-width', this.sideWidth);
    this.style.setProperty('--glan-veleg-content-min', this.contentMin);
    this.style.setProperty('--glan-veleg-space', this.space);

    const sideStr = this.side === 'right' ? '-right' : '-left';
    const stretchStr = this.noStretch ? '-noStretch' : '';
    const id = `GlanVeleg-${this.sideWidth}-${this.contentMin}-${this.space}${sideStr}${stretchStr}`.replace(/[^\w-]/g, '');
    
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      let css = `${selector} { gap: ${this.space}; }`;
      
      if (this.side === 'right') {
        css += `
          ${selector} > :first-child {
            flex-basis: 0;
            flex-grow: 999;
            min-inline-size: ${this.contentMin};
          }
          ${selector} > :last-child {
            flex-basis: ${this.sideWidth};
            flex-grow: 1;
          }
        `;
      } else {
        css += `
          ${selector} > :first-child {
            flex-basis: ${this.sideWidth};
          }
          ${selector} > :last-child {
            flex-basis: 0;
            flex-grow: 999;
            min-inline-size: ${this.contentMin};
          }
        `;
      }

      if (this.noStretch) {
        css += `${selector} { align-items: flex-start; }`;
      }

      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-glan-veleg', GlanVelegLayout);
}




// gwistindor
/**
 * Switcher Layout Custom Element
 * 
 * Switches between horizontal and vertical at a container threshold.
 * Uses the "Holy Albatross" technique - no intermediary states.
 * 
 * @property {string} threshold - Container width to switch at (default: var(--measure))
 * @property {string} space - Gap between elements (default: var(--s1))
 * @property {number} limit - Max items for horizontal layout (default: 4)
 * 
 * @example
 * <i-gwistindor threshold="30rem" limit="3">
 *   <div>One</div>
 *   <div>Two</div>
 *   <div>Three</div>
 * </i-gwistindor>
 */

class GwistindorLayout extends HTMLElement {
  static get observedAttributes() {
    return ['threshold', 'space', 'limit'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get threshold() {
    return this.getAttribute('threshold') || 'var(--measure)';
  }

  set threshold(val) {
    this.setAttribute('threshold', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get limit() {
    return parseInt(this.getAttribute('limit'), 10) || 4;
  }

  set limit(val) {
    this.setAttribute('limit', val);
  }

  render() {
    this.style.setProperty('--gwistindor-threshold', this.threshold);
    this.style.setProperty('--gwistindor-space', this.space);

    const id = `Gwistindor-${this.threshold}-${this.space}-${this.limit}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      const limitPlusOne = this.limit + 1;
      
      styleEl.textContent = `
        ${selector} {
          gap: ${this.space};
        }
        ${selector} > * {
          flex-basis: calc((${this.threshold} - 100%) * 999);
        }
        ${selector} > :nth-last-child(n+${limitPlusOne}),
        ${selector} > :nth-last-child(n+${limitPlusOne}) ~ * {
          flex-basis: 100%;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-gwistindor', GwistindorLayout);
}




// esgal
/**
 * Cover Layout Custom Element
 * 
 * Vertically centers a principal element with optional header/footer.
 * 
 * @property {string} centered - Selector for the centered element (default: h1)
 * @property {string} space - Minimum space around elements (default: var(--s1))
 * @property {string} minHeight - Minimum height of cover (default: 100vh)
 * @property {boolean} noPad - Remove padding from container
 * 
 * @example
 * <i-esgal centered="h2" min-height="80vh">
 *   <header>Logo</header>
 *   <h2>Main Title</h2>
 *   <footer>Scroll down</footer>
 * </i-esgal>
 */

class EsgalLayout extends HTMLElement {
  static get observedAttributes() {
    return ['centered', 'space', 'min-height', 'no-pad'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get centered() {
    return this.getAttribute('centered') || 'h1';
  }

  set centered(val) {
    this.setAttribute('centered', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get minHeight() {
    return this.getAttribute('min-height') || '100vh';
  }

  set minHeight(val) {
    this.setAttribute('min-height', val);
  }

  get noPad() {
    return this.hasAttribute('no-pad');
  }

  set noPad(val) {
    if (val) {
      this.setAttribute('no-pad', '');
    } else {
      this.removeAttribute('no-pad');
    }
  }

  render() {
    this.style.setProperty('--esgal-min-height', this.minHeight);
    this.style.setProperty('--esgal-space', this.space);

    const noPadStr = this.noPad ? '-noPad' : '';
    const id = `Esgal-${this.centered}-${this.minHeight}-${this.space}${noPadStr}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      const padding = this.noPad ? '0' : this.space;
      
      styleEl.textContent = `
        ${selector} {
          min-block-size: ${this.minHeight};
          padding: ${padding};
        }
        ${selector} > * {
          margin-block: ${this.space};
        }
        ${selector} > :first-child:not(${this.centered}) {
          margin-block-start: 0;
        }
        ${selector} > :last-child:not(${this.centered}) {
          margin-block-end: 0;
        }
        ${selector} > ${this.centered} {
          margin-block: auto;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-esgal', EsgalLayout);
}




// vircantie
/**
 * Vircantie Layout Custom Element
 * 
 * Auto-flowing responsive grid with minimum column width.
 * 
 * @property {string} min - Minimum column width (default: 250px)
 * @property {string} space - Gap between grid cells (default: var(--s1))
 * 
 * @example
 * <i-vircantie min="300px" space="var(--s2)">
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 *   <div>Card 3</div>
 * </i-vircantie>
 */

class VircantieLayout extends HTMLElement {
  static get observedAttributes() {
    return ['min', 'space'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get min() {
    return this.getAttribute('min') || '250px';
  }

  set min(val) {
    this.setAttribute('min', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  render() {
    this.style.setProperty('--vircantie-min', this.min);
    this.style.setProperty('--vircantie-space', this.space);

    const id = `Vircantie-${this.min}-${this.space}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      
      styleEl.textContent = `
        ${selector} {
          gap: ${this.space};
        }
        @supports (width: min(${this.min}, 100%)) {
          ${selector} {
            vircantie-template-columns: repeat(auto-fit, minmax(min(${this.min}, 100%), 1fr));
          }
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-vircantie', VircantieLayout);
}




// gant-thala
/**
 * Frame Layout Custom Element
 * 
 * Constrains content to a specific aspect ratio.
 * 
 * @property {string} ratio - GantThala ratio as "n:d" (default: 16:9)
 * 
 * @example
 * <i-gant-thala ratio="4:3">
 *   <img src="photo.jpg" alt="A photo">
 * </i-gant-thala>
 */

class GantThalaLayout extends HTMLElement {
  static get observedAttributes() {
    return ['ratio'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get ratio() {
    return this.getAttribute('ratio') || '16:9';
  }

  set ratio(val) {
    this.setAttribute('ratio', val);
  }

  render() {
    const [n, d] = this.ratio.split(':').map(v => v.trim());
    
    this.style.setProperty('--gant-thala-n', n);
    this.style.setProperty('--gant-thala-d', d);

    const id = `GantThala-${n}-${d}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      
      styleEl.textContent = `
        ${selector} {
          gant-thala-ratio: ${n} / ${d};
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-gant-thala', GantThalaLayout);
}




// glan-tholl
/**
 * Reel Layout Custom Element
 * 
 * Horizontal scrolling container with native browser scrolling.
 * Uses ResizeObserver and MutationObserver for overflow detection.
 * 
 * @property {string} itemWidth - Width of each item (default: auto)
 * @property {string} space - Gap between items (default: var(--s1))
 * @property {string} height - Height of the reel (default: auto)
 * @property {boolean} noBar - Hide the scrollbar
 * 
 * @example
 * <i-glan-tholl item-width="300px" space="var(--s2)">
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 *   <div>Card 3</div>
 * </i-glan-tholl>
 */

class GlanThollLayout extends HTMLElement {
  static get observedAttributes() {
    return ['item-width', 'space', 'height', 'no-bar'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
    this.toggleOverflowClass = this.toggleOverflowClass.bind(this);
    this.resizeObserver = null;
    this.mutationObserver = null;
  }

  connectedCallback() {
    this.render();
    this.setupObservers();
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  get itemWidth() {
    return this.getAttribute('item-width') || 'auto';
  }

  set itemWidth(val) {
    this.setAttribute('item-width', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get height() {
    return this.getAttribute('height') || 'auto';
  }

  set height(val) {
    this.setAttribute('height', val);
  }

  get noBar() {
    return this.hasAttribute('no-bar');
  }

  set noBar(val) {
    if (val) {
      this.setAttribute('no-bar', '');
    } else {
      this.removeAttribute('no-bar');
    }
  }

  toggleOverflowClass() {
    this.classList.toggle('overflowing', this.scrollWidth > this.clientWidth);
  }

  setupObservers() {
    // ResizeObserver for container size changes
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(entries => {
        this.toggleOverflowClass();
      });
      this.resizeObserver.observe(this);
    }

    // MutationObserver for child changes
    if ('MutationObserver' in window) {
      this.mutationObserver = new MutationObserver(entries => {
        this.toggleOverflowClass();
      });
      this.mutationObserver.observe(this, { childList: true });
    }

    // Initial check
    this.toggleOverflowClass();
  }

  render() {
    this.style.setProperty('--glan-tholl-item-width', this.itemWidth);
    this.style.setProperty('--glan-tholl-space', this.space);
    this.style.setProperty('--glan-tholl-height', this.height);

    const noBarStr = this.noBar ? '-noBar' : '';
    const id = `GlanTholl-${this.itemWidth}-${this.space}-${this.height}${noBarStr}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      
      styleEl.textContent = `
        ${selector} {
          block-size: ${this.height};
        }
        ${selector} > * {
          flex: 0 0 ${this.itemWidth};
        }
        ${selector} > * + * {
          margin-inline-start: ${this.space};
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-glan-tholl', GlanThollLayout);
}




// fano
/**
 * Imposter Layout Custom Element
 * 
 * Positions an element centered over a positioning container.
 * 
 * @property {boolean} fixed - Use fixed positioning (viewport-relative)
 * @property {boolean} contain - Prevent overflow outside container
 * @property {string} margin - Minimum gap from container edges (when contained)
 * 
 * @example
 * <div style="position: relative;">
 *   <p>Background content</p>
 *   <i-fano contain margin="var(--s1)">
 *     <dialog open>Modal content</dialog>
 *   </i-fano>
 * </div>
 */

class FanoLayout extends HTMLElement {
  static get observedAttributes() {
    return ['fixed', 'contain', 'margin'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get fixed() {
    return this.hasAttribute('fixed');
  }

  set fixed(val) {
    if (val) {
      this.setAttribute('fixed', '');
    } else {
      this.removeAttribute('fixed');
    }
  }

  get contain() {
    return this.hasAttribute('contain');
  }

  set contain(val) {
    if (val) {
      this.setAttribute('contain', '');
    } else {
      this.removeAttribute('contain');
    }
  }

  get margin() {
    return this.getAttribute('margin') || '0px';
  }

  set margin(val) {
    this.setAttribute('margin', val);
  }

  render() {
    this.style.setProperty('--fano-margin', this.margin);

    const fixedStr = this.fixed ? '-fixed' : '';
    const containStr = this.contain ? '-contain' : '';
    const id = `Fano-${this.margin}${fixedStr}${containStr}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      let css = '';
      
      if (this.fixed) {
        css += `${selector} { position: fixed; }`;
      }
      
      if (this.contain) {
        css += `
          ${selector} {
            overflow: auto;
            max-inline-size: calc(100% - (${this.margin} * 2));
            max-block-size: calc(100% - (${this.margin} * 2));
          }
        `;
      }

      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-fano', FanoLayout);
}




// thann
/**
 * Thann Layout Custom Element
 * 
 * Aligns an SVG icon with accompanying text.
 * 
 * @property {string} space - Gap between icon and text (default: natural word space)
 * @property {string} label - Accessible label for standalone icons
 * 
 * @example
 * <i-thann space="0.5em">
 *   <svg>...</svg>
 *   Close
 * </i-thann>
 */

class ThannLayout extends HTMLElement {
  static get observedAttributes() {
    return ['space', 'label'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get space() {
    return this.getAttribute('space');
  }

  set space(val) {
    if (val) {
      this.setAttribute('space', val);
    } else {
      this.removeAttribute('space');
    }
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(val) {
    if (val) {
      this.setAttribute('label', val);
    } else {
      this.removeAttribute('label');
    }
  }

  render() {
    // Handle accessibility for standalone icons
    if (this.label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
    }

    // Only set custom property if space is specified
    if (this.space) {
      this.style.setProperty('--thann-space', this.space);
      
      const id = `Thann-${this.space}`.replace(/[^\w-]/g, '');
      this.dataset.i = id;

      if (!document.getElementById(id)) {
        const styleEl = document.createElement('style');
        styleEl.id = id;
        
        const selector = `[data-i="${id}"]`;
        
        styleEl.textContent = `
          ${selector} {
            gap: ${this.space};
          }
        `;
        document.head.appendChild(styleEl);
      }
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-thann', ThannLayout);
}




// adleithian
/**
 * Adleithian Layout Custom Element
 * 
 * Establishes a container query context.
 * 
 * @property {string} name - Adleithian name for targeted queries (optional)
 * 
 * @example
 * <i-adleithian name="card">
 *   <div class="card">...</div>
 * </i-adleithian>
 * 
 * CSS:
 * @container card (width < 300px) {
 *   .card { flex-direction: column; }
 * }
 */

class AdleithianLayout extends HTMLElement {
  static get observedAttributes() {
    return ['name'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(val) {
    if (val) {
      this.setAttribute('name', val);
    } else {
      this.removeAttribute('name');
    }
  }

  render() {
    // Set adleithian-name via style if provided
    if (this.name) {
      this.style.containerName = this.name;
    } else {
      this.style.containerName = '';
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-adleithian', AdleithianLayout);
}




// him
/**
 * Him Layout Custom Element (NEW)
 * 
 * Creates sticky positioning with configurable offset.
 * Optionally detects "stuck" state via IntersectionObserver.
 * 
 * @property {string} to - Direction to stick: top, bottom, left, right (default: top)
 * @property {string} offset - Distance from edge when stuck (default: 0)
 * @property {boolean} sentinel - Enable stuck state detection
 * 
 * @example
 * <i-him offset="var(--s1)" sentinel>
 *   <header>This header sticks</header>
 * </i-him>
 */

class HimLayout extends HTMLElement {
  static get observedAttributes() {
    return ['to', 'offset', 'sentinel'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
    this.observer = null;
    this.sentinelEl = null;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.cleanupSentinel();
  }

  attributeChangedCallback() {
    this.render();
  }

  get to() {
    return this.getAttribute('to') || 'top';
  }

  set to(val) {
    this.setAttribute('to', val);
  }

  get offset() {
    return this.getAttribute('offset') || '0';
  }

  set offset(val) {
    this.setAttribute('offset', val);
  }

  get sentinel() {
    return this.hasAttribute('sentinel');
  }

  set sentinel(val) {
    if (val) {
      this.setAttribute('sentinel', '');
    } else {
      this.removeAttribute('sentinel');
    }
  }

  cleanupSentinel() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.sentinelEl) {
      this.sentinelEl.remove();
      this.sentinelEl = null;
    }
  }

  setupSentinel() {
    this.cleanupSentinel();

    if (!this.sentinel || !('IntersectionObserver' in window)) {
      return;
    }

    // Create invisible sentinel element
    this.sentinelEl = document.createElement('div');
    this.sentinelEl.style.cssText = `
      position: absolute;
      height: 1px;
      width: 100%;
      pointer-events: none;
      visibility: hidden;
    `;

    // Position sentinel based on sticky direction
    if (this.to === 'bottom') {
      this.sentinelEl.style.bottom = '0';
      this.insertAdjacentElement('afterend', this.sentinelEl);
    } else {
      this.sentinelEl.style.top = '0';
      this.insertAdjacentElement('beforebegin', this.sentinelEl);
    }

    // Observe the sentinel
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When sentinel is not visible, we're "stuck"
          const isStuck = !entry.isIntersecting;
          this.dataset.stuck = isStuck;
          this.dispatchEvent(new CustomEvent('stuck-change', { 
            detail: { stuck: isStuck } 
          }));
        });
      },
      { threshold: [0] }
    );

    this.observer.observe(this.sentinelEl);
  }

  render() {
    this.style.setProperty('--him-offset', this.offset);

    const id = `Him-${this.to}-${this.offset}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      let css = '';

      switch (this.to) {
        case 'bottom':
          css = `${selector} { inset-block-start: auto; inset-block-end: ${this.offset}; }`;
          break;
        case 'left':
          css = `${selector} { inset-block-start: auto; inset-inline-start: ${this.offset}; }`;
          break;
        case 'right':
          css = `${selector} { inset-block-start: auto; inset-inline-end: ${this.offset}; }`;
          break;
        default: // top
          css = `${selector} { inset-block-start: ${this.offset}; }`;
      }

      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }

    // Setup or cleanup sentinel observation
    if (this.sentinel) {
      // Defer to ensure element is in DOM
      requestAnimationFrame(() => this.setupSentinel());
    } else {
      this.cleanupSentinel();
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-him', HimLayout);
}




// miriant
/**
 * Grid-Placed Layout Custom Element (NEW)
 * 
 * A CSS Grid with explicit control over columns, rows, and item placement.
 * 
 * @property {number} columns - Number of grid columns (default: 12)
 * @property {string} space - Gap between grid cells (default: var(--s1))
 * @property {string} rowHeight - Height of auto-generated rows (default: minmax(0, auto))
 * @property {boolean} dense - Enable dense packing to fill holes
 * 
 * Children can use data attributes for placement:
 * - data-col-span="N" - Span N columns (1-12 or "full")
 * - data-row-span="N" - Span N rows (1-6)
 * - data-col-start="N" - Start at column N
 * - data-row-start="N" - Start at row N
 * 
 * @example
 * <i-miriant columns="4" space="var(--s2)">
 *   <div data-col-span="2" data-row-span="2">Feature</div>
 *   <div>Small</div>
 *   <div>Small</div>
 *   <div data-col-span="full">Full width</div>
 * </i-miriant>
 */

class MiriantLayout extends HTMLElement {
  static get observedAttributes() {
    return ['columns', 'space', 'row-height', 'dense'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
    this.mutationObserver = null;
  }

  connectedCallback() {
    this.render();
    this.setupChildObserver();
  }

  disconnectedCallback() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  get columns() {
    return parseInt(this.getAttribute('columns'), 10) || 12;
  }

  set columns(val) {
    this.setAttribute('columns', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get rowHeight() {
    return this.getAttribute('row-height') || 'minmax(0, auto)';
  }

  set rowHeight(val) {
    this.setAttribute('row-height', val);
  }

  get dense() {
    return this.hasAttribute('dense');
  }

  set dense(val) {
    if (val) {
      this.setAttribute('dense', '');
    } else {
      this.removeAttribute('dense');
    }
  }

  setupChildObserver() {
    if (!('MutationObserver' in window)) return;

    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.styleChildren();
        }
      });
    });

    this.mutationObserver.observe(this, { childList: true });
    this.styleChildren();
  }

  styleChildren() {
    // Apply inline styles for explicit placement (data-col-start, data-row-start)
    Array.from(this.children).forEach((child) => {
      const colStart = child.dataset.colStart;
      const rowStart = child.dataset.rowStart;

      if (colStart) {
        child.style.gridColumnStart = colStart;
      }
      if (rowStart) {
        child.style.gridRowStart = rowStart;
      }
    });
  }

  render() {
    this.style.setProperty('--miriant-columns', this.columns);
    this.style.setProperty('--miriant-space', this.space);
    this.style.setProperty('--miriant-row-height', this.rowHeight);

    const denseStr = this.dense ? '-dense' : '';
    const id = `Miriant-${this.columns}-${this.space}-${this.rowHeight}${denseStr}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    // Set container-type for container queries
    this.style.containerType = 'inline-size';

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      
      let css = `
        ${selector} {
          grid-template-columns: repeat(${this.columns}, 1fr);
          gap: ${this.space};
          grid-auto-rows: ${this.rowHeight};
        }
      `;

      if (this.dense) {
        css += `${selector} { grid-auto-flow: dense; }`;
      }

      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-miriant', MiriantLayout);
}




// gonath
/**
 * Gonath Layout Custom Element (NEW)
 * 
 * Pinterest-style layout with efficient column packing.
 * 
 * Uses CSS columns (widely supported) with progressive enhancement
 * to CSS Grid masonry where available.
 * 
 * @property {number} columns - Number of columns (default: 3)
 * @property {string} space - Gap between items (default: var(--s1))
 * 
 * NOTE: CSS columns flow top-to-bottom, then left-to-right.
 * This means visual order differs from DOM order.
 * For true masonry ordering, JavaScript is required.
 * 
 * @example
 * <i-gonath columns="4" space="var(--s2)">
 *   <div>Item 1</div>
 *   <div>Taller Item 2</div>
 *   <div>Item 3</div>
 *   ...
 * </i-gonath>
 */

class GonathLayout extends HTMLElement {
  static get observedAttributes() {
    return ['columns', 'space'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get columns() {
    return parseInt(this.getAttribute('columns'), 10) || 3;
  }

  set columns(val) {
    this.setAttribute('columns', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  // Check if CSS Grid masonry is supported
  static get isGridGonathSupported() {
    return CSS.supports('grid-template-rows', 'masonry');
  }

  render() {
    this.style.setProperty('--gonath-columns', this.columns);
    this.style.setProperty('--gonath-space', this.space);

    const id = `Gonath-${this.columns}-${this.space}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      
      let css = `
        ${selector} {
          column-count: ${this.columns};
          column-gap: ${this.space};
        }
        ${selector} > * {
          margin-block-end: ${this.space};
        }
      `;

      // Progressive enhancement for CSS Grid masonry
      css += `
        @supports (grid-template-rows: masonry) {
          ${selector} {
            display: grid;
            column-count: unset;
            grid-template-columns: repeat(${this.columns}, 1fr);
            grid-template-rows: masonry;
            gap: ${this.space};
          }
          ${selector} > * {
            margin-block-end: 0;
          }
        }
      `;

      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-gonath', GonathLayout);
}






  // Exports
  exports.HathLayout = HathLayout;
  exports.BauLayout = BauLayout;
  exports.EnedhLayout = EnedhLayout;
  exports.TiniathLayout = TiniathLayout;
  exports.GlanVelegLayout = GlanVelegLayout;
  exports.GwistindorLayout = GwistindorLayout;
  exports.EsgalLayout = EsgalLayout;
  exports.VircantieLayout = VircantieLayout;
  exports.GantThalaLayout = GantThalaLayout;
  exports.GlanThollLayout = GlanThollLayout;
  exports.FanoLayout = FanoLayout;
  exports.ThannLayout = ThannLayout;
  exports.AdleithianLayout = AdleithianLayout;
  exports.HimLayout = HimLayout;
  exports.MiriantLayout = MiriantLayout;
  exports.GonathLayout = GonathLayout;
  exports.transition = transition;
  exports.transitionTo = transitionTo;
  exports.transitionTheme = transitionTheme;
  exports.transitionRatio = transitionRatio;
  exports.transitionLayout = transitionLayout;
  exports.supportsViewTransitions = supportsViewTransitions;
  exports.VERSION = '2.0.0';

  Object.defineProperty(exports, '__esModule', { value: true });
});
