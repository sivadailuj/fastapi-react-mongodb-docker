import { Form } from './form'
import { Column } from './column'

export interface Frame {
  uuid: string
  client_uuid: string
  project_uuid: string
  package_uuid: string
  ppo_id: string
  name: string
  type: string
  nwt: number
  assembly_file: string
  machine: string
  status: string
  last_updated: string
}

export const FrameForm: Form = {
  title: 'Frame Information',
  groups: [
    {
      title: 'Frame Details',
      fields: [
        { name: 'client_uuid', label: 'Client UUID', type: 'text', required: true },
        { name: 'project_uuid', label: 'Project UUID', type: 'text', required: true },
        { name: 'package_uuid', label: 'Package UUID', type: 'text', required: true },
        { name: 'ppo_id', label: 'PPO ID', type: 'text', required: true },
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'nwt', label: 'NWT', type: 'number' },
        { name: 'assembly_file', label: 'Assembly File', type: 'text' },
        { name: 'machine', label: 'Machine', type: 'text' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { label: 'Queued', value: 'queued' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'In Review', value: 'in_review' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Completed', value: 'completed' },
          ],
        },
      ],
    },
  ],
}

export const FrameColumns: Column<Frame>[] = [
  { key: 'client_uuid' as keyof Frame, label: 'Client UUID' },
  { key: 'project_uuid' as keyof Frame, label: 'Project UUID' },
  { key: 'ppo_id' as keyof Frame, label: 'PPO ID' },
  { key: 'name' as keyof Frame, label: 'Name' },
  { key: 'type' as keyof Frame, label: 'Type' },
  { key: 'nwt' as keyof Frame, label: 'NWT' },
  { key: 'assembly_file' as keyof Frame, label: 'Assembly File' },
  { key: 'status' as keyof Frame, label: 'Status' },
]
