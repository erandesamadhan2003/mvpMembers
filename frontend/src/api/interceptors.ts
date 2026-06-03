import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import { AUTH_HEADER } from '@/constants/api.constants'
import { ROUTES } from '@/constants/routes.constants'
import type { ApiErrorBody } from '@/types/api.types'
import { getToken, removeToken } from '@/utils/token'

const PUBLIC_PATH_PREFIXES = ['/api/auth'] as const

function isPublicRequest(url: string | undefined): boolean {
  if (!url) return false
  return PUBLIC_PATH_PREFIXES.some((prefix) => url.startsWith(prefix))
}

function attachAuthToken(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  if (isPublicRequest(config.url)) {
    return config
  }

  const token = getToken()
  if (token) {
    config.headers.set(AUTH_HEADER, `Bearer ${token}`)
  }

  return config
}

function handleUnauthorized(error: AxiosError<ApiErrorBody>): void {
  if (error.response?.status !== 401) {
    return
  }

  removeToken()

  if (typeof window !== 'undefined' && window.location.pathname !== ROUTES.login) {
    window.location.assign(ROUTES.login)
  }
}

export function setupInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use(attachAuthToken)
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorBody>) => {
      handleUnauthorized(error)
      return Promise.reject(error)
    },
  )
}
