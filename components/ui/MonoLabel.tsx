'use client'

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/lib/animations'

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
    gsap.registerPlugin(ScrollTrigger)

    const obj = { value: 0 }
    
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
    
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill()
      })
    }
  }, [originalText, prefersReducedMotion])

  return (
    <Component ref={containerRef} className={`mono-label ${className}`} {...props}>
      {prefersReducedMotion ? children : (text || children)}
    </Component>
  )
}
