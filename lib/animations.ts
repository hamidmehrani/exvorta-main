
import { useEffect, useState } from 'react'

export const easings = {
  cinematic: [0.22, 1, 0.36, 1],
  expoOut: [0.16, 1, 0.3, 1],
  sharp: [0.4, 0, 0.2, 1],
  elastic: [0.68, -0.55, 0.27, 1.55],
}

export type AnimationLevel = 'full' | 'reduced' | 'none'

export const useAnimationLevel = (): AnimationLevel => {
  const [level, setLevel] = useState<AnimationLevel>('reduced') // Default to reduced for SSR

  useEffect(() => {
    const checkLevel = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        setLevel('none')
        return
      }
      
      const isMobileOrTablet = window.innerWidth < 1024
      setLevel(isMobileOrTablet ? 'reduced' : 'full')
    }
    
    checkLevel()
    window.addEventListener('resize', checkLevel)
    return () => window.removeEventListener('resize', checkLevel)
  }, [])

  return level
}

export const useReducedMotion = () => {
  const level = useAnimationLevel()
  return level === 'none'
}

export async function initGSAP(){
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  return { gsap, ScrollTrigger }
}
