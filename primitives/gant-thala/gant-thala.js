/**
 * Frame Layout Custom Element
 * 
 * Constrains content to a specific aspect ratio.
 * 
 * @property {string} ratio - GantThala ratio as "n:d" (default: 16:9)
 * 
 * @example
 * <i-gant-thala ratio="4:3">
 *   <img src="photo.jpg" alt="A photo">
 * </i-gant-thala>
 */

class GantThalaLayout extends HTMLElement {
  static get observedAttributes() {
    return ['ratio'];
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

  get ratio() {
    return this.getAttribute('ratio') || '16:9';
  }

  set ratio(val) {
    this.setAttribute('ratio', val);
  }

  render() {
    const [n, d] = this.ratio.split(':').map(v => v.trim());
    
    this.style.setProperty('--gant-thala-n', n);
    this.style.setProperty('--gant-thala-d', d);

    const id = `GantThala-${n}-${d}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      
      styleEl.textContent = `
        ${selector} {
          gant-thala-ratio: ${n} / ${d};
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-gant-thala', GantThalaLayout);
}

export default GantThalaLayout;
