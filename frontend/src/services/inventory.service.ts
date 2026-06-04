import axios from 'axios'
import { Inventory } from '../models/inventory'
import { QueryParams, PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class InventoryService {
  async createInventory(inventory: Inventory) {
    const response = await axios.post(API_URL + 'inventory', inventory)
    return response.data
  }

  async getInventory(inventoryId: string): Promise<Inventory> {
    const response = await axios.get(API_URL + 'inventory/' + inventoryId)
    return response.data
  }

  async updateInventory(inventoryId: string, inventory: Inventory): Promise<Inventory> {
    const response = await axios.patch(API_URL + 'inventory/' + inventoryId, inventory)
    return response.data
  }

  async deleteInventory(inventoryId: string) {
    const response = await axios.delete(API_URL + `inventory/${inventoryId}`)
    return response.data
  }

  async getInventories(params: QueryParams): Promise<PaginatedResponse<Inventory>> {
    const response = await axios.get(API_URL + 'inventory', {
      params,
    })
    return { items: response.data, total: response.data.length }
  }

  async getInventoriesBySupplier(supplierUuid: string, params: QueryParams): Promise<Inventory[]> {
    const response = await axios.get(API_URL + `inventory/supplier/${supplierUuid}`, {
      params,
    })
    return response.data
  }
}

export default new InventoryService()
