import axios from 'axios'
import { Order } from '../models/order'
import { QueryParams, PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class OrderService {
  async createOrder(order: Order) {
    const response = await axios.post(API_URL + 'orders', order)
    return response.data
  }

  async getOrder(orderId: string): Promise<Order> {
    const response = await axios.get(API_URL + 'orders/' + orderId)
    return response.data
  }

  async updateOrder(orderId: string, order: Order): Promise<Order> {
    const response = await axios.patch(API_URL + 'orders/' + orderId, order)
    return response.data
  }

  async deleteOrder(orderId: string) {
    const response = await axios.delete(API_URL + `orders/${orderId}`)
    return response.data
  }

  async getOrders(params: QueryParams): Promise<PaginatedResponse<Order>> {
    const response = await axios.get(API_URL + 'orders', {
      params,
    })
    return { items: response.data, total: response.data.length }
  }

  async getOrdersByProject(projectUuid: string, params: QueryParams): Promise<Order[]> {
    const response = await axios.get(API_URL + `orders/project/${projectUuid}`, {
      params,
    })
    return response.data
  }
}

export default new OrderService()
