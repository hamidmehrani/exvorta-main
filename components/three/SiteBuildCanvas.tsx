'use client'

import type { MotionValue } from 'framer-motion'
import StageCanvas from './StageCanvas'
import SiteBuildScene from './SiteBuildScene'

interface SiteBuildCanvasProps {
  progress: MotionValue<number>
  steps: number
  reduced: boolean
  onReady: () => void
  onFail: () => void
}

/** Process stage: one website, built in front of you as the steps scroll past. */
export default function SiteBuildCanvas({ progress, steps, reduced, onReady, onFail }: SiteBuildCanvasProps) {
  return (
    <StageCanvas reduced={reduced} onReady={onReady} onFail={onFail} camera={{ fov: 32, position: [0, 5, 9] }}>
      {(ctx) => <SiteBuildScene {...ctx} progress={progress} steps={steps} />}
    </StageCanvas>
  )
}
