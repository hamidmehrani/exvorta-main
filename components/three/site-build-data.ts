/**
 * Data + pure helpers for the "site build" scene used by the Process section:
 * one website, drawn as a blueprint, composed, extruded into architecture and
 * finally deployed to a ring of edge nodes. No three.js import — safe for the
 * server-rendered poster.
 */

/** The page slab (world units). Centered on the origin; x → right, z → towards the viewer. */
export const PAGE = { w: 3.2, d: 2.4, h: 0.06 } as const

export interface SiteBlock {
  /** Top-left corner on the slab plane. */
  x: number
  z: number
  w: number
  d: number
  /** Final extrusion height (stage 3). */
  height: number
  accent?: boolean
}

/** A web page's layout, as extruded architecture. */
export const SITE_BLOCKS: readonly SiteBlock[] = [
  { x: -1.46, z: -1.06, w: 2.92, d: 0.22, height: 0.1 }, // header
  { x: -1.46, z: -0.72, w: 1.3, d: 0.86, height: 0.34 }, // hero copy
  { x: -1.46, z: 0.22, w: 0.56, d: 0.18, height: 0.2, accent: true }, // call to action
  { x: -0.04, z: -0.72, w: 1.5, d: 0.86, height: 0.56 }, // hero visual
  { x: -1.46, z: 0.52, w: 0.92, d: 0.46, height: 0.26 }, // card 1
  { x: -0.46, z: 0.52, w: 0.92, d: 0.46, height: 0.42 }, // card 2
  { x: 0.54, z: 0.52, w: 0.92, d: 0.46, height: 0.18 }, // card 3
  { x: -1.46, z: 1.04, w: 2.92, d: 0.12, height: 0.06 }, // footer
] as const

/** Decorative name of what the scene is doing at each stage (0…3). */
export const STAGE_LABELS = ['Blueprint', 'Compose', 'Extrude', 'Deploy'] as const

/** Edge nodes the deployed site launches to. */
export const EDGE_NODES = 8
export const EDGE_RADIUS = 2.7
export const FLOOR_Y = -0.85

/**
 * Scroll progress (0…1 across the steps list) → active step index. Step i owns
 * [i/n, (i+1)/n), matching how the list is laid out.
 */
export function activeStep(p: number, steps: number): number {
  if (steps <= 1) return 0
  return Math.min(steps - 1, Math.max(0, Math.floor(p * steps)))
}

/**
 * Scroll progress → scene stage (0…3). The centre of step i maps to
 * i / (steps − 1) of the way through, so the scene is exactly "at" a stage while
 * its step is centred in the viewport.
 */
export function stageFromProgress(p: number, steps: number): number {
  if (steps <= 1) return Math.min(3, Math.max(0, p * 3))
  const t = (p * steps - 0.5) / (steps - 1)
  return Math.min(1, Math.max(0, t)) * 3
}
