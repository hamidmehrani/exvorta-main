import React from 'react'
import Link from 'next/link'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'mono'
  href?: string
  target?: string
  rel?: string
}

export function Button({ variant = 'primary', href, className = '', children, ...props }: ButtonProps) {
  const baseClasses = variant === 'primary' 
    ? 'btn-primary'
    : variant === 'ghost' 
      ? 'btn-ghost' 
      : 'btn-mono'
      
  const combinedClasses = `${baseClasses} ${className}`

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  )
}
