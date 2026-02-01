/**
 * Reel Layout Custom Element
 * 
 * Horizontal scrolling container with native browser scrolling.
 * Uses ResizeObserver and MutationObserver for overflow detection.
 * 
 * @property {string} itemWidth - Width of each item (default: auto)
 * @property {string} space - Gap between items (default: var(--s1))
 * @property {string} height - Height of the reel (default: auto)
 * @property {boolean} noBar - Hide the scrollbar
 * 
 * @example
 * <i-glan-tholl item-width="300px" space="var(--s2)">
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 *   <div>Card 3</div>
 * </i-glan-tholl>
 */

class GlanThollLayout extends HTMLElement {
  static get observedAttributes() {
    return ['item-width', 'space', 'height', 'no-bar'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
    this.toggleOverflowClass = this.toggleOverflowClass.bind(this);
    this.resizeObserver = null;
    this.mutationObserver = null;
  }

  connectedCallback() {
    this.render();
    this.setupObservers();
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  get itemWidth() {
    return this.getAttribute('item-width') || 'auto';
  }

  set itemWidth(val) {
    this.setAttribute('item-width', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get height() {
    return this.getAttribute('height') || 'auto';
  }

  set height(val) {
    this.setAttribute('height', val);
  }

  get noBar() {
    return this.hasAttribute('no-bar');
  }

  set noBar(val) {
    if (val) {
      this.setAttribute('no-bar', '');
    } else {
      this.removeAttribute('no-bar');
    }
  }

  toggleOverflowClass() {
    this.classList.toggle('overflowing', this.scrollWidth > this.clientWidth);
  }

  setupObservers() {
    // ResizeObserver for container size changes
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(entries => {
        this.toggleOverflowClass();
      });
      this.resizeObserver.observe(this);
    }

    // MutationObserver for child changes
    if ('MutationObserver' in window) {
      this.mutationObserver = new MutationObserver(entries => {
        this.toggleOverflowClass();
      });
      this.mutationObserver.observe(this, { childList: true });
    }

    // Initial check
    this.toggleOverflowClass();
  }

  render() {
    this.style.setProperty('--glan-tholl-item-width', this.itemWidth);
    this.style.setProperty('--glan-tholl-space', this.space);
    this.style.setProperty('--glan-tholl-height', this.height);

    const noBarStr = this.noBar ? '-noBar' : '';
    const id = `GlanTholl-${this.itemWidth}-${this.space}-${this.height}${noBarStr}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      
      styleEl.textContent = `
        ${selector} {
          block-size: ${this.height};
        }
        ${selector} > * {
          flex: 0 0 ${this.itemWidth};
        }
        ${selector} > * + * {
          margin-inline-start: ${this.space};
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-glan-tholl', GlanThollLayout);
}

export default GlanThollLayout;
