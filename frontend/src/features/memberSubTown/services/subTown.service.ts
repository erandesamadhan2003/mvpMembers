import { api, ENDPOINTS, unwrap } from '@/api'
import type { ApiResponse } from '@/types/api.types'
import type {
    CreateMemberSubTownRequest,
    MemberSubTown,
    UpdateMemberSubTownRequest,
} from '@/features/memberSubTown/types/subTown.types'

export const memberSubTownService = {
    getAll: async (): Promise<MemberSubTown[]> => {
        const response = await api.get<ApiResponse<MemberSubTown[]>>(
            ENDPOINTS.memberSubTowns.base,
        )
        return unwrap(response)
    },

    getById: async (id: number): Promise<MemberSubTown> => {
        const response = await api.get<ApiResponse<MemberSubTown>>(
            ENDPOINTS.memberSubTowns.byId(id),
        )
        return unwrap(response)
    },

    getByCenterId: async (centerId: number): Promise<MemberSubTown[]> => {
        const response = await api.get<ApiResponse<MemberSubTown[]>>(
            ENDPOINTS.memberSubTowns.byCenterId(centerId),
        )
        return unwrap(response)
    },

    getBySubTownId: async (subTownId: string): Promise<MemberSubTown> => {
        const response = await api.get<ApiResponse<MemberSubTown>>(
            ENDPOINTS.memberSubTowns.bySubTownId(subTownId),
        )
        return unwrap(response)
    },

    create: async (payload: CreateMemberSubTownRequest): Promise<number> => {
        const response = await api.post<ApiResponse<number>>(
            ENDPOINTS.memberSubTowns.base,
            payload,
        )
        return unwrap(response)
    },

    update: async (id: number, payload: UpdateMemberSubTownRequest): Promise<void> => {
        const response = await api.put<ApiResponse<null>>(
            ENDPOINTS.memberSubTowns.byId(id),
            payload,
        )
        unwrap(response)
    },

    delete: async (id: number): Promise<void> => {
        const response = await api.delete<ApiResponse<null>>(
            ENDPOINTS.memberSubTowns.byId(id),
        )
        unwrap(response)
    },
}