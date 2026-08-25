'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/animations'

interface GsapContext {
  revert: () => void
}

export interface MonoLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  as?: React.ElementType
}

const CHARS = '░▒▓█▄▀+*&^%$#@!'

export function MonoLabel({ children, as: Component = 'div', className = '', ...props }: MonoLabelProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [text, setText] = useState<string>('')
  const prefersReducedMotion = useReducedMotion()
  const originalText = typeof children === 'string' ? children : ''

  useEffect(() => {
    setText(originalText)
    if (prefersReducedMotion || !containerRef.current || !originalText) return
    let ctx: GsapContext | undefined
    Promise.all([
      import('gsap').then(m => m.gsap || m.default),
      import('gsap/ScrollTrigger').then(m => m.ScrollTrigger || m.default)
    ]).then(([gsap, ScrollTrigger]) => {
      if (!gsap || !ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger)

      const obj = { value: 0 }
      
      ctx = gsap.context(() => {
        gsap.to(obj, {
          value: originalText.length,
          duration: 0.4,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          },
          onUpdate: () => {
            const progress = Math.floor(obj.value)
            const scrambled = originalText.split('').map((char, index) => {
              if (index < progress) return char
              if (char === ' ') return ' '
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            }).join('')
            setText(scrambled)
          },
          onComplete: () => setText(originalText)
        })
      })
    })
    
    return () => {
      ctx?.revert()
    }
  }, [originalText, prefersReducedMotion])

  return (
    <Component ref={containerRef} className={`mono-label ${className}`} {...props}>
      {prefersReducedMotion ? children : (text || children)}
    </Component>
  )
}

export default MonoLabel;
