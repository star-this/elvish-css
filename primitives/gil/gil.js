/**
 * i-gil - Smart Prefetch Link Element
 * 
 * Sindarin: "gil" = star, bright spark (guiding light for navigation)
 * 
 * A wrapper/enhancement for <a> that intelligently prefetches resources
 * when users are likely to navigate (hover, focus, viewport proximity).
 * 
 * Usage:
 *   <!-- Basic: prefetch HTML on hover -->
 *   <i-gil href="/about">About Us</i-gil>
 *   
 *   <!-- Prefetch multiple resource types -->
 *   <i-gil href="/dashboard" 
 *          prefetch="html css:dashboard.css js:dashboard.js icons:chart,graph">
 *     Dashboard
 *   </i-gil>
 *   
 *   <!-- Eager prefetch (on viewport enter) -->
 *   <i-gil href="/products" prefetch-on="visible">Products</i-gil>
 *   
 *   <!-- Prefetch on idle -->
 *   <i-gil href="/contact" prefetch-on="idle">Contact</i-gil>
 * 
 * Attributes:
 *   href          - Link destination (required)
 *   prefetch      - Resources to prefetch (default: "html")
 *                   Format: "type:resource,resource;type:resource"
 *                   Types: html, css, js, icons, json, image
 *   prefetch-on   - When to prefetch:
 *                   "hover" (default), "visible", "idle", "immediate"
 *   prefetch-delay - Delay in ms before prefetching on hover (default: 65)
 */

(function() {
  'use strict';
  
  class ElvishGil extends HTMLElement {
    static get observedAttributes() {
      return ['href', 'prefetch', 'prefetch-on', 'prefetch-delay'];
    }
    
    constructor() {
      super();
      this.prefetched = new Set();
      this.hoverTimer = null;
      this.observer = null;
    }
    
    connectedCallback() {
      // Create inner anchor if not present
      if (!this.anchor) {
        const href = this.getAttribute('href') || '#';
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.innerHTML = this.innerHTML;
        this.innerHTML = '';
        this.appendChild(anchor);
      }
      
      // Copy relevant attributes to anchor
      this.syncAttributes();
      
      // Set up prefetch triggers
      this.setupPrefetch();
    }
    
    disconnectedCallback() {
      this.cleanup();
    }
    
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'href' && this.anchor) {
        this.anchor.href = newVal;
      }
      if (name === 'prefetch-on') {
        this.cleanup();
        this.setupPrefetch();
      }
    }
    
    get anchor() {
      return this.querySelector('a');
    }
    
    syncAttributes() {
      const anchor = this.anchor;
      if (!anchor) return;
      
      // Copy common link attributes
      ['target', 'rel', 'download', 'hreflang', 'type'].forEach(attr => {
        if (this.hasAttribute(attr)) {
          anchor.setAttribute(attr, this.getAttribute(attr));
        }
      });
      
      // Copy class and style
      if (this.hasAttribute('link-class')) {
        anchor.className = this.getAttribute('link-class');
      }
    }
    
    setupPrefetch() {
      const trigger = this.getAttribute('prefetch-on') || 'hover';
      
      switch (trigger) {
        case 'hover':
          this.setupHoverPrefetch();
          break;
        case 'visible':
          this.setupVisiblePrefetch();
          break;
        case 'idle':
          this.setupIdlePrefetch();
          break;
        case 'immediate':
          this.doPrefetch();
          break;
      }
    }
    
    setupHoverPrefetch() {
      const delay = parseInt(this.getAttribute('prefetch-delay')) || 65;
      
      const onEnter = () => {
        this.hoverTimer = setTimeout(() => this.doPrefetch(), delay);
      };
      
      const onLeave = () => {
        if (this.hoverTimer) {
          clearTimeout(this.hoverTimer);
          this.hoverTimer = null;
        }
      };
      
      this.addEventListener('mouseenter', onEnter);
      this.addEventListener('mouseleave', onLeave);
      this.addEventListener('focus', onEnter, true);
      this.addEventListener('blur', onLeave, true);
      
      // Touch: prefetch on touchstart
      this.addEventListener('touchstart', () => this.doPrefetch(), { passive: true });
      
      this._cleanup = () => {
        this.removeEventListener('mouseenter', onEnter);
        this.removeEventListener('mouseleave', onLeave);
        this.removeEventListener('focus', onEnter, true);
        this.removeEventListener('blur', onLeave, true);
      };
    }
    
    setupVisiblePrefetch() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.doPrefetch();
              this.observer?.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );
      
      this.observer.observe(this);
    }
    
    setupIdlePrefetch() {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.doPrefetch(), { timeout: 2000 });
      } else {
        setTimeout(() => this.doPrefetch(), 200);
      }
    }
    
    cleanup() {
      if (this.hoverTimer) {
        clearTimeout(this.hoverTimer);
      }
      if (this.observer) {
        this.observer.disconnect();
      }
      if (this._cleanup) {
        this._cleanup();
      }
    }
    
    /**
     * Parse prefetch attribute
     * Format: "html css:file.css js:file.js icons:name,name"
     */
    parsePrefetch() {
      const prefetch = this.getAttribute('prefetch') || 'html';
      const resources = [];
      
      prefetch.split(/\s+/).forEach(part => {
        if (part.includes(':')) {
          const [type, items] = part.split(':');
          items.split(',').forEach(item => {
            resources.push({ type, value: item.trim() });
          });
        } else {
          // Shorthand: "html" means prefetch the href as HTML
          resources.push({ type: part, value: null });
        }
      });
      
      return resources;
    }
    
    /**
     * Execute prefetch
     */
    async doPrefetch() {
      const resources = this.parsePrefetch();
      const href = this.getAttribute('href');
      
      for (const { type, value } of resources) {
        const key = `${type}:${value || href}`;
        if (this.prefetched.has(key)) continue;
        this.prefetched.add(key);
        
        try {
          switch (type) {
            case 'html':
              await this.prefetchHTML(value || href);
              break;
            case 'css':
              await this.prefetchCSS(value);
              break;
            case 'js':
              await this.prefetchJS(value);
              break;
            case 'icons':
              this.prefetchIcons(value);
              break;
            case 'json':
              await this.prefetchJSON(value);
              break;
            case 'image':
              await this.prefetchImage(value);
              break;
          }
        } catch (err) {
          console.warn(`[i-gil] Failed to prefetch ${type}:${value || href}`, err);
        }
      }
      
      this.dispatchEvent(new CustomEvent('prefetched', {
        detail: { resources: [...this.prefetched] }
      }));
    }
    
    async prefetchHTML(url) {
      // Use <link rel="prefetch"> for HTML
      if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return;
      
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = 'document';
      document.head.appendChild(link);
    }
    
    async prefetchCSS(url) {
      if (document.querySelector(`link[href="${url}"]`)) return;
      
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = 'style';
      document.head.appendChild(link);
    }
    
    async prefetchJS(url) {
      if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return;
      
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = 'script';
      document.head.appendChild(link);
    }
    
    prefetchIcons(names) {
      // Use ElvishIcons loader if available
      if (window.ElvishIcons) {
        const icons = names.split(',').map(s => s.trim());
        window.ElvishIcons.preload(icons);
      }
    }
    
    async prefetchJSON(url) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    
    async prefetchImage(url) {
      const img = new Image();
      img.src = url;
    }
  }
  
  // Define custom element
  if (!customElements.get('i-gil')) {
    customElements.define('i-gil', ElvishGil);
  }
  
  // Export
  if (typeof window !== 'undefined') {
    window.ElvishGil = ElvishGil;
  }
})();
