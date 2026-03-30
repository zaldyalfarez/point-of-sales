import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse, PaginationParams, Expense, CreateExpenseRequest } from "@/lib/types"

export const expenseService = {
  getExpenses: (params?: PaginationParams & { category?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.pageSize) query.set("pageSize", String(params.pageSize))
    if (params?.search) query.set("search", params.search)
    if (params?.category) query.set("category", params.category)
    return apiClient.get<PaginatedResponse<Expense>>(`/expenses?${query.toString()}`)
  },
  createExpense: (data: CreateExpenseRequest) =>
    apiClient.post<ApiResponse<Expense>>("/expenses", data),
  deleteExpense: (id: string) => apiClient.delete<void>(`/expenses/${id}`),
}
