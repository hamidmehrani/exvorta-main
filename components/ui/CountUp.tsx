'use client'

import React, { useEffect, useState, useRef } from 'react'
import { m, useInView, useSpring, useTransform } from 'framer-motion'

interface CountUpProps {
  value: string | number
  duration?: number
  className?: string
}

export function CountUp({ value, duration = 2, className = '' }: CountUpProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  // Parse value: split into prefix, number, suffix
  const stringValue = String(value)
  const numberMatch = stringValue.match(/([\d,\.]+)/)
  const numberValue = numberMatch ? parseFloat(numberMatch[1].replace(/,/g, '')) : 0
  const prefix = numberMatch ? stringValue.substring(0, numberMatch.index) : ''
  const suffix = numberMatch ? stringValue.substring(numberMatch.index! + numberMatch[1].length) : stringValue

  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  })

  useEffect(() => {
    if (inView && !hasStarted) {
      setHasStarted(true)
      springValue.set(numberValue)
    }
  }, [inView, hasStarted, numberValue, springValue])

  const displayValue = useTransform(springValue, (current) => {
    if (numberValue === 0) return stringValue
    return `${prefix}${Math.floor(current).toLocaleString('en-US')}${suffix}`
  })

  return (
    <m.span ref={ref} className={className}>
      {displayValue}
    </m.span>
  )
}


export default CountUp;
