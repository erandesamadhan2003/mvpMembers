import { useQuery } from '@tanstack/react-query'
import { memberTownKeys } from '@/features/memberTown/hooks/memberTown.keys'
import { memberTownService } from '@/features/memberTown/services/memberTown.service'

export function useMemberTownsQuery() {
  return useQuery({
    queryKey: memberTownKeys.list(),
    queryFn: () => memberTownService.getAll(),
  })
}

export function useMemberTownQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: memberTownKeys.detail(id),
    queryFn: () => memberTownService.getById(id),
    enabled: enabled && id > 0,
  })
}

export function useMemberTownByNameQuery(townName: string, enabled = true) {
  return useQuery({
    queryKey: memberTownKeys.byName(townName),
    queryFn: () => memberTownService.getByTownName(townName),
    enabled: enabled && townName.trim().length > 0,
  })
}
