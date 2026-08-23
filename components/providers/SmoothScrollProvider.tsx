'use client'

import React, { ReactNode, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ReactLenis = dynamic(() => import('lenis/react').then(mod => mod.ReactLenis), { ssr: false })
import { useReducedMotion } from '@/lib/animations'

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import('gsap').then(m => m.gsap || m.default),
        import('gsap/ScrollTrigger').then(m => m.ScrollTrigger || m.default)
      ]).then(([gsap, ScrollTrigger]) => {
        if (!gsap || !ScrollTrigger) return;
        gsap.registerPlugin(ScrollTrigger)
      })
    }
  }, [])

  if (prefersReducedMotion) {
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
