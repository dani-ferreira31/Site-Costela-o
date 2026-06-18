'use client'

import { motion, Variants } from 'framer-motion'
import { useRelationshipTimer } from '@/hooks/useRelationshipTimer'
import { OdometerNumber } from '@/components/ui/OdometerNumber'
import { ParticleField } from '@/components/ui/ParticleField'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } },
}

export function CounterSection() {
  const { days, hours, minutes, seconds } = useRelationshipTimer()

  return (
    <section
      id="contador"
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden"
      aria-label="Contador de tempo juntos"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '80vmax',
            height: '80vmax',
            background: 'radial-gradient(ellipse, rgba(11,16,32,0.8) 0%, transparent 70%)',
          }}
        />
      </div>

      <ParticleField count={50} />

      <motion.div
        className="relative z-10 text-center max-w-5xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="font-accent text-xs tracking-[0.5em] uppercase text-yellow-400/60 mb-6"
        >
          ✦ Nosso Tempo ✦
        </motion.p>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="font-heading text-4xl md:text-6xl font-bold text-white/90 mb-4"
        >
          Uma estrela nasceu há
        </motion.h2>

        {/* Counter grid */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 md:gap-10 my-14"
        >
          <OdometerNumber value={days} digits={3} label="Dias" />
          <OdometerNumber value={hours} digits={2} label="Horas" />
          <OdometerNumber value={minutes} digits={2} label="Minutos" />
          <OdometerNumber value={seconds} digits={2} label="Segundos" />
        </motion.div>

        {/* Horizontal divider */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-yellow-400/30" />
          <div className="w-1 h-1 rounded-full bg-yellow-400/60" />
          <div className="font-accent text-xs tracking-widest text-yellow-400/50 uppercase">18 Mai 2025</div>
          <div className="w-1 h-1 rounded-full bg-yellow-400/60" />
          <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-yellow-400/30" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="font-body text-base md:text-lg text-gray-300/70 leading-relaxed max-w-xl mx-auto"
        >
          E desde então nosso universo nunca mais foi o mesmo.
        </motion.p>

        {/* Floating stars decoration */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              width: `${3 + i}px`,
              height: `${3 + i}px`,
              background: '#D4AF37',
              borderRadius: '50%',
              boxShadow: `0 0 ${6 + i * 2}px rgba(212,175,55,0.6)`,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </motion.div>
    </section>
  )
}
