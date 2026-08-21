'use client'

import React, { useEffect, useState } from 'react'
import { m as motion, useScroll, useSpring } from "framer-motion"
import { useReducedMotion } from '@/lib/animations'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const prefersReducedMotion = useReducedMotion()
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show on case study detail pages (or pages that are long enough)
    // For this implementation, we check if body height is significantly larger than window height
    const checkHeight = () => {
      if (document.body.scrollHeight > window.innerHeight * 2) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    checkHeight()
    window.addEventListener('resize', checkHeight)
    return () => window.removeEventListener('resize', checkHeight)
  }, [])

  if (prefersReducedMotion || !isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-brand-emerald z-40 origin-left"
      style={{ scaleX }}
    />
  )
}
