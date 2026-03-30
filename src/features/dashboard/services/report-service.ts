import { apiClient } from "@/lib/api-client"
import type { ApiResponse, TopSellingProduct, StaffActivity, PaymentBreakdown, ChartDataPoint } from "@/lib/types"

export const reportService = {
  getSalesReport: (startDate: string, endDate: string) =>
    apiClient.get<ApiResponse<{ revenue: number; orders: number; avgOrder: number; dailyData: ChartDataPoint[] }>>(
      `/reports/sales?start=${startDate}&end=${endDate}`
    ),
  getTopProducts: (limit: number = 10) =>
    apiClient.get<ApiResponse<TopSellingProduct[]>>(`/reports/top-products?limit=${limit}`),
  getStaffPerformance: () =>
    apiClient.get<ApiResponse<StaffActivity[]>>("/reports/staff-performance"),
  getPaymentBreakdown: () =>
    apiClient.get<ApiResponse<PaymentBreakdown[]>>("/reports/payment-breakdown"),
}
