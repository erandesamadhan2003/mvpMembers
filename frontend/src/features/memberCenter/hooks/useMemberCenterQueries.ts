import { useQuery } from '@tanstack/react-query'
import { memberCenterKeys } from '@/features/memberCenter/hooks/memberCenter.keys'
import { memberCenterService } from '@/features/memberCenter/services/memberCenter.service'

export function useMemberCentersQuery() {
  return useQuery({
    queryKey: memberCenterKeys.list(),
    queryFn: () => memberCenterService.getAll(),
  })
}

export function useMemberCenterQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: memberCenterKeys.detail(id),
    queryFn: () => memberCenterService.getById(id),
    enabled: enabled && id > 0,
  })
}

export function useMemberCentersByTownQuery(townId: number, enabled = true) {
  return useQuery({
    queryKey: memberCenterKeys.byTown(townId),
    queryFn: () => memberCenterService.getByTownId(townId),
    enabled: enabled && townId > 0,
  })
}

export function useMemberCenterByCenterIdQuery(
  centerId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: memberCenterKeys.byCenterId(centerId),
    queryFn: () => memberCenterService.getByCenterId(centerId),
    enabled: enabled && centerId.trim().length > 0,
  })
}
