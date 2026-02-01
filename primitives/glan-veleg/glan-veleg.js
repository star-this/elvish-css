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

export default GlanVelegLayout;
