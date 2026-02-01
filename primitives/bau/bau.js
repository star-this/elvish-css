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

export default BauLayout;
