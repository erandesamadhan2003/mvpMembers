import { memo, type ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export const EmptyState = memo(function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center',
        className,
      )}
    >
      <Inbox className="mb-4 size-10 text-muted-foreground" aria-hidden />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
})
