import { memo } from 'react'
import type { ICellRendererParams } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface GridActionHandlers<T> {
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
}

export function createActionsCellRenderer<T>() {
  return memo(function ActionsCell(params: ICellRendererParams<T>) {
    const ctx = params.context as GridActionHandlers<T> | undefined
    const row = params.data
    if (!row || !ctx) return null

    return (
      <div className="flex h-full items-center gap-1">
        {ctx.onView ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="View row"
            onClick={() => ctx.onView?.(row)}
          >
            <Eye className="size-4" />
          </Button>
        ) : null}
        {ctx.onEdit ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Edit row"
            onClick={() => ctx.onEdit?.(row)}
          >
            <Pencil className="size-4" />
          </Button>
        ) : null}
        {ctx.onDelete ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Delete row"
            onClick={() => ctx.onDelete?.(row)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        ) : null}
      </div>
    )
  })
}
