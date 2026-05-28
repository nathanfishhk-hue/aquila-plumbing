'use client'

import { ThemeProvider } from 'next-themes'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

export function Providers({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}