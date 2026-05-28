'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Clock, Droplet } from 'lucide-react'

export default function Features() {
  const features = [
    { icon: Zap, title: '24/7 Emergency', desc: 'Available anytime for urgent repairs' },
    { icon: Shield, title: 'Licensed Experts', desc: 'Certified professionals you can trust' },
    { icon: Clock, title: 'On-Time Guarantee', desc: 'We arrive when promised' },
    { icon: Droplet, title: 'Water Quality', desc: 'Clean, safe, and lasting solutions' },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black mb-4">Why Choose Us</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional, reliable, and guaranteed plumbing services
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-card rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-plumb-green-100 flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-plumb-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}