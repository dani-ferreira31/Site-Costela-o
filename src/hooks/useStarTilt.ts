'use client'

import { useEffect, useRef, useState } from 'react'

interface TiltValues {
  rotateX: number
  rotateY: number
  scale: number
}

export function useStarTilt(intensity = 15) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<TiltValues>({ rotateX: 0, rotateY: 0, scale: 1 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)

      setTilt({
        rotateX: -dy * intensity,
        rotateY: dx * intensity,
        scale: 1.03,
      })
    }

    const handleMouseLeave = () => {
      setTilt({ rotateX: 0, rotateY: 0, scale: 1 })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [intensity])

  return { ref, tilt }
}
