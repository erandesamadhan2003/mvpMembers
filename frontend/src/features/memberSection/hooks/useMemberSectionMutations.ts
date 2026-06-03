import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memberSectionKeys } from '@/features/memberSection/hooks/memberSection.keys'
import { memberSectionService } from '@/features/memberSection/services/memberSection.service'
import type {
  CreateMemberSectionRequest,
  MemberSection,
  UpdateMemberSectionRequest,
} from '@/features/memberSection/types/memberSection.types'

function invalidateMemberSections(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: memberSectionKeys.all })
}

export function useCreateMemberSectionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMemberSectionRequest) =>
      memberSectionService.create(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: memberSectionKeys.list() })
      const previous = queryClient.getQueryData<MemberSection[]>(
        memberSectionKeys.list(),
      )
      const optimistic: MemberSection = {
        memberSectionID: Date.now() * -1,
        memberSectionName: payload.name,
      }
      queryClient.setQueryData<MemberSection[]>(memberSectionKeys.list(), (old) =>
        [...(old ?? []), optimistic],
      )
      return { previous }
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(memberSectionKeys.list(), context.previous)
      }
    },
    onSettled: () => invalidateMemberSections(queryClient),
  })
}

export function useUpdateMemberSectionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateMemberSectionRequest
    }) => memberSectionService.update(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: memberSectionKeys.list() })
      const previous = queryClient.getQueryData<MemberSection[]>(
        memberSectionKeys.list(),
      )
      queryClient.setQueryData<MemberSection[]>(memberSectionKeys.list(), (old) =>
        (old ?? []).map((item) =>
          item.memberSectionID === id
            ? { ...item, memberSectionName: payload.name }
            : item,
        ),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(memberSectionKeys.list(), context.previous)
      }
    },
    onSettled: (_data, _err, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: memberSectionKeys.detail(id),
      })
      return invalidateMemberSections(queryClient)
    },
  })
}

export function useDeleteMemberSectionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => memberSectionService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: memberSectionKeys.list() })
      const previous = queryClient.getQueryData<MemberSection[]>(
        memberSectionKeys.list(),
      )
      queryClient.setQueryData<MemberSection[]>(memberSectionKeys.list(), (old) =>
        (old ?? []).filter((item) => item.memberSectionID !== id),
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(memberSectionKeys.list(), context.previous)
      }
    },
    onSettled: () => invalidateMemberSections(queryClient),
  })
}
