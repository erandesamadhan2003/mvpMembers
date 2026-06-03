import type {
  GridApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-community'
import { GRID_PAGE_SIZE } from '@/components/grid/grid.constants'

/**
 * Enterprise-ready in-memory server-side datasource.
 * Swap `fetchRows` for a paginated API when backend supports skip/take.
 */
export function createServerSideDatasource<T extends Record<string, unknown>>({
  fetchRows,
  getQuickFilterText,
}: {
  fetchRows: () => Promise<T[]>
  getQuickFilterText?: (row: T) => string
}): IServerSideDatasource<T> {
  let cache: T[] = []
  let quickFilter = ''

  return {
    getRows: async (params: IServerSideGetRowsParams<T>) => {
      try {
        if (!cache.length) {
          cache = await fetchRows()
        }

        let rows = [...cache]

        if (quickFilter.trim()) {
          const q = quickFilter.toLowerCase()
          rows = rows.filter((row) => {
            const text = getQuickFilterText
              ? getQuickFilterText(row)
              : JSON.stringify(row).toLowerCase()
            return text.includes(q)
          })
        }

        const { startRow = 0, endRow = GRID_PAGE_SIZE } = params.request
        const slice = rows.slice(startRow, endRow)

        params.success({
          rowData: slice,
          rowCount: rows.length,
        })
      } catch (error) {
        console.error(error)
        params.fail()
      }
    },
  }
}

export function attachQuickFilterToDatasource<T>(
  api: GridApi<T> | undefined,
  setQuickFilter: (value: string) => void,
) {
  return (value: string) => {
    setQuickFilter(value)
    api?.refreshServerSide({ purge: true })
  }
}

export function resetDatasourceCache() {
  return { cacheCleared: true as const }
}
