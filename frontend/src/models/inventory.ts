import { Form } from './form'
import { Column } from './column'

export interface Inventory {
  uuid: string
  area: string
  gauge: string
  mill_no: string
  nwt_lbs: number
  osf_no: string
  position: string
  receipt_date: string
  row: string
  supplier_uuid: string
  status: string
  width_inches: string
  bay: string
  bi: string
  pl: string
  po: string
  last_updated: string
}

export const InventoryForm: Form = {
  title: 'Inventory Information',
  groups: [
    {
      title: 'Supplier Information',
      fields: [
        {
          name: 'supplier_uuid',
          label: 'Supplier UUID',
          type: 'text',
          required: true,
          disabled: true,
        },
      ],
    },
    {
      title: 'Coil Information',
      fields: [
        //{ name: 'manufacturing', label: 'Manufacturing', type: 'text' },
        { name: 'mill_no', label: 'Mill No', type: 'text', required: true },
        { name: 'nwt_lbs', label: 'NWT (lbs)', type: 'number', required: true },
        { name: 'gauge', label: 'Gauge', type: 'text', required: true },
        { name: 'width_inches', label: 'Width (inches)', type: 'text', required: true },
        { name: 'osf_no', label: 'OSF No', type: 'text', required: true },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Queued', value: 'queued' },
            { label: 'In Procurement', value: 'in_procurement' },
            { label: 'Ordered', value: 'ordered' },
            { label: 'Received', value: 'received' },
            { label: 'In Inventory', value: 'in_inventory' },
            { label: 'Reserved', value: 'reserved' },
            { label: 'Checked Out', value: 'checked_out' },
            { label: 'In Production', value: 'in_production' },
            { label: 'Depleted', value: 'depleted' },
            { label: 'Disposed', value: 'disposed' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
        },
      ],
    },
    {
      title: 'Storing Information',
      fields: [
        { name: 'area', label: 'Area', type: 'text', required: true },
        { name: 'bay', label: 'Bay', type: 'text', required: true },
        { name: 'row', label: 'Row', type: 'text', required: true },
        { name: 'position', label: 'Position', type: 'text', required: true },
      ],
    },
    {
      title: 'Purchase Information',
      fields: [{ name: 'po', label: 'PO', type: 'text', required: true }],
    },
    {
      title: 'Shipment Information',
      fields: [
        { name: 'bi', label: 'BI', type: 'text', required: true },
        { name: 'pl', label: 'PL', type: 'text', required: true },
      ],
    },
    {
      title: 'Receiving Information',
      fields: [{ name: 'receipt_date', label: 'Receipt Date', type: 'date', required: true }],
    },
    // {
    //   title: 'QC Information',
    //   fields: [{ name: 'inspected', label: 'Inspected', type: 'text' }],
    // },
  ],
}

export const InventoryColumns: Column<Inventory>[] = [
  { key: 'area' as keyof Inventory, label: 'Area' },
  { key: 'gauge' as keyof Inventory, label: 'Gauge' },
  { key: 'mill_no' as keyof Inventory, label: 'Mill No' },
  { key: 'nwt_lbs' as keyof Inventory, label: 'NWT (lbs)' },
  { key: 'osf_no' as keyof Inventory, label: 'OSF No' },
  { key: 'position' as keyof Inventory, label: 'Position' },
  { key: 'receipt_date' as keyof Inventory, label: 'Receipt Date' },
  { key: 'row' as keyof Inventory, label: 'Row' },
  { key: 'supplier_uuid' as keyof Inventory, label: 'Supplier UUID' },
  { key: 'status' as keyof Inventory, label: 'Status' },
  { key: 'width_inches' as keyof Inventory, label: 'Width (inches)' },
  { key: 'last_updated' as keyof Inventory, label: 'Last Updated' },
]
