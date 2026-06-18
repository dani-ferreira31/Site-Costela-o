'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ParticleField } from '@/components/ui/ParticleField'
import { StarButton } from '@/components/ui/StarButton'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface EpicEndingProps {
  onOpenDiary: () => void
}

export function EpicEnding({ onOpenDiary }: EpicEndingProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const starRef = useRef<HTMLDivElement>(null)
  const [converging, setConverging] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const star = starRef.current
    if (!section || !star) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        onEnter: () => {
          setConverging(true)
          // Animate the central star
          gsap.fromTo(
            star,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 2, ease: 'expo.out', delay: 0.5 }
          )
          gsap.to(star, {
            scale: 1.15,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 2.5,
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.8 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.23, 1, 0.32, 1] } },
  }

  return (
    <section
      ref={sectionRef}
      id="final"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      aria-label="Final épico — Constelação do Nosso Amor"
    >
      <ParticleField count={120} />

      {/* Background radial glow — large */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={{ width: '20vmax', height: '20vmax', opacity: 0 }}
          animate={
            converging
              ? { width: '80vmax', height: '80vmax', opacity: 1 }
              : {}
          }
          transition={{ duration: 3, ease: 'easeOut', delay: 0.3 }}
          style={{
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* Converging star particles */}
      {converging &&
        [...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2
          const dist = 40 + Math.random() * 30

          return (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                background: '#D4AF37',
                boxShadow: '0 0 6px rgba(212,175,55,0.8)',
                left: '50%',
                top: '50%',
                x: `${Math.cos(angle) * dist}vw`,
                y: `${Math.sin(angle) * dist}vh`,
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.08 + 0.5,
                ease: 'easeIn',
              }}
            />
          )
        })}

      {/* Central mega star */}
      <div ref={starRef} className="absolute opacity-0" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div
          className="rounded-full"
          style={{
            width: '8px',
            height: '8px',
            background: '#FFD700',
            boxShadow:
              '0 0 40px 20px rgba(212,175,55,0.3), 0 0 80px 40px rgba(212,175,55,0.15), 0 0 160px 80px rgba(212,175,55,0.06), 0 0 10px 5px rgba(255,215,0,0.9)',
          }}
        />
      </div>

      {/* Text content */}
      <motion.div
        className="relative z-10 text-center max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="font-accent text-xs tracking-[0.5em] uppercase text-yellow-400/60 mb-8"
        >
          ✦ 13 meses ✦
        </motion.p>

        {/* Main title */}
        <motion.h2
          variants={itemVariants}
          className="font-heading text-5xl sm:text-6xl md:text-8xl font-bold leading-tight mb-6"
          style={{
            background: 'linear-gradient(160deg, #fff 0%, #E8D5C4 40%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          13 meses foram
          <br />
          <em>apenas o começo.</em>
        </motion.h2>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-yellow-400/40" />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#D4AF37', boxShadow: '0 0 10px 5px rgba(212,175,55,0.4)' }}
          />
          <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-yellow-400/40" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="font-body text-lg md:text-xl text-gray-300/70 mb-4 leading-relaxed max-w-2xl mx-auto"
        >
          Ainda existem infinitas estrelas para descobrirmos juntos.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="font-body text-sm text-gray-400/50 mb-16 max-w-xl mx-auto leading-relaxed"
        >
          Nossa constelação crescerá para sempre — uma estrela por cada momento, uma memória por cada dia,
          um universo construído por dois.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <StarButton variant="primary" onClick={onOpenDiary}>
            <span>✦</span>
            <span>Continuar escrevendo esta história</span>
          </StarButton>
        </motion.div>

        {/* Final star decoration */}
        <motion.div
          variants={itemVariants}
          className="mt-20 flex items-center justify-center gap-3"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: `${6 - i}px`,
                height: `${6 - i}px`,
                background: '#D4AF37',
                borderRadius: '50%',
                boxShadow: `0 0 ${8 - i * 1.5}px rgba(212,175,55,0.5)`,
              }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
