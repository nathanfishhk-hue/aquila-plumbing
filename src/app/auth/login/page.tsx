'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [supabaseReady, setSupabaseReady] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    try {
      const client = createClient()
      setSupabase(client)
      setSupabaseReady(true)
    } catch (error) {
      console.error('Supabase client initialization failed:', error)
    }
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
            <Auth
              supabaseClient={supabase}
              providers={['google', 'github']}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                    },
                  },
                },
              }}
              socialLayout="horizontal"
            />
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-xl p-8 text-center">
            <p className="text-muted-foreground">Configure Supabase environment variables to enable authentication</p>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-plumb-green-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  )
}