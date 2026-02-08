'use client'

import { useEffect, useState } from 'react'

export function useCountUp(
  end: number,
  isActive: boolean,
  duration: number = 2000,
  prefix: string = '',
  suffix: string = ''
) {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`)

  useEffect(() => {
    if (!isActive) {
      setDisplay(`${prefix}0${suffix}`)
      return
    }

    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(startValue + (end - startValue) * easeOut)
      
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplay(`${prefix}${end.toLocaleString()}${suffix}`)
      }
    }

    requestAnimationFrame(animate)
  }, [end, isActive, duration, prefix, suffix])

  return display
}
