import axios from 'axios'
import { Project } from '../models/project'
import { QueryParams, PaginatedResponse } from '../models/PaginatedResponse'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class ProjectService {
  async createProject(project: Project) {
    const response = await axios.post(API_URL + 'projects', project)
    return response.data
  }

  async getProject(projectId: string): Promise<Project> {
    const response = await axios.get(API_URL + 'projects/' + projectId)
    return response.data
  }

  async updateProject(projectId: string, project: Project): Promise<Project> {
    const response = await axios.patch(API_URL + 'projects/' + projectId, project)
    return response.data
  }

  async deleteProject(projectId: string) {
    const response = await axios.delete(API_URL + `projects/${projectId}`)
    return response.data
  }

  async getProjects(params: QueryParams): Promise<PaginatedResponse<Project>> {
    const response = await axios.get(API_URL + 'projects', {
      params,
    })
    return { items: response.data, total: response.data.length }
  }

  async getProjectsByClient(clientUuid: string, params: QueryParams): Promise<Project[]> {
    const response = await axios.get(API_URL + `projects/client/${clientUuid}`, {
      params,
    })
    return response.data
  }
}

export default new ProjectService()
