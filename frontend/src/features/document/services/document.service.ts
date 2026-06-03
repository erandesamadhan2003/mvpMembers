import { api, ENDPOINTS, unwrap } from '@/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  CreateMemberDocumentRequest,
  MemberDocument,
  UpdateMemberDocumentRequest,
} from '@/features/document/types/document.types'

export const documentService = {
  getAll: async (): Promise<MemberDocument[]> => {
    const response = await api.get<ApiResponse<MemberDocument[]>>(
      ENDPOINTS.documents.base,
    )
    return unwrap(response)
  },

  getById: async (id: number): Promise<MemberDocument> => {
    const response = await api.get<ApiResponse<MemberDocument>>(
      ENDPOINTS.documents.byId(id),
    )
    return unwrap(response)
  },

  getByMemberId: async (memberId: number): Promise<MemberDocument> => {
    const response = await api.get<ApiResponse<MemberDocument>>(
      ENDPOINTS.documents.byMemberId(memberId),
    )
    return unwrap(response)
  },

  create: async (payload: CreateMemberDocumentRequest): Promise<number> => {
    const response = await api.post<ApiResponse<number>>(
      ENDPOINTS.documents.base,
      payload,
    )
    return unwrap(response)
  },

  update: async (
    id: number,
    payload: UpdateMemberDocumentRequest,
  ): Promise<void> => {
    const response = await api.put<ApiResponse<null>>(
      ENDPOINTS.documents.byId(id),
      payload,
    )
    unwrap(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>(
      ENDPOINTS.documents.byId(id),
    )
    unwrap(response)
  },
}
