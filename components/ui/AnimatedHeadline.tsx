'use client'

import React from 'react'
import { m as motion } from 'framer-motion'
import { easings } from '@/lib/animations'

interface AnimatedHeadlineProps {
  text: string
  as?: React.ElementType
  className?: string
  delay?: number
}

// Lightweight React text splitter for per-char masked reveal
function splitText(text: string, delay = 0) {
  return text.split(' ').map((word, wordIndex) => (
    <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
      {word.split('').map((char, charIndex) => (
        <span
          key={charIndex}
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            style={{ transformOrigin: '50% 100%' }}
            initial={{ y: '110%', opacity: 0, rotateX: -55 }}
            whileInView={{ y: '0%', opacity: 1, rotateX: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: 0.8,
              ease: easings.cinematic,
              delay: delay + (wordIndex * 4 + charIndex) * 0.018,
            }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  ))
}

export function AnimatedHeadline({
  text,
  as: Component = 'h2',
  className = '',
  delay = 0,
}: AnimatedHeadlineProps) {
  return (
    <Component className={`${className} overflow-hidden`} style={{ perspective: '1000px' }}>
      {splitText(text, delay)}
    </Component>
  )
}

export default AnimatedHeadline
