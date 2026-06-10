import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/auth.service'
import type { LoginRequest } from '@/types/auth.types'
import { removeToken, setToken } from '@/utils/token'

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (token) => {
      setToken(token)
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
