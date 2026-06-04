import axios from 'axios'
import { Shipment } from '../models/shipment'
import { QueryParams, PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class ShipmentService {
  async createShipment(shipment: Shipment) {
    const response = await axios.post(API_URL + 'shipments', shipment)
    return response.data
  }

  async getShipment(shipmentId: string): Promise<Shipment> {
    const response = await axios.get(API_URL + 'shipments/' + shipmentId)
    return response.data
  }

  async updateShipment(shipmentId: string, shipment: Shipment): Promise<Shipment> {
    const response = await axios.patch(API_URL + 'shipments/' + shipmentId, shipment)
    return response.data
  }

  async deleteShipment(shipmentId: string) {
    const response = await axios.delete(API_URL + `shipments/${shipmentId}`)
    return response.data
  }

  async getShipments(params: QueryParams): Promise<PaginatedResponse<Shipment>> {
    const response = await axios.get(API_URL + 'shipments', {
      params,
    })
    return { items: response.data, total: response.data.length }
  }
}

export default new ShipmentService()
