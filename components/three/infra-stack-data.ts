/**
 * Data + pure geometry builders for the hero "infrastructure stack".
 *
 * Five slabs, one per Exvorta module (same order + dates as the roadmap in
 * EcosystemBlock). Every detail is a flat list of line segments on the slab's
 * top plane: [x1, z1, x2, z2, …]. The scene lifts them to 3D, so nothing here
 * touches three.js and the module is safe to import from server code.
 */

export interface StackModule {
  key: string
  index: string
  name: string
  status: string
  live: boolean
  caption: string
}

export const STACK_MODULES: readonly StackModule[] = [
  { key: 'web', index: '01', name: 'Web', status: 'Live', live: true, caption: 'High-velocity sites built to earn institutional trust.' },
  { key: 'docs', index: '02', name: 'Docs & Track', status: 'Q3 2026', live: false, caption: 'A zero-trust data room and real-time supply-chain visibility.' },
  { key: 'crm', index: '03', name: 'CRM', status: 'Q1 2027', live: false, caption: 'Relationship architecture built for international trade desks.' },
  { key: 'intel', index: '04', name: 'Intel', status: 'Q3 2027', live: false, caption: 'Market intelligence for commodity forecasting and risk.' },
  { key: 'suite', index: '05', name: 'Suite', status: '2028', live: false, caption: 'Every module converging into one trade operating system.' },
] as const

/** Slab footprint (world units). */
export const SLAB = { w: 3.2, d: 2.2, h: 0.09 } as const

/** Scroll progress at which the stack has finished exploding / the highlight sweep begins. */
export const EXPLODE_END = 0.32
const SWEEP_START = 0.34

/** Which module is "lit" for a scroll progress (−1 while the stack is still assembling). */
export function activeFromProgress(p: number): number {
  if (p < SWEEP_START) return -1
  const t = (p - SWEEP_START) / (1 - SWEEP_START)
  return Math.min(STACK_MODULES.length - 1, Math.floor(t * STACK_MODULES.length))
}

/* ─── 2D segment helpers (x, z on the slab plane) ─────────────────────────── */

type Seg = number[]

const rect = (x: number, z: number, w: number, d: number): Seg => [
  x, z, x + w, z,
  x + w, z, x + w, z + d,
  x + w, z + d, x, z + d,
  x, z + d, x, z,
]

const line = (x1: number, z1: number, x2: number, z2: number): Seg => [x1, z1, x2, z2]

const polyline = (pts: Array<[number, number]>, closed = false): Seg => {
  const out: Seg = []
  for (let i = 0; i < pts.length - 1; i++) out.push(...pts[i], ...pts[i + 1])
  if (closed) out.push(...pts[pts.length - 1], ...pts[0])
  return out
}

const circle = (cx: number, cz: number, r: number, n = 40): Seg => {
  const pts: Array<[number, number]> = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r])
  }
  return polyline(pts, true)
}

const rotatedRect = (cx: number, cz: number, w: number, d: number, rot: number): Seg => {
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  const corner = (x: number, z: number): [number, number] => [cx + x * c - z * s, cz + x * s + z * c]
  return polyline([corner(-w / 2, -d / 2), corner(w / 2, -d / 2), corner(w / 2, d / 2), corner(-w / 2, d / 2)], true)
}

/* ─── Per-module wireframes ───────────────────────────────────────────────── */

export interface LayerArt {
  /** Structural linework (drawn with the slab's line colour). */
  lines: Float32Array
  /** Accent rectangles / discs filled with the brand accent: [x, z, w, d]. */
  accents: Array<[number, number, number, number]>
}

const f32 = (...parts: Seg[]) => new Float32Array(parts.flat())

function webLayer(): LayerArt {
  const lines = f32(
    rect(-1.38, -0.9, 2.76, 1.8),
    line(-1.38, -0.62, 1.38, -0.62),
    circle(-1.26, -0.76, 0.028, 12),
    circle(-1.16, -0.76, 0.028, 12),
    circle(-1.06, -0.76, 0.028, 12),
    rect(-0.5, -0.81, 1.0, 0.1),
    line(-1.2, -0.38, -0.1, -0.38),
    line(-1.2, -0.26, -0.35, -0.26),
    line(-1.2, -0.14, -0.55, -0.14),
    rect(-1.2, 0.04, 0.46, 0.14),
    rect(0.12, -0.46, 1.1, 0.64),
    line(0.12, -0.46, 1.22, 0.18),
    line(1.22, -0.46, 0.12, 0.18),
    rect(-1.2, 0.34, 0.74, 0.42),
    rect(-0.31, 0.34, 0.74, 0.42),
    rect(0.58, 0.34, 0.64, 0.42),
  )
  return { lines, accents: [[-1.2, 0.04, 0.46, 0.14]] }
}

function docsLayer(): LayerArt {
  const route: Array<[number, number]> = [[0.15, 0.72], [0.5, 0.28], [0.85, 0.44], [1.15, -0.12], [1.32, -0.62]]
  const lines = f32(
    rotatedRect(-0.78, 0.04, 0.86, 1.16, -0.16),
    rotatedRect(-0.62, 0.0, 0.86, 1.16, -0.02),
    rotatedRect(-0.44, -0.02, 0.86, 1.16, 0.12),
    line(-0.72, -0.4, -0.12, -0.34),
    line(-0.72, -0.22, -0.2, -0.17),
    line(-0.72, -0.04, -0.3, 0.0),
    line(-0.72, 0.14, -0.16, 0.19),
    polyline(route),
    ...route.map(([x, z]) => circle(x, z, 0.055, 16)),
    rect(0.1, -0.86, 1.2, 0.2),
  )
  return { lines, accents: [[0.1, -0.86, 0.42, 0.2]] }
}

function crmLayer(): LayerArt {
  const rows: Seg[] = []
  for (let i = 0; i < 5; i++) {
    const z = -0.5 + i * 0.3
    rows.push(
      line(-1.38, z + 0.14, 1.38, z + 0.14),
      circle(-1.24, z, 0.065, 18),
      line(-1.08, z - 0.03, -0.46, z - 0.03),
      line(-1.08, z + 0.05, -0.7, z + 0.05),
      rect(0.14, z - 0.06, 0.4, 0.12),
      line(0.82, z, 1.3, z),
    )
  }
  const lines = f32(rect(-1.38, -0.9, 2.76, 0.2), ...rows, rect(-1.38, -0.9, 2.76, 1.8))
  return { lines, accents: [[0.14, -0.2, 0.4, 0.12]] }
}

function intelLayer(): LayerArt {
  const heights = [0.3, 0.46, 0.38, 0.64, 0.52, 0.82, 0.98]
  const bars: Seg[] = []
  const trend: Array<[number, number]> = []
  heights.forEach((h, i) => {
    const x = -1.22 + i * 0.22
    bars.push(rect(x, 0.78 - h, 0.14, h))
    trend.push([x + 0.07, 0.78 - h - 0.14])
  })
  const lines = f32(
    polyline([[-1.34, -0.8], [-1.34, 0.8], [0.34, 0.8]]),
    ...bars,
    polyline(trend),
    ...trend.map(([x, z]) => circle(x, z, 0.03, 10)),
    circle(0.98, -0.12, 0.24, 40),
    circle(0.98, -0.12, 0.42, 48),
    circle(0.98, -0.12, 0.6, 56),
    line(0.38, -0.12, 1.58, -0.12),
    line(0.98, -0.72, 0.98, 0.48),
    line(0.56, -0.54, 1.4, 0.3),
    line(1.4, -0.54, 0.56, 0.3),
  )
  const last = heights.length - 1
  return { lines, accents: [[-1.22 + last * 0.22, 0.78 - heights[last], 0.14, heights[last]]] }
}

function suiteLayer(): LayerArt {
  const spokes: Seg[] = []
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    spokes.push(line(Math.cos(a) * 0.3, Math.sin(a) * 0.3, Math.cos(a) * 1.0, Math.sin(a) * 1.0))
  }
  const hex = (r: number): Seg => {
    const pts: Array<[number, number]> = []
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6
      pts.push([Math.cos(a) * r, Math.sin(a) * r])
    }
    return polyline(pts, true)
  }
  const lines = f32(circle(0, 0, 0.3, 40), circle(0, 0, 0.55, 48), circle(0, 0, 0.8, 56), circle(0, 0, 1.0, 64), ...spokes, hex(1.28), hex(0.42))
  return { lines, accents: [] }
}

const BUILDERS = [webLayer, docsLayer, crmLayer, intelLayer, suiteLayer] as const

export function buildLayerArt(index: number): LayerArt {
  return BUILDERS[index]()
}
