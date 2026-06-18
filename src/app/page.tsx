'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import { CinematicLoader } from '@/components/ui/CinematicLoader'
import { DiaryEntryModal } from '@/components/ui/DiaryEntryModal'
import { IntroSection } from '@/components/sections/IntroSection'
import { CounterSection } from '@/components/sections/CounterSection'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { GallerySection } from '@/components/sections/GallerySection'
import { ConstellationMap } from '@/components/sections/ConstellationMap'
import { LetterSection } from '@/components/sections/LetterSection'
import { EpicEnding } from '@/components/sections/EpicEnding'
import { DiarySection } from '@/components/sections/DiarySection'
import { useDiary } from '@/hooks/useDiary'

// Lazy load heavy 3D components
const StarField = dynamic(() => import('@/components/three/StarField').then((m) => ({ default: m.StarField })), {
  ssr: false,
})
const UniverseSection = dynamic(
  () => import('@/components/sections/UniverseSection').then((m) => ({ default: m.UniverseSection })),
  { ssr: false }
)

const NAV_SECTIONS = [
  { id: 'intro', label: 'Intro' },
  { id: 'contador', label: 'Contador' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'constelacao', label: 'Mapa' },
  { id: 'carta', label: 'Carta' },
  { id: 'universo', label: 'Universo' },
  { id: 'final', label: 'Final' },
  { id: 'diario', label: 'Diário' },
]

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [diaryModalOpen, setDiaryModalOpen] = useState(false)
  // Single source of truth for diary state — shared between DiarySection and modal
  const { entries, addEntry, deleteEntry, loaded } = useDiary()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleStart = () => {
    setTimeout(() => {
      document.getElementById('contador')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleOpenDiary = () => {
    setDiaryModalOpen(true)
  }

  const handleSaveEntry = (entry: Parameters<typeof addEntry>[0]) => {
    addEntry(entry)
    setDiaryModalOpen(false)
    // Scroll to diary section after saving
    setTimeout(() => {
      document.getElementById('diario')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <main className="relative min-h-screen bg-space-deep overflow-x-hidden">
      {/* Cinematic loader */}
      <CinematicLoader visible={loading} onComplete={() => {}} />

      {/* Global star field background */}
      <StarField />

      {/* Section 1 — Intro */}
      <IntroSection onStart={handleStart} />

      {/* Section 2 — Counter */}
      <CounterSection />

      {/* Section 3 — Timeline */}
      <TimelineSection />

      {/* Section 4 — Gallery */}
      <GallerySection />

      {/* Section 5 — Constellation Map */}
      <ConstellationMap />

      {/* Section 6 — Letter */}
      <LetterSection />

      {/* Section 7 — Universe 3D */}
      <UniverseSection />

      {/* Section 8 — Epic Ending */}
      <EpicEnding onOpenDiary={handleOpenDiary} />

      {/* Section 9 — Diary */}
      <DiarySection
        entries={entries}
        loaded={loaded}
        onNewEntry={handleOpenDiary}
        onDelete={deleteEntry}
      />

      {/* Diary entry modal */}
      <AnimatePresence>
        {diaryModalOpen && (
          <DiaryEntryModal
            onSave={handleSaveEntry}
            onClose={() => setDiaryModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation dots */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
        aria-label="Navegação por seções"
      >
        {NAV_SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300 hover:scale-[2.5]"
            style={{ background: 'rgba(212,175,55,0.4)' }}
            aria-label={`Ir para ${label}`}
            title={label}
          />
        ))}
      </div>
    </main>
  )
}
