import { api, ENDPOINTS, unwrap } from '@/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  CreateMemberTownRequest,
  MemberTown,
  UpdateMemberTownRequest,
} from '@/features/memberTown/types/memberTown.types'

export const memberTownService = {
  getAll: async (): Promise<MemberTown[]> => {
    const response = await api.get<ApiResponse<MemberTown[]>>(
      ENDPOINTS.memberTowns.base,
    )
    return unwrap(response)
  },

  getById: async (id: number): Promise<MemberTown> => {
    const response = await api.get<ApiResponse<MemberTown>>(
      ENDPOINTS.memberTowns.byId(id),
    )
    return unwrap(response)
  },

  getByTownName: async (townName: string): Promise<MemberTown> => {
    const response = await api.get<ApiResponse<MemberTown>>(
      ENDPOINTS.memberTowns.byName(townName),
    )
    return unwrap(response)
  },

  create: async (payload: CreateMemberTownRequest): Promise<number> => {
    const response = await api.post<ApiResponse<number>>(
      ENDPOINTS.memberTowns.base,
      payload,
    )
    return unwrap(response)
  },

  update: async (
    id: number,
    payload: UpdateMemberTownRequest,
  ): Promise<void> => {
    const response = await api.put<ApiResponse<null>>(
      ENDPOINTS.memberTowns.byId(id),
      payload,
    )
    unwrap(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>(
      ENDPOINTS.memberTowns.byId(id),
    )
    unwrap(response)
  },
}
