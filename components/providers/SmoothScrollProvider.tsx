'use client'

import React, { ReactNode, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const ReactLenis = dynamic(() => import('lenis/react').then(mod => mod.ReactLenis), { ssr: false })
import { useReducedMotion } from '@/lib/animations'

interface SmoothScrollProviderProps {
  children: ReactNode
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
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
