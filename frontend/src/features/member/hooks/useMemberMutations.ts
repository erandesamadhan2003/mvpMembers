import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memberKeys } from '@/features/member/hooks/member.keys'
import { memberService } from '@/features/member/services/member.service'
import type {
  CreateMemberRequest,
  UpdateMemberRequest,
} from '@/features/member/types/member.types'

function invalidateMembers(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: memberKeys.all })
}

export function useCreateMemberMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMemberRequest) => memberService.create(payload),
    onSuccess: () => invalidateMembers(queryClient),
  })
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateMemberRequest
    }) => memberService.update(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: memberKeys.detail(id) })
      return invalidateMembers(queryClient)
    },
  })
}

export function useDeleteMemberMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => memberService.delete(id),
    onSuccess: () => invalidateMembers(queryClient),
  })
}
