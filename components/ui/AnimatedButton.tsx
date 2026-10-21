'use client'

import React from 'react'
import { m } from 'framer-motion'

interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

/** Button/anchor with a restrained press + hover scale. */
export function AnimatedButton({ children, className = '', href, type, disabled }: AnimatedButtonProps) {
  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  }

  if (href) {
    return (
      <m.a href={href} {...motionProps} className={className}>
        {children}
      </m.a>
    )
  }
  return (
    <m.button type={type || 'button'} disabled={disabled} {...motionProps} className={className}>
      {children}
    </m.button>
  )
}

export default AnimatedButton
