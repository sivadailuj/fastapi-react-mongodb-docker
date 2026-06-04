import { Form } from './form'
import { Column } from './column'
import { Address } from './address'

export interface Shipment {
  uuid: string
  name: string
  client_uuid: string
  project_uuid: string
  ppo_id: string
  consignee: string
  po_quotation: string
  carrier: string
  phone: string
  truck: string
  driver: string
  attn: string
  trailer: string
  emergency_contact: string
  emergency_contact_phone: string
  osfc_address: Address
  delivery_terms: string
  status: string
  last_updated: string
}

export const ShipmentForm: Form = {
  title: 'Shipment Information',
  groups: [
    {
      title: 'Shipment Details',
      fields: [
        { name: 'name', label: 'Shipment Name', type: 'text', required: true },
        { name: 'client_uuid', label: 'Client UUID', type: 'text', required: true },
        { name: 'project_uuid', label: 'Project UUID', type: 'text', required: true },
        { name: 'ppo_id', label: 'PPO ID', type: 'text', required: true },
        { name: 'consignee', label: 'Consignee', type: 'text', required: true },
        { name: 'po_quotation', label: 'PO/Quotation', type: 'text', required: true },
        { name: 'carrier', label: 'Carrier', type: 'text', required: true },
        { name: 'phone', label: 'Phone', type: 'text', required: true },
        { name: 'truck', label: 'Truck', type: 'text', required: true },
        { name: 'driver', label: 'Driver', type: 'text', required: true },
        { name: 'attn', label: 'Attn', type: 'text', required: true },
        { name: 'trailer', label: 'Trailer', type: 'text', required: true },
        { name: 'emergency_contact', label: 'Emergency Contact', type: 'text', required: true },
        {
          name: 'emergency_contact_phone',
          label: 'Emergency Contact Phone',
          type: 'text',
          required: true,
        },
        { name: 'delivery_terms', label: 'Delivery Terms', type: 'text', required: true },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Queued', value: 'queued' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Completed', value: 'completed' },
          ],
        },
      ],
    },
    {
      title: 'OSFC Address',
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
}

export const ShipmentColumns: Column<Shipment>[] = [
  { key: 'client_uuid' as keyof Shipment, label: 'Client UUID' },
  { key: 'project_uuid' as keyof Shipment, label: 'Project UUID' },
  { key: 'ppo_id' as keyof Shipment, label: 'PPO ID' },
  { key: 'name' as keyof Shipment, label: 'Shipment Name' },
  { key: 'status' as keyof Shipment, label: 'Status' },
  { key: 'last_updated' as keyof Shipment, label: 'Last Updated' },
]
