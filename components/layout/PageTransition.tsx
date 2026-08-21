'use client'

import React from 'react'
import { m as motion, AnimatePresence } from "framer-motion"
import { usePathname } from 'next/navigation'
import { useReducedMotion } from '@/lib/animations'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || prefersReducedMotion) {
    return <div>{children}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1], // Cinematic ease
          delay: 0.1 // 100ms delay for enter as requested
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
