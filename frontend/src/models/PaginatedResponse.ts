export interface PaginatedResponse<T> {
  items: T[]
  total: number
}

export interface QueryParams {
  offset?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: number
}
