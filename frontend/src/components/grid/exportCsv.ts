import type { GridApi } from 'ag-grid-community'

export function exportGridToCsv(api: GridApi | undefined, fileName: string) {
  if (!api) return
  api.exportDataAsCsv({
    fileName: `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`,
  })
}
