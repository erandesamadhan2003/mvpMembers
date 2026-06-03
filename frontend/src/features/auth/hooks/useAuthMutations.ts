import { useMutation } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/api'
import { authService } from '@/features/auth/services/auth.service'
import type { LoginRequest, VerifyOtpRequest } from '@/types/auth.types'
import { removeToken, setToken } from '@/utils/token'

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    meta: {
      errorMessage: (error: unknown) => getApiErrorMessage(error),
    },
  })
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtp(payload),
    onSuccess: (token) => {
      setToken(token)
    },
    meta: {
      errorMessage: (error: unknown) => getApiErrorMessage(error),
    },
  })
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      removeToken()
    },
  })
}
