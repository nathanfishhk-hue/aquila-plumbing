'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, OrbitControls, Sphere } from '@react-three/drei'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useEffect } from 'react'

interface AnimatedSphereProps {
  scrollY: number
}

function AnimatedSphere({ scrollY }: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2
    meshRef.current.rotation.y += delta * 0.3
    meshRef.current.scale.setScalar(2 + Math.sin(state.clock.elapsedTime) * 0.1)
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 100, 200]}
      scale={2}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshTransmissionMaterial
        color="#22c55e"
        transmission={0.8}
        thickness={1}
        roughness={0}
        metalness={0.2}
        chromaticAberration={0.2}
        distortion={hovered ? 0.3 : 0}
      />
    </Sphere>
  )
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedSphere scrollY={scrollY} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  )
}