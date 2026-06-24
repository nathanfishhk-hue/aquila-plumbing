'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function HeroVideo() {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      const elements = textRef.current.querySelectorAll('h1, p, a, button')
      elements.forEach((el, i) => {
        el.setAttribute('style', `opacity:0;transform:translateY(30px);transition:opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`)
      })
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          elements.forEach((el) => {
            el.setAttribute('style', el.getAttribute('style')?.replace('opacity:0', 'opacity:1')?.replace('translateY(30px)', 'translateY(0)') || 'opacity:1;transform:translateY(0)')
          })
        })
      })
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
        <div className="w-64 h-64 border-4 border-plumb-green-400 rounded-full" />
      </div>

      <div ref={textRef} className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-start max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
          <span className="block">Punctual Plumbers</span>
          <span className="block text-plumb-green-400">Construction & Maintenance</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-xl">
          Professional plumbing services for commercial and industrial projects.
          Quality control and assurance with SABS and SANS compliance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/book"
            className="px-8 py-4 rounded-lg bg-plumb-green-600 text-white font-semibold text-lg hover:bg-plumb-green-700 transition-all shadow-lg"
          >
            Book Service Now
          </Link>
          <Link
            href="/services"
            className="px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white/10 transition-all"
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  )
}
