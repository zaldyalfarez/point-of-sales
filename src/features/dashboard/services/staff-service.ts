import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse, PaginationParams, Staff, CreateStaffRequest, UpdateStaffRequest } from "@/lib/types"

export const staffService = {
  getStaffList: (params?: PaginationParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.pageSize) query.set("pageSize", String(params.pageSize))
    if (params?.search) query.set("search", params.search)
    return apiClient.get<PaginatedResponse<Staff>>(`/staff?${query.toString()}`)
  },
  getStaff: (id: string) => apiClient.get<ApiResponse<Staff>>(`/staff/${id}`),
  createStaff: (data: CreateStaffRequest) => apiClient.post<ApiResponse<Staff>>("/staff", data),
  updateStaff: (id: string, data: UpdateStaffRequest) => apiClient.patch<ApiResponse<Staff>>(`/staff/${id}`, data),
  deleteStaff: (id: string) => apiClient.delete<void>(`/staff/${id}`),
}
