import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { ColDef, GridApi, ICellRendererParams } from 'ag-grid-community'
import { Pencil, Trash2 } from 'lucide-react'
import { AgDataGrid } from '@/components/grid/AgDataGrid'
import { exportGridToCsv } from '@/components/grid/exportCsv'
import { useGridQuickFilter } from '@/components/grid/useGridQuickFilter'
import { GridToolbar } from '@/components/common/GridToolbar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  useDeleteMemberCenterMutation,
  useMemberCentersQuery,
} from '@/features/memberCenter/hooks'
import type { MemberCenter } from '@/features/memberCenter/types/memberCenter.types'
import { CenterFormDialog } from '@/features/memberCenter/components/CenterFormDialog'
import { getApiErrorMessage } from '@/api'

function CenterActionsCell(
  params: ICellRendererParams<MemberCenter> & {
    onEdit: (row: MemberCenter) => void
    onDelete: (row: MemberCenter) => void
  },
) {
  const row = params.data
  if (!row) return null
  return (
    <div className="flex h-full items-center gap-1">
      <Button type="button" variant="ghost" size="icon-xs" onClick={() => params.onEdit(row)}>
        <Pencil className="size-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon-xs" onClick={() => params.onDelete(row)}>
        <Trash2 className="size-3.5 text-destructive" />
      </Button>
    </div>
  )
}

export const CenterGrid = memo(function CenterGrid({ onAdd }: { onAdd: () => void }) {
  const gridApiRef = useRef<GridApi<MemberCenter> | null>(null)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading, isError, error } = useMemberCentersQuery()
  const deleteMutation = useDeleteMemberCenterMutation()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MemberCenter | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MemberCenter | null>(null)

  const handleEdit = useCallback((center: MemberCenter) => {
    setEditing(center)
    setFormOpen(true)
  }, [])

  const columnDefs = useMemo<ColDef<MemberCenter>[]>(
    () => [
      { field: 'organizationMemberCenterID', headerName: 'ID', maxWidth: 90 },
      { field: 'centerID', headerName: 'Center ID', maxWidth: 120 },
      { field: 'centerName', headerName: 'Center Name', flex: 2 },
      {
        field: 'organizationMemberTown.townName',
        headerName: 'Town',
        valueGetter: (p) => p.data?.organizationMemberTown?.townName ?? '—',
        flex: 1,
      },
      { field: 'oCode', headerName: 'O Code', maxWidth: 100 },
      {
        headerName: 'Actions',
        maxWidth: 120,
        pinned: 'right',
        sortable: false,
        filter: false,
        cellRenderer: CenterActionsCell,
        cellRendererParams: { onEdit: handleEdit, onDelete: setDeleteTarget },
      },
    ],
    [handleEdit],
  )

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <GridToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search centers..."
          onExport={() => exportGridToCsv(gridApiRef.current, 'member-centers')}
          actions={<Button onClick={onAdd}>Add Center</Button>}
        />
        {isError ? (
          <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
        ) : null}
        <AgDataGrid
          rowData={data}
          columnDefs={columnDefs}
          loading={isLoading}
          quickFilterText={quickFilterText}
          onGridReady={(api) => { gridApiRef.current = api }}
        />
      </CardContent>
      <CenterFormDialog open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }} center={editing} />
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
          }
        }}
      />
    </Card>
  )
})
