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
  useDeleteMemberCenterMutation,
  useMemberCentersQuery,
} from '@/features/memberCenter/hooks'
import type { MemberCenter } from '@/features/memberCenter/types/memberCenter.types'
import { CenterFormDialog } from '@/features/memberCenter/components/CenterFormDialog'
import { getApiErrorMessage } from '@/api'

type DialogMode = 'view' | 'edit' | null

export const CenterGrid = memo(function CenterGrid({ onAdd }: { onAdd: () => void }) {
  const gridApiRef = useRef<GridApi<MemberCenter> | null>(null)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading, isError, error } = useMemberCentersQuery()
  const deleteMutation = useDeleteMemberCenterMutation()

  const [selected, setSelected] = useState<MemberCenter | null>(null)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [deleteTarget, setDeleteTarget] = useState<MemberCenter | null>(null)

  const columnDefs = useMemo<ColDef<MemberCenter>[]>(
    () => [
      {
        field: 'organizationMemberCenterID',
        headerName: 'ID',
        minWidth: 90,
        maxWidth: 110,
      },
      { field: 'centerID', headerName: 'Center ID', minWidth: 120, maxWidth: 140 },
      {
        field: 'centerName',
        headerName: 'Center Name',
        flex: 2,
        minWidth: 180,
        cellClass: 'font-medium',
      },
      {
        headerName: 'Town',
        minWidth: 140,
        valueGetter: (p) => p.data?.organizationMemberTown?.townName ?? '—',
        flex: 1,
      },
    ],
    [],
  )

  const handleSelectionChanged = useCallback((rows: MemberCenter[]) => {
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
        searchPlaceholder="Search centers..."
        onExport={() => exportGridToCsv(gridApiRef.current, 'member-centers')}
        actions={<Button onClick={onAdd}>Add Center</Button>}
      />

      <GridSelectionBar
        hasSelection={Boolean(selected)}
        selectedLabel={selected?.centerName ?? null}
        selectedMeta={selected?.organizationMemberTown?.townName ?? null}
        emptyLabel="Select a row to view, update, or delete a center."
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

      <CenterFormDialog
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
        center={selected}
        readOnly={dialogMode === 'view'}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Member Center"
        description={`Delete "${deleteTarget?.centerName}"?`}
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMutation.mutateAsync(deleteTarget.organizationMemberCenterID)
            setDeleteTarget(null)
            setSelected(null)
          }
        }}
      />
    </div>
  )
})