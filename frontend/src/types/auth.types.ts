export interface LoginRequest {
  email: string
  password: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface AuthSession {
  token: string
}
