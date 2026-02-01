/**
 * Him Layout Custom Element (NEW)
 * 
 * Creates sticky positioning with configurable offset.
 * Optionally detects "stuck" state via IntersectionObserver.
 * 
 * @property {string} to - Direction to stick: top, bottom, left, right (default: top)
 * @property {string} offset - Distance from edge when stuck (default: 0)
 * @property {boolean} sentinel - Enable stuck state detection
 * 
 * @example
 * <i-him offset="var(--s1)" sentinel>
 *   <header>This header sticks</header>
 * </i-him>
 */

class HimLayout extends HTMLElement {
  static get observedAttributes() {
    return ['to', 'offset', 'sentinel'];
  }

  constructor() {
    super();
    this.render = this.render.bind(this);
    this.observer = null;
    this.sentinelEl = null;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.cleanupSentinel();
  }

  attributeChangedCallback() {
    this.render();
  }

  get to() {
    return this.getAttribute('to') || 'top';
  }

  set to(val) {
    this.setAttribute('to', val);
  }

  get offset() {
    return this.getAttribute('offset') || '0';
  }

  set offset(val) {
    this.setAttribute('offset', val);
  }

  get sentinel() {
    return this.hasAttribute('sentinel');
  }

  set sentinel(val) {
    if (val) {
      this.setAttribute('sentinel', '');
    } else {
      this.removeAttribute('sentinel');
    }
  }

  cleanupSentinel() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.sentinelEl) {
      this.sentinelEl.remove();
      this.sentinelEl = null;
    }
  }

  setupSentinel() {
    this.cleanupSentinel();

    if (!this.sentinel || !('IntersectionObserver' in window)) {
      return;
    }

    // Create invisible sentinel element
    this.sentinelEl = document.createElement('div');
    this.sentinelEl.style.cssText = `
      position: absolute;
      height: 1px;
      width: 100%;
      pointer-events: none;
      visibility: hidden;
    `;

    // Position sentinel based on sticky direction
    if (this.to === 'bottom') {
      this.sentinelEl.style.bottom = '0';
      this.insertAdjacentElement('afterend', this.sentinelEl);
    } else {
      this.sentinelEl.style.top = '0';
      this.insertAdjacentElement('beforebegin', this.sentinelEl);
    }

    // Observe the sentinel
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When sentinel is not visible, we're "stuck"
          const isStuck = !entry.isIntersecting;
          this.dataset.stuck = isStuck;
          this.dispatchEvent(new CustomEvent('stuck-change', { 
            detail: { stuck: isStuck } 
          }));
        });
      },
      { threshold: [0] }
    );

    this.observer.observe(this.sentinelEl);
  }

  render() {
    this.style.setProperty('--him-offset', this.offset);

    const id = `Him-${this.to}-${this.offset}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      let css = '';

      switch (this.to) {
        case 'bottom':
          css = `${selector} { inset-block-start: auto; inset-block-end: ${this.offset}; }`;
          break;
        case 'left':
          css = `${selector} { inset-block-start: auto; inset-inline-start: ${this.offset}; }`;
          break;
        case 'right':
          css = `${selector} { inset-block-start: auto; inset-inline-end: ${this.offset}; }`;
          break;
        default: // top
          css = `${selector} { inset-block-start: ${this.offset}; }`;
      }

      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }

    // Setup or cleanup sentinel observation
    if (this.sentinel) {
      // Defer to ensure element is in DOM
      requestAnimationFrame(() => this.setupSentinel());
    } else {
      this.cleanupSentinel();
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-him', HimLayout);
}

export default HimLayout;
