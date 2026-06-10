import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { ColDef, GridApi } from 'ag-grid-community'
import { AgDataGrid } from '@/components/grid/AgDataGrid'
import { exportGridToCsv } from '@/components/grid/exportCsv'
import { useGridQuickFilter } from '@/components/grid/useGridQuickFilter'
import { GridToolbar } from '@/components/common/GridToolbar'
import { GridSelectionBar } from '@/components/common/GridSelectionBar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/api'
import {
    useDeleteMemberSubTownMutation,
    useMemberSubTownsQuery,
} from '@/features/memberSubTown/hooks'
import type { MemberSubTown } from '@/features/memberSubTown/types/subTown.types'
import { SubTownFormDialog } from '@/features/memberSubTown/components/SubTownFormDialog'

type DialogMode = 'view' | 'edit' | null

export const SubTownGrid = memo(function SubTownGrid({ onAdd }: { onAdd: () => void }) {
    const gridApiRef = useRef<GridApi<MemberSubTown> | null>(null)
    const { search, setSearch, quickFilterText } = useGridQuickFilter()
    const { data = [], isLoading, isError, error } = useMemberSubTownsQuery()
    const deleteMutation = useDeleteMemberSubTownMutation()

    const [selected, setSelected] = useState<MemberSubTown | null>(null)
    const [dialogMode, setDialogMode] = useState<DialogMode>(null)
    const [deleteTarget, setDeleteTarget] = useState<MemberSubTown | null>(null)

    const columnDefs = useMemo<ColDef<MemberSubTown>[]>(
        () => [
            { field: 'organisationMemberSubTownID', headerName: 'ID', minWidth: 90, maxWidth: 110 },
            { field: 'subTownID', headerName: 'Sub Town ID', minWidth: 130, maxWidth: 160 },
            { field: 'subTownName', headerName: 'Sub Town Name', flex: 2, minWidth: 180, cellClass: 'font-medium' },
            {
                headerName: 'Center',
                minWidth: 160,
                flex: 1,
                valueGetter: (p) => p.data?.organizationMemberCenter?.centerName ?? '—',
            },
            {
                headerName: 'Town',
                minWidth: 140,
                flex: 1,
                valueGetter: (p) =>
                    p.data?.organizationMemberCenter?.organizationMemberTown?.townName ?? '—',
            },
        ],
        [],
    )

    const handleSelectionChanged = useCallback((rows: MemberSubTown[]) => {
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
                searchPlaceholder="Search sub towns..."
                onExport={() => exportGridToCsv(gridApiRef.current, 'member-sub-towns')}
                actions={<Button onClick={onAdd}>Add Sub Town</Button>}
            />

            <GridSelectionBar
                hasSelection={Boolean(selected)}
                selectedLabel={selected?.subTownName ?? null}
                selectedMeta={selected?.subTownID ?? null}
                emptyLabel="Select a row to view, update, or delete a sub town."
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
                onGridReady={(api) => { gridApiRef.current = api }}
            />

            <SubTownFormDialog
                open={dialogMode !== null}
                onOpenChange={(open) => !open && setDialogMode(null)}
                subTown={selected}
                readOnly={dialogMode === 'view'}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                title="Delete Sub Town"
                description={`Delete "${deleteTarget?.subTownName}"?`}
                confirmLabel="Delete"
                destructive
                loading={deleteMutation.isPending}
                onConfirm={async () => {
                    if (deleteTarget) {
                        await deleteMutation.mutateAsync(deleteTarget.organisationMemberSubTownID)
                        setDeleteTarget(null)
                        setSelected(null)
                    }
                }}
            />
        </div>
    )
})