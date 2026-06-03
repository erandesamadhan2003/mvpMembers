import { useQuery } from '@tanstack/react-query'
import { documentKeys } from '@/features/document/hooks/document.keys'
import { documentService } from '@/features/document/services/document.service'

export function useDocumentsQuery() {
  return useQuery({
    queryKey: documentKeys.list(),
    queryFn: () => documentService.getAll(),
  })
}

export function useDocumentQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentService.getById(id),
    enabled: enabled && id > 0,
  })
}

export function useDocumentByMemberQuery(memberId: number, enabled = true) {
  return useQuery({
    queryKey: documentKeys.byMember(memberId),
    queryFn: () => documentService.getByMemberId(memberId),
    enabled: enabled && memberId > 0,
  })
}
