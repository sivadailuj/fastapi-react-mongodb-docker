import { Form } from './form'
import { Column } from './column'
import { Address } from './address'
import { OrderColumns, OrderForm } from './order'

export interface Project {
  uuid: string
  name: string
  client_uuid: string
  category: string
  address: Address
  sow: string
  type: string
  construction_type: string
  models: string
  phase_volleys: string
  stories: string
  units: string
  last_updated: string
}

export const ProjectForm: Form = {
  title: 'Project Information',
  groups: [
    {
      title: 'Project Details',
      fields: [
        { name: 'client_uuid', label: 'Client UUID', type: 'text', required: true, disabled: true },
        { name: 'name', label: 'Project Name', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'text', required: true },
      ],
    },
    {
      title: '',
      renderKey: 'address',
      fields: [
        { name: 'street', label: 'Street', type: 'text', required: true },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'state', label: 'State', type: 'text' },
        { name: 'zip_code', label: 'ZIP Code', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
      ],
    },
    {
      title: 'Technical Details',
      fields: [
        { name: 'sow', label: 'SOW', type: 'text', required: true },
        { name: 'type', label: 'Type', type: 'text', required: true },
        {
          name: 'construction_type',
          label: 'Construction Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Full CFS', value: 'Full CFS' },
            { label: 'Hybrid CFS + CMU', value: 'Hybrid CFS + CMU' },
            { label: 'Hybrid CFS + Concrete', value: 'Hybrid CFS + Concrete' },
            { label: 'Hybrid CFS + Wood', value: 'Hybrid CFS + Wood' },
            { label: 'Hybrid CFS + HRS', value: 'Hybrid CFS + HRS' },
          ],
        },
        { name: 'models', label: 'Models', type: 'text', required: true },
        { name: 'phase_volleys', label: 'Phase Volleys', type: 'text', required: true },
        { name: 'stories', label: 'Stories', type: 'text', required: true },
        { name: 'units', label: 'Units', type: 'text', required: true },
      ],
    },
  ],
  relatedTables: [
    {
      title: 'Orders',
      entityType: 'order',
      initialValueKeys: [
        { localKey: 'project_uuid', parentKey: 'uuid' },
        { localKey: 'client_uuid', parentKey: 'client_uuid' },
      ],
      columns: OrderColumns as unknown as Column<Record<string, unknown>>[],
      form: OrderForm,
    },
  ],
}

export const ProjectColumns: Column<Project>[] = [
  { key: 'name' as keyof Project, label: 'Project Name' },
  { key: 'sow' as keyof Project, label: 'SOW' },
  { key: 'type' as keyof Project, label: 'Type' },
  { key: 'client_uuid' as keyof Project, label: 'Client UUID' },
  { key: 'models' as keyof Project, label: 'Models' },
  { key: 'phase_volleys' as keyof Project, label: 'Phase Volleys' },
  { key: 'stories' as keyof Project, label: 'Stories' },
  { key: 'units' as keyof Project, label: 'Units' },
  { key: 'last_updated' as keyof Project, label: 'Last Updated' },
]
