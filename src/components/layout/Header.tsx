'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wrench, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const client = createClient()
        setSupabase(client)
        
        const { data: { user } } = await client.auth.getUser()
        setUser(user)
        
        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null)
        })
        
        return () => subscription.unsubscribe()
      } catch (_error) {
        console.error('Supabase initialization failed')
      }
    }
    
    initSupabase()
  }, [])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      setUser(null)
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Wrench className="h-8 w-8 text-plumb-green-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-plumb-green-600 to-plumb-blue-600 bg-clip-text text-transparent">
            Aquila Plumbing
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-foreground hover:text-plumb-green-600 transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-foreground hover:text-plumb-green-600 transition-colors">
            Services
          </Link>
          <Link href="/about" className="text-foreground hover:text-plumb-green-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-foreground hover:text-plumb-green-600 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard/user">
                <button className="px-4 py-2 rounded-lg bg-plumb-green-600 text-white hover:bg-plumb-green-700 transition-colors">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link href="/auth/login">
              <button className="px-4 py-2 rounded-lg bg-plumb-green-600 text-white hover:bg-plumb-green-700 transition-colors">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  )
}