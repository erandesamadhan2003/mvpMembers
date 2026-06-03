import { useCallback, useMemo, useState } from 'react'
import type { PaginationParams } from '@/types/common.types'

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialPageSize = 10 } = options
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const params: PaginationParams = useMemo(
    () => ({ page, pageSize }),
    [page, pageSize],
  )

  const nextPage = useCallback(() => setPage((p) => p + 1), [])
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), [])
  const reset = useCallback(() => {
    setPage(initialPage)
    setPageSize(initialPageSize)
  }, [initialPage, initialPageSize])

  return {
    page,
    pageSize,
    params,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    reset,
  }
}
