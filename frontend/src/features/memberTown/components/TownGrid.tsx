import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { ColDef, GridApi } from 'ag-grid-community'
import { AgDataGrid } from '@/components/grid/AgDataGrid'
import { exportGridToCsv } from '@/components/grid/exportCsv'
import { useGridQuickFilter } from '@/components/grid/useGridQuickFilter'
import { GridToolbar } from '@/components/common/GridToolbar'
import { GridSelectionBar } from '@/components/common/GridSelectionBar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import {
  useDeleteMemberTownMutation,
  useMemberTownsQuery,
} from '@/features/memberTown/hooks'
import type { MemberTown } from '@/features/memberTown/types/memberTown.types'
import { TownFormDialog } from '@/features/memberTown/components/TownFormDialog'
import { getApiErrorMessage } from '@/api'

type DialogMode = 'view' | 'edit' | null

export const TownGrid = memo(function TownGrid({ onAdd }: { onAdd: () => void }) {
  const gridApiRef = useRef<GridApi<MemberTown> | null>(null)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading, isError, error } = useMemberTownsQuery()
  const deleteMutation = useDeleteMemberTownMutation()

  const [selected, setSelected] = useState<MemberTown | null>(null)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [deleteTarget, setDeleteTarget] = useState<MemberTown | null>(null)

  const columnDefs = useMemo<ColDef<MemberTown>[]>(
    () => [
      { field: 'townID', headerName: 'Town ID', minWidth: 120, maxWidth: 140 },
      {
        field: 'townName',
        headerName: 'Town Name',
        flex: 2,
        minWidth: 200,
        cellClass: 'font-medium',
      },
    ],
    [],
  )

  const handleSelectionChanged = useCallback((rows: MemberTown[]) => {
    setSelected(rows[0] ?? null)
  }, [])

  const openDialog = useCallback((mode: DialogMode) => {
    if (selected) setDialogMode(mode)
  }, [selected])

  return (
    <div className="space-y-4">
      <GridToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search towns..."
        onExport={() => exportGridToCsv(gridApiRef.current, 'member-towns')}
        actions={<Button onClick={onAdd}>Add Town</Button>}
      />

      <GridSelectionBar
        hasSelection={Boolean(selected)}
        selectedLabel={selected?.townName ?? null}
        selectedMeta={selected ? `ID ${selected.townID}` : null}
        emptyLabel="Select a row to view, update, or delete a town."
        onView={() => openDialog('view')}
        onEdit={() => openDialog('edit')}
        onDelete={() => selected && setDeleteTarget(selected)}
      />

      {isError ? (
        <p className="text-base text-destructive">{getApiErrorMessage(error)}</p>
      ) : null}

      <AgDataGrid
        rowData={data}
        columnDefs={columnDefs}
        loading={isLoading}
        quickFilterText={quickFilterText}
        rowSelection
        onSelectionChanged={handleSelectionChanged}
        onGridReady={(api) => {
          gridApiRef.current = api
        }}
      />

      <TownFormDialog
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
        town={selected}
        readOnly={dialogMode === 'view'}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Member Town"
        description={`Delete "${deleteTarget?.townName}"?`}
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMutation.mutateAsync(deleteTarget.organizationMemberTownID)
            setDeleteTarget(null)
            setSelected(null)
          }
        }}
      />
    </div>
  )
})