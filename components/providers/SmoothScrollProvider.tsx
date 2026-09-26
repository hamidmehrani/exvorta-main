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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isTouchOrSmall = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    setIsMobile(isTouchOrSmall)
  }, [])

  if (!mounted || prefersReducedMotion || isMobile) {
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
