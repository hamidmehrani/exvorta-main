'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useReducedMotion } from '@/lib/animations'

const ReactLenis = dynamic(() => import('lenis/react').then(mod => mod.ReactLenis), { ssr: false })

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      Promise.all([
        import('gsap').then(m => m.gsap || m.default),
        import('gsap/ScrollTrigger').then(m => m.ScrollTrigger || m.default)
      ]).then(([gsap, ScrollTrigger]) => {
        if (!gsap || !ScrollTrigger) return;
        gsap.registerPlugin(ScrollTrigger)
      }).catch(e => console.warn('GSAP load failed', e))
    }
  }, [])

  if (!mounted || prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}

export default SmoothScrollProvider
