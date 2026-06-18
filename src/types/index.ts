export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  message: string
  imagePath: string
  position: { x: number; y: number }
}

export interface GalleryPhoto {
  id: string
  src: string
  title: string
  date: string
  message: string
  width: number
  height: number
}

export interface ConstellationPoint {
  id: string
  x: number
  y: number
  title: string
  date: string
  story: string
  imagePath: string
  connections: string[]
}

export interface RelationshipConfig {
  startDate: Date
  names: {
    person1: string
    person2: string
  }
}

export interface CounterTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}
