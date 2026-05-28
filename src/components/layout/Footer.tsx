'use client'

import Link from 'next/link'
import { Wrench, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-plumb-blue-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Wrench className="h-8 w-8 text-plumb-green-400" />
              <span className="text-2xl font-bold">Aquila Plumbing</span>
            </Link>
            <p className="text-gray-300">
              Professional plumbing services you can trust. Available 24/7 for emergencies.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/services/emergency" className="hover:text-plumb-green-400 transition-colors">Emergency Plumbing</Link></li>
              <li><Link href="/services/installation" className="hover:text-plumb-green-400 transition-colors">Installation</Link></li>
              <li><Link href="/services/repair" className="hover:text-plumb-green-400 transition-colors">Repair & Maintenance</Link></li>
              <li><Link href="/services/drain" className="hover:text-plumb-green-400 transition-colors">Drain Cleaning</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@aquilaplumbing.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Main St, Your City</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <motion.a href="#" whileHover={{ scale: 1.2 }} className="text-gray-300 hover:text-plumb-green-400">
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.2 }} className="text-gray-300 hover:text-plumb-green-400">
                <Instagram className="h-6 w-6" />
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.2 }} className="text-gray-300 hover:text-plumb-green-400">
                <Twitter className="h-6 w-6" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-plumb-blue-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Aquila Plumbing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}