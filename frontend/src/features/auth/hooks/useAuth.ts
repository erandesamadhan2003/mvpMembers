import { useCallback } from 'react'
import { useLoginMutation, useLogoutMutation } from '@/features/auth/hooks/useAuthMutations'
import { getToken, isAuthenticated, removeToken } from '@/utils/token'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const loginMutation = useLoginMutation()
  const logoutMutation = useLogoutMutation()
  const navigate = useNavigate()

  const logout = useCallback(() => {
    removeToken()
    logoutMutation.mutate()
    navigate('/login')
  }, [logoutMutation])

  return {
    token: getToken(),
    isAuthenticated: isAuthenticated(),
    login: loginMutation,
    logout,
    isLoggingIn: loginMutation.isPending,
  }
}