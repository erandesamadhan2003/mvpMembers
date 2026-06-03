import { useQuery } from '@tanstack/react-query'
import { memberSectionKeys } from '@/features/memberSection/hooks/memberSection.keys'
import { memberSectionService } from '@/features/memberSection/services/memberSection.service'

export function useMemberSectionsQuery() {
  return useQuery({
    queryKey: memberSectionKeys.list(),
    queryFn: () => memberSectionService.getAll(),
  })
}

export function useMemberSectionQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: memberSectionKeys.detail(id),
    queryFn: () => memberSectionService.getById(id),
    enabled: enabled && id > 0,
  })
}
