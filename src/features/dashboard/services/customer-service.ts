import { apiClient } from "@/lib/api-client"
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "@/lib/types"

export const customerService = {
  getCustomers: (params?: PaginationParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.pageSize) query.set("pageSize", String(params.pageSize))
    if (params?.search) query.set("search", params.search)
    if (params?.sortBy) query.set("sortBy", params.sortBy)
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder)
    return apiClient.get<PaginatedResponse<Customer>>(
      `/customers?${query.toString()}`
    )
  },

  getCustomer: (id: string) =>
    apiClient.get<ApiResponse<Customer>>(`/customers/${id}`),

  createCustomer: (data: CreateCustomerRequest) =>
    apiClient.post<ApiResponse<Customer>>("/customers", data),

  updateCustomer: (id: string, data: UpdateCustomerRequest) =>
    apiClient.patch<ApiResponse<Customer>>(`/customers/${id}`, data),

  deleteCustomer: (id: string) =>
    apiClient.delete<void>(`/customers/${id}`),
}
