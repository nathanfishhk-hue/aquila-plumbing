'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [debug, setDebug] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      setErrorMsg(null)
      setDebug('Starting callback...')

      try {
        await supabase.auth.getSession()
        setDebug('Attempting signInWithOAuth callback...')

        const hash = window.location.hash
        const params = new URLSearchParams(window.location.search)

        setDebug(`Hash present: ${!!hash}, Code present: ${!!params.get('code')}`)

        if (hash && hash.includes('access_token')) {
          const accessToken = new URLSearchParams(hash.substring(1)).get('access_token')
          const refreshToken = new URLSearchParams(hash.substring(1)).get('refresh_token')

          if (accessToken) {
            setDebug('Exchanging access_token for session...')
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken!,
            })

            if (sessionError) {
              setDebug(`setSession error: ${sessionError.message}`)
            }
          }
        }

        const { data: sessionData } = await supabase.auth.getSession()

        if (sessionData.session) {
          setDebug(`Session found for user: ${sessionData.session.user.email}`)
          setTimeout(() => router.replace('/'), 500)
        } else {
          setDebug('No session after all attempts')
          if (params.get('error')) {
            setDebug(`OAuth error: ${params.get('error_description') || params.get('error')}`)
          }
          setErrorMsg('Authentication failed. Please try again.')
          setTimeout(() => router.replace('/auth'), 3000)
        }
      } catch (err: any) {
        setDebug(`Exception: ${err.message || err}`)
        setErrorMsg(`Exception: ${err.message || err}`)
        setTimeout(() => router.replace('/auth'), 3000)
      }
    }

    handleCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-plumb-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Completing sign in...</p>
        {debug && <p className="text-xs text-muted-foreground/60 max-w-md mx-auto break-all">{debug}</p>}
        {errorMsg && (
          <div className="space-y-2">
            <p className="text-red-600 font-medium">{errorMsg}</p>
            <p className="text-sm text-muted-foreground">Redirecting to auth page...</p>
          </div>
        )}
      </div>
    </div>
  )
}
