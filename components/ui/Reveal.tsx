import React from 'react'

/*
 * Scroll-reveal primitives.
 *
 * These render plain elements carrying data-reveal* hooks; the entrance
 * itself is CSS (globals.css → "Scroll reveal") and the trigger is a tiny
 * inline IntersectionObserver (RevealScript). Nothing here needs hydration,
 * so above-the-fold content paints and animates at first paint instead of
 * staying invisible until React boots, and there is no per-element JS.
 *
 * No 'use client' on purpose: usable from server and client components.
 */

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

type RevealStyle = React.CSSProperties & Record<`--${string}`, string | number | undefined>

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
  duration?: number
  id?: string
}

export function Reveal({ children, delay = 0, className = '', y = 20, duration = 0.7, id }: RevealProps) {
  const style: RevealStyle = {
    '--reveal-y': `${y}px`,
    '--reveal-dur': `${duration}s`,
    '--reveal-delay': `${delay}s`,
  }
  return (
    // data-in is added by the observer after SSR — silence the attribute diff.
    <div id={id} data-reveal="" suppressHydrationWarning className={className} style={style}>
      {children}
    </div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  delayChildren?: number
  staggerChildren?: number
  /** Semantic element, e.g. "ul" — pair with <StaggerItem as="li">. */
  as?: React.ElementType
}

export function StaggerContainer({
  children,
  className = '',
  delayChildren = 0.1,
  staggerChildren = 0.08,
  as: Tag = 'div',
}: StaggerContainerProps) {
  const style: RevealStyle = {
    '--stagger-start': `${delayChildren}s`,
    '--stagger': `${staggerChildren}s`,
  }
  return (
    <Tag data-reveal-stagger="" suppressHydrationWarning className={className} style={style}>
      {children}
    </Tag>
  )
}

export function StaggerItem({
  children,
  className = '',
  y = 16,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  y?: number
  as?: React.ElementType
}) {
  const style: RevealStyle = { '--reveal-y': `${y}px`, '--reveal-dur': '0.6s' }
  return (
    <Tag data-reveal-item="" className={className} style={style}>
      {children}
    </Tag>
  )
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  id,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  id?: string
}) {
  const style: RevealStyle = {
    '--reveal-y': '24px',
    '--reveal-dur': '0.8s',
    '--reveal-delay': `${delay}s`,
  }
  return (
    <section id={id} data-reveal="" suppressHydrationWarning className={className} style={style}>
      {children}
    </section>
  )
}

export { AnimatedButton } from './AnimatedButton'

export default Reveal
