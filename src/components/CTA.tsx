'use client'

import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-plumb-green-600 to-plumb-blue-600 text-white">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-black mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Create your plumbing business account and start managing bookings today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register/business"
              className="inline-block px-8 py-4 rounded-lg bg-white text-plumb-green-600 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Create Your Business
            </Link>
            <Link
              href="/auth"
              className="inline-block px-8 py-4 rounded-lg border-2 border-white text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}