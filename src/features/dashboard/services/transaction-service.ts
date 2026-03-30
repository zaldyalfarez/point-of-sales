import { apiClient } from "@/lib/api-client"
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Transaction,
} from "@/lib/types"

export const transactionService = {
  getTransactions: (
    params?: PaginationParams & { status?: string; paymentMethod?: string }
  ) => {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.pageSize) query.set("pageSize", String(params.pageSize))
    if (params?.search) query.set("search", params.search)
    if (params?.sortBy) query.set("sortBy", params.sortBy)
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder)
    if (params?.status) query.set("status", params.status)
    if (params?.paymentMethod) query.set("paymentMethod", params.paymentMethod)
    return apiClient.get<PaginatedResponse<Transaction>>(
      `/transactions?${query.toString()}`
    )
  },

  getTransaction: (id: string) =>
    apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`),

  refundTransaction: (id: string) =>
    apiClient.post<ApiResponse<Transaction>>(`/transactions/${id}/refund`),
}
