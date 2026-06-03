import { api, ENDPOINTS, unwrap } from '@/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  CreateMemberCenterRequest,
  MemberCenter,
  UpdateMemberCenterRequest,
} from '@/features/memberCenter/types/memberCenter.types'

export const memberCenterService = {
  getAll: async (): Promise<MemberCenter[]> => {
    const response = await api.get<ApiResponse<MemberCenter[]>>(
      ENDPOINTS.memberCenters.base,
    )
    return unwrap(response)
  },

  getById: async (id: number): Promise<MemberCenter> => {
    const response = await api.get<ApiResponse<MemberCenter>>(
      ENDPOINTS.memberCenters.byId(id),
    )
    return unwrap(response)
  },

  getByTownId: async (townId: number): Promise<MemberCenter[]> => {
    const response = await api.get<ApiResponse<MemberCenter[]>>(
      ENDPOINTS.memberCenters.byTownId(townId),
    )
    return unwrap(response)
  },

  getByCenterId: async (centerId: string): Promise<MemberCenter> => {
    const response = await api.get<ApiResponse<MemberCenter>>(
      ENDPOINTS.memberCenters.byCenterId(centerId),
    )
    return unwrap(response)
  },

  create: async (payload: CreateMemberCenterRequest): Promise<number> => {
    const response = await api.post<ApiResponse<number>>(
      ENDPOINTS.memberCenters.base,
      payload,
    )
    return unwrap(response)
  },

  update: async (
    id: number,
    payload: UpdateMemberCenterRequest,
  ): Promise<void> => {
    const response = await api.put<ApiResponse<null>>(
      ENDPOINTS.memberCenters.byId(id),
      payload,
    )
    unwrap(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>(
      ENDPOINTS.memberCenters.byId(id),
    )
    unwrap(response)
  },
}
