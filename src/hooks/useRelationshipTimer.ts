'use client'

import { useState, useEffect } from 'react'
import type { CounterTime } from '@/types'
import { RELATIONSHIP_CONFIG } from '@/data/config'

export function useRelationshipTimer(): CounterTime {
  const [time, setTime] = useState<CounterTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculate = () => {
      const now = new Date()
      const diff = now.getTime() - RELATIONSHIP_CONFIG.startDate.getTime()

      const totalSeconds = Math.floor(diff / 1000)
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setTime({ days, hours, minutes, seconds })
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [])

  return time
}
