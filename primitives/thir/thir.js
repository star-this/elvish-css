/**
 * Visual Effects Custom Element (i-thîr)
 * 
 * "Thîr" (Sindarin) = look, face, expression, appearance
 * Handles visual effects, shapes, and interactions.
 * 
 * @property {string} effect - Visual effect preset (neon, frosted, glassmorphism, etc.)
 * @property {string} corners - Corner shape (inverted, top, bottom, tl, tr, bl, br)
 * @property {string} shape - Overall shape (ticket, scalloped, pill, etc.)
 * @property {string} hover - Hover interaction (lift, grow, shrink, tilt, etc.)
 * @property {string} touch - Touch interaction (same values as hover, or boolean for same-as-hover)
 * @property {string} filter - CSS filter shortcut (grayscale, sepia, blur-*, etc.)
 * @property {string} backdrop - Backdrop filter (blur, frost, dim, etc.)
 * @property {string} blend - Blend mode (multiply, screen, overlay, etc.)
 * 
 * @example
 * <i-thir effect="neon" color="cyan">Glowing card</i-thir>
 * <i-thir effect="glassmorphism" corners="inverted">Glass with scalloped corners</i-thir>
 * <i-thir hover="lift" touch>Lifts on hover and long-press</i-thir>
 */

class ThirElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'effect', 'corners', 'shape',
      'hover', 'touch',
      'filter', 'backdrop', 'blend',
      'opacity', 'cursor',
      'rotate', 'flip', 'skew'
    ];
  }

  constructor() {
    super();
    this._touchTimer = null;
    this._touchActive = false;
  }

  connectedCallback() {
    // Initialize touch support if [touch] attribute is present
    if (this.hasAttribute('touch')) {
      this._initTouchSupport();
    }
  }

  disconnectedCallback() {
    this._cleanupTouchSupport();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'touch') {
      if (newVal !== null) {
        this._initTouchSupport();
      } else {
        this._cleanupTouchSupport();
      }
    }
  }

  // Touch support methods
  _initTouchSupport() {
    this._onTouchStart = this._handleTouchStart.bind(this);
    this._onTouchEnd = this._handleTouchEnd.bind(this);
    this._onTouchCancel = this._handleTouchCancel.bind(this);

    this.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this.addEventListener('touchend', this._onTouchEnd, { passive: true });
    this.addEventListener('touchcancel', this._onTouchCancel, { passive: true });
  }

  _cleanupTouchSupport() {
    if (this._onTouchStart) {
      this.removeEventListener('touchstart', this._onTouchStart);
      this.removeEventListener('touchend', this._onTouchEnd);
      this.removeEventListener('touchcancel', this._onTouchCancel);
    }
    this._clearTouchTimer();
  }

  _handleTouchStart(e) {
    this._clearTouchTimer();
    
    // Long press threshold (300ms)
    this._touchTimer = setTimeout(() => {
      this._activateTouch();
    }, 300);
  }

  _handleTouchEnd(e) {
    this._clearTouchTimer();
    
    // Keep active briefly after release
    if (this._touchActive) {
      setTimeout(() => {
        this._deactivateTouch();
      }, 600);
    }
  }

  _handleTouchCancel(e) {
    this._clearTouchTimer();
    this._deactivateTouch();
  }

  _clearTouchTimer() {
    if (this._touchTimer) {
      clearTimeout(this._touchTimer);
      this._touchTimer = null;
    }
  }

  _activateTouch() {
    this._touchActive = true;
    this.classList.add('touch-active');
    
    this.dispatchEvent(new CustomEvent('thir:touch-active', {
      bubbles: true,
      detail: { effect: this._getTouchEffect() }
    }));
  }

  _deactivateTouch() {
    this._touchActive = false;
    this.classList.remove('touch-active');
    
    this.dispatchEvent(new CustomEvent('thir:touch-inactive', {
      bubbles: true
    }));
  }

  _getTouchEffect() {
    const touchAttr = this.getAttribute('touch');
    
    // If touch has a specific value, use it
    if (touchAttr && touchAttr !== '' && touchAttr !== 'true') {
      return touchAttr;
    }
    
    // Otherwise, use the hover value
    return this.getAttribute('hover') || 'default';
  }

  // Attribute getters/setters
  get effect() { return this.getAttribute('effect'); }
  set effect(val) { val ? this.setAttribute('effect', val) : this.removeAttribute('effect'); }

  get corners() { return this.getAttribute('corners'); }
  set corners(val) { val ? this.setAttribute('corners', val) : this.removeAttribute('corners'); }

  get shape() { return this.getAttribute('shape'); }
  set shape(val) { val ? this.setAttribute('shape', val) : this.removeAttribute('shape'); }

  get hover() { return this.getAttribute('hover'); }
  set hover(val) { val ? this.setAttribute('hover', val) : this.removeAttribute('hover'); }

  get touch() { return this.hasAttribute('touch'); }
  set touch(val) { val ? this.setAttribute('touch', val === true ? '' : val) : this.removeAttribute('touch'); }

  get filter() { return this.getAttribute('filter'); }
  set filter(val) { val ? this.setAttribute('filter', val) : this.removeAttribute('filter'); }

  get backdrop() { return this.getAttribute('backdrop'); }
  set backdrop(val) { val ? this.setAttribute('backdrop', val) : this.removeAttribute('backdrop'); }

  get blend() { return this.getAttribute('blend'); }
  set blend(val) { val ? this.setAttribute('blend', val) : this.removeAttribute('blend'); }
}

// Define the custom element
if ('customElements' in window) {
  customElements.define('i-thir', ThirElement);
}

export default ThirElement;
