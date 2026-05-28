'use client'

import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-plumb-blue-50 to-plumb-green-50 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-black bg-gradient-to-r from-plumb-green-600 to-plumb-blue-600 bg-clip-text text-transparent mb-4">
          Aquila Plumbing
        </h1>
        <p className="text-muted-foreground mb-8">
          Registration requires Supabase configuration. 
          Please configure your environment variables.
        </p>
        <Link href="/auth/login" className="text-plumb-green-600 hover:underline font-medium">
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}