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
  useDeleteMemberTownMutation,
  useMemberTownsQuery,
} from '@/features/memberTown/hooks'
import type { MemberTown } from '@/features/memberTown/types/memberTown.types'
import { TownFormDialog } from '@/features/memberTown/components/TownFormDialog'
import { getApiErrorMessage } from '@/api'

function TownActionsCell(
  params: ICellRendererParams<MemberTown> & {
    onEdit: (row: MemberTown) => void
    onDelete: (row: MemberTown) => void
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

export const TownGrid = memo(function TownGrid({ onAdd }: { onAdd: () => void }) {
  const gridApiRef = useRef<GridApi<MemberTown> | undefined>(undefined)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading, isError, error } = useMemberTownsQuery()
  const deleteMutation = useDeleteMemberTownMutation()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MemberTown | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MemberTown | null>(null)

  const handleEdit = useCallback((town: MemberTown) => {
    setEditing(town)
    setFormOpen(true)
  }, [])

  const columnDefs = useMemo<ColDef<MemberTown>[]>(
    () => [
      // { field: 'organizationMemberTownID', headerName: 'ID', maxWidth: 100 },
      { field: 'townID', headerName: 'Town ID', maxWidth: 110 },
      { field: 'townName', headerName: 'Town Name', flex: 2 },
      {
        headerName: 'Actions',
        maxWidth: 120,
        pinned: 'right',
        sortable: false,
        filter: false,
        cellRenderer: TownActionsCell,
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
          searchPlaceholder="Search towns..."
          onExport={() => exportGridToCsv(gridApiRef.current, 'member-towns')}
          actions={<Button onClick={onAdd}>Add Town</Button>}
        />
        {isError ? (
          <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
        ) : null}
        <AgDataGrid rowData={data} columnDefs={columnDefs} loading={isLoading} quickFilterText={quickFilterText} onGridReady={(api) => { gridApiRef.current = api }} />
      </CardContent>
      <TownFormDialog open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }} town={editing} />
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
          }
        }}
      />
    </Card>
  )
})
