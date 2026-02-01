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

export default GonathLayout;
