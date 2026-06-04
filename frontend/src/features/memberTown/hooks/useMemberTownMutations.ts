import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memberTownKeys } from '@/features/memberTown/hooks/memberTown.keys'
import { memberTownService } from '@/features/memberTown/services/memberTown.service'
import type {
  CreateMemberTownRequest,
  UpdateMemberTownRequest,
} from '@/features/memberTown/types/memberTown.types'

function invalidateMemberTowns(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: memberTownKeys.all })
}

export function useCreateMemberTownMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: CreateMemberTownRequest) =>
      memberTownService.create(payload),
    onSuccess: () => invalidateMemberTowns(queryClient),
  })
}

export function useUpdateMemberTownMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateMemberTownRequest
    }) => memberTownService.update(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: memberTownKeys.detail(id),
      })
      return invalidateMemberTowns(queryClient)
    },
  })
}

export function useDeleteMemberTownMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => memberTownService.delete(id),
    onSuccess: () => invalidateMemberTowns(queryClient),
  })
}
