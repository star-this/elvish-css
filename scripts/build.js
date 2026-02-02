#!/usr/bin/env node

/**
 * Elvish Build Script
 * 
 * Bundles CSS and JS for distribution.
 * 
 * Usage:
 *   node scripts/build.js          # Build once
 *   node scripts/build.js --watch  # Watch mode
 *   node scripts/build.js --no-minify  # Skip minification
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

// Ensure dist directory exists
if (!existsSync(DIST)) {
  mkdirSync(DIST, { recursive: true });
}

// ============================================================
// CSS BUNDLING
// ============================================================

const CSS_FILES = [
  // Global styles
  'global/tokens.css',
  'global/reset.css',
  'global/utilities.css',
  'global/modern.css',
  'global/transitions.css',
  'global/inverted-radius.css',
  
  // Primitives (Sindarin order)
  'primitives/hath/hath.css',
  'primitives/bau/bau.css',
  'primitives/enedh/enedh.css',
  'primitives/tiniath/tiniath.css',
  'primitives/glan-veleg/glan-veleg.css',
  'primitives/gwistindor/gwistindor.css',
  'primitives/esgal/esgal.css',
  'primitives/vircantie/vircantie.css',
  'primitives/gant-thala/gant-thala.css',
  'primitives/glan-tholl/glan-tholl.css',
  'primitives/fano/fano.css',
  'primitives/thann/thann.css',
  'primitives/adleithian/adleithian.css',
  'primitives/him/him.css',
  'primitives/miriant/miriant.css',
  'primitives/gonath/gonath.css',
  
  // Visual effects and typography primitives
  'primitives/thir/thir.css',
  'primitives/tew/tew.css',
];

function bundleCSS() {
  console.log('📦 Bundling CSS...');
  
  const banner = `/**
 * Elvish Layout System v2.0.0
 * Intrinsic CSS layout primitives with Sindarin names
 * 
 * https://github.com/yourusername/elvish-layout
 * License: MIT
 */

`;

  let css = banner;
  
  for (const file of CSS_FILES) {
    const filePath = join(ROOT, file);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      // Remove @import statements since we're bundling
      const cleaned = content.replace(/@import\s+['"][^'"]+['"]\s*;?\n?/g, '');
      css += `/* === ${file} === */\n${cleaned}\n\n`;
    } else {
      console.warn(`  ⚠️  Missing: ${file}`);
    }
  }
  
  writeFileSync(join(DIST, 'elvish.css'), css);
  console.log('  ✅ dist/elvish.css');
  
  // Minify CSS (simple minification without dependencies)
  const minified = css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .replace(/\s*([{}:;,>+~])\s*/g, '$1') // Remove space around special chars
    .replace(/;}/g, '}')              // Remove trailing semicolons
    .trim();
  
  writeFileSync(join(DIST, 'elvish.min.css'), banner + minified);
  console.log('  ✅ dist/elvish.min.css');
}

// ============================================================
// JS BUNDLING
// ============================================================

const JS_PRIMITIVES = [
  'hath', 'bau', 'enedh', 'tiniath', 'glan-veleg', 'gwistindor',
  'esgal', 'vircantie', 'gant-thala', 'glan-tholl', 'fano', 'thann',
  'adleithian', 'him', 'miriant', 'gonath', 'thir', 'tew'
];

function bundleJS() {
  console.log('📦 Bundling JavaScript...');
  
  const banner = `/**
 * Elvish Layout System v2.0.0
 * Custom Elements for intrinsic CSS layouts
 * 
 * https://github.com/yourusername/elvish-layout
 * License: MIT
 */

`;

  // Read all primitive JS files
  let primitiveCode = '';
  const exports = [];
  
  for (const name of JS_PRIMITIVES) {
    const filePath = join(ROOT, 'primitives', name, `${name}.js`);
    if (existsSync(filePath)) {
      let content = readFileSync(filePath, 'utf-8');
      
      // Extract class name from the file (matches Layout or Element classes)
      const classMatch = content.match(/class\s+(\w+(?:Layout|Element))\s+extends/);
      if (classMatch) {
        const className = classMatch[1];
        exports.push(className);
        
        // Remove export statements for bundling
        content = content
          .replace(/export\s+\{\s*default\s+as\s+\w+\s*\}\s*;?/g, '')
          .replace(/export\s+default\s+\w+\s*;?/g, '')
          .replace(/export\s+\{[^}]+\}\s*;?/g, '');
        
        primitiveCode += `// ${name}\n${content}\n\n`;
      }
    }
  }
  
  // Read transitions.js
  let transitionsCode = readFileSync(join(ROOT, 'global', 'transitions.js'), 'utf-8');
  // Remove export statements
  transitionsCode = transitionsCode
    .replace(/export\s+(const|function|default)/g, '$1')
    .replace(/export\s+\{[^}]+\}\s*;?/g, '');

  // ESM Bundle
  const esmBundle = `${banner}
// Transitions
${transitionsCode}

// Primitives
${primitiveCode}

// Exports
export {
  ${exports.join(',\n  ')},
  transition,
  transitionTo,
  transitionTheme,
  transitionRatio,
  transitionLayout,
  supportsViewTransitions
};

export const VERSION = '2.0.0';

export const PRIMITIVES = {
  'i-hath': 'Stack',
  'i-bau': 'Box',
  'i-enedh': 'Center',
  'i-tiniath': 'Cluster',
  'i-glan-veleg': 'Sidebar',
  'i-gwistindor': 'Switcher',
  'i-esgal': 'Cover',
  'i-vircantie': 'Grid',
  'i-gant-thala': 'Frame',
  'i-glan-tholl': 'Reel',
  'i-fano': 'Imposter',
  'i-thann': 'Icon',
  'i-adleithian': 'Container',
  'i-him': 'Sticky',
  'i-miriant': 'Grid-placed',
  'i-gonath': 'Masonry'
};
`;

  writeFileSync(join(DIST, 'elvish.esm.js'), esmBundle);
  console.log('  ✅ dist/elvish.esm.js');

  // UMD Bundle (for script tags)
  const umdBundle = `${banner}
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Elvish = {}));
})(this, function(exports) {
  'use strict';

  // Transitions
  ${transitionsCode.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var')}

  // Primitives
  ${primitiveCode}

  // Exports
  ${exports.map(e => `exports.${e} = ${e};`).join('\n  ')}
  exports.transition = transition;
  exports.transitionTo = transitionTo;
  exports.transitionTheme = transitionTheme;
  exports.transitionRatio = transitionRatio;
  exports.transitionLayout = transitionLayout;
  exports.supportsViewTransitions = supportsViewTransitions;
  exports.VERSION = '2.0.0';

  Object.defineProperty(exports, '__esModule', { value: true });
});
`;

  writeFileSync(join(DIST, 'elvish.umd.js'), umdBundle);
  console.log('  ✅ dist/elvish.umd.js');

  // IIFE for direct script tag (auto-registers elements)
  const iifeBundle = `${banner}
(function() {
  'use strict';

  // Transitions
  ${transitionsCode.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var')}

  // Primitives (auto-register)
  ${primitiveCode}

  // Expose to window
  window.Elvish = {
    ${exports.join(',\n    ')},
    transition: transition,
    transitionTo: transitionTo,
    transitionTheme: transitionTheme,
    transitionRatio: transitionRatio,
    transitionLayout: transitionLayout,
    supportsViewTransitions: supportsViewTransitions,
    VERSION: '2.0.0'
  };
})();
`;

  writeFileSync(join(DIST, 'elvish.iife.js'), iifeBundle);
  console.log('  ✅ dist/elvish.iife.js');
}

// ============================================================
// TYPE DECLARATIONS
// ============================================================

function generateTypes() {
  console.log('📦 Generating TypeScript declarations...');
  
  const dts = `/**
 * Elvish Layout System
 * TypeScript declarations
 */

// Transition options
export interface TransitionOptions {
  duration?: number;
  easing?: string;
  types?: string[];
}

// Transition functions
export function transition(callback: () => void, options?: TransitionOptions): Promise<void>;
export function transitionTo(element: HTMLElement, changes: {
  attrs?: Record<string, string | null>;
  addClass?: string[];
  removeClass?: string[];
  toggleClass?: string[];
  style?: Record<string, string>;
}, options?: TransitionOptions): Promise<void>;
export function transitionTheme(theme: 'light' | 'dark' | 'auto', options?: TransitionOptions): Promise<void>;
export function transitionRatio(ratio: 'golden' | 'silver' | 'fifth', options?: TransitionOptions): Promise<void>;
export function transitionLayout(primitive: HTMLElement, attrs: Record<string, string>, options?: TransitionOptions): Promise<void>;
export function crossfade(outElement: HTMLElement, inElement: HTMLElement, options?: TransitionOptions): Promise<void>;
export function setTransitionName(element: HTMLElement, name: string): void;
export function clearTransitionName(element: HTMLElement): void;
export function nameTransitionGroup(elements: NodeListOf<Element> | HTMLElement[], prefix?: string): void;
export function enableAutoNaming(container: HTMLElement, transitionClass?: string): void;
export function disableAutoNaming(container: HTMLElement): void;
export function skipTransition(): void;
export function supportsViewTransitions(): boolean;
export function getActiveTransition(): ViewTransition | null;

// Layout primitives
export class HathLayout extends HTMLElement {}
export class BauLayout extends HTMLElement {}
export class EnedhLayout extends HTMLElement {}
export class TiniathLayout extends HTMLElement {}
export class GlanVelegLayout extends HTMLElement {}
export class GwistindorLayout extends HTMLElement {}
export class EsgalLayout extends HTMLElement {}
export class VircantieLayout extends HTMLElement {}
export class GantThalaLayout extends HTMLElement {}
export class GlanThollLayout extends HTMLElement {}
export class FanoLayout extends HTMLElement {}
export class ThannLayout extends HTMLElement {}
export class AdleithianLayout extends HTMLElement {}
export class HimLayout extends HTMLElement {}
export class MiriantLayout extends HTMLElement {}
export class GonathLayout extends HTMLElement {}

// Constants
export const VERSION: string;
export const PRIMITIVES: Record<string, string>;
export const SINDARIN: Record<string, string>;

// Custom element tag names
declare global {
  interface HTMLElementTagNameMap {
    'i-hath': HathLayout;
    'i-bau': BauLayout;
    'i-enedh': EnedhLayout;
    'i-tiniath': TiniathLayout;
    'i-glan-veleg': GlanVelegLayout;
    'i-gwistindor': GwistindorLayout;
    'i-esgal': EsgalLayout;
    'i-vircantie': VircantieLayout;
    'i-gant-thala': GantThalaLayout;
    'i-glan-tholl': GlanThollLayout;
    'i-fano': FanoLayout;
    'i-thann': ThannLayout;
    'i-adleithian': AdleithianLayout;
    'i-him': HimLayout;
    'i-miriant': MiriantLayout;
    'i-gonath': GonathLayout;
  }
}
`;

  writeFileSync(join(DIST, 'elvish.d.ts'), dts);
  console.log('  ✅ dist/elvish.d.ts');
}

// ============================================================
// MAIN
// ============================================================

console.log('🧝 Building Elvish...\n');

bundleCSS();
bundleJS();
generateTypes();

console.log('\n✨ Build complete!');
console.log(`
Files created:
  dist/elvish.css       - Full CSS bundle
  dist/elvish.min.css   - Minified CSS
  dist/elvish.esm.js    - ES Module bundle
  dist/elvish.umd.js    - UMD bundle (CommonJS/AMD)
  dist/elvish.iife.js   - IIFE bundle (script tag)
  dist/elvish.d.ts      - TypeScript declarations

Usage:
  <!-- CDN (after npm publish) -->
  <link rel="stylesheet" href="https://unpkg.com/elvish-layout/dist/elvish.min.css">
  <script src="https://unpkg.com/elvish-layout/dist/elvish.iife.js"></script>

  <!-- ES Modules -->
  import { transition, HathLayout } from 'elvish-layout';

  <!-- Script tag -->
  <script src="elvish.iife.js"></script>
  <script>
    Elvish.transition(() => { ... });
  </script>
`);
