/** Isometric projection helpers for the server-rendered SVG posters (no three.js). */

const COS = Math.cos(Math.PI / 6)
const SIN = Math.sin(Math.PI / 6)

export type P = [number, number]

/** World (x right, y up, z towards the viewer) → screen, `scale` px per unit. */
export function iso(x: number, y: number, z: number, scale: number): P {
  return [(x - z) * COS * scale, (x + z) * SIN * scale - y * scale]
}

export const polyPath = (pts: P[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`
