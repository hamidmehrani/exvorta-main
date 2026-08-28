'use client'

import React from 'react'
import { m as motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import { easings } from '@/lib/animations'

interface StaggerTextProps {
  /** Plain text or inline markup (e.g. <br/>). Markup tags are preserved verbatim. */
  text: string
  className?: string
  /** Seconds between each unit ("chars" or "words"). */
  stagger?: number
  delay?: number
  duration?: number
  /** Rendered element. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  unit?: 'chars' | 'words'
  /** "animate" = on mount (hero), "inView" = when scrolled into view. */
  mode?: 'animate' | 'inView'
  /** Animate each unit with a vertical mask (clip-path) for a polished reveal. */
  fromMarks?: boolean
}

/**
 * Splits text into words/chars and animates each with a rise+fade+blur.
 * HTML fragments such as <br/> or <span> pass through untouched.
 * Words are wrapped so line breaks stay intact; each word holds an
 * overflow-hidden mask when fromMarks is on.
 */
export function StaggerText({
  text,
  className = '',
  stagger = 0.04,
  delay = 0,
  duration = 0.6,
  as = 'h1',
  unit = 'chars',
  mode = 'animate',
  fromMarks = true,
}: StaggerTextProps) {
  const framerReduced = useFramerReducedMotion()
  const Tag = motion[as] as typeof motion.h1

  // Tokenize: words + html tags preserved; words keep adjacent tags attached.
  const words: Array<{ parts: Array<{ type: 'text' | 'html'; value: string }> }> = []
  const htmlRe = /<[^>]+>/g
  let cursor = 0
  let match: RegExpExecArray | null
  const pushWord = () => {
    if (words.length === 0 || words[words.length - 1].parts.length === 0) return
  }
  let current: Array<{ type: 'text' | 'html'; value: string }> = []
  const flushWord = () => {
    if (current.length > 0) {
      words.push({ parts: current })
      current = []
    }
  }
  const flushAll = () => {
    flushWord()
    pushWord()
  }

  while ((match = htmlRe.exec(text)) !== null) {
    const segment = text.slice(cursor, match.index)
    for (const rawWord of segment.split(/(\s+)/)) {
      if (rawWord) {
        if (/^\s+$/.test(rawWord)) {
          flushAll()
        } else {
          current.push({ type: 'text', value: rawWord })
        }
      }
    }
    current.push({ type: 'html', value: match[0] })
    cursor = match.index + match[0].length
  }
  for (const rawWord of text.slice(cursor).split(/(\s+)/)) {
    if (rawWord) {
      if (/^\s+$/.test(rawWord)) {
        flushAll()
      } else {
        current.push({ type: 'text', value: rawWord })
      }
    }
  }
  flushAll()

  // Simplified char splitting per word (only text parts get split into chars).
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: unit === 'chars' ? stagger : stagger, delayChildren: delay } },
  }

  const unitVariants = {
    hidden: fromMarks
      ? { y: '110%', opacity: 0, filter: 'blur(4px)' }
      : { y: '0.6em', opacity: 0, filter: 'blur(6px)' },
    show: {
      y: '0%',
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration, ease: easings.cinematic },
    },
  }

  const aria = React.useMemo(() => text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), [text])

  if (framerReduced) {
    return (
      <Tag className={className} dangerouslySetInnerHTML={{ __html: text }} />
    )
  }

  const renderWord = (word: { parts: Array<{ type: 'text' | 'html'; value: string }> }, wordIndex: number) => {
    const pieces: React.ReactNode[] = []
    let charKey = 0
    word.parts.forEach((part, partIndex) => {
      if (part.type === 'html') {
        pieces.push(<span key={`h-${wordIndex}-${partIndex}`} dangerouslySetInnerHTML={{ __html: part.value }} />)
      } else if (unit === 'chars') {
        for (const ch of part.value) {
          const inner = fromMarks ? (
            <motion.span
              key={`c-${wordIndex}-${charKey}`}
              variants={unitVariants}
              className="inline-block will-change-transform"
            >
              {ch}
            </motion.span>
          ) : (
            <motion.span
              key={`c-${wordIndex}-${charKey}`}
              variants={unitVariants}
              className="inline-block will-change-transform"
            >
              {ch}
            </motion.span>
          )
          pieces.push(
            fromMarks ? (
              <span key={`m-${wordIndex}-${charKey}`} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                {inner}
              </span>
            ) : inner,
          )
          charKey++
        }
      } else {
        pieces.push(
          <motion.span
            key={`w-${wordIndex}-${partIndex}`}
            variants={unitVariants}
            className="inline-block will-change-transform"
          >
            {part.value}
          </motion.span>,
        )
      }
    })
    return (
      <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
        {pieces}
      </span>
    )
  }

  return (
    <Tag
      variants={container}
      initial="hidden"
      {...(mode === 'animate' ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '-80px' } })}
      className={className}
      aria-label={aria}
    >
      {words.map(renderWord)}
    </Tag>
  )
}

export default StaggerText
