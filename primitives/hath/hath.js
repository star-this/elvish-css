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

export default HathLayout;
