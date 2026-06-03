import { api, ENDPOINTS, unwrap } from '@/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  CreateMemberSectionRequest,
  MemberSection,
  UpdateMemberSectionRequest,
} from '@/features/memberSection/types/memberSection.types'

export const memberSectionService = {
  getAll: async (): Promise<MemberSection[]> => {
    const response = await api.get<ApiResponse<MemberSection[]>>(
      ENDPOINTS.memberSections.base,
    )
    return unwrap(response)
  },

  getById: async (id: number): Promise<MemberSection> => {
    const response = await api.get<ApiResponse<MemberSection>>(
      ENDPOINTS.memberSections.byId(id),
    )
    return unwrap(response)
  },

  create: async (payload: CreateMemberSectionRequest): Promise<void> => {
    const response = await api.post<ApiResponse<null>>(
      ENDPOINTS.memberSections.base,
      payload,
    )
    unwrap(response)
  },

  update: async (
    id: number,
    payload: UpdateMemberSectionRequest,
  ): Promise<void> => {
    const response = await api.put<ApiResponse<null>>(
      ENDPOINTS.memberSections.byId(id),
      payload,
    )
    unwrap(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>(
      ENDPOINTS.memberSections.byId(id),
    )
    unwrap(response)
  },
}
