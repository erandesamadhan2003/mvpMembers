export const GRID_PAGE_SIZE = 10

export const GRID_PAGE_SIZE_OPTIONS = [10, 15] as const

export const GRID_DEFAULT_COL_DEF = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 120,
  filterParams: {
    maxNumConditions: 1,
    buttons: ['reset', 'apply'],
  },
} as const 

export const GRID_OVERLAY_LOADING = 'Loading records...'
export const GRID_OVERLAY_NO_ROWS = 'No records found'