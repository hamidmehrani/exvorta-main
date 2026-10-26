import { SLAB, STACK_MODULES } from './infra-stack-data'

/**
 * Static isometric render of the stack. It is the server-rendered stand-in for
 * the WebGL scene: it paints with the first frame (no JS), is what visitors on
 * weak devices / without WebGL / with data-saver see, and is what the canvas
 * cross-fades from once it has drawn.
 */

const COS = Math.cos(Math.PI / 6)
const SIN = Math.sin(Math.PI / 6)
const SCALE = 46
const GAP = 1.12

type P = [number, number]

function iso(x: number, y: number, z: number): P {
  return [(x - z) * COS * SCALE, (x + z) * SIN * SCALE - y * SCALE]
}

const path = (pts: P[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`

function slabPaths(yTop: number) {
  const hw = SLAB.w / 2
  const hd = SLAB.d / 2
  const yBottom = yTop - SLAB.h * 1.6
  const top = [iso(-hw, yTop, -hd), iso(hw, yTop, -hd), iso(hw, yTop, hd), iso(-hw, yTop, hd)]
  const left = [iso(-hw, yTop, hd), iso(hw, yTop, hd), iso(hw, yBottom, hd), iso(-hw, yBottom, hd)]
  const right = [iso(hw, yTop, -hd), iso(hw, yTop, hd), iso(hw, yBottom, hd), iso(hw, yBottom, -hd)]
  // Inner "plate" outline + a cross-hair, so each slab reads as a different module.
  const inset = 0.16
  const plate = [iso(-hw + inset, yTop, -hd + inset), iso(hw - inset, yTop, -hd + inset), iso(hw - inset, yTop, hd - inset), iso(-hw + inset, yTop, hd - inset)]
  return { top: path(top), left: path(left), right: path(right), plate: path(plate) }
}

export function InfraPoster({ className = '' }: { className?: string }) {
  const slabs = STACK_MODULES.map((m, i) => ({ m, ...slabPaths((2 - i) * GAP) }))
  return (
    <svg viewBox="-200 -190 400 380" className={className} role="img" aria-label="Exploded view of the five Exvorta modules, stacked as layers">
      {slabs.map(({ m, top, left, right, plate }) => (
        <g key={m.key} strokeLinejoin="round">
          <path d={left} className="fill-sidebar stroke-white/25" strokeWidth={0.8} />
          <path d={right} className="fill-dashboard stroke-white/25" strokeWidth={0.8} />
          <path d={top} className="fill-card stroke-white/45" strokeWidth={0.9} />
          <path d={plate} className={m.live ? 'fill-none stroke-success/80' : 'fill-none stroke-white/20'} strokeWidth={0.7} />
        </g>
      ))}
    </svg>
  )
}

export default InfraPoster
