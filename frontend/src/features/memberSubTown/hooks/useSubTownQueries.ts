import { useQuery } from '@tanstack/react-query'
import { memberSubTownKeys } from '@/features/memberSubTown/hooks/subTown.keys'
import { memberSubTownService } from '@/features/memberSubTown/services/subTown.service'

export function useMemberSubTownsQuery() {
    return useQuery({
        queryKey: memberSubTownKeys.list(),
        queryFn: () => memberSubTownService.getAll(),
    })
}

export function useMemberSubTownQuery(id: number, enabled = true) {
    return useQuery({
        queryKey: memberSubTownKeys.detail(id),
        queryFn: () => memberSubTownService.getById(id),
        enabled: enabled && id > 0,
    })
}

export function useMemberSubTownsByCenterQuery(centerId: number, enabled = true) {
    return useQuery({
        queryKey: memberSubTownKeys.byCenter(centerId),
        queryFn: () => memberSubTownService.getByCenterId(centerId),
        enabled: enabled && centerId > 0,
    })
}

export function useMemberSubTownBySubTownIdQuery(subTownId: string, enabled = true) {
    return useQuery({
        queryKey: memberSubTownKeys.bySubTownId(subTownId),
        queryFn: () => memberSubTownService.getBySubTownId(subTownId),
        enabled: enabled && subTownId.trim().length > 0,
    })
}