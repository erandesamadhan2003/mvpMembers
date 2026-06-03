import { useMemo, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export function useGridQuickFilter(delayMs = 300) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, delayMs)

  return useMemo(
    () => ({
      search,
      setSearch,
      quickFilterText: debouncedSearch,
    }),
    [search, debouncedSearch],
  )
}
