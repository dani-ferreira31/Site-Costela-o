'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { StarButton } from '@/components/ui/StarButton'
import { ParticleField } from '@/components/ui/ParticleField'
import { RELATIONSHIP_CONFIG } from '@/data/config'

interface IntroSectionProps {
  onStart: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.5,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.23, 1, 0.32, 1] },
  },
}

export function IntroSection({ onStart }: IntroSectionProps) {
  const centralStarRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Pulsating central star
    if (centralStarRef.current) {
      gsap.to(centralStarRef.current, {
        scale: 1.3,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    }
  }, [])

  const { person1, person2 } = RELATIONSHIP_CONFIG.names

  return (
    <section
      id="intro"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Introdução — Constelação do Nosso Amor"
    >
      {/* Particle field */}
      <ParticleField count={100} />

      {/* Radial gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '60vmax',
            height: '60vmax',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, rgba(11,16,32,0) 65%)',
          }}
        />
      </div>

      {/* Central glowing star */}
      <motion.div
        ref={centralStarRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.2 }}
        style={{ zIndex: 0 }}
      >
        <div
          className="rounded-full"
          style={{
            width: '4px',
            height: '4px',
            background: '#FFD700',
            boxShadow: '0 0 60px 30px rgba(212,175,55,0.15), 0 0 120px 60px rgba(212,175,55,0.07), 0 0 6px 3px rgba(255,215,0,0.8)',
          }}
        />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Constellation label */}
        <motion.p
          variants={itemVariants}
          className="font-accent text-xs md:text-sm tracking-[0.5em] text-yellow-400/60 uppercase mb-8"
        >
          {person1} & {person2}
        </motion.p>

        {/* Main title */}
        <motion.h1
          ref={titleRef}
          variants={itemVariants}
          className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-none mb-6"
          style={{
            background: 'linear-gradient(160deg, #fff 0%, #E8D5C4 30%, #D4AF37 60%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
          }}
        >
          Constelação
          <br />
          <span className="italic">do Nosso Amor</span>
        </motion.h1>

        {/* Divider line */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-yellow-400/40" />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#D4AF37', boxShadow: '0 0 8px 4px rgba(212,175,55,0.4)' }}
          />
          <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-yellow-400/40" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="font-body text-lg md:text-xl text-gray-300/80 mb-4 leading-relaxed max-w-xl mx-auto"
        >
          13 meses escrevendo estrelas no universo.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="font-body text-sm text-gray-400/60 mb-14 tracking-wide"
        >
          Uma jornada cósmica através de cada memória que criamos juntos.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <StarButton onClick={onStart} variant="primary">
            <span>✦</span>
            <span>Iniciar Jornada</span>
          </StarButton>
        </motion.div>
      </motion.div>

      {/* Bottom scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <span className="font-accent text-xs tracking-widest text-yellow-400/40 uppercase">Role para explorar</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-yellow-400/40 to-transparent"
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
