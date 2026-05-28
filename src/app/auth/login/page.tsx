'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [supabaseReady, setSupabaseReady] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        setSupabase(createClient())
        setSupabaseReady(true)
      } catch {
        setSupabaseReady(false)
      }
    }
    initSupabase()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-plumb-green-50 to-plumb-blue-50 p-4">
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
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {supabaseReady && supabase ? (
          <div className="bg-card rounded-2xl shadow-xl p-8">
            <AuthForm supabase={supabase} />
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-xl p-8 text-center">
            <p className="text-muted-foreground mb-4">Configure Supabase environment variables to enable authentication</p>
            <Link href="/" className="text-plumb-green-600 hover:underline font-medium">
              Back to home
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function AuthForm({ supabase }: { supabase: any }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (mode === 'signIn') {
        await supabase.auth.signInWithPassword({ email, password })
      } else {
        await supabase.auth.signUp({ email, password })
      }
    } catch (error) {
      console.error(error)
    }
    
    setLoading(false)
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
        {loading ? 'Loading...' : (mode === 'signIn' ? 'Sign In' : 'Sign Up')}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
        className="w-full text-sm text-plumb-green-600"
      >
        {mode === 'signIn' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
      </button>
    </form>
  )
}