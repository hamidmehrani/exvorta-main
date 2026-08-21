import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  as?: React.ElementType
}

export function Container({ children, as: Component = 'div', className = '', ...props }: ContainerProps) {
  return (
    <Component className={`container-site ${className}`} {...props}>
      {children}
    </Component>
  )
}
