import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type SelectionChangedEvent,
} from 'ag-grid-community'
import { cn } from '@/lib/utils'
import {
  GRID_DEFAULT_COL_DEF,
  GRID_OVERLAY_LOADING,
  GRID_OVERLAY_NO_ROWS,
  GRID_PAGE_SIZE,
} from '@/components/grid/grid.constants'

ModuleRegistry.registerModules([AllCommunityModule])

interface AgDataGridProps<T extends object> {
  columnDefs: ColDef<T>[]
  rowData: T[]
  loading?: boolean
  className?: string
  height?: number | string
  onGridReady?: (api: GridApi<T>) => void
  quickFilterText?: string
  rowSelection?: boolean
  onSelectionChanged?: (selectedRows: T[]) => void
}

function AgDataGridInner<T extends object>({
  columnDefs,
  rowData,
  loading = false,
  className,
  height = 520,
  onGridReady,
  quickFilterText = '',
  rowSelection = false,
  onSelectionChanged,
}: AgDataGridProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null)

  const defaultColDef = useMemo<ColDef<T>>(
    () => ({ ...GRID_DEFAULT_COL_DEF }),
    [],
  )

  const handleGridReady = useCallback(
    (event: GridReadyEvent<T>) => {
      onGridReady?.(event.api)
    },
    [onGridReady],
  )

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent<T>) => {
      onSelectionChanged?.(event.api.getSelectedRows())
    },
    [onSelectionChanged],
  )

  useEffect(() => {
    const api = gridRef.current?.api
    if (!api) return
    if (loading) {
      api.showLoadingOverlay()
    } else if (!rowData.length) {
      api.showNoRowsOverlay()
    } else {
      api.hideOverlay()
    }
  }, [loading, rowData.length])

  return (
    <div
      className={cn(
        'ag-theme-alpine ag-theme-mvp w-full rounded-lg border border-border shadow-sm',
        className,
      )}
      style={{ height }}
      role="region"
      aria-label="Data grid"
    >
      <AgGridReact<T>
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
        pagination
        paginationPageSize={GRID_PAGE_SIZE}
        paginationPageSizeSelector={[15, 30, 50]}
        animateRows
        suppressCellFocus
        quickFilterText={quickFilterText}
        rowSelection={rowSelection ? { mode: 'singleRow', checkboxes: false } : undefined}
        overlayLoadingTemplate={`<span class="ag-overlay-loading-center">${GRID_OVERLAY_LOADING}</span>`}
        overlayNoRowsTemplate={`<span class="ag-overlay-no-rows-center">${GRID_OVERLAY_NO_ROWS}</span>`}
        onGridReady={handleGridReady}
        onSelectionChanged={rowSelection ? handleSelectionChanged : undefined}
        onRowDoubleClicked={
          rowSelection
            ? (event) => {
                if (event.data) {
                  event.api.setNodesSelected({
                    nodes: [event.node],
                    newValue: true,
                  })
                }
              }
            : undefined
        }
      />
    </div>
  )
}

export const AgDataGrid = memo(AgDataGridInner) as typeof AgDataGridInner
