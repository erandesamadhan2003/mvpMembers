import { memo, type ReactNode } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GridSelectionBarProps {
  selectedLabel?: string | null
  selectedMeta?: string | null
  emptyLabel: string
  hasSelection: boolean
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showView?: boolean
  extraActions?: ReactNode
  className?: string
}

export const GridSelectionBar = memo(function GridSelectionBar({
  selectedLabel,
  selectedMeta,
  emptyLabel,
  hasSelection,
  onView,
  onEdit,
  onDelete,
  showView = true,
  extraActions,
  className,
}: GridSelectionBarProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {showView && onView ? (
          <Button
            type="button"
            variant="outline"
            disabled={!hasSelection}
            onClick={onView}
          >
            <Eye className="size-4" aria-hidden />
            View
          </Button>
        ) : null}
        {onEdit ? (
          <Button
            type="button"
            variant="outline"
            disabled={!hasSelection}
            onClick={onEdit}
          >
            <Pencil className="size-4" aria-hidden />
            Update
          </Button>
        ) : null}
        {onDelete ? (
          <Button
            type="button"
            variant="outline"
            disabled={!hasSelection}
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="size-4" aria-hidden />
            Delete
          </Button>
        ) : null}
        {extraActions}
      </div>

      {/* {hasSelection && selectedLabel ? (
        <p className="rounded-md border border-primary/20 bg-primary/5 px-4 py-2.5 text-base text-foreground">
          Selected: <span className="font-semibold">{selectedLabel}</span>
          {selectedMeta ? (
            <span className="text-muted-foreground"> · {selectedMeta}</span>
          ) : null}
        </p>
      ) : (
        <p className="text-base text-muted-foreground">{emptyLabel}</p>
      )} */}
    </div>
  )
})
