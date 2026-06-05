import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentKeys } from '@/features/member/documents/hooks/document.keys'
import { documentService } from '@/features/member/documents/services/document.service'
import type {
  CreateMemberDocumentRequest,
  UpdateMemberDocumentRequest,
} from '@/features/member/documents/types/document.types'

function invalidateDocuments(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: documentKeys.all })
}

export function useCreateDocumentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMemberDocumentRequest) =>
      documentService.create(payload),
    onSuccess: (_data, payload) => {
      void queryClient.invalidateQueries({
        queryKey: documentKeys.byMember(payload.organizationMemberID),
      })
      return invalidateDocuments(queryClient)
    },
  })
}

export function useUpdateDocumentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateMemberDocumentRequest
    }) => documentService.update(id, payload),
    onSuccess: (_data, { id, payload }) => {
      void queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) })
      void queryClient.invalidateQueries({
        queryKey: documentKeys.byMember(payload.organizationMemberID),
      })
      return invalidateDocuments(queryClient)
    },
  })
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => documentService.delete(id),
    onSuccess: () => invalidateDocuments(queryClient),
  })
}
