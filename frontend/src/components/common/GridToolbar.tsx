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
  className?: string
}

export const GridToolbar = memo(function GridToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  onExport,
  actions,
  className,
}: GridToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <SearchBox
        value={search}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      <div className="flex flex-wrap items-center gap-2">
        {onExport ? (
          <Button variant="outline" size="sm" onClick={onExport} type="button">
            <Download className="size-4" aria-hidden />
            Export CSV
          </Button>
        ) : null}
        {actions}
      </div>
    </div>
  )
})
