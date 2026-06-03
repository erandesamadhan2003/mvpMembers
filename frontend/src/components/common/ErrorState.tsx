import { memo } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export const ErrorState = memo(function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-12 text-center',
        className,
      )}
      role="alert"
    >
      <AlertCircle className="mb-3 size-10 text-destructive" aria-hidden />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button className="mt-4" variant="outline" onClick={onRetry} type="button">
          Try again
        </Button>
      ) : null}
    </div>
  )
})
