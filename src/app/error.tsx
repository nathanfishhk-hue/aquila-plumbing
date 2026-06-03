'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-plumb-blue-50 to-plumb-green-50 p-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-3xl font-black text-gray-900">Something went wrong</h2>
        <p className="text-muted-foreground">{error.message || 'An unexpected error occurred'}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-plumb-green-600 text-white rounded-lg font-medium hover:bg-plumb-green-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
