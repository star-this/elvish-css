/**
 * Cover Layout Custom Element
 * 
 * Vertically centers a principal element with optional header/footer.
 * 
 * @property {string} centered - Selector for the centered element (default: h1)
 * @property {string} space - Minimum space around elements (default: var(--s1))
 * @property {string} minHeight - Minimum height of cover (default: 100vh)
 * @property {boolean} noPad - Remove padding from container
 * 
 * @example
 * <i-esgal centered="h2" min-height="80vh">
 *   <header>Logo</header>
 *   <h2>Main Title</h2>
 *   <footer>Scroll down</footer>
 * </i-esgal>
 */

class EsgalLayout extends HTMLElement {
  static get observedAttributes() {
    return ['centered', 'space', 'min-height', 'no-pad'];
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

  get centered() {
    return this.getAttribute('centered') || 'h1';
  }

  set centered(val) {
    this.setAttribute('centered', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get minHeight() {
    return this.getAttribute('min-height') || '100vh';
  }

  set minHeight(val) {
    this.setAttribute('min-height', val);
  }

  get noPad() {
    return this.hasAttribute('no-pad');
  }

  set noPad(val) {
    if (val) {
      this.setAttribute('no-pad', '');
    } else {
      this.removeAttribute('no-pad');
    }
  }

  render() {
    this.style.setProperty('--esgal-min-height', this.minHeight);
    this.style.setProperty('--esgal-space', this.space);

    const noPadStr = this.noPad ? '-noPad' : '';
    const id = `Esgal-${this.centered}-${this.minHeight}-${this.space}${noPadStr}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      const padding = this.noPad ? '0' : this.space;
      
      styleEl.textContent = `
        ${selector} {
          min-block-size: ${this.minHeight};
          padding: ${padding};
        }
        ${selector} > * {
          margin-block: ${this.space};
        }
        ${selector} > :first-child:not(${this.centered}) {
          margin-block-start: 0;
        }
        ${selector} > :last-child:not(${this.centered}) {
          margin-block-end: 0;
        }
        ${selector} > ${this.centered} {
          margin-block: auto;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-esgal', EsgalLayout);
}

export default EsgalLayout;
