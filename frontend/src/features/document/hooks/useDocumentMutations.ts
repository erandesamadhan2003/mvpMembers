import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentKeys } from '@/features/document/hooks/document.keys'
import { documentService } from '@/features/document/services/document.service'
import type {
  CreateMemberDocumentRequest,
  UpdateMemberDocumentRequest,
} from '@/features/document/types/document.types'

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
