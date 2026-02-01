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

export default EnedhLayout;
