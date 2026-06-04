import { Address } from './address'
import { Form } from './form'
import { Column } from './column'
import { ProjectColumns, ProjectForm } from './project'

export interface Client {
  uuid: string
  company?: string
  category?: string
  address?: Address
  mobile?: string
  email: string
  fax?: string
  extension?: string
  web_page?: string
  notes?: string
  last_updated: string
}

export const ClientForm: Form = {
  title: 'Client Information',
  groups: [
    {
      title: 'Basic Details',
      fields: [
        { name: 'company', label: 'Company Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'mobile', label: 'Mobile', type: 'text' },
        { name: 'web_page', label: 'Web Page', type: 'text' },
      ],
    },
    {
      title: 'Address',
      fields: [
        { name: 'street', label: 'Street', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'state', label: 'State', type: 'text' },
        { name: 'zip_code', label: 'ZIP Code', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
      ],
      renderKey: 'address',
    },
    {
      title: 'Additional Info',
      fields: [{ name: 'notes', label: 'Notes', type: 'textarea' }],
    },
  ],
  relatedTables: [
    {
      title: 'Projects',
      entityType: 'project',
      initialValueKeys: [{ localKey: 'client_uuid', parentKey: 'uuid' }],
      columns: ProjectColumns as unknown as Column<Record<string, unknown>>[],
      form: ProjectForm,
    },
  ],
}

export const ClientColumns: Column<Client>[] = [
  { key: 'company' as keyof Client, label: 'Company' },
  { key: 'email' as keyof Client, label: 'Email' },
  { key: 'category' as keyof Client, label: 'Category' },
  { key: 'street', label: 'Street', renderKey: 'address' as keyof Client },
  { key: 'city', label: 'City', renderKey: 'address' as keyof Client },
  { key: 'state', label: 'State', renderKey: 'address' as keyof Client },
  { key: 'country', label: 'Country', renderKey: 'address' as keyof Client },
  { key: 'mobile' as keyof Client, label: 'Mobile' },
  { key: 'web_page' as keyof Client, label: 'Web Page' },
  { key: 'notes' as keyof Client, label: 'Notes' },
  { key: 'last_updated' as keyof Client, label: 'Last Updated' },
]
