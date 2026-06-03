export interface ApiResponse<T> {
  success: boolean
  message: string
  statusCode: number
  data: T
}

export interface ApiErrorBody {
  success: false
  message: string
  statusCode: number
  data: null
}
