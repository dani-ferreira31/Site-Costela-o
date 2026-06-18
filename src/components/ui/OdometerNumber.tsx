'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface OdometerNumberProps {
  value: number
  digits?: number
  label: string
}

export function OdometerNumber({ value, digits = 3, label }: OdometerNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [animating, setAnimating] = useState(false)
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current !== value) {
      setAnimating(true)
      setDisplayValue(value)
      prevValue.current = value
      const t = setTimeout(() => setAnimating(false), 600)
      return () => clearTimeout(t)
    }
  }, [value])

  const padded = String(displayValue).padStart(digits, '0')

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Number display */}
      <div className="relative flex gap-1">
        {padded.split('').map((digit, i) => (
          <div
            key={i}
            className="relative w-16 h-20 md:w-20 md:h-24 overflow-hidden rounded-lg glass-gold flex items-center justify-center"
            style={{
              boxShadow: animating
                ? '0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.25)'
                : '0 0 8px rgba(212,175,55,0.15)',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={digit}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="font-accent text-3xl md:text-4xl font-bold gradient-text absolute"
              >
                {digit}
              </motion.span>
            </AnimatePresence>

            {/* Particle burst on update */}
            {animating && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Label */}
      <span className="font-accent text-xs tracking-widest uppercase text-yellow-400/70">
        {label}
      </span>
    </div>
  )
}
