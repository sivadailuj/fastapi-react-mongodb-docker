import axios from 'axios'
import { Supplier } from '../models/supplier'
import { QueryParams, PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class SupplierService {
  async createSupplier(supplier: Supplier) {
    const response = await axios.post(API_URL + 'suppliers', supplier)
    return response.data
  }

  async getSupplier(supplierId: string): Promise<Supplier> {
    const response = await axios.get(API_URL + 'suppliers/' + supplierId)
    return response.data
  }

  async updateSupplier(supplierId: string, supplier: Supplier): Promise<Supplier> {
    const response = await axios.patch(API_URL + 'suppliers/' + supplierId, supplier)
    return response.data
  }

  async deleteSupplier(supplierId: string) {
    const response = await axios.delete(API_URL + `suppliers/${supplierId}`)
    return response.data
  }

  async getSuppliers(params: QueryParams): Promise<PaginatedResponse<Supplier>> {
    const response = await axios.get(API_URL + 'suppliers', {
      params,
    })
    return { items: response.data, total: response.data.length }
  }
}

export default new SupplierService()
