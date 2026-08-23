'use client'

import React from 'react'
import { AnimatePresence, m as motion } from 'framer-motion'
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

  // Always render the SAME component tree structure — prevents "Rendered more hooks
  // than during the previous render" in Next.js App Router caused by React reconciling
  // different component structures between SSR and CSR renders.
  // Pre-mount: children rendered immediately visible (no animation flash).
  // Post-mount + reduced motion: same static wrapper.
  // Post-mount + full motion: AnimatePresence with key-based page transition.
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={mounted && !prefersReducedMotion ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={mounted && !prefersReducedMotion ? { opacity: 0, y: -12 } : undefined}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.05,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
