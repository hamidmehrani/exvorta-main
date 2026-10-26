import * as THREE from 'three'

/**
 * The 3D scene never hard-codes a colour: it reads the same design tokens the
 * rest of the site uses (`--color-*` in app/globals.css), so a token change
 * re-skins the WebGL layer too.
 */
export interface StackColors {
  /** Linework on obsidian (token: surface). */
  ink: THREE.Color
  /** Live / lit accent on dark surfaces (token: success). */
  accent: THREE.Color
  /** Quieter accent for planned modules (token: emerald). */
  accentSoft: THREE.Color
  /** Slab top shading, light → deep (tokens: card, dashboard). */
  base: THREE.Color
  deep: THREE.Color
}

function token(css: CSSStyleDeclaration, name: string): THREE.Color {
  const value = css.getPropertyValue(name).trim()
  return value ? new THREE.Color(value) : new THREE.Color().setRGB(1, 1, 1)
}

export function readStackColors(): StackColors {
  const css = getComputedStyle(document.documentElement)
  return {
    ink: token(css, '--color-surface'),
    accent: token(css, '--color-success'),
    accentSoft: token(css, '--color-emerald'),
    base: token(css, '--color-card'),
    deep: token(css, '--color-dashboard'),
  }
}
