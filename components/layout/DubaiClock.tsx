'use client'

import { useEffect, useState } from 'react'

const fmt = () =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())

/**
 * Live Dubai time (GST, UTC+4). Renders a fixed-width placeholder on the server
 * and for the first client paint so there is no hydration mismatch or layout shift.
 */
export default function DubaiClock({ className = '' }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setTime(fmt())
    tick()
    const id = window.setInterval(tick, 20_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <time className={`tabular-nums ${className}`} dateTime={time ?? undefined}>
      {time ?? '--:--'}
    </time>
  )
}
