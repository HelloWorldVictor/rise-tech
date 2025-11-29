import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'card'
  text?: string
  className?: string
}

export function LoadingState({
  variant = 'spinner',
  text = 'Loading...',
  className,
}: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4 py-12',
          className,
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-4', className)}>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div
        className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-6">
            <Skeleton className="mb-4 h-32 w-full rounded-md" />
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return null
}

interface PageLoadingProps {
  title?: string
}

export function PageLoading({ title }: PageLoadingProps) {
  return (
    <div className="space-y-6">
      {title && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-6">
            <Skeleton className="mb-2 h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border">
        <div className="border-b p-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
