import { apiClient } from "@/lib/api-client"
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/lib/types"

export const productService = {
  getProducts: (params?: PaginationParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.pageSize) query.set("pageSize", String(params.pageSize))
    if (params?.search) query.set("search", params.search)
    if (params?.sortBy) query.set("sortBy", params.sortBy)
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder)
    return apiClient.get<PaginatedResponse<Product>>(
      `/products?${query.toString()}`
    )
  },

  getProduct: (id: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/${id}`),

  createProduct: (data: CreateProductRequest) =>
    apiClient.post<ApiResponse<Product>>("/products", data),

  updateProduct: (id: string, data: UpdateProductRequest) =>
    apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data),

  deleteProduct: (id: string) =>
    apiClient.delete<void>(`/products/${id}`),
}
