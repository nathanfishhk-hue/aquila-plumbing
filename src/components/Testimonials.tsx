'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Downtown',
      rating: 5,
      text: 'Aquila Plumbing saved us during a major leak emergency. Quick response and excellent work!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'Mike Chen',
      location: 'Westside',
      rating: 5,
      text: 'Professional installation of our new bathroom fixtures. Clean, efficient, and affordable.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      name: 'Lisa Rodriguez',
      location: 'North Hills',
      rating: 5,
      text: 'Best plumbing service I\'ve used. The team was friendly and explained everything clearly.',
      avatar: 'https://images.unsplash.com/photo-1438761745064-5d64a96271b4?w=100&h=100&fit=crop',
    },
  ]

  return (
    <section className="py-24 bg-plumb-blue-900 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black mb-4">What Our Customers Say</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur rounded-xl p-8"
            >
              <div className="flex mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="mb-6 text-lg">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={50}
                  height={50}
                  className="rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-300">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}