'use client'

import React, { useRef, useEffect, useState } from 'react'
import type {  Page  } from '@/payload-types'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { useInView } from 'framer-motion'

type StatsBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'stats' }>

const AnimatedStat = ({ value, label }: { value: string, label: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayNum, setDisplayNum] = useState(0)
  const [showSuffix, setShowSuffix] = useState(false)

  // Parse the number and suffix
  const match = value.match(/([\d,\.]+)(.*)/)
  const numericStr = match ? match[1].replace(/,/g, '') : '0'
  const suffix = match ? match[2] : ''
  const finalNum = parseFloat(numericStr) || 0
  const isFloat = numericStr.includes('.')

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const duration = 1500 // 1.5s

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)

      // power2.out easing
      const easeOut = 1 - Math.pow(1 - percentage, 2)

      const current = finalNum * easeOut
      setDisplayNum(current)

      if (percentage < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayNum(finalNum)
        setShowSuffix(true)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, finalNum])

  const formatNumber = (num: number) => {
    if (isFloat) return num.toFixed(1)
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="mb-4 flex items-baseline">
        <span className="font-serif text-headline font-semibold tabular-nums text-obsidian">
          {formatNumber(displayNum)}
        </span>
        <span
          className={`ms-1 font-serif text-title font-semibold text-emerald transition-all duration-500 ease-[var(--ease-cinematic)] ${showSuffix ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
        >
          {suffix}
        </span>
      </div>
      <p className="eyebrow">{label}</p>
    </div>
  )
}

export const StatsBlock: React.FC<StatsBlockProps> = ({ stats }) => {
  if (!stats || stats.length === 0) return null
  const columns = stats.length === 3 ? 'md:grid-cols-3' : stats.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'

  return (
    <AnimatedSection className="relative w-full overflow-hidden border-y border-rule bg-surface py-24 md:py-32">
      <div className="container-site">
        <StaggerContainer className={`frame grid grid-cols-1 border border-rule ${columns}`} staggerChildren={0.12} delayChildren={0.1}>
          {stats.map((stat, idx) => (
            <StaggerItem
              key={stat.id || idx}
              className="group relative border-b border-rule bg-surface px-6 py-14 transition-colors duration-300 last:border-b-0 hover:bg-surface-2 md:border-b-0 md:border-e md:last:border-e-0"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-emerald transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
              />
              <AnimatedStat value={stat.value} label={stat.label} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

export default StatsBlock
