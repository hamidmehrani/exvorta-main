'use client'

import React from 'react'
import Link from 'next/link'
import { m } from 'framer-motion'
import { useReducedMotion } from '@/lib/animations'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'mono'
  href?: string
  target?: string
  rel?: string
}

export function Button({ variant = 'primary', href, className = '', children, ...props }: ButtonProps) {
  const prefersReduced = useReducedMotion()
  const baseClasses = variant === 'primary'
    ? 'btn-primary'
    : variant === 'ghost'
      ? 'btn-ghost'
      : 'btn-mono'

  const combinedClasses = `${baseClasses} ${className}`

  if (href) {
    return (
      <m.div
        whileHover={prefersReduced ? undefined : { y: -2 }}
        whileTap={prefersReduced ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        <Link href={href} className={combinedClasses} target={props.target} rel={props.rel}>
          {children}
        </Link>
      </m.div>
    )
  }

  return (
    <m.button
      whileHover={prefersReduced ? undefined : { y: -2 }}
      whileTap={prefersReduced ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={combinedClasses}
      {...(props as any)}
    >
      {children}
    </m.button>
  )
}

export default Button
