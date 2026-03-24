import { Address } from './address'
import { Form } from './form'

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
}
