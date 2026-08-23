'use client'

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { m as motion } from "framer-motion"
import { useReducedMotion } from '@/lib/animations'

interface AnimatedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  priority?: boolean
  containerClassName?: string
}

export function AnimatedImage({ 
  src, 
  alt, 
  priority = false, 
  containerClassName = '',
  ...props 
}: AnimatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const handleLoad = () => {
    setIsLoaded(true)
  }

  // Without JS or with reduced motion, just show the image
  if (prefersReducedMotion) {
    return (
      <div className={`relative overflow-hidden ${containerClassName}`}>
        <Image src={src} alt={alt} priority={priority} {...props} />
      </div>
    )
  }
  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {priority ? (
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: isLoaded ? 1 : 1.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          <Image 
            src={src} 
            alt={alt} 
            priority={priority} 
            onLoad={handleLoad}
            {...props} 
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ filter: 'blur(20px)', opacity: 0 }}
          whileInView={{ filter: isLoaded ? 'blur(0px)' : 'blur(20px)', opacity: isLoaded ? 1 : 0 }}
          viewport={{ once: true, margin: "50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full"
        >
          <Image 
            src={src} 
            alt={alt} 
            priority={priority} 
            onLoad={handleLoad}
            {...props} 
          />
        </motion.div>
      )}
    </div>
  )
}

export default AnimatedImage;
