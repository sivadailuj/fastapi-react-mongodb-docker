export interface Column<T> {
  key: string | keyof T
  label: string
  renderKey?: keyof T
  path?: string[]
}
