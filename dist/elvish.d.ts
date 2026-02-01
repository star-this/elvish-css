/**
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
