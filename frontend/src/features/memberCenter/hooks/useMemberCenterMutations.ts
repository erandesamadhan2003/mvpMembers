import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memberCenterKeys } from '@/features/memberCenter/hooks/memberCenter.keys'
import { memberCenterService } from '@/features/memberCenter/services/memberCenter.service'
import type {
  CreateMemberCenterRequest,
  UpdateMemberCenterRequest,
} from '@/features/memberCenter/types/memberCenter.types'

function invalidateMemberCenters(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  return queryClient.invalidateQueries({ queryKey: memberCenterKeys.all })
}

export function useCreateMemberCenterMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMemberCenterRequest) =>
      memberCenterService.create(payload),
    onSuccess: () => invalidateMemberCenters(queryClient),
  })
}

export function useUpdateMemberCenterMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateMemberCenterRequest
    }) => memberCenterService.update(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: memberCenterKeys.detail(id),
      })
      return invalidateMemberCenters(queryClient)
    },
  })
}

export function useDeleteMemberCenterMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => memberCenterService.delete(id),
    onSuccess: () => invalidateMemberCenters(queryClient),
  })
}
