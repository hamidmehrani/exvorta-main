'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export const EASE_OUT: [number, number, number, number] = [0.25, 1, 0.5, 1]
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
  duration?: number
}

export function Reveal({ children, delay = 0, className = '', y = 16, duration = 0.5 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', y = 16 }: { children: React.ReactNode, className?: string, y?: number }) {
  const shouldReduceMotion = useReducedMotion()
  
  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: EASE_OUT } 
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
