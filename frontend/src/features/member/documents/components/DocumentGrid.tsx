import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { ColDef, GridApi, ICellRendererParams } from 'ag-grid-community'
import { AgDataGrid } from '@/components/grid/AgDataGrid'
import {
  createActionsCellRenderer,
  type GridActionHandlers,
} from '@/components/grid/GridActionsCell'
import { exportGridToCsv } from '@/components/grid/exportCsv'
import { useGridQuickFilter } from '@/components/grid/useGridQuickFilter'
import { GridToolbar } from '@/components/common/GridToolbar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import {
  useDeleteDocumentMutation,
  useDocumentsQuery,
} from '@/features/member/documents/hooks'
import type { MemberDocument } from '@/features/member/documents/types/document.types'
import { getApiErrorMessage } from '@/api'

const DocumentActionsCell = createActionsCellRenderer<MemberDocument>()

function AttachedBadge(params: ICellRendererParams<MemberDocument>) {
  const has = Boolean(params.value)
  return (
    <Badge variant={has ? 'success' : 'outline'}>
      {has ? 'Yes' : 'No'}
    </Badge>
  )
}

type DocumentGridRow = MemberDocument & {
  hasPhoto: boolean
  hasAadhaar: boolean
  hasPan: boolean
  hasDeathCert: boolean
}

function enrichDocument(doc: MemberDocument): DocumentGridRow {
  return {
    ...doc,
    hasPhoto: Boolean(doc.memberPhoto),
    hasAadhaar: Boolean(doc.aadhaarCopy),
    hasPan: Boolean(doc.panCopy),
    hasDeathCert: Boolean(doc.deathCertificate),
  }
}

export const DocumentGrid = memo(function DocumentGrid() {
  const gridApiRef = useRef<GridApi<DocumentGridRow> | null>(null)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading, isError, error, refetch } = useDocumentsQuery()
  const deleteMutation = useDeleteDocumentMutation()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toDelete, setToDelete] = useState<MemberDocument | null>(null)

  const openDelete = useCallback((doc: MemberDocument) => {
    setToDelete(doc)
    setDeleteOpen(true)
  }, [])

  const gridContext = useMemo<GridActionHandlers<MemberDocument>>(
    () => ({ onDelete: openDelete }),
    [openDelete],
  )

  const columnDefs = useMemo<ColDef<DocumentGridRow>[]>(
    () => [
      {
        field: 'organizationMemberDocumentID',
        headerName: 'Doc ID',
        maxWidth: 100,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'organizationMemberID',
        headerName: 'Member ID',
        maxWidth: 120,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'hasPhoto',
        headerName: 'Photo',
        maxWidth: 90,
        cellRenderer: AttachedBadge,
      },
      {
        field: 'hasAadhaar',
        headerName: 'Aadhaar',
        maxWidth: 100,
        cellRenderer: AttachedBadge,
      },
      {
        field: 'hasPan',
        headerName: 'PAN',
        maxWidth: 90,
        cellRenderer: AttachedBadge,
      },
      {
        field: 'hasDeathCert',
        headerName: 'Death Cert.',
        maxWidth: 110,
        cellRenderer: AttachedBadge,
      },
      {
        headerName: 'Actions',
        sortable: false,
        filter: false,
        maxWidth: 100,
        pinned: 'right',
        cellRenderer: DocumentActionsCell,
      },
    ],
    [],
  )

  const rowData = useMemo(() => data.map(enrichDocument), [data])

  const handleDeleteConfirm = useCallback(() => {
    if (!toDelete) return
    deleteMutation.mutate(toDelete.organizationMemberDocumentID, {
      onSuccess: () => {
        setDeleteOpen(false)
        setToDelete(null)
      },
    })
  }, [toDelete, deleteMutation])

  if (isLoading && data.length === 0) {
    return <LoadingSpinner className="py-24" label="Loading documents..." />
  }

  if (isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(error)}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-4">
      <GridToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by member ID..."
        onExport={() => exportGridToCsv(gridApiRef.current, 'member-documents')}
      />
      <AgDataGrid<DocumentGridRow>
        columnDefs={columnDefs}
        rowData={rowData}
        loading={isLoading}
        quickFilterText={quickFilterText}
        context={gridContext}
        onGridReady={(api) => {
          gridApiRef.current = api
        }}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Document Record"
        description={`Delete document record for member ID ${toDelete?.organizationMemberID}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
        destructive
      />
    </div>
  )
})