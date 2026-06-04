import { Form } from './form'
import { Column } from './column'
import { FrameColumns, FrameForm } from './frame'

export interface Package {
  uuid: string
  client_uuid: string
  project_uuid: string
  shipment_uuid: string
  ppo_id: string
  name: string
  type: string
  status: string
  last_updated: string
}

export const PackageForm: Form = {
  title: 'Package Information',
  groups: [
    {
      title: 'Package Details',
      fields: [
        { name: 'client_uuid', label: 'Client UUID', type: 'text', required: true },
        { name: 'project_uuid', label: 'Project UUID', type: 'text', required: true },
        { name: 'shipment_uuid', label: 'Shipment UUID', type: 'text', required: true },
        { name: 'ppo_id', label: 'PPO ID', type: 'text', required: true },
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'type', label: 'Type', type: 'text', required: true },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Queued', value: 'queued' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Printing Label', value: 'printing_label' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Completed', value: 'completed' },
          ],
        },
      ],
    },
  ],
  relatedTables: [
    {
      title: 'Frames',
      entityType: 'frame',
      initialValueKeys: [{ localKey: 'package_uuid', parentKey: 'uuid' }],
      columns: FrameColumns as unknown as Column<Record<string, unknown>>[],
      form: FrameForm,
    },
  ],
}

export const PackageColumns: Column<Package>[] = [
  { key: 'client_uuid' as keyof Package, label: 'Client UUID' },
  { key: 'project_uuid' as keyof Package, label: 'Project UUID' },
  { key: 'ppo_id' as keyof Package, label: 'PPO ID' },
  { key: 'name' as keyof Package, label: 'Name' },
  { key: 'type' as keyof Package, label: 'Type' },
  { key: 'status' as keyof Package, label: 'Status' },
  { key: 'last_updated' as keyof Package, label: 'Last Updated' },
]
