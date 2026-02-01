/**
 * Switcher Layout Custom Element
 * 
 * Switches between horizontal and vertical at a container threshold.
 * Uses the "Holy Albatross" technique - no intermediary states.
 * 
 * @property {string} threshold - Container width to switch at (default: var(--measure))
 * @property {string} space - Gap between elements (default: var(--s1))
 * @property {number} limit - Max items for horizontal layout (default: 4)
 * 
 * @example
 * <i-gwistindor threshold="30rem" limit="3">
 *   <div>One</div>
 *   <div>Two</div>
 *   <div>Three</div>
 * </i-gwistindor>
 */

class GwistindorLayout extends HTMLElement {
  static get observedAttributes() {
    return ['threshold', 'space', 'limit'];
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

  get threshold() {
    return this.getAttribute('threshold') || 'var(--measure)';
  }

  set threshold(val) {
    this.setAttribute('threshold', val);
  }

  get space() {
    return this.getAttribute('space') || 'var(--s1)';
  }

  set space(val) {
    this.setAttribute('space', val);
  }

  get limit() {
    return parseInt(this.getAttribute('limit'), 10) || 4;
  }

  set limit(val) {
    this.setAttribute('limit', val);
  }

  render() {
    this.style.setProperty('--gwistindor-threshold', this.threshold);
    this.style.setProperty('--gwistindor-space', this.space);

    const id = `Gwistindor-${this.threshold}-${this.space}-${this.limit}`.replace(/[^\w-]/g, '');
    this.dataset.i = id;

    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      
      const selector = `[data-i="${id}"]`;
      const limitPlusOne = this.limit + 1;
      
      styleEl.textContent = `
        ${selector} {
          gap: ${this.space};
        }
        ${selector} > * {
          flex-basis: calc((${this.threshold} - 100%) * 999);
        }
        ${selector} > :nth-last-child(n+${limitPlusOne}),
        ${selector} > :nth-last-child(n+${limitPlusOne}) ~ * {
          flex-basis: 100%;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
}

if ('customElements' in window) {
  customElements.define('i-gwistindor', GwistindorLayout);
}

export default GwistindorLayout;
