export interface AuditFields {
  addBy?: number | null
  addByTime?: string | null
  editBy?: number | null
  editByTime?: string | null
  urid?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
