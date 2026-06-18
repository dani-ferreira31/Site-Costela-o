'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DiaryEntry } from '@/hooks/useDiary'
import { GlassCard } from '@/components/ui/GlassCard'
import { ParticleField } from '@/components/ui/ParticleField'

interface DiarySectionProps {
  entries: DiaryEntry[]
  loaded: boolean
  onNewEntry: () => void
  onDelete: (id: string) => void
}

function DiaryCard({
  entry,
  index,
  onDelete,
}: {
  entry: DiaryEntry
  index: number
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isLong = entry.text.length > 280
  const previewText = isLong && !expanded ? entry.text.slice(0, 280) + '…' : entry.text

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
    >
      <GlassCard gold className="overflow-hidden group relative">
        {/* Author badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className="font-accent text-xs tracking-widest px-3 py-1 rounded-full"
            style={{
              background: entry.author === 'Daniel'
                ? 'rgba(59,130,246,0.15)'
                : 'rgba(236,72,153,0.15)',
              border: `1px solid ${entry.author === 'Daniel' ? 'rgba(59,130,246,0.3)' : 'rgba(236,72,153,0.3)'}`,
              color: entry.author === 'Daniel' ? '#93c5fd' : '#f9a8d4',
            }}
          >
            {entry.author}
          </span>
        </div>

        {/* Image */}
        {entry.imageBase64 && (
          <div className="relative overflow-hidden" style={{ height: '200px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.imageBase64}
              alt={entry.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-5 md:p-6">
          {/* Date */}
          <p className="font-accent text-xs text-yellow-400/50 tracking-widest uppercase mb-2 capitalize">
            {entry.date}
          </p>

          {/* Title */}
          <h3 className="font-heading text-xl text-white mb-3 pr-16">{entry.title}</h3>

          {/* Text */}
          <p className="font-body text-sm text-gray-300/75 leading-relaxed whitespace-pre-wrap">
            {previewText}
          </p>

          {/* Expand toggle */}
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-xs font-accent tracking-wider text-yellow-400/60 hover:text-yellow-400 transition-colors"
            >
              {expanded ? 'Mostrar menos ↑' : 'Ler tudo ↓'}
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Star decoration */}
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#D4AF37', boxShadow: '0 0 5px rgba(212,175,55,0.5)' }}
              />
              <span className="text-xs text-white/20 font-accent tracking-wide">
                Memória preservada
              </span>
            </div>

            {/* Delete */}
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-white/20 hover:text-red-400/60 transition-colors font-accent"
                aria-label="Apagar entrada"
              >
                Apagar
              </button>
            ) : (
              <div className="flex gap-2 items-center">
                <span className="text-xs text-red-400/70">Confirmar?</span>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="text-xs text-red-400/80 hover:text-red-300 font-accent"
                >
                  Sim
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-white/30 hover:text-white/60 font-accent"
                >
                  Não
                </button>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export function DiarySection({ entries = [], loaded, onNewEntry, onDelete }: DiarySectionProps) {

  return (
    <section
      id="diario"
      className="relative py-24 px-6 overflow-hidden"
      aria-label="Diário do Nosso Amor"
    >
      <ParticleField count={35} />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '70vmax',
            height: '70vmax',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-14 relative z-10">
        <motion.p
          className="font-accent text-xs tracking-[0.5em] uppercase text-yellow-400/60 mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ✦ Nossas Palavras ✦
        </motion.p>

        <motion.h2
          className="font-heading text-4xl md:text-6xl font-bold gradient-text mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Diário do Nosso Amor
        </motion.h2>

        <motion.p
          className="text-gray-400/70 max-w-md mx-auto text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Um espaço sagrado para guardar tudo o que o coração quer dizer.
          <br />
          Cada entrada é uma estrela permanente na nossa constelação.
        </motion.p>

        {/* Add entry button */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={onNewEntry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden px-8 py-4 rounded-full font-accent tracking-widest text-sm uppercase cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FFD700, #F7D794)',
              color: '#050816',
              fontWeight: 600,
              boxShadow: '0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)',
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10 flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Nova entrada no diário
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Entries grid */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {!loaded ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : entries.length === 0 ? (
          // Empty state
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Decorative star */}
            <motion.div
              className="mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ width: 'fit-content' }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M20 2L23.5 15L37 11L27 20L37 29L23.5 25L20 38L16.5 25L3 29L13 20L3 11L16.5 15L20 2Z"
                  fill="url(#emptyStarGrad)"
                  opacity="0.4"
                />
                <defs>
                  <linearGradient id="emptyStarGrad" x1="3" y1="2" x2="37" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D4AF37" />
                    <stop offset="1" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            <p className="font-heading text-2xl text-white/30 mb-2">O diário ainda está em branco</p>
            <p className="text-sm text-white/20 font-body">
              Seja a primeira estrela desta constelação de palavras.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {entries.map((entry, i) => (
                <DiaryCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>


      {/* Bottom decoration */}
      {entries.length > 0 && (
        <motion.div
          className="text-center mt-14 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: `${5 - i}px`,
                  height: `${5 - i}px`,
                  background: '#D4AF37',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px rgba(212,175,55,0.5)',
                }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
          <p className="font-accent text-xs text-yellow-400/30 tracking-widest uppercase">
            {entries.length} {entries.length === 1 ? 'memória guardada' : 'memórias guardadas'}
          </p>
        </motion.div>
      )}
    </section>
  )
}
