import { api, ENDPOINTS, unwrap } from '@/api'
import type { ApiResponse } from '@/types/api.types'
import type { LoginRequest } from '@/types/auth.types'

export const authService = {
  login: async (payload: LoginRequest): Promise<string> => {
    const response = await api.post<ApiResponse<string>>(
      ENDPOINTS.auth.login,
      payload,
    )
    return unwrap(response)
  },
}
