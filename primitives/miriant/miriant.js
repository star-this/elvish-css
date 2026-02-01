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

export default MiriantLayout;
