import React from 'react'
import { MonoLabel } from './MonoLabel'
import { CountUp } from './CountUp'

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
  trend?: string
}

export function Stat({ label, value, trend, className = '', ...props }: StatProps) {
  return (
    <div className={`bg-mockup-card border border-hairline-dark p-6 rounded-lg ${className}`} {...props}>
      <MonoLabel className="text-white/40 mb-2">{label}</MonoLabel>
      <div className="text-3xl font-light text-white tabular-nums">
        <CountUp value={value} duration={1.6} />
      </div>
      {trend && (
        <div className="text-[10px] text-white/40 mt-1 flex items-center">
          <span className="w-1.5 h-1.5 bg-mockup-info rounded-full mr-1.5 animate-pulse"></span>
          {trend}
        </div>
      )}
    </div>
  )
}

export default Stat;
