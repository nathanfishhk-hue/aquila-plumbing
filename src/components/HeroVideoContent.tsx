'use client'

import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

export default function HeroVideoContent() {
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
    <section className="relative h-screen w-full overflow-hidden">
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

      <div className="absolute inset-0 z-10 opacity-20 flex items-center justify-center">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
            scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="w-64 h-64 border-4 border-plumb-green-400 rounded-full"
        />
      </div>

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