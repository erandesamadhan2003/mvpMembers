import type { AxiosError, AxiosResponse } from 'axios'
import type { ApiErrorBody, ApiResponse } from '@/types/api.types'

export class ApiError extends Error {
  readonly statusCode: number
  readonly success: boolean

  constructor(message: string, statusCode: number, success = false) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.success = success
  }
}

export function unwrap<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const { data } = response

  if (!data.success) {
    throw new ApiError(data.message, data.statusCode, data.success)
  }

  return data.data
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (isAxiosApiError(error)) {
    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

function isAxiosApiError(
  error: unknown,
): error is AxiosError<ApiErrorBody> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  )
}
