import { iso, polyPath } from './iso'
import type { P } from './iso'
import { PAGE, SITE_BLOCKS } from './site-build-data'

/**
 * Static isometric render of the extruded site: the server-rendered stand-in
 * for the Process section's WebGL scene (first paint, no-WebGL, data-saver, and
 * what the canvas cross-fades from).
 */

const S = 52

function box(x: number, z: number, w: number, d: number, yBase: number, yTop: number) {
  const top: P[] = [iso(x, yTop, z, S), iso(x + w, yTop, z, S), iso(x + w, yTop, z + d, S), iso(x, yTop, z + d, S)]
  const left: P[] = [iso(x, yTop, z + d, S), iso(x + w, yTop, z + d, S), iso(x + w, yBase, z + d, S), iso(x, yBase, z + d, S)]
  const right: P[] = [iso(x + w, yTop, z, S), iso(x + w, yTop, z + d, S), iso(x + w, yBase, z + d, S), iso(x + w, yBase, z, S)]
  return { top: polyPath(top), left: polyPath(left), right: polyPath(right) }
}

export function SiteBuildPoster({ className = '' }: { className?: string }) {
  const slab = box(-PAGE.w / 2, -PAGE.d / 2, PAGE.w, PAGE.d, -PAGE.h / 2, PAGE.h / 2)
  // Painter's order: far blocks first (screen-y grows with x + z).
  const blocks = [...SITE_BLOCKS]
    .sort((a, b) => a.x + a.w / 2 + a.z + a.d / 2 - (b.x + b.w / 2 + b.z + b.d / 2))
    .map((b, i) => ({ ...b, key: i, ...box(b.x, b.z, b.w, b.d, PAGE.h / 2, PAGE.h / 2 + b.height) }))

  return (
    <svg viewBox="-200 -150 400 300" className={className} role="img" aria-label="A website drawn as extruded architecture on a blueprint grid">
      <g strokeLinejoin="round">
        <path d={slab.left} className="fill-sidebar stroke-white/25" strokeWidth={0.8} />
        <path d={slab.right} className="fill-dashboard stroke-white/25" strokeWidth={0.8} />
        <path d={slab.top} className="fill-card stroke-white/40" strokeWidth={0.9} />
        {blocks.map((b) => (
          <g key={b.key}>
            <path d={b.left} className={b.accent ? 'fill-emerald/60 stroke-success/70' : 'fill-sidebar stroke-white/35'} strokeWidth={0.7} />
            <path d={b.right} className={b.accent ? 'fill-emerald/40 stroke-success/70' : 'fill-dashboard stroke-white/35'} strokeWidth={0.7} />
            <path d={b.top} className={b.accent ? 'fill-emerald stroke-success' : 'fill-card stroke-white/60'} strokeWidth={0.8} />
          </g>
        ))}
      </g>
    </svg>
  )
}

export default SiteBuildPoster
