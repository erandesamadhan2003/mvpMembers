import { api, ENDPOINTS, unwrap } from '@/api'
import type { ApiResponse } from '@/types/api.types'
import type { LoginRequest, VerifyOtpRequest } from '@/types/auth.types'

export const authService = {
  login: async (payload: LoginRequest): Promise<void> => {
    const response = await api.post<ApiResponse<null>>(
      ENDPOINTS.auth.login,
      payload,
    )
    unwrap(response)
  },

  verifyOtp: async (payload: VerifyOtpRequest): Promise<string> => {
    const response = await api.post<ApiResponse<string>>(
      ENDPOINTS.auth.verifyOtp,
      payload,
    )
    return unwrap(response)
  },
}
