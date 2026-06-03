import { api, ENDPOINTS, unwrap } from '@/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  CreateMemberRequest,
  Member,
  UpdateMemberRequest,
} from '@/features/member/types/member.types'

export const memberService = {
  getAll: async (): Promise<Member[]> => {
    const response = await api.get<ApiResponse<Member[]>>(
      ENDPOINTS.members.base,
    )
    return unwrap(response)
  },

  getById: async (id: number): Promise<Member> => {
    const response = await api.get<ApiResponse<Member>>(
      ENDPOINTS.members.byId(id),
    )
    return unwrap(response)
  },

  getByMemberNo: async (memberNo: string): Promise<Member> => {
    const response = await api.get<ApiResponse<Member>>(
      ENDPOINTS.members.byMemberNo(memberNo),
    )
    return unwrap(response)
  },

  getByMemberSectionId: async (memberSectionId: number): Promise<Member[]> => {
    const response = await api.get<ApiResponse<Member[]>>(
      ENDPOINTS.members.bySection(memberSectionId),
    )
    return unwrap(response)
  },

  getByOrganizationMemberCenterId: async (
    centerId: number,
  ): Promise<Member[]> => {
    const response = await api.get<ApiResponse<Member[]>>(
      ENDPOINTS.members.byCenter(centerId),
    )
    return unwrap(response)
  },

  create: async (payload: CreateMemberRequest): Promise<number> => {
    const response = await api.post<ApiResponse<number>>(
      ENDPOINTS.members.base,
      payload,
    )
    return unwrap(response)
  },

  update: async (id: number, payload: UpdateMemberRequest): Promise<void> => {
    const response = await api.put<ApiResponse<null>>(
      ENDPOINTS.members.byId(id),
      payload,
    )
    unwrap(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>(
      ENDPOINTS.members.byId(id),
    )
    unwrap(response)
  },
}
