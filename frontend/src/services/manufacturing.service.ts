import axios from 'axios'
import { Manufacturing } from '../models/manufacturing'
import { QueryParams, PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class ManufacturingService {
  async createManufacturing(manufacturing: Manufacturing) {
    const response = await axios.post(API_URL + 'manufacturing', manufacturing)
    return response.data
  }

  async getManufacturing(manufacturingId: string): Promise<Manufacturing> {
    const response = await axios.get(API_URL + 'manufacturing/' + manufacturingId)
    return response.data
  }

  async updateManufacturing(
    manufacturingId: string,
    manufacturing: Manufacturing,
  ): Promise<Manufacturing> {
    const response = await axios.patch(API_URL + 'manufacturing/' + manufacturingId, manufacturing)
    return response.data
  }

  async deleteManufacturing(manufacturingId: string) {
    const response = await axios.delete(API_URL + `manufacturing/${manufacturingId}`)
    return response.data
  }

  async getManufacturings(params: QueryParams): Promise<PaginatedResponse<Manufacturing>> {
    const response = await axios.get(API_URL + 'manufacturing', {
      params,
    })
    return { items: response.data, total: response.data.length }
  }
}

export default new ManufacturingService()
