'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Stars({ count = 3000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 50 + Math.random() * 150

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      sizes[i] = Math.random() * 2.5 + 0.3

      // Warm star colors
      const isGold = Math.random() < 0.15
      const isWarm = Math.random() < 0.3
      if (isGold) {
        colors[i * 3] = 0.83; colors[i * 3 + 1] = 0.69; colors[i * 3 + 2] = 0.22
      } else if (isWarm) {
        colors[i * 3] = 0.95; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.7
      } else {
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0
      }
    }

    return { positions, sizes, colors }
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.015
    meshRef.current.rotation.x = Math.sin(t * 0.005) * 0.05
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  )
}

function NebulaCloud({ position, color, scale }: {
  position: [number, number, number]
  color: string
  scale: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.material.opacity = 0.04 + Math.sin(t * 0.3) * 0.02
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.05} depthWrite={false} />
    </mesh>
  )
}

export function StarField() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Stars count={3500} />
        {/* Nebula clouds */}
        <NebulaCloud position={[-30, 20, -80]} color="#4a1a6a" scale={25} />
        <NebulaCloud position={[40, -15, -100]} color="#1a2a5a" scale={30} />
        <NebulaCloud position={[0, 30, -70]} color="#2a1a4a" scale={20} />
        <NebulaCloud position={[-20, -30, -90]} color="#1a3a2a" scale={22} />
      </Canvas>
    </div>
  )
}
