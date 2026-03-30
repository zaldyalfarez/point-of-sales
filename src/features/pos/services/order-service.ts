import { apiClient } from "@/lib/api-client"
import type { ApiResponse, Transaction, TransactionItem, PaymentMethod } from "@/lib/types"

export interface CreateOrderRequest {
  customerName: string
  customerId?: string
  items: Omit<TransactionItem, "subtotal">[]
  discount: number
  paymentMethod: PaymentMethod
  amountPaid: number
}

export const orderService = {
  createOrder: (data: CreateOrderRequest) =>
    apiClient.post<ApiResponse<Transaction>>("/orders", data),
}
