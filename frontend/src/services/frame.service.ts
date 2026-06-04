import axios from 'axios'
import { Frame } from '../models/frame'
import { QueryParams, PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class FrameService {
  async createFrame(frame: Frame) {
    const response = await axios.post(API_URL + 'frames', frame)
    return response.data
  }

  async getFrame(frameId: string): Promise<Frame> {
    const response = await axios.get(API_URL + 'frames/' + frameId)
    return response.data
  }

  async updateFrame(frameId: string, frame: Frame): Promise<Frame> {
    const response = await axios.patch(API_URL + 'frames/' + frameId, frame)
    return response.data
  }

  async deleteFrame(frameId: string) {
    const response = await axios.delete(API_URL + `frames/${frameId}`)
    return response.data
  }

  async getFrames(params: QueryParams): Promise<PaginatedResponse<Frame>> {
    const response = await axios.get(API_URL + 'frames', {
      params,
    })
    return response.data
  }

  async getFramesByPackage(packageUuid: string, params: QueryParams): Promise<Frame[]> {
    const response = await axios.get(API_URL + `frames/package/${packageUuid}`, {
      params,
    })
    return response.data
  }
}

export default new FrameService()
