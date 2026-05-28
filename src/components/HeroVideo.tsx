'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

export default function HeroVideo() {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.querySelectorAll('h1, p, button'),
        {
          opacity: 0,
          y: 100,
          skewY: 10,
        },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power4.out',
        }
      )
    }
  }, [])

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-plumber-working-on-a-pipe-close-up-7821.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />

      <Canvas className="absolute inset-0 z-10 opacity-30">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Sphere args={[1, 100, 200]} scale={2}>
          <MeshDistortMaterial
            color="#22c55e"
            attach="material"
            distort={0.5}
            speed={5}
            roughness={0}
          />
        </Sphere>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      <div ref={textRef} className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-start max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
          <span className="block">Expert Plumbing</span>
          <span className="block text-plumb-green-400">Solutions</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-xl">
          Professional plumbing services for residential and commercial needs. 
          Emergency repairs, installations, and maintenance with guaranteed satisfaction.
        </p>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px hsl(var(--primary) / 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg bg-plumb-green-600 text-white font-semibold text-lg hover:bg-plumb-green-700 transition-all"
          >
            Book Service Now
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white/10 transition-all"
          >
            View Services
          </motion.button>
        </div>
      </div>
    </section>
  )
}