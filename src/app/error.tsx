'use client';

// Disable static generation for this client-side page
export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6">
        An error occurred while loading this page.
      </p>
      <Button onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
