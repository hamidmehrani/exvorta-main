import React from 'react'

export interface HairlineProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Hairline({ className = '', ...props }: HairlineProps) {
  return (
    <div className={`hairline ${className}`} {...props} />
  )
}

export default Hairline;
