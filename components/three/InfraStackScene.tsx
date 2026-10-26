'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import { EXPLODE_END, SLAB, STACK_MODULES, activeFromProgress, buildLayerArt } from './infra-stack-data'
import type { StackColors } from './stack-colors'

/** DOM nodes the scene drives imperatively every frame (leader lines + labels). */
export interface OverlayRefs {
  lines: Array<SVGLineElement | null>
  dots: Array<SVGCircleElement | null>
  labels: Array<HTMLElement | null>
}

export interface SceneProps {
  colors: StackColors
  /** Scroll progress 0 → 1 across the hero. */
  progress: MotionValue<number>
  pointer: MutableRefObject<{ x: number; y: number }>
  overlay: MutableRefObject<OverlayRefs>
  reduced: boolean
  compact: boolean
  onReady: () => void
  onSlow: () => void
}

const COUNT = STACK_MODULES.length
const GAP_MIN = 0.2
const GAP_MAX = 0.8
const FOV = 32
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(FOV / 2))

const smooth = (x: number) => {
  const t = THREE.MathUtils.clamp(x, 0, 1)
  return t * t * (3 - 2 * t)
}

/* ─── Shaders ─────────────────────────────────────────────────────────────── */

const SLAB_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

// Blueprint-grid slab: deep → base gradient, hairline grid, edge glow and a
// scan line that sweeps the lit module. Ends with colorspace_fragment so the
// token colours land exactly where the DOM renders them.
const SLAB_FRAG = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uAccent;
uniform float uTime;
uniform float uActive;
varying vec2 vUv;
void main() {
  vec3 col = mix(uDeep, uBase, smoothstep(0.0, 1.0, vUv.y));
  vec2 gp = vUv * vec2(32.0, 22.0);
  vec2 g = abs(fract(gp - 0.5) - 0.5) / fwidth(gp);
  float grid = 1.0 - min(min(g.x, g.y), 1.0);
  col += uAccent * grid * (0.03 + 0.07 * uActive);
  float d = abs(vUv.x - fract(uTime * 0.2));
  col += uAccent * smoothstep(0.09, 0.0, d) * 0.28 * uActive;
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  col += uAccent * smoothstep(0.07, 0.0, edge) * (0.08 + 0.4 * uActive);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

const GLOW_VERT = SLAB_VERT
const GLOW_FRAG = /* glsl */ `
uniform vec3 uAccent;
uniform float uAlpha;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float a = pow(clamp(1.0 - r, 0.0, 1.0), 2.2) * uAlpha;
  gl_FragColor = vec4(uAccent, a);
  #include <colorspace_fragment>
}`

/* ─── Deterministic dust (no Math.random → identical every mount) ─────────── */

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function circlePoints(radius: number, n = 96) {
  const pts: number[] = []
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2
    const a1 = ((i + 1) / n) * Math.PI * 2
    pts.push(Math.cos(a0) * radius, 0, Math.sin(a0) * radius, Math.cos(a1) * radius, 0, Math.sin(a1) * radius)
  }
  return new Float32Array(pts)
}

function lineGeometry(positions: Float32Array) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return g
}

/** [x1,z1,x2,z2]… on the slab plane → [x1,0,z1,x2,0,z2]… in 3D. */
function liftSegments(flat: Float32Array) {
  const out = new Float32Array((flat.length / 4) * 6)
  for (let i = 0, o = 0; i < flat.length; i += 4, o += 6) {
    out[o] = flat[i]
    out[o + 2] = flat[i + 1]
    out[o + 3] = flat[i + 2]
    out[o + 5] = flat[i + 3]
  }
  return out
}

/* ─── Scene ───────────────────────────────────────────────────────────────── */

export default function InfraStackScene({ colors, progress, pointer, overlay, reduced, compact, onReady, onSlow }: SceneProps) {
  const { camera, size } = useThree()

  const root = useRef<THREE.Group>(null)
  const layerGroups = useRef<Array<THREE.Group | null>>([])
  const connectors = useRef<Array<THREE.LineSegments | null>>([])
  const beam = useRef<THREE.LineSegments>(null)
  const pulses = useRef<Array<THREE.Mesh | null>>([])
  const floor = useRef<THREE.Group>(null)
  const sweep = useRef<THREE.LineSegments>(null)
  const dust = useRef<THREE.Points>(null)
  const glow = useRef<THREE.Mesh>(null)

  const state = useRef({ p: 0, t: 0, intro: 0, active: new Array(COUNT).fill(0) as number[], labelOn: new Array(COUNT).fill(-1) as number[], frames: 0, acc: 0, slow: 0, ready: false })

  const assets = useMemo(() => {
    const slabGeo = new THREE.BoxGeometry(SLAB.w, SLAB.h, SLAB.d)
    const edgesGeo = new THREE.EdgesGeometry(slabGeo)
    const planeGeo = new THREE.PlaneGeometry(1, 1)

    const layers = STACK_MODULES.map((m, i) => {
      const art = buildLayerArt(i)
      return {
        live: m.live,
        lineGeo: lineGeometry(liftSegments(art.lines)),
        accents: art.accents,
        slabMat: new THREE.ShaderMaterial({
          vertexShader: SLAB_VERT,
          fragmentShader: SLAB_FRAG,
          uniforms: {
            uBase: { value: colors.base },
            uDeep: { value: colors.deep },
            uAccent: { value: m.live ? colors.accent : colors.accentSoft },
            uTime: { value: 0 },
            uActive: { value: 0 },
          },
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        }),
        lineMat: new THREE.LineBasicMaterial({ color: colors.ink.clone(), transparent: true, opacity: 0.4, depthWrite: false }),
        edgeMat: new THREE.LineBasicMaterial({ color: colors.ink.clone(), transparent: true, opacity: 0.55, depthWrite: false }),
        accentMat: new THREE.MeshBasicMaterial({ color: m.live ? colors.accent : colors.accentSoft, transparent: true, opacity: 0.85, depthWrite: false }),
      }
    })

    // Four vertical posts per gap, scaled in Y as the stack explodes.
    const hx = SLAB.w / 2 - 0.06
    const hz = SLAB.d / 2 - 0.06
    const post = new Float32Array([-hx, 0, -hz, -hx, 1, -hz, hx, 0, -hz, hx, 1, -hz, -hx, 0, hz, -hx, 1, hz, hx, 0, hz, hx, 1, hz])
    const connectorGeo = lineGeometry(post)
    const connectorMat = new THREE.LineBasicMaterial({ color: colors.ink.clone(), transparent: true, opacity: 0.22, depthWrite: false })

    const beamGeo = lineGeometry(new Float32Array([0, 0, 0, 0, 1, 0]))
    const beamMat = new THREE.LineBasicMaterial({ color: colors.accent.clone(), transparent: true, opacity: 0.55, depthWrite: false })
    const pulseGeo = new THREE.SphereGeometry(0.02, 12, 12)
    const pulseMat = new THREE.MeshBasicMaterial({ color: colors.accent.clone(), transparent: true, depthWrite: false })

    const glowMat = new THREE.ShaderMaterial({
      vertexShader: GLOW_VERT,
      fragmentShader: GLOW_FRAG,
      uniforms: { uAccent: { value: colors.accent }, uAlpha: { value: 0.0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const ringRadii = [2.3, 3.1, 4.0]
    const ringGeos = ringRadii.map((r) => lineGeometry(circlePoints(r)))
    const ringMat = new THREE.LineBasicMaterial({ color: colors.accentSoft.clone(), transparent: true, opacity: 0.28, depthWrite: false })
    const sweepGeo = lineGeometry(new Float32Array([0, 0, 0, 4.0, 0, 0]))
    const sweepMat = new THREE.LineBasicMaterial({ color: colors.accent.clone(), transparent: true, opacity: 0.5, depthWrite: false })

    const n = compact ? 90 : 180
    const rnd = mulberry32(20_250_825)
    const dustPos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2
      const r = 1.8 + rnd() * 3.4
      dustPos[i * 3] = Math.cos(a) * r
      dustPos[i * 3 + 1] = (rnd() - 0.5) * 7
      dustPos[i * 3 + 2] = Math.sin(a) * r
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dustMat = new THREE.PointsMaterial({ color: colors.ink.clone(), size: 0.028, sizeAttenuation: true, transparent: true, opacity: 0.42, depthWrite: false })

    return { slabGeo, edgesGeo, planeGeo, layers, connectorGeo, connectorMat, beamGeo, beamMat, pulseGeo, pulseMat, glowMat, ringGeos, ringMat, sweepGeo, sweepMat, dustGeo, dustMat }
  }, [colors, compact])

  useEffect(() => {
    return () => {
      assets.slabGeo.dispose()
      assets.edgesGeo.dispose()
      assets.planeGeo.dispose()
      assets.layers.forEach((l) => {
        l.lineGeo.dispose()
        l.slabMat.dispose()
        l.lineMat.dispose()
        l.edgeMat.dispose()
        l.accentMat.dispose()
      })
      assets.connectorGeo.dispose()
      assets.connectorMat.dispose()
      assets.beamGeo.dispose()
      assets.beamMat.dispose()
      assets.pulseGeo.dispose()
      assets.pulseMat.dispose()
      assets.glowMat.dispose()
      assets.ringGeos.forEach((g) => g.dispose())
      assets.ringMat.dispose()
      assets.sweepGeo.dispose()
      assets.sweepMat.dispose()
      assets.dustGeo.dispose()
      assets.dustMat.dispose()
    }
  }, [assets])

  const scratch = useMemo(() => ({ v: new THREE.Vector3(), mixed: new THREE.Color() }), [])

  useFrame((frame, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const st = state.current
    st.t += dt
    st.intro = Math.min(1, st.intro + dt / 2.2)

    // Frame-time watchdog: two consecutive slow windows → ask the parent to drop quality.
    st.frames += 1
    st.acc += dtRaw
    if (st.frames >= 90) {
      st.slow = st.acc / st.frames > 0.034 ? st.slow + 1 : 0
      if (st.slow >= 2) {
        st.slow = -99
        onSlow()
      }
      st.frames = 0
      st.acc = 0
    }

    const target = reduced ? 0.6 : progress.get()
    st.p = reduced ? target : THREE.MathUtils.damp(st.p, target, 3.2, dt)
    const e = smooth(st.p / EXPLODE_END)
    const gap = THREE.MathUtils.lerp(GAP_MIN, GAP_MAX, e)
    const activeIdx = reduced ? -1 : activeFromProgress(st.p)
    const introEase = reduced ? 1 : st.intro

    /* camera: fit the whole stack, then nudge the object clear of the label column */
    const aspect = size.width / size.height
    const heightWorld = 4 * gap + 1.7
    const distV = (heightWorld * 1.3) / (2 * TAN_HALF_FOV)
    const distH = (4.1 * 1.2) / (2 * TAN_HALF_FOV * aspect)
    const dist = Math.max(distV, distH, 9.4)
    camera.position.set(0, dist * 0.3, dist)
    camera.lookAt(0, 0, 0)
    camera.updateMatrixWorld()

    const labelCol = compact ? 78 : 218
    const viewW = 2 * TAN_HALF_FOV * dist * aspect
    const shift = e * (labelCol / 2 / size.width) * viewW

    const g = root.current
    if (!g) return
    g.position.x = -shift
    g.rotation.y = -0.72 + Math.sin(st.t * 0.25) * 0.1 + st.p * 1.15 + (reduced ? 0 : pointer.current.x * 0.3)
    g.rotation.x = reduced ? 0 : pointer.current.y * 0.07

    /* layers */
    for (let i = 0; i < COUNT; i++) {
      const group = layerGroups.current[i]
      const layer = assets.layers[i]
      if (!group) continue

      const order = COUNT - 1 - i // bottom slab lands first
      const tI = THREE.MathUtils.clamp(introEase * 1.55 - order * 0.14, 0, 1)
      const landed = 1 - Math.pow(1 - tI, 3)
      group.visible = tI > 0.001
      group.position.y = (2 - i) * gap + (1 - landed) * 3.2

      const k = THREE.MathUtils.damp(st.active[i], activeIdx === i ? 1 : 0, 6, dt)
      st.active[i] = k
      layer.slabMat.uniforms.uActive.value = k
      layer.slabMat.uniforms.uTime.value = st.t
      const lit = layer.live ? colors.accent : colors.accentSoft
      scratch.mixed.copy(colors.ink).lerp(lit, k)
      layer.lineMat.color.copy(scratch.mixed)
      layer.edgeMat.color.copy(scratch.mixed)
      layer.lineMat.opacity = (layer.live ? 0.62 : 0.4) + 0.38 * k
      layer.edgeMat.opacity = 0.55 + 0.45 * k
    }

    const bottomY = -2 * gap
    const topY = 2 * gap

    for (let i = 0; i < COUNT - 1; i++) {
      const c = connectors.current[i]
      if (!c) continue
      const upper = (2 - i) * gap
      const lower = (2 - (i + 1)) * gap
      c.position.y = lower + SLAB.h / 2
      c.scale.y = Math.max(0.0001, upper - lower - SLAB.h)
      c.visible = introEase > 0.9
    }

    if (beam.current) {
      beam.current.position.y = bottomY - 0.3
      beam.current.scale.y = topY - bottomY + 0.95
      beam.current.visible = introEase > 0.9
    }
    pulses.current.forEach((m, i) => {
      if (!m) return
      const t = (st.t * 0.2 + i / pulses.current.length) % 1
      m.position.y = THREE.MathUtils.lerp(bottomY - 0.2, topY + 0.55, t)
      const s = Math.sin(Math.PI * t)
      m.scale.setScalar(0.5 + s * 0.9)
      m.visible = introEase > 0.9 && !reduced
    })

    if (glow.current) {
      glow.current.position.y = bottomY + SLAB.h / 2 + 0.012
      assets.glowMat.uniforms.uAlpha.value = (0.25 + 0.35 * Math.sin(st.t * 1.6) * 0.5 + 0.35 * st.active[COUNT - 1]) * introEase
    }

    if (floor.current) floor.current.position.y = bottomY - 0.62
    if (sweep.current) sweep.current.rotation.y = -st.t * 0.7
    if (dust.current) dust.current.rotation.y = st.t * 0.015

    /* callouts: project each slab's right edge, run a leader to the label column */
    g.updateMatrixWorld(true)
    const labelX = size.width - labelCol + 8
    const { lines, dots, labels } = overlay.current
    const show = reduced ? 1 : smooth((e - 0.45) / 0.45) * smooth((st.intro - 0.55) / 0.35)
    for (let i = 0; i < COUNT; i++) {
      const group = layerGroups.current[i]
      if (!group) continue
      scratch.v.set(SLAB.w / 2 - 0.12, SLAB.h / 2, 0)
      group.localToWorld(scratch.v)
      scratch.v.project(camera)
      const ax = (scratch.v.x * 0.5 + 0.5) * size.width
      const ay = (-scratch.v.y * 0.5 + 0.5) * size.height
      const x2 = Math.max(ax + 14, labelX - 10)

      const line = lines[i]
      const dot = dots[i]
      const label = labels[i]
      if (line) {
        line.setAttribute('x1', ax.toFixed(1))
        line.setAttribute('y1', ay.toFixed(1))
        line.setAttribute('x2', x2.toFixed(1))
        line.setAttribute('y2', ay.toFixed(1))
        line.style.opacity = String(show * (activeIdx === -1 || activeIdx === i ? 1 : 0.45))
      }
      if (dot) {
        dot.setAttribute('cx', ax.toFixed(1))
        dot.setAttribute('cy', ay.toFixed(1))
        dot.style.opacity = String(show)
      }
      if (label) {
        label.style.transform = `translate3d(${labelX.toFixed(1)}px, ${ay.toFixed(1)}px, 0) translateY(-50%)`
        label.style.opacity = String(show * (activeIdx === -1 || activeIdx === i ? 1 : 0.5))
        const on = activeIdx === i ? 1 : 0
        if (st.labelOn[i] !== on) {
          st.labelOn[i] = on
          label.dataset.active = on ? 'true' : 'false'
        }
      }
    }

    // Reduced motion renders on demand (one still frame), so don't wait for a loop.
    if (!st.ready && st.frames >= (reduced ? 1 : 3)) {
      st.ready = true
      onReady()
    }
  })

  return (
    <group ref={root}>
      {assets.layers.map((layer, i) => (
        <group key={STACK_MODULES[i].key} ref={(el) => { layerGroups.current[i] = el }}>
          <mesh geometry={assets.slabGeo} material={layer.slabMat} />
          <lineSegments geometry={assets.edgesGeo} material={layer.edgeMat} />
          <lineSegments geometry={layer.lineGeo} material={layer.lineMat} position={[0, SLAB.h / 2 + 0.004, 0]} />
          {layer.accents.map(([x, z, w, d], k) => (
            <mesh
              key={k}
              geometry={assets.planeGeo}
              material={layer.accentMat}
              position={[x + w / 2, SLAB.h / 2 + 0.008, z + d / 2]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[w, d, 1]}
            />
          ))}
        </group>
      ))}

      {/* posts between slabs */}
      {Array.from({ length: COUNT - 1 }, (_, i) => (
        <lineSegments key={i} ref={(el) => { connectors.current[i] = el }} geometry={assets.connectorGeo} material={assets.connectorMat} />
      ))}

      {/* axis beam + data pulses */}
      <lineSegments ref={beam} geometry={assets.beamGeo} material={assets.beamMat} />
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} ref={(el) => { pulses.current[i] = el }} geometry={assets.pulseGeo} material={assets.pulseMat} />
      ))}

      {/* suite core glow, sitting on the bottom slab */}
      <mesh ref={glow} geometry={assets.planeGeo} material={assets.glowMat} rotation={[-Math.PI / 2, 0, 0]} scale={[2.6, 2.6, 1]} />

      {/* floor: radar rings + sweep */}
      <group ref={floor}>
        {assets.ringGeos.map((geo, i) => (
          <lineSegments key={i} geometry={geo} material={assets.ringMat} />
        ))}
        <lineSegments ref={sweep} geometry={assets.sweepGeo} material={assets.sweepMat} />
      </group>

      <points ref={dust} geometry={assets.dustGeo} material={assets.dustMat} />
    </group>
  )
}
