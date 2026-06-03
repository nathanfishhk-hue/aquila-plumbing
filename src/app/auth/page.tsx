'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Chrome } from 'lucide-react'

type Mode = 'signIn' | 'signUp'

export default function AuthPage() {
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current
  const [mode, setMode] = useState<Mode>('signIn')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmRequired, setConfirmRequired] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })
    } catch (_error: any) {
      console.error('Google sign-in error:', _error)
      setError(_error?.message || 'Unable to connect to Google. Please try again.')
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({
          email: (e.currentTarget.elements.namedItem('email') as any).value,
          password: (e.currentTarget.elements.namedItem('password') as any).value,
        })
        if (error) setError(error.message)
      } else {
        const { error, data } = await supabase.auth.signUp({
          email: (e.currentTarget.elements.namedItem('email') as any).value,
          password: (e.currentTarget.elements.namedItem('password') as any).value,
          options: {
            emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
          },
        })
        if (error) {
          setError(error.message)
        } else if (data?.user && !data.session) {
          setError(null)
          setConfirmRequired(true)
        }
      }
    } catch {
      setError('Unexpected error occurred')
    }

    setLoading(false)
  }

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
          <p className="text-muted-foreground">
            {mode === 'signIn' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {confirmRequired && (
          <div className="p-4 rounded-lg bg-blue-50 text-blue-700 text-sm text-center">
            Check your email for a confirmation link. Once verified, you can sign in.
          </div>
        )}

        <div className="bg-card rounded-2xl shadow-xl p-8 space-y-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <Chrome className="h-5 w-5" />
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
              required
              minLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-plumb-green-600 text-white rounded-lg font-medium hover:bg-plumb-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : mode === 'signIn' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {mode === 'signIn' ? "Don&apos;t have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
            className="text-plumb-green-600 hover:underline font-medium"
          >
            {mode === 'signIn' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
