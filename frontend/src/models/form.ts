export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'date'

export interface SelectOption {
  label: string
  value: string | number
}

export interface InputField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  gridWidth?: number
  options?: SelectOption[]
  loadOptions?: () => Promise<SelectOption[]>
}

export interface Group {
  title: string
  description?: string
  fields: InputField[]
  gridColumns?: number
  renderKey?: string
}

export interface Form {
  title: string
  groups: Group[]
}
