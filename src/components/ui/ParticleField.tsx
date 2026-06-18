'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
  life: number
  maxLife: number
}

export function ParticleField({ count = 80 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []
    const colors = ['rgba(212,175,55,', 'rgba(255,215,0,', 'rgba(247,215,148,', 'rgba(255,255,255,']

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 300 + 200,
    })

    for (let i = 0; i < count; i++) {
      particles.push(createParticle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, idx) => {
        p.life++
        p.x += p.vx
        p.y += p.vy

        const lifeRatio = p.life / p.maxLife
        const alpha = p.alpha * (1 - Math.pow(lifeRatio, 2))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${alpha})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${alpha * 0.15})`
        ctx.fill()

        if (p.life >= p.maxLife || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          particles[idx] = createParticle()
        }
      })

      animId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      resizeObs.disconnect()
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
