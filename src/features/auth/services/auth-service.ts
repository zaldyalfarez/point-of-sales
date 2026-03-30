import { apiClient } from "@/lib/api-client"
import type { LoginRequest, LoginResponse, User, ApiResponse } from "@/lib/types"

export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/login", data),

  logout: () => apiClient.post<void>("/auth/logout"),

  getCurrentUser: () => apiClient.get<ApiResponse<User>>("/auth/me"),

  refreshToken: () =>
    apiClient.post<ApiResponse<{ token: string }>>("/auth/refresh"),
}
