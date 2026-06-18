'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TIMELINE_EVENTS } from '@/data/timeline'
import { GlassCard } from '@/components/ui/GlassCard'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { TimelineEvent } from '@/types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function TimelineSection() {
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    // Horizontal scroll via GSAP ScrollTrigger
    const totalWidth = track.scrollWidth - track.clientWidth

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalWidth * 1.5}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative overflow-hidden"
      aria-label="Linha do tempo do relacionamento"
    >
      <div className="relative z-10 min-h-screen flex flex-col justify-center">
        {/* Section header */}
        <div className="text-center pt-16 pb-8 px-6 shrink-0">
          <motion.p
            className="font-accent text-xs tracking-[0.5em] uppercase text-yellow-400/60 mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            ✦ Linha do Tempo Estelar ✦
          </motion.p>
          <motion.h2
            className="font-heading text-4xl md:text-6xl font-bold gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Nossa Jornada
          </motion.h2>
        </div>

        {/* Timeline track */}
        <div className="relative overflow-hidden flex-1">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent pointer-events-none" />

          <div
            ref={trackRef}
            className="flex items-center gap-24 px-24 py-12 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {TIMELINE_EVENTS.map((event, index) => (
              <TimelineNode
                key={event.id}
                event={event}
                index={index}
                isActive={activeEvent?.id === event.id}
                onClick={() => setActiveEvent(event.id === activeEvent?.id ? null : event)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveEvent(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 max-w-lg w-full"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard gold tilt className="overflow-hidden">
                <div className="relative h-56 w-full">
                  <Image
                    src={activeEvent.imagePath}
                    alt={activeEvent.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 512px) 100vw, 512px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-accent text-xs text-yellow-400/80 tracking-widest uppercase">
                      {activeEvent.date}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-2xl text-white mb-2">{activeEvent.title}</h3>
                  <p className="text-gray-300/80 text-sm mb-4 leading-relaxed">{activeEvent.description}</p>
                  <p className="text-yellow-300/70 text-sm italic leading-relaxed border-l-2 border-yellow-400/30 pl-4">
                    "{activeEvent.message}"
                  </p>
                </div>
              </GlassCard>
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function TimelineNode({
  event,
  index,
  isActive,
  onClick,
}: {
  event: TimelineEvent
  index: number
  isActive: boolean
  onClick: () => void
}) {
  const isAbove = index % 2 === 0

  return (
    <div className="relative flex flex-col items-center shrink-0" style={{ width: '180px' }}>
      {/* Text above/below */}
      <div
        className={`absolute w-48 text-center ${isAbove ? 'bottom-full mb-8' : 'top-full mt-8'}`}
      >
        <p className="font-heading text-base text-white/80 leading-tight">{event.title}</p>
        <p className="font-accent text-xs text-yellow-400/60 tracking-wider mt-1">{event.date}</p>
      </div>

      {/* Vertical connector */}
      <div
        className={`absolute w-px bg-gradient-to-b from-yellow-400/20 to-transparent ${isAbove ? 'bottom-6 h-8' : 'top-6 h-8'}`}
      />

      {/* Star node */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.4 }}
        whileTap={{ scale: 0.95 }}
        className="relative focus:outline-none"
        aria-label={`Ver detalhes: ${event.title}`}
      >
        <motion.div
          animate={
            isActive
              ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 1L16.5 10.5L26 8L18 14L26 20L16.5 17.5L14 27L11.5 17.5L2 20L10 14L2 8L11.5 10.5L14 1Z"
              fill={isActive ? '#FFD700' : '#D4AF37'}
              className="transition-all duration-300"
              style={{
                filter: isActive
                  ? 'drop-shadow(0 0 12px rgba(255,215,0,0.9))'
                  : 'drop-shadow(0 0 6px rgba(212,175,55,0.5))',
              }}
            />
          </svg>
        </motion.div>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-yellow-400/40"
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
        />
      </motion.button>
    </div>
  )
}
