'use client'

import { motion } from 'framer-motion'
import { useStarTilt } from '@/hooks/useStarTilt'
import { clsx } from 'clsx'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  gold?: boolean
  tilt?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className, gold = false, tilt = false, onClick }: GlassCardProps) {
  const { ref, tilt: tiltValues } = useStarTilt(tilt ? 12 : 0)

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      style={
        tilt
          ? {
              transform: `perspective(1000px) rotateX(${tiltValues.rotateX}deg) rotateY(${tiltValues.rotateY}deg) scale(${tiltValues.scale})`,
              transition: 'transform 0.15s ease-out',
            }
          : {}
      }
      className={clsx(
        'rounded-2xl overflow-hidden relative',
        gold ? 'glass-gold' : 'glass',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Inner glow border */}
      <div
        className={clsx(
          'absolute inset-0 rounded-2xl pointer-events-none',
          gold
            ? 'border border-yellow-400/20'
            : 'border border-white/5'
        )}
      />
      {children}
    </motion.div>
  )
}
