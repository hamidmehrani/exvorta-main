'use client'

import React from 'react'
import { m as motion } from 'framer-motion'
import { easings } from '@/lib/animations'

interface StaggerTextProps {
  /** Plain text or inline markup (e.g. <br/>). Markup tags are preserved verbatim. */
  text: string
  className?: string
  /** Seconds between each word. */
  stagger?: number
  delay?: number
  duration?: number
  /** Rendered element. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/**
 * Splits text into words and animates each with a rise+fade, word by word.
 * HTML fragments such as <br/> or <span> pass through untouched.
 */
export function StaggerText({
  text,
  className = '',
  stagger = 0.04,
  delay = 0,
  duration = 0.6,
  as = 'h1',
}: StaggerTextProps) {
  const Tag = motion[as]
  const tokens: Array<{ type: 'word'; value: string } | { type: 'html'; value: string }> = []
  const htmlRe = /<[^>]+>/g
  let cursor = 0
  let m: RegExpExecArray | null
  while ((m = htmlRe.exec(text)) !== null) {
    if (m.index > cursor) {
      for (const w of text.slice(cursor, m.index).split(/\s+/)) {
        if (w) tokens.push({ type: 'word', value: w })
      }
    }
    tokens.push({ type: 'html', value: m[0] })
    cursor = m.index + m[0].length
  }
  if (cursor < text.length) {
    for (const w of text.slice(cursor).split(/\s+/)) {
      if (w) tokens.push({ type: 'word', value: w })
    }
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }

  const word = {
    hidden: { opacity: 0, y: '0.5em' },
    show: { opacity: 1, y: '0em', transition: { duration, ease: easings.cinematic } },
  }

  return (
    <Tag variants={container} initial="hidden" animate="show" className={className} aria-label={undefined}>
      {tokens.map((token, i) =>
        token.type === 'word' ? (
          <motion.span key={i} variants={word} className="inline-block will-change-transform">
            {token.value}
          </motion.span>
        ) : (
          <span key={i} dangerouslySetInnerHTML={{ __html: token.value }} />
        ),
      )}
    </Tag>
  )
}

export default StaggerText
