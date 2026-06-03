'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

type Plan = {
  id: 'free' | 'pro' | 'enterprise'
  name: string
  price: number
  description: string
  features: string[]
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Basic plumbing services',
    features: ['Up to 10 services', 'Basic support', '7 days trial'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    description: 'Professional plumbing business',
    features: ['Unlimited services', 'Priority support', 'Advanced analytics', 'Email notifications'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    description: 'Large plumbing business',
    features: ['Unlimited services', '24/7 support', 'Advanced analytics', 'SMS notifications', 'Custom integrations'],
  },
]

export default function TenantRegistrationPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    plan: 'free' as Plan['id'],
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.businessName,
          email: formData.email,
          subscription_plan: formData.plan,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create business account')
        return
      }

      if (data.subscriptionUrl) {
        router.push(data.subscriptionUrl)
      } else {
        router.push(`/dashboard/admin?tenant=${data.tenant.slug}`)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-plumb-blue-50 to-plumb-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <h1 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-plumb-green-600 to-plumb-blue-600 bg-clip-text text-transparent">
          Create Your Business
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Set up your plumbing business in minutes
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Business Information</h2>
              <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
                    placeholder="e.g., Smith Plumbing Co."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
                    placeholder="business@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-plumb-green-600 text-white rounded-lg font-medium hover:bg-plumb-green-700 transition-colors"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      formData.plan === plan.id
                        ? 'border-plumb-green-600 bg-plumb-green-50'
                        : 'border-gray-200 hover:border-plumb-green-300'
                    }`}
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                  >
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-3xl font-black my-2">
                      R{plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-plumb-green-600 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-plumb-green-600 text-white rounded-lg font-medium hover:bg-plumb-green-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Business'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}