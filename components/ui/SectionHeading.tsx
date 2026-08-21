import React from 'react'
import { MonoLabel } from './MonoLabel'

export interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'title'> {
  title: React.ReactNode
  eyebrow?: React.ReactNode
  as?: React.ElementType
}

export function SectionHeading({ title, eyebrow, as: Component = 'h2', className = '', ...props }: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${className}`} {...props}>
      {eyebrow && <MonoLabel className="text-brand-obsidian/40 mb-4">{eyebrow}</MonoLabel>}
      <Component className="text-3xl md:text-4xl font-serif text-brand-obsidian">
        {title}
      </Component>
    </div>
  )
}
