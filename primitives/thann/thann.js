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

export default ThannLayout;
