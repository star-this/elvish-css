/**
 * Elvish - View Transitions Helper
 * 
 * Utilities for smooth view transitions between layout states.
 * 
 * Usage:
 * 
 * import { transition, transitionTo } from './transitions.js';
 * 
 * // Wrap any DOM change in a transition
 * transition(() => {
 *   element.classList.toggle('collapsed');
 * });
 * 
 * // With custom options
 * transition(() => {
 *   sidebar.hidden = true;
 * }, { duration: 500 });
 * 
 * // Transition with callback after completion
 * transition(() => {
 *   grid.setAttribute('columns', '4');
 * }).then(() => {
 *   console.log('Transition complete!');
 * });
 */

/**
 * Check if View Transitions API is supported
 */
export const supportsViewTransitions = () => 
  typeof document !== 'undefined' && 
  'startViewTransition' in document;

/**
 * Get the currently active view transition (if any)
 * @returns {ViewTransition|null}
 */
export const getActiveTransition = () => 
  document.activeViewTransition ?? null;

/**
 * Wrap a DOM mutation in a view transition
 * 
 * @param {Function} updateCallback - Function that performs DOM changes
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Override transition duration (ms)
 * @param {string} options.easing - Override easing function
 * @param {string[]} options.types - Transition types for :active-view-transition-type()
 * @returns {Promise} Resolves when transition completes
 */
export function transition(updateCallback, options = {}) {
  // If View Transitions not supported, just run the callback
  if (!supportsViewTransitions()) {
    updateCallback();
    return Promise.resolve();
  }
  
  // Apply custom duration/easing if provided
  const root = document.documentElement;
  const originalDuration = root.style.getPropertyValue('--transition-duration');
  const originalEasing = root.style.getPropertyValue('--transition-ease');
  
  if (options.duration) {
    root.style.setProperty('--transition-duration', `${options.duration}ms`);
  }
  if (options.easing) {
    root.style.setProperty('--transition-ease', options.easing);
  }
  
  // Start the view transition with optional types
  const transitionOptions = options.types 
    ? { update: updateCallback, types: options.types }
    : updateCallback;
  
  const viewTransition = document.startViewTransition(transitionOptions);
  
  // Restore original values after transition
  return viewTransition.finished.then(() => {
    if (options.duration) {
      root.style.setProperty('--transition-duration', originalDuration || '');
    }
    if (options.easing) {
      root.style.setProperty('--transition-ease', originalEasing || '');
    }
  });
}

/**
 * Transition an element to a new state by changing attributes/classes
 * 
 * @param {HTMLElement} element - Element to transition
 * @param {Object} changes - Attribute/class changes to apply
 * @param {Object} changes.attrs - Attributes to set (use null to remove)
 * @param {string[]} changes.addClass - Classes to add
 * @param {string[]} changes.removeClass - Classes to remove
 * @param {string[]} changes.toggleClass - Classes to toggle
 * @param {Object} changes.style - Inline styles to set
 * @param {Object} options - Transition options
 * @returns {Promise}
 */
export function transitionTo(element, changes = {}, options = {}) {
  return transition(() => {
    // Apply attribute changes
    if (changes.attrs) {
      Object.entries(changes.attrs).forEach(([key, value]) => {
        if (value === null) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, value);
        }
      });
    }
    
    // Apply class changes
    if (changes.addClass) {
      element.classList.add(...changes.addClass);
    }
    if (changes.removeClass) {
      element.classList.remove(...changes.removeClass);
    }
    if (changes.toggleClass) {
      changes.toggleClass.forEach(cls => element.classList.toggle(cls));
    }
    
    // Apply style changes
    if (changes.style) {
      Object.entries(changes.style).forEach(([prop, value]) => {
        element.style.setProperty(prop, value);
      });
    }
  }, options);
}

/**
 * Transition between two elements (e.g., swap content)
 * 
 * @param {HTMLElement} outElement - Element leaving
 * @param {HTMLElement} inElement - Element entering
 * @param {Object} options - Transition options
 * @returns {Promise}
 */
export function crossfade(outElement, inElement, options = {}) {
  return transition(() => {
    outElement.hidden = true;
    inElement.hidden = false;
  }, options);
}

/**
 * Create a named transition group for an element
 * Elements with the same view-transition-name animate together
 * 
 * @param {HTMLElement} element - Element to name
 * @param {string} name - Transition name
 */
export function setTransitionName(element, name) {
  element.style.viewTransitionName = name;
}

/**
 * Remove transition name from element
 * 
 * @param {HTMLElement} element 
 */
export function clearTransitionName(element) {
  element.style.viewTransitionName = '';
}

/**
 * Batch multiple elements with unique transition names
 * Useful for list/grid items that should animate independently
 * 
 * @param {NodeList|HTMLElement[]} elements - Elements to name
 * @param {string} prefix - Name prefix (will add index)
 */
export function nameTransitionGroup(elements, prefix = 'item') {
  elements.forEach((el, i) => {
    el.style.viewTransitionName = `${prefix}-${i}`;
  });
}

/**
 * Enable auto-naming with match-element for a container's children
 * Each child gets a unique browser-generated name automatically
 * 
 * @param {HTMLElement} container - Parent element
 * @param {string} [transitionClass] - Optional view-transition-class for group styling
 */
export function enableAutoNaming(container, transitionClass) {
  Array.from(container.children).forEach(child => {
    child.style.viewTransitionName = 'match-element';
    if (transitionClass) {
      child.style.viewTransitionClass = transitionClass;
    }
  });
}

/**
 * Disable auto-naming for a container's children
 * 
 * @param {HTMLElement} container - Parent element
 */
export function disableAutoNaming(container) {
  Array.from(container.children).forEach(child => {
    child.style.viewTransitionName = '';
    child.style.viewTransitionClass = '';
  });
}

/**
 * Elvish-specific: Transition ratio change
 * 
 * @param {'golden'|'silver'|'fifth'} ratio - New ratio
 * @param {Object} options - Transition options
 */
export function transitionRatio(ratio, options = {}) {
  const ratioVar = `var(--ratio-${ratio})`;
  const measures = { golden: '60ch', fifth: '70ch', silver: '80ch' };
  
  return transition(() => {
    const root = document.documentElement;
    root.style.setProperty('--ratio', ratioVar);
    root.style.setProperty('--measure', measures[ratio]);
    root.dataset.ratio = ratio;
  }, { duration: 400, types: ['layout', 'ratio'], ...options });
}

/**
 * Elvish-specific: Transition theme change
 * 
 * @param {'light'|'dark'|'auto'} theme - New theme
 * @param {Object} options - Transition options
 */
export function transitionTheme(theme, options = {}) {
  return transition(() => {
    const root = document.documentElement;
    if (theme === 'auto') {
      root.style.colorScheme = 'light dark';
    } else {
      root.style.colorScheme = theme;
    }
    localStorage.setItem('elvish-theme', theme);
  }, { duration: 300, types: ['theme'], ...options });
}

/**
 * Elvish-specific: Transition layout primitive state
 * 
 * @param {HTMLElement} primitive - Elvish layout element
 * @param {Object} attrs - New attribute values
 * @param {Object} options - Transition options
 */
export function transitionLayout(primitive, attrs, options = {}) {
  // Give the primitive a transition name if it doesn't have one
  if (!primitive.style.viewTransitionName) {
    primitive.style.viewTransitionName = primitive.tagName.toLowerCase();
  }
  
  return transitionTo(primitive, { attrs }, { types: ['layout'], ...options });
}

/**
 * Skip/cancel the currently active view transition
 */
export function skipTransition() {
  const active = getActiveTransition();
  if (active) {
    active.skipTransition();
  }
}

// Default export for convenient importing
export default {
  transition,
  transitionTo,
  crossfade,
  setTransitionName,
  clearTransitionName,
  nameTransitionGroup,
  enableAutoNaming,
  disableAutoNaming,
  transitionRatio,
  transitionTheme,
  transitionLayout,
  skipTransition,
  supportsViewTransitions,
  getActiveTransition,
};
