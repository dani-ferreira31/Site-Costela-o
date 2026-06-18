'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GALLERY_PHOTOS } from '@/data/gallery'
import type { GalleryPhoto } from '@/types'

function FloatingPhoto({
  photo,
  index,
  onClick,
}: {
  photo: GalleryPhoto
  index: number
  onClick: () => void
}) {
  const delay = index * 0.15
  const duration = 5 + (index % 4) * 1.2
  const yRange = 8 + (index % 3) * 6

  return (
    <motion.div
      layoutId={`photo-${photo.id}`}
      className="relative cursor-pointer group"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      animate={{ y: [0, -yRange, 0] }}
      whileHover={{ scale: 1.06, zIndex: 10 }}
      style={{
        animationDuration: `${duration}s`,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
      }}
      onClick={onClick}
    >
      {/* Glow border */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.4), rgba(255,215,0,0.2), transparent)',
        }}
      />

      <div className="relative overflow-hidden rounded-xl" style={{ width: '100%', paddingBottom: '133%' }}>
        <Image
          src={photo.src}
          alt={photo.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="font-heading text-sm text-white">{photo.title}</p>
          <p className="font-accent text-xs text-yellow-400/70">{photo.date}</p>
        </div>
      </div>

      {/* Star indicator */}
      <div
        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
        style={{
          background: '#D4AF37',
          boxShadow: '0 0 8px 4px rgba(212,175,55,0.4)',
        }}
      />
    </motion.div>
  )
}

function PhotoModal({ photo, onClose }: { photo: GalleryPhoto; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

      <motion.div
        layoutId={`photo-${photo.id}`}
        className="relative z-10 max-w-2xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative" style={{ paddingBottom: '75%' }}>
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="font-accent text-xs text-yellow-400/70 tracking-widest uppercase">{photo.date}</span>
            <h3 className="font-heading text-3xl text-white mt-1 mb-2">{photo.title}</h3>
            <p className="text-gray-300/80 text-sm leading-relaxed italic">"{photo.message}"</p>
          </div>

          {/* Gold border */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ border: '1px solid rgba(212,175,55,0.2)' }}
          />
        </div>

        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          aria-label="Fechar foto"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  )
}

export function GallerySection() {
  const [selected, setSelected] = useState<GalleryPhoto | null>(null)

  return (
    <section
      id="galeria"
      className="relative py-24 px-6 overflow-hidden"
      aria-label="Galeria das constelações"
    >
      {/* Section header */}
      <div className="text-center mb-16">
        <motion.p
          className="font-accent text-xs tracking-[0.5em] uppercase text-yellow-400/60 mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ✦ Galeria ✦
        </motion.p>
        <motion.h2
          className="font-heading text-4xl md:text-6xl font-bold gradient-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Constelações de Memórias
        </motion.h2>
        <motion.p
          className="text-gray-400/70 mt-4 max-w-md mx-auto text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Cada foto é uma estrela. Cada estrela, uma memória eterna.
        </motion.p>
      </div>

      {/* Photo grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {GALLERY_PHOTOS.map((photo, i) => (
          <FloatingPhoto
            key={photo.id}
            photo={photo}
            index={i}
            onClick={() => setSelected(photo)}
          />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <PhotoModal photo={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
