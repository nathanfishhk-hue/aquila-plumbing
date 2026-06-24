'use client'

import { Card } from '@/components/ui/card'
import { Clock, Droplet, Hammer, Wrench, Bath, PenTool } from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
  const services = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      icon: Droplet,
      title: 'Emergency Repairs',
      price: 'From R350',
      desc: 'Leaking/faulty WC, pressure valves, leaking taps, burst pipes',
      color: 'plumb-blue',
      details: [
        'Leaking / faulty WC',
        'Pressure valves',
        'Leaking taps',
        'Repair / replacement of burst pipes',
      ],
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      icon: Wrench,
      title: 'Sanitary & Brassware',
      price: 'From R250',
      desc: 'Repair / replacement of sanitary and brassware',
      color: 'plumb-green',
      details: [
        'All brands supported',
        'Commercial-grade installations',
        'Certificate of compliance issued',
      ],
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      icon: Bath,
      title: 'Geyser Replacement',
      price: 'From R1500',
      desc: 'Professional geyser installation and replacement',
      color: 'plumb-blue',
      details: [
        'All geyser types',
        'SABS compliant installation',
        'Certificate of compliance',
      ],
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      icon: PenTool,
      title: 'Drain Cleaning',
      price: 'From R200',
      desc: 'Professional drain cleaning services',
      color: 'plumb-green',
      details: [
        'Drain cleaning',
        'Maintenance services',
      ],
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      icon: Hammer,
      title: 'Construction Services',
      price: 'From R800',
      desc: 'Hot/cold water reticulation, drainage, storm water',
      color: 'plumb-blue',
      details: [
        'Hot and cold water reticulation',
        'Soil drainage above and below ground',
        'Storm water and rain water disposal',
        'Fire reticulation systems',
      ],
    },
    {
      id: '66666666-6666-6666-6666-666666666666',
      icon: Clock,
      title: 'Tenant Installations',
      price: 'From R250',
      desc: 'Tenant installations and renovations',
      color: 'plumb-green',
      details: [
        'Tenant installations',
        'Renovations',
      ],
    },
  ]

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Construction and maintenance plumbing solutions for commercial and industrial projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="p-8 h-full flex flex-col hover:shadow-xl transition-all">
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
                <Link href="/book" className="w-full bg-plumb-green-600 text-white py-3 px-6 rounded-lg text-center font-semibold hover:bg-plumb-green-700 transition-colors">
                  Book This Service
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-20 pt-16 border-t border-muted-foreground/20">
          <h2 className="text-4xl font-black text-center mb-6">Ready to Book a Service?</h2>
          <p className="text-xl text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Our team handles all construction and maintenance projects across Garden Route
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="flex-1 px-8 py-4 rounded-lg bg-white text-plumb-green-600 font-bold text-lg shadow-lg hover:shadow-xl transition-all">
              Book Service Now
            </Link>
            <Link href="/dashboard/user" className="flex-1 px-8 py-4 rounded-lg border-2 border-plumb-green-600 text-plumb-green-600 font-semibold text-lg hover:bg-plumb-green-600 hover:text-white transition-all">
              View Your Bookings
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
