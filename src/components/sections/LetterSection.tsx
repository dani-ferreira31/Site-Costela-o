'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LETTER_PARAGRAPHS } from '@/data/letter'
import { ParticleField } from '@/components/ui/ParticleField'
import { RELATIONSHIP_CONFIG } from '@/data/config'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function LetterSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const letterRef = useRef<HTMLDivElement>(null)
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const letter = letterRef.current
    if (!section || !letter) return

    const ctx = gsap.context(() => {
      // Fade in each paragraph on scroll
      paragraphRefs.current.forEach((p, i) => {
        if (!p) return
        gsap.fromTo(
          p,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: p,
              start: 'top 85%',
              end: 'top 60%',
              scrub: false,
              once: true,
            },
          }
        )
      })

      // Float animation for the letter card
      gsap.to(letter, {
        y: -12,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const { person2 } = RELATIONSHIP_CONFIG.names

  return (
    <section
      ref={sectionRef}
      id="carta"
      className="relative py-24 px-6 overflow-hidden"
      aria-label="Carta entre as estrelas"
    >
      <ParticleField count={40} />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '60vmax',
            height: '60vmax',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <motion.p
          className="font-accent text-xs tracking-[0.5em] uppercase text-yellow-400/60 mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ✦ Para Sempre ✦
        </motion.p>
        <motion.h2
          className="font-heading text-4xl md:text-6xl font-bold gradient-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Carta entre as Estrelas
        </motion.h2>
      </div>

      {/* Letter card */}
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          ref={letterRef}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Translucent paper */}
          <div
            className="relative rounded-3xl p-8 md:p-12"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(212, 175, 55, 0.12)',
              boxShadow:
                '0 0 60px rgba(212,175,55,0.08), 0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Corner decorations */}
            {[
              'top-4 left-4',
              'top-4 right-4',
              'bottom-4 left-4',
              'bottom-4 right-4',
            ].map((pos, i) => (
              <div key={i} className={`absolute ${pos} opacity-30`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0L11.5 8L20 6L13 10L20 14L11.5 12L10 20L8.5 12L0 14L7 10L0 6L8.5 8L10 0Z" fill="#D4AF37" />
                </svg>
              </div>
            ))}

            {/* Letter content */}
            <div className="space-y-6 relative z-10">
              {LETTER_PARAGRAPHS.map((paragraph, i) => (
                <p
                  key={i}
                  ref={(el) => { paragraphRefs.current[i] = el }}
                  className={
                    i === 0
                      ? 'font-heading text-2xl text-yellow-300 mb-2'
                      : i === LETTER_PARAGRAPHS.length - 1
                      ? 'font-heading text-xl text-yellow-300 mt-4'
                      : i === LETTER_PARAGRAPHS.length - 2
                      ? 'font-body text-base text-gray-300/80 italic'
                      : 'font-body text-base md:text-lg text-gray-200/80 leading-relaxed'
                  }
                  style={{ opacity: 0 }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Horizontal rule */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-yellow-400/15" />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.6)' }}
              />
              <div className="h-px flex-1 bg-yellow-400/15" />
            </div>

            <p className="text-center mt-4 font-accent text-xs tracking-widest text-yellow-400/40 uppercase">
              Para {person2}, com amor eterno
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
