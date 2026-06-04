import { Form } from './form'
import { Column } from './column'

export interface RawMaterial {
  uuid: string
  client_uuid: string
  project_uuid: string
  order_uuid: string
  manufacturing_uuid: string
  ppo_id: string
  machine: string
  required_nwt: number
  available_nwt: number
  status: string
  last_updated: string
}

export const RawMaterialForm: Form = {
  title: 'Raw Material Information',
  groups: [
    {
      title: 'Raw Material Details',
      fields: [
        { name: 'client_uuid', label: 'Client UUID', type: 'text', required: true },
        { name: 'project_uuid', label: 'Project UUID', type: 'text', required: true },
        { name: 'order_uuid', label: 'Order UUID', type: 'text', required: true },
        { name: 'manufacturing_uuid', label: 'Manufacturing UUID', type: 'text', required: true },
        { name: 'ppo_id', label: 'PPO ID', type: 'text', required: true },
        { name: 'machine', label: 'Machine', type: 'text', required: true },
        { name: 'required_nwt', label: 'Required NWT', type: 'number', required: true },
        { name: 'available_nwt', label: 'Available NWT', type: 'number', required: true },
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
  ],
}

export const RawMaterialColumns: Column<RawMaterial>[] = [
  { key: 'client_uuid' as keyof RawMaterial, label: 'Client UUID' },
  { key: 'project_uuid' as keyof RawMaterial, label: 'Project UUID' },
  { key: 'ppo_id' as keyof RawMaterial, label: 'PPO ID' },
  { key: 'machine' as keyof RawMaterial, label: 'Machine' },
  { key: 'required_nwt' as keyof RawMaterial, label: 'Required NWT' },
  { key: 'available_nwt' as keyof RawMaterial, label: 'Available NWT' },
  { key: 'status' as keyof RawMaterial, label: 'Status' },
  { key: 'last_updated' as keyof RawMaterial, label: 'Last Updated' },
]
