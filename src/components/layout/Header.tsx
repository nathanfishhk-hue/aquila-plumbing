'use client'

import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import { Wrench, LogOut, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

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
      setMobileOpen(false)
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Wrench className="h-8 w-8 text-plumb-green-600" />
<span className="text-2xl font-bold bg-gradient-to-r from-plumb-green-600 to-plumb-blue-600 bg-clip-text text-transparent">
              Punctual Plumbers
            </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-plumb-green-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
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
            <Link href="/auth">
              <button className="px-4 py-2 rounded-lg bg-plumb-green-600 text-white hover:bg-plumb-green-700 transition-colors">
                Sign In
              </button>
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground hover:text-plumb-green-600 transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t">
                {user ? (
                  <>
                    <Link href="/dashboard/user" onClick={() => setMobileOpen(false)}>
                      <button className="w-full px-4 py-2 rounded-lg bg-plumb-green-600 text-white hover:bg-plumb-green-700 transition-colors mb-2">
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 rounded-lg border border-plumb-green-600 text-plumb-green-600 hover:bg-plumb-green-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-4 py-2 rounded-lg bg-plumb-green-600 text-white hover:bg-plumb-green-700 transition-colors">
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
