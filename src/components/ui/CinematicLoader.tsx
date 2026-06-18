'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ParticleField } from './ParticleField'

interface CinematicLoaderProps {
  visible: boolean
  onComplete: () => void
}

export function CinematicLoader({ visible, onComplete }: CinematicLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-space-deep overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          onAnimationComplete={onComplete}
        >
          <ParticleField count={60} />

          {/* Radial glow */}
          <div className="absolute inset-0 gradient-radial-gold" />

          {/* Star rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-yellow-400/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 2.5], opacity: [0, 0.4, 0] }}
              transition={{
                duration: 2.5,
                delay: i * 0.4,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{ width: i * 80, height: i * 80 }}
            />
          ))}

          {/* Central star */}
          <motion.div
            className="relative flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Star icon */}
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 2L28.5 18.5L45 13L31 22.5L45 32L28.5 26.5L24 46L19.5 26.5L3 32L17 22.5L3 13L19.5 18.5L24 2Z"
                  fill="url(#starGrad)"
                  className="drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                />
                <defs>
                  <linearGradient id="starGrad" x1="3" y1="2" x2="45" y2="46" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D4AF37" />
                    <stop offset="1" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            <div className="text-center">
              <p className="font-accent text-xs tracking-[0.4em] text-yellow-400/60 uppercase mb-2">
                Carregando
              </p>
              {/* Loading bar */}
              <div className="w-32 h-px bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-300"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
