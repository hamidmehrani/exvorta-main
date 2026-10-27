'use client'

import { useCallback, useEffect, useState } from 'react'
import { canRunWebGL } from './capability'

/**
 * Mount policy shared by every hero-class 3D stage: the SVG poster is the first
 * paint, the canvas is mounted once the browser is idle and only on devices that
 * can take it, and any failure (context lost, WebGL unavailable) drops back to
 * the poster.
 */
export function useStageMount() {
  const [mode, setMode] = useState<'poster' | 'webgl'>('poster')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canRunWebGL()) return
    const start = () => setMode('webgl')
    // Safari has no requestIdleCallback; the lib typings pretend it always exists.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 1800 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(start, 700)
    return () => window.clearTimeout(id)
  }, [])

  const onReady = useCallback(() => setReady(true), [])
  const onFail = useCallback(() => {
    setReady(false)
    setMode('poster')
  }, [])

  return { mode, ready, onReady, onFail }
}
