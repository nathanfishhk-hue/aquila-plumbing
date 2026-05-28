'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-plumb-blue-50 to-plumb-green-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-black bg-gradient-to-r from-plumb-green-600 to-plumb-blue-600 bg-clip-text text-transparent mb-2">
              Aquila Plumbing
            </h1>
          </Link>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-plumb-green-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

function RegisterForm() {
  const [supabase, setSupabase] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        setSupabase(createClient())
      } catch {
        setSupabase(null)
      }
    }
    initSupabase()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (supabase) {
        await supabase.auth.signUp({ email, password })
      }
    } catch (_error) {
      console.error('Registration failed')
    }
    
    setLoading(false)
  }

  if (!supabase) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Configure Supabase environment variables to enable registration</p>
        <Link href="/auth/login" className="text-plumb-green-600 hover:underline font-medium">
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-plumb-green-600 text-white rounded-lg"
      >
        {loading ? 'Loading...' : 'Sign Up'}
      </button>
    </form>
  )
}