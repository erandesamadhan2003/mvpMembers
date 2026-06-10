import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memberSubTownKeys } from '@/features/memberSubTown/hooks/subTown.keys'
import { memberSubTownService } from '@/features/memberSubTown/services/subTown.service'
import type {
    CreateMemberSubTownRequest,
    UpdateMemberSubTownRequest,
} from '@/features/memberSubTown/types/subTown.types'

function invalidateMemberSubTowns(queryClient: ReturnType<typeof useQueryClient>) {
    return queryClient.invalidateQueries({ queryKey: memberSubTownKeys.all })
}

export function useCreateMemberSubTownMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateMemberSubTownRequest) =>
            memberSubTownService.create(payload),
        onSuccess: () => invalidateMemberSubTowns(queryClient),
    })
}

export function useUpdateMemberSubTownMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateMemberSubTownRequest }) =>
            memberSubTownService.update(id, payload),
        onSuccess: (_data, { id }) => {
            void queryClient.invalidateQueries({ queryKey: memberSubTownKeys.detail(id) })
            return invalidateMemberSubTowns(queryClient)
        },
    })
}

export function useDeleteMemberSubTownMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => memberSubTownService.delete(id),
        onSuccess: () => invalidateMemberSubTowns(queryClient),
    })
}