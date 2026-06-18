'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CONSTELLATION_POINTS } from '@/data/constellation'
import { GlassCard } from '@/components/ui/GlassCard'
import type { ConstellationPoint } from '@/types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function ConstellationMap() {
  const [activePoint, setActivePoint] = useState<ConstellationPoint | null>(null)
  const [drawnLines, setDrawnLines] = useState<string[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        onEnter: () => {
          // Progressively reveal connection lines
          const allConnections: string[] = []
          CONSTELLATION_POINTS.forEach((point) => {
            point.connections.forEach((targetId) => {
              const key = [point.id, targetId].sort().join('-')
              if (!allConnections.includes(key)) allConnections.push(key)
            })
          })

          allConnections.forEach((key, i) => {
            setTimeout(() => {
              setDrawnLines((prev) => [...prev, key])
            }, i * 300 + 400)
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="constelacao"
      className="relative py-24 px-6 overflow-hidden"
      aria-label="Mapa das memórias — constelação interativa"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.p
          className="font-accent text-xs tracking-[0.5em] uppercase text-yellow-400/60 mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ✦ Mapa das Memórias ✦
        </motion.p>
        <motion.h2
          className="font-heading text-4xl md:text-6xl font-bold gradient-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Nossa Constelação
        </motion.h2>
        <motion.p
          className="text-gray-400/70 mt-4 max-w-md mx-auto text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Clique em cada estrela para revelar o momento que ela representa.
        </motion.p>
      </div>

      {/* Constellation SVG */}
      <div className="relative max-w-4xl mx-auto" style={{ height: '500px' }}>
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(212,175,55,0.6)" />
              <stop offset="100%" stopColor="rgba(212,175,55,0.15)" />
            </linearGradient>
          </defs>

          {/* Connection lines */}
          {CONSTELLATION_POINTS.map((point) =>
            point.connections.map((targetId) => {
              const target = CONSTELLATION_POINTS.find((p) => p.id === targetId)
              if (!target) return null
              const key = [point.id, targetId].sort().join('-')
              const isDrawn = drawnLines.includes(key)

              return (
                <motion.line
                  key={key}
                  x1={point.x}
                  y1={point.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="url(#lineGrad)"
                  strokeWidth="0.2"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isDrawn ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              )
            })
          )}
        </svg>

        {/* Star points (HTML overlay for interaction) */}
        {CONSTELLATION_POINTS.map((point, index) => (
          <StarPoint
            key={point.id}
            point={point}
            index={index}
            isActive={activePoint?.id === point.id}
            onClick={() => setActivePoint(activePoint?.id === point.id ? null : point)}
          />
        ))}
      </div>

      {/* Detail card */}
      <AnimatePresence>
        {activePoint && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePoint(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 max-w-md w-full"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard gold tilt>
                <div className="relative h-48">
                  <Image
                    src={activePoint.imagePath}
                    alt={activePoint.title}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-6">
                  <span className="font-accent text-xs text-yellow-400/70 tracking-widest uppercase">
                    {activePoint.date}
                  </span>
                  <h3 className="font-heading text-2xl text-white mt-1 mb-3">{activePoint.title}</h3>
                  <p className="text-gray-300/80 text-sm leading-relaxed">{activePoint.story}</p>
                </div>
              </GlassCard>
              <button
                onClick={() => setActivePoint(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white"
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

function StarPoint({
  point,
  index,
  isActive,
  onClick,
}: {
  point: ConstellationPoint
  index: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      className="absolute focus:outline-none group"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 + 0.5, type: 'spring' }}
      whileHover={{ scale: 1.5 }}
      aria-label={point.title}
    >
      {/* Star shape */}
      <div
        className="relative transition-all duration-300"
        style={{
          width: '16px',
          height: '16px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 0L9.5 6L16 4.5L10.5 8L16 11.5L9.5 10L8 16L6.5 10L0 11.5L5.5 8L0 4.5L6.5 6L8 0Z"
            fill={isActive ? '#FFD700' : '#D4AF37'}
            style={{
              filter: isActive
                ? 'drop-shadow(0 0 8px rgba(255,215,0,1))'
                : 'drop-shadow(0 0 4px rgba(212,175,55,0.7))',
              transition: 'all 0.3s',
            }}
          />
        </svg>

        {/* Pulse */}
        <motion.div
          className="absolute inset-0 rounded-full border border-yellow-400/50"
          animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
        />
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <div className="glass px-2 py-1 rounded text-xs text-yellow-300 font-accent tracking-wide">
          {point.title}
        </div>
      </div>
    </motion.button>
  )
}
