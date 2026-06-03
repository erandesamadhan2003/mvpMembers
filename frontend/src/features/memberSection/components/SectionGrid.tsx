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
  useDeleteMemberSectionMutation,
  useMemberSectionsQuery,
} from '@/features/memberSection/hooks'
import type { MemberSection } from '@/features/memberSection/types/memberSection.types'
import { SectionFormDialog } from '@/features/memberSection/components/SectionFormDialog'
import { getApiErrorMessage } from '@/api'

interface SectionGridProps {
  onAdd: () => void
}

function SectionActionsCell(
  params: ICellRendererParams<MemberSection> & {
    onEdit: (row: MemberSection) => void
    onDelete: (row: MemberSection) => void
  },
) {
  const row = params.data
  if (!row) return null
  return (
    <div className="flex h-full items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Edit ${row.memberSectionName}`}
        onClick={() => params.onEdit(row)}
      >
        <Pencil className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Delete ${row.memberSectionName}`}
        onClick={() => params.onDelete(row)}
      >
        <Trash2 className="size-3.5 text-destructive" />
      </Button>
    </div>
  )
}

export const SectionGrid = memo(function SectionGrid({ onAdd }: SectionGridProps) {
  const gridApiRef = useRef<GridApi<MemberSection> | null>(null)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading, isError, error, refetch } = useMemberSectionsQuery()
  const deleteMutation = useDeleteMemberSectionMutation()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MemberSection | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MemberSection | null>(null)

  const handleEdit = useCallback((section: MemberSection) => {
    setEditing(section)
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.memberSectionID)
      setDeleteTarget(null)
    } catch {
      /* mutation error surfaced via dialog state */
    }
  }, [deleteMutation, deleteTarget])

  const columnDefs = useMemo<ColDef<MemberSection>[]>(
    () => [
      {
        field: 'memberSectionID',
        headerName: 'ID',
        maxWidth: 100,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'memberSectionName',
        headerName: 'Section Name',
        flex: 2,
      },
      {
        headerName: 'Actions',
        sortable: false,
        filter: false,
        maxWidth: 140,
        pinned: 'right',
        cellRenderer: SectionActionsCell,
        cellRendererParams: {
          onEdit: handleEdit,
          onDelete: setDeleteTarget,
        },
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
          searchPlaceholder="Search sections..."
          onExport={() => exportGridToCsv(gridApiRef.current, 'member-sections')}
          actions={
            <Button type="button" onClick={onAdd}>
              Add Section
            </Button>
          }
        />
        {isError ? (
          <p className="text-sm text-destructive" role="alert">
            {getApiErrorMessage(error)}
            <Button variant="link" className="ml-2" onClick={() => refetch()}>
              Retry
            </Button>
          </p>
        ) : null}
        <AgDataGrid<MemberSection>
          columnDefs={columnDefs}
          rowData={data}
          loading={isLoading}
          quickFilterText={quickFilterText}
          onGridReady={(api) => {
            gridApiRef.current = api
          }}
        />
      </CardContent>

      <SectionFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
        section={editing}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Member Section"
        description={`Are you sure you want to delete "${deleteTarget?.memberSectionName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </Card>
  )
})
