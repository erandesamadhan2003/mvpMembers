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
  useDeleteMemberSectionMutation,
  useMemberSectionsQuery,
} from '@/features/memberSection/hooks'
import type { MemberSection } from '@/features/memberSection/types/memberSection.types'
import { SectionFormDialog } from '@/features/memberSection/components/SectionFormDialog'
import { getApiErrorMessage } from '@/api'

type DialogMode = 'view' | 'edit' | null

interface SectionGridProps {
  onAdd: () => void
}

export const SectionGrid = memo(function SectionGrid({ onAdd }: SectionGridProps) {
  const gridApiRef = useRef<GridApi<MemberSection> | null>(null)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading, isError, error, refetch } = useMemberSectionsQuery()
  const deleteMutation = useDeleteMemberSectionMutation()

  const [selected, setSelected] = useState<MemberSection | null>(null)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [deleteTarget, setDeleteTarget] = useState<MemberSection | null>(null)

  const columnDefs = useMemo<ColDef<MemberSection>[]>(
    () => [
      {
        field: 'memberSectionID',
        headerName: 'ID',
        minWidth: 100,
        maxWidth: 120,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'memberSectionName',
        headerName: 'Section Name',
        flex: 2,
        minWidth: 200,
        cellClass: 'font-medium',
      },
    ],
    [],
  )

  const handleSelectionChanged = useCallback((rows: MemberSection[]) => {
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
        searchPlaceholder="Search sections..."
        onExport={() => exportGridToCsv(gridApiRef.current, 'member-sections')}
        actions={
          <Button type="button" onClick={onAdd}>
            Add Section
          </Button>
        }
      />

      <GridSelectionBar
        hasSelection={Boolean(selected)}
        selectedLabel={selected?.memberSectionName ?? null}
        selectedMeta={selected ? `ID ${selected.memberSectionID}` : null}
        emptyLabel="Select a row to view, update, or delete a section."
        onView={() => openDialog('view')}
        onEdit={() => openDialog('edit')}
        onDelete={() => selected && setDeleteTarget(selected)}
      />

      {isError ? (
        <p className="text-base text-destructive" role="alert">
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
        rowSelection
        onSelectionChanged={handleSelectionChanged}
        onGridReady={(api) => {
          gridApiRef.current = api
        }}
      />

      <SectionFormDialog
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
        section={selected}
        readOnly={dialogMode === 'view'}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Member Section"
        description={`Are you sure you want to delete "${deleteTarget?.memberSectionName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!deleteTarget) return
          await deleteMutation.mutateAsync(deleteTarget.memberSectionID)
          setDeleteTarget(null)
          setSelected(null)
        }}
      />
    </div>
  )
})