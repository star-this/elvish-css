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

export default TiniathLayout;
