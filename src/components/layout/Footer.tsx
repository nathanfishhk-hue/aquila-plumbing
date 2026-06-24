'use client'

import Link from 'next/link'
import { Wrench, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
// motion import removed

export default function Footer() {
  return (
    <footer className="bg-plumb-blue-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Wrench className="h-8 w-8 text-plumb-green-400" />
              <span className="text-2xl font-bold">Punctual Plumbers</span>
            </Link>
            <p className="text-gray-300">
              Medium to large commercial and industrial projects, residential blocks, office parks, shopping malls and warehouses.
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
                <span>+27 83 237 9132 (Steven Freislich)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>punctualplumbers@outlook.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Garden Route, South Africa</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <span className="text-gray-300 hover:text-plumb-green-400 transition-transform hover:scale-110 inline-block cursor-pointer">
                <Facebook className="h-6 w-6" />
              </span>
              <span className="text-gray-300 hover:text-plumb-green-400 transition-transform hover:scale-110 inline-block cursor-pointer">
                <Instagram className="h-6 w-6" />
              </span>
              <span className="text-gray-300 hover:text-plumb-green-400 transition-transform hover:scale-110 inline-block cursor-pointer">
                <Twitter className="h-6 w-6" />
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-plumb-blue-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2023 Punctual Plumbers. All rights reserved. | Garden Route</p>
        </div>
      </div>
    </footer>
  )
}