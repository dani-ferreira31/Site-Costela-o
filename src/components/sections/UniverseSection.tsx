'use client'

import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { GALLERY_PHOTOS } from '@/data/gallery'

// Generates galaxy spiral positions
function getGalaxyPositions(count: number) {
  const positions: THREE.Vector3[] = []
  const branches = 3
  const spread = 0.4
  const radius = 8

  for (let i = 0; i < count; i++) {
    const r = Math.random() * radius
    const branchAngle = ((i % branches) / branches) * Math.PI * 2
    const spinAngle = r * 1.2
    const sx = (Math.random() - 0.5) * spread * r
    const sy = (Math.random() - 0.5) * spread * 0.5
    const sz = (Math.random() - 0.5) * spread * r

    positions.push(
      new THREE.Vector3(
        Math.cos(branchAngle + spinAngle) * r + sx,
        sy,
        Math.sin(branchAngle + spinAngle) * r + sz
      )
    )
  }

  return positions
}

// Generates heart shape positions
function getHeartPositions(count: number) {
  const positions: THREE.Vector3[] = []
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    const jitter = (Math.random() - 0.5) * 0.8
    positions.push(new THREE.Vector3((x + jitter) * 0.35, (y + jitter) * 0.35, (Math.random() - 0.5) * 1.5))
  }
  return positions
}

function PhotoPlane({
  src,
  position,
  targetPosition,
  morphing,
  index,
}: {
  src: string
  position: THREE.Vector3
  targetPosition: THREE.Vector3
  morphing: boolean
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const currentPos = useRef(position.clone())

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const target = morphing ? targetPosition : position
    currentPos.current.lerp(target, delta * (morphing ? 1.2 : 0.8))
    meshRef.current.position.copy(currentPos.current)
    meshRef.current.rotation.y += delta * 0.05
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial color="#D4AF37" transparent opacity={0.7} />
    </mesh>
  )
}

function GalaxyInner({ morphing }: { morphing: boolean }) {
  const count = Math.min(GALLERY_PHOTOS.length, 18)
  const galaxyPositions = useMemo(() => getGalaxyPositions(count), [count])
  const heartPositions = useMemo(() => getHeartPositions(count), [count])
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current && !morphing) {
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {galaxyPositions.map((pos, i) => (
        <PhotoPlane
          key={i}
          src={GALLERY_PHOTOS[i % GALLERY_PHOTOS.length].src}
          position={pos}
          targetPosition={heartPositions[i]}
          morphing={morphing}
          index={i}
        />
      ))}
    </group>
  )
}

export function UniverseSection() {
  const [morphing, setMorphing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMorphing(false)
    timerRef.current = setTimeout(() => setMorphing(true), 5000)
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => setMorphing(true), 5000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <section
      id="universo"
      className="relative py-24 overflow-hidden"
      aria-label="Universo das memórias 3D"
    >
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <motion.p
          className="font-accent text-xs tracking-[0.5em] uppercase text-yellow-400/60 mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ✦ Universo 3D ✦
        </motion.p>
        <motion.h2
          className="font-heading text-4xl md:text-6xl font-bold gradient-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Universo das Memórias
        </motion.h2>
        <motion.p
          className="text-gray-400/70 mt-4 max-w-md mx-auto text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Arraste para explorar nossa galáxia. Em alguns segundos, as memórias formam um coração.
        </motion.p>
      </div>

      {/* 3D Canvas */}
      <div
        className="relative mx-auto"
        style={{ height: '500px', maxWidth: '900px' }}
        onPointerDown={resetTimer}
        onWheel={resetTimer}
      >
        <Canvas camera={{ position: [0, 3, 18], fov: 60 }} gl={{ antialias: true }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color="#D4AF37" intensity={1.5} />
          <Suspense fallback={null}>
            <GalaxyInner morphing={morphing} />
          </Suspense>
          <OrbitControls
            enableZoom
            enablePan={false}
            minDistance={5}
            maxDistance={25}
            autoRotate={!morphing}
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Overlay text */}
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <motion.p
            className="font-accent text-xs text-yellow-400/40 tracking-widest uppercase"
            animate={{ opacity: morphing ? 1 : 0.5 }}
          >
            {morphing ? '✦ Memórias formando um coração ✦' : '✦ Arraste para explorar ✦'}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
