import { Form } from './form'
import { Column } from './column'
import { Address } from './address'
import { InventoryColumns, InventoryForm } from './inventory'

export interface Supplier {
  uuid: string
  company: string
  contact_person: string
  short_name: string
  address: Address
  email: string
  mobile: string
  office: string
  position: string
  last_updated: string
}

export const SupplierForm: Form = {
  title: 'Supplier Information',
  groups: [
    {
      title: 'Supplier Details',
      fields: [
        { name: 'company', label: 'Company', type: 'text', required: true },
        { name: 'contact_person', label: 'Contact Person', type: 'text', required: true },
        { name: 'short_name', label: 'Short Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text', required: true },
        { name: 'mobile', label: 'Mobile', type: 'text', required: true },
        { name: 'office', label: 'Office', type: 'text', required: true },
        { name: 'position', label: 'Position', type: 'text', required: true },
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
  ],
  relatedTables: [
    {
      title: 'Inventory Items',
      entityType: 'inventory',
      initialValueKeys: [{ localKey: 'supplier_uuid', parentKey: 'uuid' }],
      columns: InventoryColumns as unknown as Column<Record<string, unknown>>[],
      form: InventoryForm,
    },
  ],
}

export const SupplierColumns: Column<Supplier>[] = [
  { key: 'company' as keyof Supplier, label: 'Company' },
  { key: 'contact_person' as keyof Supplier, label: 'Contact Person' },
  { key: 'short_name' as keyof Supplier, label: 'Short Name' },
  { key: 'street', label: 'Street', renderKey: 'address' as keyof Supplier },
  { key: 'city', label: 'City', renderKey: 'address' as keyof Supplier },
  { key: 'state', label: 'State', renderKey: 'address' as keyof Supplier },
  { key: 'country', label: 'Country', renderKey: 'address' as keyof Supplier },
  { key: 'email' as keyof Supplier, label: 'Email' },
  { key: 'mobile' as keyof Supplier, label: 'Mobile' },
  { key: 'office' as keyof Supplier, label: 'Office' },
  { key: 'position' as keyof Supplier, label: 'Position' },
  { key: 'last_updated' as keyof Supplier, label: 'Last Updated' },
]
