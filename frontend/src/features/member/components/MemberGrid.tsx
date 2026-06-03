import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ColDef, GridApi, ICellRendererParams } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { AgDataGrid } from '@/components/grid/AgDataGrid'
import { exportGridToCsv } from '@/components/grid/exportCsv'
import { useGridQuickFilter } from '@/components/grid/useGridQuickFilter'
import { GridToolbar } from '@/components/common/GridToolbar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes.constants'
import { formatDisplayDate } from '@/utils/date'
import {
  useDeleteMemberMutation,
  useMembersQuery,
} from '@/features/member/hooks'
import type { Member } from '@/features/member/types/member.types'
import { getApiErrorMessage } from '@/api'

function memberFullName(m: Member) {
  return [m.firstName, m.middleName, m.lastName].filter(Boolean).join(' ')
}

function MemberStatusCell(params: ICellRendererParams<Member>) {
  const row = params.data
  if (!row) return null
  if (row.death) return <Badge variant="destructive">Deceased</Badge>
  if (row.memberCardIssue) return <Badge variant="success">Active</Badge>
  return <Badge variant="secondary">Pending</Badge>
}

function MemberActionsCell(
  params: ICellRendererParams<Member> & {
    onView: (row: Member) => void
    onEdit: (row: Member) => void
    onDelete: (row: Member) => void
  },
) {
  const row = params.data
  if (!row) return null
  return (
    <div className="flex h-full items-center gap-1">
      <Button type="button" variant="ghost" size="icon-xs" aria-label="View" onClick={() => params.onView(row)}>
        <Eye className="size-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon-xs" aria-label="Edit" onClick={() => params.onEdit(row)}>
        <Pencil className="size-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon-xs" aria-label="Delete" onClick={() => params.onDelete(row)}>
        <Trash2 className="size-3.5 text-destructive" />
      </Button>
    </div>
  )
}

export const MemberGrid = memo(function MemberGrid({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (member: Member) => void
}) {
  const navigate = useNavigate()
  const gridApiRef = useRef<GridApi<Member> | null>(null)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading, isError, error } = useMembersQuery()
  const deleteMutation = useDeleteMemberMutation()
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null)

  const handleView = useCallback(
    (member: Member) => navigate(ROUTES.memberDetail(member.organizationMemberID)),
    [navigate],
  )

  const columnDefs = useMemo<ColDef<Member>[]>(
    () => [
      { field: 'memberNo', headerName: 'Member No', maxWidth: 130 },
      {
        headerName: 'Name',
        flex: 1.5,
        valueGetter: (p) => (p.data ? memberFullName(p.data) : ''),
      },
      { field: 'phoneNo', headerName: 'Phone', maxWidth: 130 },
      { field: 'eMail', headerName: 'Email', flex: 1.2 },
      {
        headerName: 'Town',
        valueGetter: (p) =>
          p.data?.organizationMemberCenter?.organizationMemberTown?.townName ?? '—',
      },
      {
        headerName: 'Center',
        valueGetter: (p) => p.data?.organizationMemberCenter?.centerName ?? '—',
      },
      {
        headerName: 'Section',
        valueGetter: (p) => p.data?.memberSection?.memberSectionName ?? '—',
      },
      {
        field: 'registrationDate',
        headerName: 'Registration',
        maxWidth: 130,
        valueFormatter: (p) => formatDisplayDate(p.value as string),
      },
      {
        headerName: 'Status',
        maxWidth: 110,
        cellRenderer: MemberStatusCell,
      },
      {
        headerName: 'Actions',
        maxWidth: 130,
        pinned: 'right',
        sortable: false,
        filter: false,
        cellRenderer: MemberActionsCell,
        cellRendererParams: {
          onView: handleView,
          onEdit,
          onDelete: setDeleteTarget,
        },
      },
    ],
    [handleView, onEdit],
  )

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <GridToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search members..."
          onExport={() => exportGridToCsv(gridApiRef.current, 'members')}
          actions={
            <>
              <Link to={ROUTES.memberCreate}>
                <Button variant="outline" type="button">
                  Add Member
                </Button>
              </Link>
              <Button onClick={onAdd}>Quick Add</Button>
            </>
          }
        />
        {isError ? (
          <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
        ) : null}
        <AgDataGrid
          rowData={data}
          columnDefs={columnDefs}
          loading={isLoading}
          quickFilterText={quickFilterText}
          height={560}
          onGridReady={(api) => { gridApiRef.current = api }}
        />
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
          }
        }}
      />
    </Card>
  )
})
