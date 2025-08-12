import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Button asChild>
        <Link href="/en">Return Home</Link>
      </Button>
    </div>
  )
}
