import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse, PaginationParams, StockAdjustment, CreateStockAdjustmentRequest } from "@/lib/types"

export const stockService = {
  getAdjustments: (params?: PaginationParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.pageSize) query.set("pageSize", String(params.pageSize))
    if (params?.search) query.set("search", params.search)
    return apiClient.get<PaginatedResponse<StockAdjustment>>(`/stock-adjustments?${query.toString()}`)
  },
  createAdjustment: (data: CreateStockAdjustmentRequest) =>
    apiClient.post<ApiResponse<StockAdjustment>>("/stock-adjustments", data),
}
