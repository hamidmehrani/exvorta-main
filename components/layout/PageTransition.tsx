'use client'

import React, { useRef } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * Route-change fade for the page content only (header/footer stay put).
 *
 * Pure CSS: keying on the pathname remounts the wrapper, which replays the
 * `.page-enter` keyframes. The first render never animates, so the initial
 * load paints immediately. (The previous AnimatePresence `mode="wait"`
 * version delayed every navigation by ~0.8s and, in the App Router, could not
 * keep the outgoing page around anyway — it faded the *new* page out and in.)
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const first = useRef(pathname)
  const navigated = first.current !== pathname

  return (
    <div key={pathname} className={navigated ? 'page-enter flex flex-1 flex-col' : 'flex flex-1 flex-col'}>
      {children}
    </div>
  )
}

export default PageTransition
