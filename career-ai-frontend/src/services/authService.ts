
import api from './api'

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface UserResponse {
  id: number
  name: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  email: string
  token: string
}

export async function registerUser(
  data: RegisterRequest,
): Promise<UserResponse> {
  const response = await api.post<UserResponse>('/users', data)
  return response.data
}

export async function loginUser(
  data: LoginRequest,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', data)

  localStorage.setItem('careerai_token', response.data.token)

  return response.data
}

export function logoutUser(): void {
  localStorage.removeItem('careerai_token')
}
