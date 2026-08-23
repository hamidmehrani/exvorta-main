'use client'

import React, { useRef, useEffect, useState } from 'react'
import type {  Page  } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'
import { m, useInView } from 'framer-motion'

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
    <div ref={ref} className="flex flex-col items-center">
      <div className="flex items-baseline mb-2 overflow-hidden">
        <span className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-text tabular-nums">
          {formatNumber(displayNum)}
        </span>
        <m.span 
          initial={{ opacity: 0, y: 10 }}
          animate={showSuffix ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary ml-1"
        >
          {suffix}
        </m.span>
      </div>
      <div className="text-xs md:text-sm font-mono tracking-widest uppercase text-muted">
        [ {label} ]
      </div>
    </div>
  )
}

export const StatsBlock: React.FC<StatsBlockProps> = ({ stats }) => {
  if (!stats || stats.length === 0) return null

  return (
    <AnimatedSection className="w-full py-24 md:py-32 px-6 bg-surface border-y border-border relative overflow-hidden">
      {/* Background subtle noise */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <m.div 
            key={stat.id || idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="group relative p-8 border border-border/50 bg-bg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Animated hover gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            </div>
            
            <div className="relative z-10">
              <AnimatedStat value={stat.value} label={stat.label} />
            </div>
          </m.div>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default StatsBlock
