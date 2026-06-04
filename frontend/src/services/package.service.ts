import axios from 'axios'
import { Package } from '../models/package'
import { QueryParams, PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class PackageService {
  async createPackage(packageData: Package) {
    const response = await axios.post(API_URL + 'packages', packageData)
    return response.data
  }

  async getPackage(packageId: string): Promise<Package> {
    const response = await axios.get(API_URL + 'packages/' + packageId)
    return response.data
  }

  async updatePackage(packageId: string, packageData: Package): Promise<Package> {
    const response = await axios.patch(API_URL + 'packages/' + packageId, packageData)
    return response.data
  }

  async deletePackage(packageId: string) {
    const response = await axios.delete(API_URL + `packages/${packageId}`)
    return response.data
  }

  async getPackages(params: QueryParams): Promise<PaginatedResponse<Package>> {
    const response = await axios.get(API_URL + 'packages', {
      params,
    })
    return { items: response.data, total: response.data.length }
  }

  async getPackagesByShipment(shipmentUuid: string, params: QueryParams): Promise<Package[]> {
    const response = await axios.get(API_URL + `packages/shipment/${shipmentUuid}`, {
      params,
    })
    return response.data
  }
}

export default new PackageService()
