'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { m as motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from '@/lib/animations'

export function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // In Next.js App Router, we can simulate a loading bar on route change
    // by triggering it when pathname changes and hiding it shortly after
    setIsLoading(true)
    
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 500) // Simulate a short loading time

    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  if (prefersReducedMotion) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.4, 
            ease: 'easeInOut' 
          }}
          style={{ transformOrigin: '0% 50%' }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-brand-emerald z-50 pointer-events-none"
        />
      )}
    </AnimatePresence>
  )
}

export default LoadingBar;
