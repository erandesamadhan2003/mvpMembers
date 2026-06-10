import { memo, type ReactNode } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBox } from '@/components/common/SearchBox'
import { cn } from '@/lib/utils'

interface GridToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onExport?: () => void
  actions?: ReactNode
  filters?: ReactNode
  className?: string
}

export const GridToolbar = memo(function GridToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  onExport,
  actions,
  filters,
  className,
}: GridToolbarProps) {
  return (
    <div
      className={cn(
        'border-b border-border/50 pb-4',
        className,
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBox
            value={search}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="h-9 w-full min-w-50 max-w-xs"
          />
          {filters}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {onExport ? (
            <Button variant="outline" size="sm" onClick={onExport} type="button">
              <Download className="size-4" aria-hidden />
              Export CSV
            </Button>
          ) : null}
          {actions}
        </div>
      </div>
    </div>
  )
})