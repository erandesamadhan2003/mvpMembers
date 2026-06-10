import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ColDef, GridApi } from 'ag-grid-community'
import { AgDataGrid } from '@/components/grid/AgDataGrid'
import { exportGridToCsv } from '@/components/grid/exportCsv'
import { useGridQuickFilter } from '@/components/grid/useGridQuickFilter'
import { GridToolbar } from '@/components/common/GridToolbar'
import { GridSelectionBar } from '@/components/common/GridSelectionBar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes.constants'
import { formatDisplayDate } from '@/utils/date'
import {
  useDeleteMemberMutation,
  useMembersQuery,
} from '@/features/member/hooks'
import { MemberSelectionPreview } from '@/features/member/components/MemberSelectionPreview'
import type { Member } from '@/features/member/types/member.types'
import { isMemberActive } from '@/features/member/utils/memberStatus'
import { getApiErrorMessage } from '@/api'

function memberFullName(m: Member) {
  return [m.firstName, m.middleName, m.lastName].filter(Boolean).join(' ')
}

interface MemberGridProps {
  onView: (member: Member) => void
  onEdit: (member: Member) => void
}

export const MemberGrid = memo(function MemberGrid({
  onView,
  onEdit,
}: MemberGridProps) {
  const gridApiRef = useRef<GridApi<Member> | null>(null)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading, isError, error } = useMembersQuery()
  const deleteMutation = useDeleteMemberMutation()
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [selected, setSelected] = useState<Member | null>(null)

  const rowData = useMemo(
    () => (showAll ? data : data.filter(isMemberActive)),
    [data, showAll],
  )

  const columnDefs = useMemo<ColDef<Member>[]>(
    () => [
      {
        field: 'memberNo',
        headerName: 'Member No',
        minWidth: 140,
        maxWidth: 160,
        cellClass: 'font-medium text-foreground',
      },
      {
        headerName: 'Full Name',
        flex: 1.6,
        minWidth: 180,
        valueGetter: (p) => (p.data ? memberFullName(p.data) : ''),
      },
      {
        field: 'phoneNo',
        headerName: 'Phone',
        minWidth: 130,
        maxWidth: 150,
      },
      {
        field: 'eMail',
        headerName: 'Email',
        flex: 1.4,
        minWidth: 180,
      },
      {
        headerName: 'Town',
        minWidth: 130,
        valueGetter: (p) =>
          p.data?.organizationMemberCenter?.organizationMemberTown?.townName ?? '—',
      },
      {
        headerName: 'Center',
        minWidth: 140,
        valueGetter: (p) => p.data?.organizationMemberCenter?.centerName ?? '—',
      },
      {
        headerName: 'Section',
        minWidth: 120,
        valueGetter: (p) => p.data?.memberSection?.memberSectionName ?? '—',
      },
      {
        field: 'registrationDate',
        headerName: 'Registered',
        minWidth: 130,
        maxWidth: 150,
        valueFormatter: (p) => formatDisplayDate(p.value as string),
      },
    ],
    [],
  )

  const handleSelectionChanged = useCallback((rows: Member[]) => {
    setSelected(rows[0] ?? null)
  }, [])

  const requireSelection = useCallback(
    (action: (member: Member) => void) => {
      if (selected) action(selected)
    },
    [selected],
  )

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <GridToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search members by name, number, email..."
          onExport={() => exportGridToCsv(gridApiRef.current, 'members')}
          actions={
            <Link to={ROUTES.memberCreate}>
              <Button type="button">Register Member</Button>
            </Link>
          }
        />

        <GridSelectionBar
          hasSelection={Boolean(selected)}
          selectedLabel={selected ? memberFullName(selected) : null}
          selectedMeta={selected?.memberNo ?? null}
          emptyLabel=""
          onView={() => requireSelection(onView)}
          onEdit={() => requireSelection(onEdit)}
          onDelete={() => requireSelection(setDeleteTarget)}
          extraActions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Active Only' : 'Show All'}
            </Button>
          }
        />

        {isError ? (
          <p className="text-base text-destructive">{getApiErrorMessage(error)}</p>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <AgDataGrid
            rowData={rowData}
            columnDefs={columnDefs}
            loading={isLoading}
            quickFilterText={quickFilterText}
            rowSelection
            onSelectionChanged={handleSelectionChanged}
            onGridReady={(api) => {
              gridApiRef.current = api
            }}
          />
          <MemberSelectionPreview member={selected} />
        </div>
      </CardContent>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Member"
        description={`Delete member ${deleteTarget?.memberNo ?? ''}?`}
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMutation.mutateAsync(deleteTarget.organizationMemberID)
            setDeleteTarget(null)
            setSelected(null)
          }
        }}
      />
    </Card>
  )
})
