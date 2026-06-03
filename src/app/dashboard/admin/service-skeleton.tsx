'use client'

export default function ServiceSkeleton() {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-muted rounded" />
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
