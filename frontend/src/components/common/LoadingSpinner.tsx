import { memo } from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'size-5', md: 'size-8', lg: 'size-12' }

export const LoadingSpinner = memo(function LoadingSpinner({
  label = 'Loading...',
  className,
  size = 'md',
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-primary/30 border-t-primary',
          sizeMap[size],
        )}
        aria-hidden
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
})
