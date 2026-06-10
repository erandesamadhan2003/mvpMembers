import { memo, useMemo, useRef, useState } from 'react'
import type { ColDef, GridApi } from 'ag-grid-community'
import { AgDataGrid } from '@/components/grid/AgDataGrid'
import { exportGridToCsv } from '@/components/grid/exportCsv'
import { useGridQuickFilter } from '@/components/grid/useGridQuickFilter'
import { GridToolbar, GridFilterField, PageContainer, PageHeader } from '@/components/common'
import { Input } from '@/components/ui/input'
import { useDocumentsQuery } from '@/features/member/documents/hooks'
import type { MemberDocument } from '@/features/member/documents/types/document.types'

export const DocumentList = memo(function DocumentList() {
  const gridApiRef = useRef<GridApi<MemberDocument> | null>(null)
  const { search, setSearch, quickFilterText } = useGridQuickFilter()
  const { data = [], isLoading } = useDocumentsQuery()
  const [memberFilter, setMemberFilter] = useState('')

  const rowData = useMemo(() => {
    if (!memberFilter.trim()) return data
    const q = memberFilter.toLowerCase()
    return data.filter((d) =>
      String(d.organizationMemberID).includes(q),
    )
  }, [data, memberFilter])

  const columnDefs = useMemo<ColDef<MemberDocument>[]>(
    () => [
      { field: 'organizationMemberDocumentID', headerName: 'Doc ID', maxWidth: 100 },
      { field: 'organizationMemberID', headerName: 'Member ID', maxWidth: 120 },
      {
        headerName: 'Photo',
        valueGetter: (p) => (p.data?.memberPhoto ? 'Uploaded' : '—'),
      },
      {
        headerName: 'Aadhaar',
        valueGetter: (p) => (p.data?.aadhaarCopy ? 'Uploaded' : '—'),
      },
      {
        headerName: 'PAN',
        valueGetter: (p) => (p.data?.panCopy ? 'Uploaded' : '—'),
      },
      {
        headerName: 'Death Cert.',
        valueGetter: (p) => (p.data?.deathCertificate ? 'Uploaded' : '—'),
      },
    ],
    [],
  )

  return (
    <PageContainer>
      <PageHeader title="Member Documents" />
      <div className="space-y-4">
        <GridToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search documents..."
          onExport={() => exportGridToCsv(gridApiRef.current, 'member-documents')}
          filters={
            <GridFilterField label="Member ID" htmlFor="member-id-filter">
              <Input
                id="member-id-filter"
                className="h-9"
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                placeholder="Filter by ID"
              />
            </GridFilterField>
          }
        />
        <AgDataGrid
          rowData={rowData}
          columnDefs={columnDefs}
          loading={isLoading}
          quickFilterText={quickFilterText}
          onGridReady={(api) => { gridApiRef.current = api }}
        />
      </div>
    </PageContainer>
  )
})