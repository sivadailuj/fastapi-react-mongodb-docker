import { Form } from './form'
import { Column } from './column'

export interface Order {
  uuid: string
  client_uuid: string
  project_uuid: string
  job_no: string
  purchase_order: string
  phase: string
  batch: string
  area: string
  level: string
  planned_start_date: string
  planned_end_date: string
  status: string
  last_updated: string
}

export const OrderForm: Form = {
  title: 'Order Information',
  groups: [
    {
      title: 'Order Details',
      fields: [
        { name: 'client_uuid', label: 'Client UUID', type: 'text', required: true, disabled: true },
        {
          name: 'project_uuid',
          label: 'Project UUID',
          type: 'text',
          required: true,
          disabled: true,
        },
        { name: 'job_no', label: 'Job No', type: 'text', required: true },
        { name: 'purchase_order', label: 'Purchase Order', type: 'text', required: true },
        { name: 'phase', label: 'Phase', type: 'text', required: true },
        { name: 'batch', label: 'Batch', type: 'text', required: true },
        { name: 'area', label: 'Area', type: 'text', required: true },
        { name: 'level', label: 'Level', type: 'text', required: true },
        { name: 'planned_start_date', label: 'Planned Start Date', type: 'date', required: true },
        { name: 'planned_end_date', label: 'Planned End Date', type: 'date', required: true },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { label: 'In Planning', value: 'in_planning' },
            { label: 'Queued', value: 'queued' },
            { label: 'In Raw Materials', value: 'in_rawmaterials' },
            { label: 'In Manufacturing', value: 'in_manufacturing' },
            { label: 'In Assembly', value: 'in_assembly' },
            { label: 'In Packaging', value: 'in_packaging' },
            { label: 'In Shipping', value: 'in_shipping' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Completed', value: 'completed' },
          ],
        },
      ],
    },
  ],
}

export const OrderColumns: Column<Order>[] = [
  { key: 'client_uuid' as keyof Order, label: 'Client UUID' },
  { key: 'project_uuid' as keyof Order, label: 'Project UUID' },
  { key: 'job_no' as keyof Order, label: 'Job No' },
  { key: 'purchase_order' as keyof Order, label: 'Purchase Order' },
  { key: 'status' as keyof Order, label: 'Status' },
  { key: 'last_updated' as keyof Order, label: 'Last Updated' },
]
