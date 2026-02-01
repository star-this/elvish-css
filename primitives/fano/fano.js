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

export default FanoLayout;
