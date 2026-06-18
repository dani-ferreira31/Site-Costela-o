'use client'

import { useState, useEffect, useCallback } from 'react'

export interface DiaryEntry {
  id: string
  title: string
  text: string
  author: string
  date: string
  createdAt: number
  imageBase64?: string
  imageName?: string
}

const STORAGE_KEY = 'constellation-diary-entries'

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: DiaryEntry[] = JSON.parse(raw)
        // Sort by createdAt descending (newest first)
        parsed.sort((a, b) => b.createdAt - a.createdAt)
        setEntries(parsed)
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true)
  }, [])

  const save = useCallback((updated: DiaryEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setEntries([...updated].sort((a, b) => b.createdAt - a.createdAt))
  }, [])

  const addEntry = useCallback(
    (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'date'>) => {
      const now = Date.now()
      const newEntry: DiaryEntry = {
        ...entry,
        id: `entry-${now}`,
        createdAt: now,
        date: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          weekday: 'long',
        }),
      }
      const updated = [newEntry, ...entries]
      save(updated)
      return newEntry
    },
    [entries, save]
  )

  const deleteEntry = useCallback(
    (id: string) => {
      const updated = entries.filter((e) => e.id !== id)
      save(updated)
    },
    [entries, save]
  )

  return { entries, addEntry, deleteEntry, loaded }
}

/**
 * Compress an image File to a base64 string with max width/height.
 * This keeps localStorage usage reasonable.
 */
export async function compressImageToBase64(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target!.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
