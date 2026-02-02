/**
 * Elvish - Touch Support for i-thir
 * 
 * Enables touch interactions (long-press) for elements with the [touch] attribute.
 * Works alongside CSS :hover for desktop.
 * 
 * Usage:
 *   <i-thir hover="lift" touch>Hover AND long-press</i-thir>
 *   <i-thir hover="lift" touch="pulse">Different per platform</i-thir>
 * 
 * The script adds/removes the .touch-active class on long-press,
 * which triggers the same styles as :hover in the CSS.
 */

(function() {
  'use strict';
  
  // Configuration
  const LONG_PRESS_DURATION = 300; // ms before touch is considered "long press"
  const TOUCH_ACTIVE_DURATION = 600; // ms to keep effect active after release
  
  // Track active touches
  const touchTimers = new WeakMap();
  const activeElements = new WeakSet();
  
  /**
   * Initialize touch support for all i-thir[touch] elements
   */
  function initTouchSupport() {
    // Use event delegation on document for efficiency
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    
    // Also handle dynamically added elements via MutationObserver
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        // No action needed - we use event delegation
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
  
  /**
   * Handle touch start - begin long-press timer
   */
  function handleTouchStart(event) {
    const target = event.target.closest('i-thir[touch]');
    if (!target) return;
    
    // Clear any existing timer
    clearTouchTimer(target);
    
    // Start long-press timer
    const timer = setTimeout(() => {
      activateTouch(target);
    }, LONG_PRESS_DURATION);
    
    touchTimers.set(target, timer);
  }
  
  /**
   * Handle touch end - activate effect briefly or cancel
   */
  function handleTouchEnd(event) {
    const target = event.target.closest('i-thir[touch]');
    if (!target) return;
    
    clearTouchTimer(target);
    
    // If already active from long-press, keep it active briefly
    if (activeElements.has(target)) {
      setTimeout(() => {
        deactivateTouch(target);
      }, TOUCH_ACTIVE_DURATION);
    }
  }
  
  /**
   * Handle touch cancel - immediately deactivate
   */
  function handleTouchCancel(event) {
    const target = event.target.closest('i-thir[touch]');
    if (!target) return;
    
    clearTouchTimer(target);
    deactivateTouch(target);
  }
  
  /**
   * Clear the long-press timer for an element
   */
  function clearTouchTimer(element) {
    const timer = touchTimers.get(element);
    if (timer) {
      clearTimeout(timer);
      touchTimers.delete(element);
    }
  }
  
  /**
   * Activate the touch effect on an element
   */
  function activateTouch(element) {
    element.classList.add('touch-active');
    activeElements.add(element);
    
    // Dispatch custom event for JS listeners
    element.dispatchEvent(new CustomEvent('thir:touch-active', {
      bubbles: true,
      detail: { effect: getTouchEffect(element) }
    }));
  }
  
  /**
   * Deactivate the touch effect on an element
   */
  function deactivateTouch(element) {
    element.classList.remove('touch-active');
    activeElements.delete(element);
    
    // Dispatch custom event
    element.dispatchEvent(new CustomEvent('thir:touch-inactive', {
      bubbles: true
    }));
  }
  
  /**
   * Get the touch effect for an element
   * If [touch] has no value, use the [hover] value
   */
  function getTouchEffect(element) {
    const touchAttr = element.getAttribute('touch');
    
    // If touch has a value, use it
    if (touchAttr && touchAttr !== '' && touchAttr !== 'true') {
      return touchAttr;
    }
    
    // Otherwise, use the hover value
    return element.getAttribute('hover') || 'default';
  }
  
  /**
   * Utility: Check if device supports touch
   */
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  
  /**
   * Utility: Programmatically trigger touch effect
   */
  function triggerTouch(element, duration = TOUCH_ACTIVE_DURATION) {
    activateTouch(element);
    setTimeout(() => deactivateTouch(element), duration);
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTouchSupport);
  } else {
    initTouchSupport();
  }
  
  // Export utilities for programmatic use
  if (typeof window !== 'undefined') {
    window.ElvishTouch = {
      activate: activateTouch,
      deactivate: deactivateTouch,
      trigger: triggerTouch,
      isTouchDevice: isTouchDevice
    };
  }
  
  // ES Module export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      activate: activateTouch,
      deactivate: deactivateTouch,
      trigger: triggerTouch,
      isTouchDevice: isTouchDevice
    };
  }
})();
