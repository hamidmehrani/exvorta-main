'use client'

import React from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { easings } from '@/lib/animations'

export const EASE_OUT = easings.cinematic
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
  duration?: number
}

export function Reveal({ children, delay = 0, className = '', y = 20, duration = 0.7 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <m.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: EASE_OUT }}
      className={className}
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {children}
    </m.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  delayChildren?: number
  staggerChildren?: number
}

export function StaggerContainer({ 
  children, 
  className = '', 
  delayChildren = 0.1, 
  staggerChildren = 0.08 
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerChildren,
        delayChildren,
      },
    },
  }

  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({ children, className = '', y = 16 }: { children: React.ReactNode, className?: string, y?: number }) {
  const shouldReduceMotion = useReducedMotion()
  
  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(4px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: EASE_OUT }
    },
  }

  return (
    <m.div variants={itemVariants} className={className} style={{ willChange: 'opacity, transform, filter' }}>
      {children}
    </m.div>
  )
}

export function AnimatedSection({ children, className = '', delay = 0, id }: { children: React.ReactNode, className?: string, delay?: number, id?: string }) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <m.section
      id={id}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
      className={className}
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {children}
    </m.section>
  )
}

export function AnimatedButton({ children, className = '', href, type, disabled }: { children: React.ReactNode; className?: string; href?: string; type?: 'button' | 'submit' | 'reset'; disabled?: boolean }) {
  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  }

  if (href) {
    return (
      <m.a
        href={href}
        {...motionProps}
        className={className}
      >
        {children}
      </m.a>
    )
  }
  return (
    <m.button
      type={type || 'button'}
      disabled={disabled}
      {...motionProps}
      className={className}
    >
      {children}
    </m.button>
  )
}


export default Reveal;
