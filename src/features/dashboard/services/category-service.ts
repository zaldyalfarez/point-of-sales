import { apiClient } from "@/lib/api-client"
import type { ApiResponse, Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/lib/types"

export const categoryService = {
  getCategories: () => apiClient.get<ApiResponse<Category[]>>("/categories"),
  getCategory: (id: string) => apiClient.get<ApiResponse<Category>>(`/categories/${id}`),
  createCategory: (data: CreateCategoryRequest) => apiClient.post<ApiResponse<Category>>("/categories", data),
  updateCategory: (id: string, data: UpdateCategoryRequest) => apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete<void>(`/categories/${id}`),
}
