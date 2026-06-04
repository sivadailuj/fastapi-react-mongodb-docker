import axios from 'axios'
import { RawMaterial } from '../models/rawmaterial'
import { QueryParams, PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class MaterialService {
  async createMaterial(material: RawMaterial) {
    const response = await axios.post(API_URL + 'materials', material)
    return response.data
  }

  async getMaterial(materialId: string): Promise<RawMaterial> {
    const response = await axios.get(API_URL + 'materials/' + materialId)
    return response.data
  }

  async updateMaterial(materialId: string, material: RawMaterial): Promise<RawMaterial> {
    const response = await axios.patch(API_URL + 'materials/' + materialId, material)
    return response.data
  }

  async deleteMaterial(materialId: string) {
    const response = await axios.delete(API_URL + `materials/${materialId}`)
    return response.data
  }

  async getMaterials(params: QueryParams): Promise<PaginatedResponse<RawMaterial>> {
    const response = await axios.get(API_URL + 'materials', {
      params,
    })
    return { items: response.data, total: response.data.length }
  }

  async getMaterialsByOrder(orderUuid: string, params: QueryParams): Promise<RawMaterial[]> {
    const response = await axios.get(API_URL + `materials/order/${orderUuid}`, {
      params,
    })
    return response.data
  }

  async getMaterialsByManufacturing(
    manufacturingUuid: string,
    params: QueryParams,
  ): Promise<RawMaterial[]> {
    const response = await axios.get(API_URL + `materials/manufacturing/${manufacturingUuid}`, {
      params,
    })
    return response.data
  }
}

export default new MaterialService()
