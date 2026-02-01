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

export default VircantieLayout;
