'use client'

import React, { useEffect, ReactNode } from 'react'
import type { gsap as GSAPType } from 'gsap'

interface GSAPProviderProps {
  children: ReactNode
}

export function GSAPProvider({ children }: GSAPProviderProps) {
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

  return <>{children}</>
}

export default GSAPProvider
