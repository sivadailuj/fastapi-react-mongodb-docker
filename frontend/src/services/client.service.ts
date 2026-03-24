import axios from 'axios'
import { Client } from '../models/client'
import { PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

interface ClientQueryParams {
  offset?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: number
}

class ClientService {
  async createClient(client: Client) {
    const response = await axios.post(API_URL + 'clients', client)
    return response.data
  }

  async getClient(clientId: string): Promise<Client> {
    const response = await axios.get(API_URL + 'clients/' + clientId)
    return response.data
  }

  async updateClient(clientId: string, client: Client): Promise<Client> {
    const response = await axios.patch(API_URL + 'clients/' + clientId, client)
    return response.data
  }

  async deleteClient(clientId: string) {
    const response = await axios.delete(API_URL + `clients/${clientId}`)
    return response.data
  }

  async getClients(params: ClientQueryParams): Promise<PaginatedResponse<Client>> {
    const response = await axios.get(API_URL + 'clients', {
      params,
    })
    return response.data
  }
}

export default new ClientService()
