import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import type { ColDef, GridApi, ICellRendererParams } from 'ag-grid-community'
import { AgDataGrid } from '@/components/grid/AgDataGrid'
import {
  createActionsCellRenderer,
  type GridActionHandlers,
} from '@/components/grid/GridActionsCell'
import {
  applyClientSideServerSlice,
  createServerSideDatasource,
  exportGridToCsv,
} from '@/components/grid/createServerSideDatasource'
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
  const { data = [], isLoading, isError, error, refetch } = useDocumentsQuery()
  const deleteMutation = useDeleteDocumentMutation()

  const [search, setSearch] = useState('')
  const [gridApi, setGridApi] = useState<GridApi<DocumentGridRow> | null>(null)
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

  useEffect(() => {
    gridApi?.refreshServerSide({ purge: true })
  }, [data, search, gridApi])

  const enriched = useMemo(() => data.map(enrichDocument), [data])

  const datasource = useMemo(
    () =>
      createServerSideDatasource<DocumentGridRow>(async (request) =>
        applyClientSideServerSlice(enriched, request, [
          'organizationMemberID',
          'organizationMemberDocumentID',
        ]),
      ),
    [enriched],
  )

  const handleExport = useCallback(() => {
    if (gridApi) exportGridToCsv(gridApi, 'member-documents.csv')
  }, [gridApi])

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
    <>
      <GridToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by member ID..."
        onExport={handleExport}
      />
      <AgDataGrid<DocumentGridRow>
        columnDefs={columnDefs}
        serverSideDatasource={datasource}
        loading={isLoading}
        quickFilterText={search}
        onGridReady={setGridApi}
        context={gridContext}
        getRowId={({ data }) =>
          String(data.organizationMemberDocumentID)
        }
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
    </>
  )
})
