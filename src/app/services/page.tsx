'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Clock, Droplet, Hammer, Wrench, Bath, PenTool } from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
  const services = [ 
    { 
      id: '11111111-1111-1111-1111-111111111111',
      icon: Droplet, 
      title: 'Emergency Repairs', 
      price: 'From $150', 
      desc: 'Burst pipes, leaks, and urgent fixes handled fast',
      color: 'plumb-blue',
      details: [
        '24/7 emergency response',
        'Licensed and insured plumbers',
        'Fully stocked service vehicles',
        'Same-day service available'
      ]
    },
    { 
      id: '22222222-2222-2222-2222-222222222222',
      icon: Wrench, 
      title: 'Fixture Installation', 
      price: 'From $100', 
      desc: 'Faucets, sinks, toilets, and water heaters installed professionally',
      color: 'plumb-green',
      details: [
        'All brands and models supported',
        'Water-saving options available',
        'Old fixture removal included',
        'Clean-up and testing provided'
      ]
    },
    { 
      id: '33333333-3333-3333-3333-333333333333',
      icon: Bath, 
      title: 'Bathroom Remodeling', 
      price: 'From $500', 
      desc: 'Complete bathroom renovations with modern fixtures',
      color: 'plumb-blue',
      details: [
        'Design consultation included',
        'Custom tile and flooring options',
        'Plumbing and electrical work',
        'Project management from start to finish'
      ]
    },
    { 
      id: '44444444-4444-4444-4444-444444444444',
      icon: PenTool, 
      title: 'Drain Cleaning', 
      price: 'From $80', 
      desc: 'Professional drain unclogging and maintenance',
      color: 'plumb-green',
      details: [
        'Camera inspection available',
        'Eco-friendly solutions',
        'Preventative maintenance plans',
        'Guaranteed results'
      ]
    },
    { 
      id: '55555555-5555-5555-5555-555555555555',
      icon: Hammer, 
      title: 'Pipe Replacement', 
      price: 'From $200', 
      desc: 'Replace old or damaged pipes with modern solutions',
      color: 'plumb-blue',
      details: [
        'Trenchless options available',
        'Copper, PEX, and PVC piping',
        'Wall and floor repair included',
        '10-year warranty on workmanship'
      ]
    },
    { 
      id: '66666666-6666-6666-6666-666666666666',
      icon: Clock, 
      title: 'Maintenance', 
      price: 'From $75', 
      desc: 'Regular check-ups to prevent costly repairs',
      color: 'plumb-green',
      details: [
        'Annual plumbing inspections',
        'Water pressure testing',
        'Leak detection services',
        'Priority scheduling for members'
      ]
    },
  ]

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-black mb-4">Our Plumbing Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional, reliable, and affordable plumbing solutions for residential and commercial properties
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
                transition: { duration: 0.3 }
              }}
            >
              <Card className="p-8 h-full flex flex-col hover:shadow-xl transition-all">
                <div className={`w-16 h-16 rounded-lg bg-${service.color}-100 flex items-center justify-center mb-6`}>
                  <service.icon className={`h-10 w-10 text-${service.color}-600`} />
                </div>
                <h2 className="text-3xl font-bold mb-3">{service.title}</h2>
                <p className="text-plumb-green-600 font-semibold mb-4">{service.price}</p>
                <p className="text-muted-foreground flex-grow mb-6">{service.desc}</p>
                
                <div className="mt-auto pt-4">
                  <h3 className="text-lg font-semibold mb-2">What&apos;s Included:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {service.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6">
                  <Link href={`/book?service=${service.id}`} className="w-full bg-plumb-green-600 text-white py-3 px-6 rounded-lg text-center font-semibold hover:bg-plumb-green-700 transition-colors">
                    Book This Service
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 pt-16 border-t border-muted-foreground/20"
        >
          <h2 className="text-4xl font-black text-center mb-6">Ready to Book a Service?</h2>
          <p className="text-xl text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Our licensed plumbers are ready to help with any plumbing need, big or small
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/book`} className="flex-1 px-8 py-4 rounded-lg bg-white text-plumb-green-600 font-bold text-lg shadow-lg hover:shadow-xl transition-all">
              Book Service Now
            </Link>
            <Link href="/auth/login" className="flex-1 px-8 py-4 rounded-lg border-2 border-plumb-green-600 text-plumb-green-600 font-semibold text-lg hover:bg-plumb-green-600 hover:text-white transition-all">
              View Your Bookings
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
