'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const dynamic = 'force-dynamic'

export default function AuthRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/auth')
  }, [router])
  return null
}
