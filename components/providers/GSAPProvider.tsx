'use client'

import React, { useEffect, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface GSAPProviderProps {
  children: ReactNode
}

export default function GSAPProvider({ children }: GSAPProviderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }
  }, [])

  return <>{children}</>
}
