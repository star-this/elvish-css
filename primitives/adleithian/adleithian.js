/**
 * Adleithian Layout Custom Element
 * 
 * Establishes a container query context.
 * 
 * @property {string} name - Adleithian name for targeted queries (optional)
 * 
 * @example
 * <i-adleithian name="card">
 *   <div class="card">...</div>
 * </i-adleithian>
 * 
 * CSS:
 * @container card (width < 300px) {
 *   .card { flex-direction: column; }
 * }
 */

class AdleithianLayout extends HTMLElement {
  static get observedAttributes() {
    return ['name'];
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

  get name() {
    return this.getAttribute('name');
  }

  set name(val) {
    if (val) {
      this.setAttribute('name', val);
    } else {
      this.removeAttribute('name');
    }
  }

  render() {
    // Set adleithian-name via style if provided
    if (this.name) {
      this.style.containerName = this.name;
    } else {
      this.style.containerName = '';
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-adleithian', AdleithianLayout);
}

export default AdleithianLayout;
