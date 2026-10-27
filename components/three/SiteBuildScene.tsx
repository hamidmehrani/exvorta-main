'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import type { StageContext } from './StageCanvas'
import { EDGE_NODES, EDGE_RADIUS, FLOOR_Y, PAGE, SITE_BLOCKS, stageFromProgress } from './site-build-data'

interface SiteBuildSceneProps extends StageContext {
  /** Scroll progress 0 → 1 across the steps list. */
  progress: MotionValue<number>
  /** CMS step count (the scene stages are fixed; this only places each step on the stage axis). */
  steps: number
}

const FOV = 32
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
const ARC_POINTS = 40
/** Reduced motion: a still frame partway through the deploy. */
const STATIC_STAGE = 2.7

const smooth = (x: number) => {
  const t = THREE.MathUtils.clamp(x, 0, 1)
  return t * t * (3 - 2 * t)
}

/* ─── Shaders ─────────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vN;
void main() {
  vUv = uv;
  vN = mat3(modelMatrix) * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

// Blueprint paper → solid slab: uFill 0 draws only a two-level grid, 1 is the dark slab.
const PLATE_FRAG = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uLine;
uniform float uFill;
uniform float uAlpha;
varying vec2 vUv;
void main() {
  vec2 gp = vUv * vec2(32.0, 24.0);
  vec2 g = abs(fract(gp - 0.5) - 0.5) / fwidth(gp);
  float minor = 1.0 - min(min(g.x, g.y), 1.0);
  vec2 gp2 = vUv * vec2(8.0, 6.0);
  vec2 g2 = abs(fract(gp2 - 0.5) - 0.5) / fwidth(gp2);
  float major = 1.0 - min(min(g2.x, g2.y), 1.0);
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float border = smoothstep(0.012, 0.0, edge);
  float paper = clamp(minor * 0.3 + major * 0.55 + border, 0.0, 1.0);
  vec3 solid = mix(uDeep, uBase, smoothstep(0.0, 1.0, vUv.y)) + uLine * (minor * 0.04 + major * 0.06);
  vec3 col = mix(uLine, solid, uFill);
  float a = mix(paper, 1.0, uFill) * uAlpha;
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`

// Lit box: top face bright, flanks darker. Normals are axis-aligned, so the
// scaled model matrix is fine for direction.
const BLOCK_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uGlow;
uniform float uAlpha;
uniform float uLit;
varying vec3 vN;
void main() {
  float l = clamp(dot(normalize(vN), normalize(vec3(0.35, 1.0, 0.55))), 0.0, 1.0);
  float shade = 0.5 + 0.5 * l;
  vec3 col = uColor * shade + uGlow * (0.035 + uLit * 0.16) * shade;
  gl_FragColor = vec4(col, uAlpha);
  #include <colorspace_fragment>
}`

/* ─── Geometry helpers ────────────────────────────────────────────────────── */

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

function segGeometry(positions: number[] | Float32Array) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions instanceof Float32Array ? positions : new Float32Array(positions), 3))
  return g
}

function circleSegments(radius: number, n = 64, y = 0) {
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2
    const a1 = ((i + 1) / n) * Math.PI * 2
    out.push(Math.cos(a0) * radius, y, Math.sin(a0) * radius, Math.cos(a1) * radius, y, Math.sin(a1) * radius)
  }
  return out
}

/** Survey marks drawn on the blueprint: dimension lines with ticks, corner brackets, a centre cross-hair. */
function surveySegments() {
  const hw = PAGE.w / 2
  const hd = PAGE.d / 2
  const s: number[] = []
  const seg = (x1: number, z1: number, x2: number, z2: number) => s.push(x1, 0, z1, x2, 0, z2)

  // front dimension line + ticks
  const zf = hd + 0.22
  seg(-hw, zf, hw, zf)
  for (let i = 0; i <= 8; i++) {
    const x = -hw + (i / 8) * PAGE.w
    seg(x, zf - (i % 4 === 0 ? 0.09 : 0.04), x, zf + (i % 4 === 0 ? 0.09 : 0.04))
  }
  seg(-hw, hd, -hw, zf + 0.09)
  seg(hw, hd, hw, zf + 0.09)
  // right dimension line + ticks
  const xr = hw + 0.22
  seg(xr, -hd, xr, hd)
  for (let i = 0; i <= 6; i++) {
    const z = -hd + (i / 6) * PAGE.d
    seg(xr - (i % 3 === 0 ? 0.09 : 0.04), z, xr + (i % 3 === 0 ? 0.09 : 0.04), z)
  }
  seg(hw, -hd, xr + 0.09, -hd)
  seg(hw, hd, xr + 0.09, hd)
  // corner brackets
  const b = 0.2
  for (const [cx, cz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
    const x = cx * (hw + 0.1)
    const z = cz * (hd + 0.1)
    seg(x, z, x - cx * b, z)
    seg(x, z, x, z - cz * b)
  }
  // centre cross-hair
  seg(-0.28, 0, 0.28, 0)
  seg(0, -0.28, 0, 0.28)
  s.push(...circleSegments(0.14, 24))
  return s
}

/** Quadratic arc from the deployed site, over the floor, down to an edge node. */
function arcPoints(index: number) {
  const a = (index / EDGE_NODES) * Math.PI * 2 + Math.PI / EDGE_NODES
  const nx = Math.cos(a) * EDGE_RADIUS
  const nz = Math.sin(a) * EDGE_RADIUS
  const p0 = new THREE.Vector3(0, 0.62, 0)
  const p1 = new THREE.Vector3(nx * 0.5, 2.15, nz * 0.5)
  const p2 = new THREE.Vector3(nx, FLOOR_Y, nz)
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < ARC_POINTS; i++) {
    const t = i / (ARC_POINTS - 1)
    const u = 1 - t
    pts.push(new THREE.Vector3(u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y, u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z))
  }
  return { pts, node: p2 }
}

/* ─── Scene ───────────────────────────────────────────────────────────────── */

export default function SiteBuildScene({ colors, progress, steps, pointer, reduced, compact, onReady, onSlow }: SiteBuildSceneProps) {
  const { camera, size } = useThree()

  const root = useRef<THREE.Group>(null)
  const site = useRef<THREE.Group>(null)
  const blockGroups = useRef<Array<THREE.Group | null>>([])
  const nodeDots = useRef<Array<THREE.Mesh | null>>([])
  const pulses = useRef<Array<THREE.Mesh | null>>([])
  const dust = useRef<THREE.Points>(null)

  const state = useRef({ s: 0, t: 0, intro: 0, frames: 0, acc: 0, slow: 0, ready: false })

  const assets = useMemo(() => {
    const unitBox = new THREE.BoxGeometry(1, 1, 1)
    const unitEdges = new THREE.EdgesGeometry(unitBox)
    const plateGeo = new THREE.BoxGeometry(PAGE.w, PAGE.h, PAGE.d)
    const plateEdges = new THREE.EdgesGeometry(plateGeo)

    const plateMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: PLATE_FRAG,
      uniforms: {
        uBase: { value: colors.base },
        uDeep: { value: colors.deep },
        uLine: { value: colors.accentSoft },
        uFill: { value: 0 },
        uAlpha: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    })
    // Lerp in linear space is aggressive: a few percent of white already reads as mid-grey.
    const plain = colors.base.clone().lerp(colors.ink, 0.03)
    const blockMat = (color: THREE.Color) =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: BLOCK_FRAG,
        uniforms: { uColor: { value: color }, uGlow: { value: colors.accent }, uAlpha: { value: 0 }, uLit: { value: 0 } },
        transparent: true,
      })
    const plainMat = blockMat(plain)
    const accentMat = blockMat(colors.accentSoft.clone())

    const edgeMat = new THREE.LineBasicMaterial({ color: colors.ink.clone(), transparent: true, opacity: 0, depthWrite: false })
    const plateEdgeMat = new THREE.LineBasicMaterial({ color: colors.ink.clone(), transparent: true, opacity: 0, depthWrite: false })
    const surveyGeo = segGeometry(surveySegments())
    const surveyMat = new THREE.LineBasicMaterial({ color: colors.ink.clone(), transparent: true, opacity: 0, depthWrite: false })

    const arcs = Array.from({ length: EDGE_NODES }, (_, i) => {
      const { pts, node } = arcPoints(i)
      const flat: number[] = []
      for (let k = 0; k < pts.length - 1; k++) flat.push(pts[k].x, pts[k].y, pts[k].z, pts[k + 1].x, pts[k + 1].y, pts[k + 1].z)
      return { geo: segGeometry(flat), pts, node }
    })
    const arcMat = new THREE.LineBasicMaterial({ color: colors.accent.clone(), transparent: true, opacity: 0.75, depthWrite: false })

    const nodeRingGeo = segGeometry(circleSegments(0.16, 32))
    const nodeRingMat = new THREE.LineBasicMaterial({ color: colors.accent.clone(), transparent: true, opacity: 0, depthWrite: false })
    const dotGeo = new THREE.SphereGeometry(0.05, 12, 12)
    const dotMat = new THREE.MeshBasicMaterial({ color: colors.accent.clone(), transparent: true, opacity: 0, depthWrite: false })
    const pulseGeo = new THREE.SphereGeometry(0.03, 10, 10)
    const pulseMat = new THREE.MeshBasicMaterial({ color: colors.ink.clone(), transparent: true, opacity: 0.95, depthWrite: false })

    const floorGeos = [1.2, 2.0, EDGE_RADIUS, 3.3].map((r) => segGeometry(circleSegments(r, 96, FLOOR_Y)))
    const floorMat = new THREE.LineBasicMaterial({ color: colors.accentSoft.clone(), transparent: true, opacity: 0.26, depthWrite: false })

    const n = compact ? 80 : 160
    const rnd = mulberry32(20_251_027)
    const dustPos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2
      const r = 1.6 + rnd() * 3.2
      dustPos[i * 3] = Math.cos(a) * r
      dustPos[i * 3 + 1] = (rnd() - 0.4) * 5
      dustPos[i * 3 + 2] = Math.sin(a) * r
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dustMat = new THREE.PointsMaterial({ color: colors.ink.clone(), size: 0.026, sizeAttenuation: true, transparent: true, opacity: 0.4, depthWrite: false })

    return {
      unitBox, unitEdges, plateGeo, plateEdges, plateMat, plainMat, accentMat, edgeMat, plateEdgeMat, surveyGeo, surveyMat,
      arcs, arcMat, nodeRingGeo, nodeRingMat, dotGeo, dotMat, pulseGeo, pulseMat, floorGeos, floorMat, dustGeo, dustMat,
    }
  }, [colors, compact])

  useEffect(() => {
    return () => {
      const a = assets
      ;[a.unitBox, a.unitEdges, a.plateGeo, a.plateEdges, a.surveyGeo, a.nodeRingGeo, a.dotGeo, a.pulseGeo, a.dustGeo, ...a.floorGeos, ...a.arcs.map((x) => x.geo)].forEach((g) => g.dispose())
      ;[a.plateMat, a.plainMat, a.accentMat, a.edgeMat, a.plateEdgeMat, a.surveyMat, a.arcMat, a.nodeRingMat, a.dotMat, a.pulseMat, a.floorMat, a.dustMat].forEach((m) => m.dispose())
    }
  }, [assets])

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const st = state.current
    st.t += dt
    st.intro = Math.min(1, st.intro + dt / 1.6)

    // Long gaps (tab hidden, scrolled away, shader compile) are not a performance signal.
    if (dtRaw > 0.25) {
      st.frames = 0
      st.acc = 0
    } else {
      st.frames += 1
      st.acc += dtRaw
    }
    if (st.frames >= 90) {
      st.slow = st.acc / st.frames > 0.034 ? st.slow + 1 : 0
      if (st.slow >= 2) {
        st.slow = -99
        onSlow()
      }
      st.frames = 0
      st.acc = 0
    }

    const target = reduced ? STATIC_STAGE : stageFromProgress(progress.get(), steps)
    st.s = reduced ? target : THREE.MathUtils.damp(st.s, target, 3.0, dt)
    const s = st.s
    const intro = reduced ? 1 : smooth(st.intro)

    const plateFill = smooth(s - 0.2)
    const fill = smooth(s - 0.45)
    const survey = 1 - smooth((s - 0.15) / 0.8)
    const deploy = smooth((s - 2.0) / 1.0)
    const lit = smooth(s - 2.2)

    /* camera: high and flat on the blueprint, lower to read the extrusion, wide for the deploy */
    const aspect = size.width / size.height
    const elev = THREE.MathUtils.lerp(0.62, 0.3, smooth(s / 2.2))
    const needW = THREE.MathUtils.lerp(3.8, 6.4, deploy)
    const needH = THREE.MathUtils.lerp(2.5, 4.1, deploy)
    const dist = Math.max((needW * 1.12) / (2 * TAN_HALF_FOV * aspect), (needH * 1.15) / (2 * TAN_HALF_FOV), 8)
    camera.position.set(0, dist * Math.sin(elev), dist * Math.cos(elev))
    camera.lookAt(0, THREE.MathUtils.lerp(-0.05, 0.25, deploy), 0)
    camera.updateMatrixWorld()

    const g = root.current
    if (!g) return
    g.rotation.y = -0.55 + s * 0.3 + (1 - intro) * 0.9 + Math.sin(st.t * 0.22) * 0.07 + (reduced ? 0 : pointer.current.x * 0.22)
    g.rotation.x = reduced ? 0 : pointer.current.y * 0.05
    if (site.current) site.current.position.y = deploy * 0.32

    /* plate + survey */
    assets.plateMat.uniforms.uFill.value = plateFill
    assets.plateMat.uniforms.uAlpha.value = intro
    assets.plateEdgeMat.opacity = (0.3 + 0.45 * plateFill) * intro
    assets.surveyMat.opacity = 0.7 * survey * intro

    /* blocks: flat outline → filled → extruded */
    assets.plainMat.uniforms.uAlpha.value = fill * intro
    assets.accentMat.uniforms.uAlpha.value = fill * intro
    assets.plainMat.uniforms.uLit.value = lit
    assets.accentMat.uniforms.uLit.value = lit
    assets.edgeMat.opacity = (0.34 + 0.46 * fill) * intro
    SITE_BLOCKS.forEach((b, i) => {
      const grp = blockGroups.current[i]
      if (!grp) return
      const ext = smooth((s - 1.1 - i * 0.07) / 0.9)
      const h = THREE.MathUtils.lerp(0.004, b.height, ext)
      grp.scale.set(b.w, h, b.d)
      grp.position.set(b.x + b.w / 2, PAGE.h / 2 + h / 2, b.z + b.d / 2)
    })
    // The edge lines warm towards the accent as the site goes live.
    assets.edgeMat.color.copy(colors.ink).lerp(colors.accent, lit * 0.85)
    assets.plateEdgeMat.color.copy(colors.ink).lerp(colors.accent, lit * 0.6)

    /* deploy: arcs draw outward, nodes light, pulses travel */
    const drawT = THREE.MathUtils.clamp(deploy * 1.25, 0, 1)
    assets.arcs.forEach((arc, i) => {
      const count = Math.floor(drawT * (ARC_POINTS - 1)) * 2
      arc.geo.setDrawRange(0, count)
      const dot = nodeDots.current[i]
      if (dot) dot.visible = drawT > 0.92
      const pulse = pulses.current[i]
      if (pulse) {
        const t = (st.t * 0.32 + i / EDGE_NODES) % 1
        const p = arc.pts[Math.min(ARC_POINTS - 1, Math.floor(t * (ARC_POINTS - 1)))]
        pulse.position.copy(p)
        pulse.visible = !reduced && deploy > 0.6
      }
    })
    assets.arcMat.opacity = 0.75 * intro
    assets.nodeRingMat.opacity = smooth((drawT - 0.8) / 0.2) * 0.9
    assets.dotMat.opacity = smooth((drawT - 0.8) / 0.2)
    assets.floorMat.opacity = (0.16 + 0.2 * deploy) * intro

    if (dust.current) dust.current.rotation.y = st.t * 0.015

    if (!st.ready && st.frames >= (reduced ? 1 : 3)) {
      st.ready = true
      onReady()
    }
  })

  return (
    <group ref={root}>
      <group ref={site}>
        <mesh geometry={assets.plateGeo} material={assets.plateMat} renderOrder={0} />
        <lineSegments geometry={assets.plateEdges} material={assets.plateEdgeMat} renderOrder={3} />
        <lineSegments geometry={assets.surveyGeo} material={assets.surveyMat} position={[0, PAGE.h / 2 + 0.004, 0]} renderOrder={3} />
        {SITE_BLOCKS.map((b, i) => (
          <group key={i} ref={(el) => { blockGroups.current[i] = el }} position={[b.x + b.w / 2, PAGE.h / 2, b.z + b.d / 2]} scale={[b.w, 0.004, b.d]}>
            <mesh geometry={assets.unitBox} material={b.accent ? assets.accentMat : assets.plainMat} renderOrder={1} />
            <lineSegments geometry={assets.unitEdges} material={assets.edgeMat} renderOrder={3} />
          </group>
        ))}
      </group>

      {assets.arcs.map((arc, i) => (
        <group key={i}>
          <lineSegments geometry={arc.geo} material={assets.arcMat} />
          <group position={arc.node}>
            <lineSegments geometry={assets.nodeRingGeo} material={assets.nodeRingMat} />
            <mesh ref={(el) => { nodeDots.current[i] = el }} geometry={assets.dotGeo} material={assets.dotMat} visible={false} />
          </group>
          <mesh ref={(el) => { pulses.current[i] = el }} geometry={assets.pulseGeo} material={assets.pulseMat} visible={false} />
        </group>
      ))}

      {assets.floorGeos.map((geo, i) => (
        <lineSegments key={i} geometry={geo} material={assets.floorMat} />
      ))}

      <points ref={dust} geometry={assets.dustGeo} material={assets.dustMat} />
    </group>
  )
}
