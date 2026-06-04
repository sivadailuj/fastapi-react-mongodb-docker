import { Form } from './form'
import { Column } from './column'

export interface Manufacturing {
  uuid: string
  client_uuid: string
  project_uuid: string
  ppo_id: string
  job_no: string
  rfy_file: string
  material_uuid: string
  status: string
  last_updated: string
}

export const ManufacturingForm: Form = {
  title: 'Manufacturing Information',
  groups: [
    {
      title: 'Manufacturing Details',
      fields: [
        { name: 'client_uuid', label: 'Client UUID', type: 'text', required: true },
        { name: 'project_uuid', label: 'Project UUID', type: 'text', required: true },
        { name: 'ppo_id', label: 'PPO ID', type: 'text', required: true },
        { name: 'job_no', label: 'Job No', type: 'text', required: true },
        { name: 'rfy_file', label: 'RFY File', type: 'text', required: true },
        { name: 'material_uuid', label: 'Material UUID', type: 'text', required: true },
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

export const ManufacturingColumns: Column<Manufacturing>[] = [
  { key: 'client_uuid' as keyof Manufacturing, label: 'Client UUID' },
  { key: 'project_uuid' as keyof Manufacturing, label: 'Project UUID' },
  { key: 'ppo_id' as keyof Manufacturing, label: 'PPO ID' },
  { key: 'rfy_file' as keyof Manufacturing, label: 'RFY File' },
  { key: 'status' as keyof Manufacturing, label: 'Status' },
  { key: 'last_updated' as keyof Manufacturing, label: 'Last Updated' },
]
