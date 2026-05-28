'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState } from 'react'

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
    <mesh
      ref={meshRef}
      scale={2}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 100, 200]} />
      <MeshTransmissionMaterial
        color="#22c55e"
        transmission={0.8}
        thickness={1}
        roughness={0}
        metalness={0.2}
        chromaticAberration={0.2}
        distortion={hovered ? 0.3 : 0}
      />
    </mesh>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <AnimatedSphere scrollY={0} />
    </Canvas>
  )
}