'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Clock, Droplet, Hammer, Wrench, Bath, PenTool } from 'lucide-react'

export default function Services() {
  const services = [
    { 
      icon: Droplet, 
      title: 'Emergency Repairs', 
      price: 'From R350', 
      desc: 'Leaking/faulty WC, pressure valves, leaking taps, burst pipes',
      color: 'plumb-blue'
    },
    { 
      icon: Wrench, 
      title: 'Sanitary & Brassware', 
      price: 'From R250', 
      desc: 'Repair / replacement of sanitary and brassware',
      color: 'plumb-green'
    },
    { 
      icon: Bath, 
      title: 'Geyser Replacement', 
      price: 'From R1500', 
      desc: 'Professional geyser installation and replacement',
      color: 'plumb-blue'
    },
    { 
      icon: PenTool, 
      title: 'Drain Cleaning', 
      price: 'From R200', 
      desc: 'Professional drain cleaning services',
      color: 'plumb-green'
    },
    { 
      icon: Hammer, 
      title: 'Construction Plumbing', 
      price: 'From R800', 
      desc: 'Hot/cold water reticulation, drainage, storm water',
      color: 'plumb-blue'
    },
    { 
      icon: Clock, 
      title: 'Tenant Installations', 
      price: 'From R250', 
      desc: 'Tenant installations and renovations',
      color: 'plumb-green'
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive plumbing solutions for every need
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
            >
              <Card className="p-8 h-full flex flex-col hover:shadow-xl transition-all perspective-1000">
                <div className={`w-14 h-14 rounded-lg bg-${service.color}-100 flex items-center justify-center mb-6`}>
                  <service.icon className={`h-8 w-8 text-${service.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-plumb-green-600 font-semibold mb-4">{service.price}</p>
                <p className="text-muted-foreground flex-grow">{service.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}