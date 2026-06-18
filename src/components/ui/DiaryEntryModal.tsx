'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { compressImageToBase64 } from '@/hooks/useDiary'
import type { DiaryEntry } from '@/hooks/useDiary'

interface DiaryEntryModalProps {
  onSave: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'date'>) => void
  onClose: () => void
}

export function DiaryEntryModal({ onSave, onClose }: DiaryEntryModalProps) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('Daniel')
  const [imageBase64, setImageBase64] = useState<string | undefined>()
  const [imageName, setImageName] = useState<string | undefined>()
  const [imageLoading, setImageLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageLoading(true)
    try {
      const base64 = await compressImageToBase64(file)
      setImageBase64(base64)
      setImageName(file.name)
    } catch {
      alert('Erro ao carregar imagem. Tente outra foto.')
    } finally {
      setImageLoading(false)
    }
  }, [])

  const handleSave = () => {
    if (!text.trim()) return
    setSaving(true)
    onSave({
      title: title.trim() || 'Um momento nosso',
      text: text.trim(),
      author,
      imageBase64,
      imageName,
    })
    setSaving(false)
  }

  const canSave = text.trim().length > 0 && !imageLoading && !saving

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div
          className="rounded-3xl p-6 md:p-8"
          style={{
            background: 'rgba(11, 16, 32, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            boxShadow: '0 0 60px rgba(212,175,55,0.1), 0 40px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-accent text-xs tracking-[0.4em] uppercase text-yellow-400/60 mb-1">
                ✦ Nova Entrada ✦
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-white">Diário do Nosso Amor</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          {/* Author selector */}
          <div className="flex gap-3 mb-5">
            {['Daniel', 'Vitória'].map((name) => (
              <button
                key={name}
                onClick={() => setAuthor(name)}
                className="flex-1 py-2.5 rounded-xl text-sm font-accent tracking-wider transition-all duration-200"
                style={{
                  background: author === name ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${author === name ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: author === name ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                }}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Title input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Título do momento (opcional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-all duration-200 font-heading text-lg"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* Text area */}
          <div className="mb-5">
            <textarea
              placeholder="Escreva o que seu coração sente hoje..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              className="w-full rounded-xl px-4 py-3 text-white/90 placeholder-white/25 text-sm leading-relaxed outline-none resize-none transition-all duration-200 font-body"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
            <p className="text-right text-xs text-white/20 mt-1">{text.length} caracteres</p>
          </div>

          {/* Image upload */}
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
              aria-label="Adicionar foto"
            />

            {imageBase64 ? (
              <div className="relative rounded-xl overflow-hidden" style={{ height: '180px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageBase64} alt="Foto do momento" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => { setImageBase64(undefined); setImageName(undefined) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/80 text-xs hover:bg-black/80 transition-colors"
                  aria-label="Remover foto"
                >
                  ✕
                </button>
                <p className="absolute bottom-2 left-3 text-xs text-white/50 font-accent">{imageName}</p>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={imageLoading}
                className="w-full rounded-xl py-4 flex flex-col items-center gap-2 transition-all duration-200 group"
                style={{
                  border: '1px dashed rgba(212,175,55,0.25)',
                  background: 'rgba(212,175,55,0.03)',
                }}
              >
                {imageLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-yellow-400/40 border-t-yellow-400 animate-spin" />
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-400/50 group-hover:text-yellow-400/80 transition-colors">
                      <path d="M4 16l4-4 4 4 4-5 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    </svg>
                    <span className="text-xs text-yellow-400/50 group-hover:text-yellow-400/80 font-accent tracking-wider transition-colors">
                      Adicionar foto do momento
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Save button */}
          <motion.button
            onClick={handleSave}
            disabled={!canSave}
            whileHover={canSave ? { scale: 1.02 } : {}}
            whileTap={canSave ? { scale: 0.98 } : {}}
            className="w-full py-4 rounded-2xl font-accent text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden"
            style={{
              background: canSave
                ? 'linear-gradient(135deg, #D4AF37, #FFD700, #F7D794)'
                : 'rgba(255,255,255,0.05)',
              color: canSave ? '#050816' : 'rgba(255,255,255,0.2)',
              boxShadow: canSave ? '0 0 30px rgba(212,175,55,0.3)' : 'none',
              cursor: canSave ? 'pointer' : 'not-allowed',
            }}
          >
            {/* Shimmer */}
            {canSave && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
              />
            )}
            <span className="relative z-10">
              {saving ? 'Salvando...' : '✦ Guardar este momento'}
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
