import { apiClient } from "@/lib/api-client"
import type {
  ApiResponse,
  DashboardStats,
  ChartDataPoint,
  Transaction,
} from "@/lib/types"

export const dashboardService = {
  getStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats"),

  getRevenueChart: (period: "weekly" | "monthly" | "yearly" = "monthly") =>
    apiClient.get<ApiResponse<ChartDataPoint[]>>(
      `/dashboard/revenue?period=${period}`
    ),

  getRecentTransactions: (limit: number = 10) =>
    apiClient.get<ApiResponse<Transaction[]>>(
      `/dashboard/recent-transactions?limit=${limit}`
    ),
}
