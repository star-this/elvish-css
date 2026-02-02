/**
 * Typography Custom Element (i-têw)
 * 
 * "Têw" (Sindarin) = letters, characters, writing
 * Handles all text and font styling concerns.
 * 
 * @property {string} family - Font family (sans, serif, title, code, alt)
 * @property {string} size - Font size from modular scale (-3 to 8, xs to 6xl, fluid-*)
 * @property {string} weight - Font weight (thin, light, normal, medium, semibold, bold, etc.)
 * @property {string} leading - Line height (none, tight, snug, normal, relaxed, loose)
 * @property {string} tracking - Letter spacing (tighter, tight, normal, wide, wider, widest)
 * @property {string} align - Text alignment (left, center, right, justify)
 * @property {string} transform - Text transform (uppercase, lowercase, capitalize, small-caps)
 * @property {string} decoration - Text decoration (underline, line-through, overline, etc.)
 * @property {string} wrap - Text wrap behavior (balance, pretty, stable, nowrap)
 * @property {string} shadow - Text shadow (sm, md, lg, glow, 3d, long)
 * @property {string} color - Text color (primary, muted, accent, success, etc.)
 * @property {string} preset - Typography preset (h1-h6, body, lead, caption, code, quote, bquote)
 * @property {string} measure - Line length constraint (narrow, normal, wide, full)
 * @property {string} numeric - Numeric font features (tabular, oldstyle, slashed-zero, ordinal)
 * 
 * @example
 * <i-tew family="serif" size="lg" weight="bold">Elegant heading</i-tew>
 * <i-tew preset="bquote" data-cite="Author">A memorable quote.</i-tew>
 * <i-tew leading="loose" tracking="wide">Spacious text</i-tew>
 */

class TewElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'family', 'size', 'weight',
      'leading', 'tracking', 'word-spacing',
      'align', 'valign',
      'transform', 'case',
      'style', 'italic',
      'decoration', 'decoration-thickness',
      'wrap', 'whitespace', 'break', 'hyphens',
      'overflow', 'truncate', 'lines',
      'indent', 'color',
      'shadow', 'selection',
      'numeric', 'ligatures', 'kerning',
      'rendering', 'smoothing',
      'writing', 'dir', 'orientation',
      'preset', 'measure',
      'block', 'inline-block', 'responsive',
      'data-cite', 'closing'
    ];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    // Ensure proper display for block-level presets
    this._updateDisplay();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'preset' || name === 'block' || name === 'inline-block') {
      this._updateDisplay();
    }
  }

  _updateDisplay() {
    // Block-level presets automatically get display: block via CSS
    // This method is for any JS-based enhancements if needed
  }

  // Attribute getters/setters for common properties
  get family() { return this.getAttribute('family'); }
  set family(val) { val ? this.setAttribute('family', val) : this.removeAttribute('family'); }

  get size() { return this.getAttribute('size'); }
  set size(val) { val ? this.setAttribute('size', val) : this.removeAttribute('size'); }

  get weight() { return this.getAttribute('weight'); }
  set weight(val) { val ? this.setAttribute('weight', val) : this.removeAttribute('weight'); }

  get leading() { return this.getAttribute('leading'); }
  set leading(val) { val ? this.setAttribute('leading', val) : this.removeAttribute('leading'); }

  get tracking() { return this.getAttribute('tracking'); }
  set tracking(val) { val ? this.setAttribute('tracking', val) : this.removeAttribute('tracking'); }

  get align() { return this.getAttribute('align'); }
  set align(val) { val ? this.setAttribute('align', val) : this.removeAttribute('align'); }

  get transform() { return this.getAttribute('transform'); }
  set transform(val) { val ? this.setAttribute('transform', val) : this.removeAttribute('transform'); }

  get decoration() { return this.getAttribute('decoration'); }
  set decoration(val) { val ? this.setAttribute('decoration', val) : this.removeAttribute('decoration'); }

  get wrap() { return this.getAttribute('wrap'); }
  set wrap(val) { val ? this.setAttribute('wrap', val) : this.removeAttribute('wrap'); }

  get shadow() { return this.getAttribute('shadow'); }
  set shadow(val) { val ? this.setAttribute('shadow', val) : this.removeAttribute('shadow'); }

  get color() { return this.getAttribute('color'); }
  set color(val) { val ? this.setAttribute('color', val) : this.removeAttribute('color'); }

  get preset() { return this.getAttribute('preset'); }
  set preset(val) { val ? this.setAttribute('preset', val) : this.removeAttribute('preset'); }

  get measure() { return this.getAttribute('measure'); }
  set measure(val) { val ? this.setAttribute('measure', val) : this.removeAttribute('measure'); }

  get numeric() { return this.getAttribute('numeric'); }
  set numeric(val) { val ? this.setAttribute('numeric', val) : this.removeAttribute('numeric'); }

  get lines() { return this.getAttribute('lines'); }
  set lines(val) { val ? this.setAttribute('lines', val) : this.removeAttribute('lines'); }

  // Boolean attributes
  get block() { return this.hasAttribute('block'); }
  set block(val) { val ? this.setAttribute('block', '') : this.removeAttribute('block'); }

  get italic() { return this.hasAttribute('italic'); }
  set italic(val) { val ? this.setAttribute('italic', '') : this.removeAttribute('italic'); }

  get truncate() { return this.hasAttribute('truncate'); }
  set truncate(val) { val ? this.setAttribute('truncate', '') : this.removeAttribute('truncate'); }

  get responsive() { return this.hasAttribute('responsive'); }
  set responsive(val) { val ? this.setAttribute('responsive', '') : this.removeAttribute('responsive'); }

  // Data attribute for citation (bquote preset)
  get cite() { return this.dataset.cite; }
  set cite(val) { val ? this.dataset.cite = val : delete this.dataset.cite; }
}

// Define the custom element
if ('customElements' in window) {
  customElements.define('i-tew', TewElement);
}

export default TewElement;
