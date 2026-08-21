'use client'

import React, { useRef, useState } from 'react'
import { m as motion, HTMLMotionProps } from "framer-motion"
import { useReducedMotion } from '@/lib/animations'

interface MagneticButtonProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ 
  children, 
  className = '', 
  strength = 20,
  ...props 
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return
    
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()
    
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    
    setPosition({ 
      x: (middleX / width) * strength, 
      y: (middleY / height) * strength 
    })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  if (prefersReducedMotion) {
    return <motion.div className={className} {...props}>{children}</motion.div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-block cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
