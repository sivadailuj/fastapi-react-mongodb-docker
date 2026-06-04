import { useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, Box, DialogContentText, Stack } from '@mui/material'
import { Delete, Edit, Add } from '@mui/icons-material'
import { Form, RelatedTable } from '../models/form'
import { Column } from '../models/column'
import { ConfirmationDialog } from './ConfirmationDialog'
import {
  fetchRelatedData,
  getServiceForEntityType,
  getServiceMethods,
  getParentUuidField,
} from '../services/serviceRegistry'
import DataForm from './DataForm'
import DataTable from './DataTable'

interface DetailsPanelProps<T> {
  open: boolean
  item: T
  schema: Form
  onClose: () => void
  handleDelete: () => void
  handleEdit: () => void
}

export function DetailsPanel<T extends Record<string, unknown>>({
  open,
  item,
  schema,
  onClose,
  handleDelete,
  handleEdit,
}: DetailsPanelProps<T>) {
  const [relatedDataMap, setRelatedDataMap] = useState<Record<string, unknown[]>>({})
  const [openRelatedForm, setOpenRelatedForm] = useState(false)
  const [selectedRelatedTable, setSelectedRelatedTable] = useState<RelatedTable | null>(null)
  const [editingRelatedItem, setEditingRelatedItem] = useState<Record<string, unknown> | null>(null)
  const [relatedFormInitialValues, setRelatedFormInitialValues] = useState<Record<string, unknown>>(
    {},
  )
  const [relatedTablePagination, setRelatedTablePagination] = useState<
    Record<string, { page: number; rowsPerPage: number }>
  >({})

  useEffect(() => {
    if (!open || !schema.relatedTables || schema.relatedTables.length === 0) {
      return
    }

    const loadRelatedData = async () => {
      try {
        const dataMap: Record<string, unknown[]> = {}
        for (const relatedTable of schema.relatedTables!) {
          const parentUuid = item.uuid as string
          if (parentUuid) {
            const data = await fetchRelatedData(relatedTable.entityType, parentUuid)
            dataMap[relatedTable.entityType] = data || []
          }
        }
        setRelatedDataMap(dataMap)
      } catch (err) {
        console.error('Failed to load related data:', err)
      }
    }

    loadRelatedData()
  }, [open, item, schema.relatedTables])

  const handleAddRelated = (relatedTable: RelatedTable) => {
    setSelectedRelatedTable(relatedTable)
    setEditingRelatedItem(null)
    // Set initial values using initialValueKeys if defined
    if (relatedTable.initialValueKeys) {
      const initialValues: Record<string, unknown> = {}
      relatedTable.initialValueKeys.forEach((keyPair) => {
        initialValues[keyPair.localKey] = item[keyPair.parentKey as keyof T]
      })
      setRelatedFormInitialValues(initialValues)
    } else {
      setRelatedFormInitialValues({})
    }
    setOpenRelatedForm(true)
  }

  const handleDeleteRelated = async (
    relatedTable: RelatedTable,
    relatedItem: Record<string, unknown>,
  ) => {
    try {
      const service = getServiceForEntityType(relatedTable.entityType)
      const methods = getServiceMethods(relatedTable.entityType)
      const serviceWithMethod = service as Record<string, (uuid: string) => Promise<unknown>>
      await serviceWithMethod[methods.delete](relatedItem.uuid as string)
    } catch (err) {
      console.error('Failed to delete related item:', err)
    }
  }

  const handleSubmitRelated = async (relatedItem: Record<string, unknown>) => {
    if (!selectedRelatedTable) return

    try {
      const service = getServiceForEntityType(selectedRelatedTable.entityType)
      const parentUuid = (item as Record<string, unknown>).uuid

      // Add parent UUID to the related item
      const itemWithParent = {
        ...relatedItem,
        //[selectedRelatedTable.parentUuidField]: parentUuid,
        [getParentUuidField(selectedRelatedTable.entityType)]: parentUuid,
      }

      if (editingRelatedItem) {
        // Update existing
        const methods = getServiceMethods(selectedRelatedTable.entityType)
        const serviceWithMethod = service as Record<
          string,
          (uuid: string, item: Record<string, unknown>) => Promise<unknown>
        >
        await serviceWithMethod[methods.update](itemWithParent.uuid as string, itemWithParent)
      } else {
        // Create new
        const methods = getServiceMethods(selectedRelatedTable.entityType)
        const serviceWithMethod = service as Record<
          string,
          (item: Record<string, unknown>) => Promise<unknown>
        >
        await serviceWithMethod[methods.create](itemWithParent)
      }

      // Refresh related data
      const parentUuidValue = (item as Record<string, unknown>).uuid as string
      const updatedData = await fetchRelatedData(selectedRelatedTable.entityType, parentUuidValue)
      setRelatedDataMap((prev) => ({
        ...prev,
        [selectedRelatedTable.entityType]: updatedData || [],
      }))

      setOpenRelatedForm(false)
    } catch (err) {
      console.error('Failed to save related item:', err)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{schema.title}</DialogTitle>
      <Box
        sx={{
          maxHeight: '70vh',
          overflowY: 'auto',
          /* Hide scrollbar for Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none' /* IE and Edge */,
          scrollbarWidth: 'none' /* Firefox */,
        }}
      >
        <Box sx={{ columnCount: schema.groups.length > 1 ? '2' : '1', columnGap: 4, px: 4, py: 2 }}>
          {schema.groups.map((group) => (
            <div key={group.title} style={{ marginBottom: 16 }}>
              {group.renderKey ? (
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1, px: 4 }}>
                  {group.fields.map((field) => {
                    return (
                      <DialogContentText key={field.label}>
                        <strong>{field.label}: </strong>
                        {item[group.renderKey as keyof T] !== undefined
                          ? String(Object(item[group.renderKey as keyof T])[field.name])
                          : ''}
                      </DialogContentText>
                    )
                  })}
                </Box>
              ) : (
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1, px: 4 }}>
                  {group.fields.map((field) => {
                    return (
                      <DialogContentText key={field.label}>
                        <strong>{field.label}: </strong>
                        {item[field.name as keyof T] !== undefined
                          ? String(item[field.name as keyof T])
                          : ''}
                      </DialogContentText>
                    )
                  })}
                </Box>
              )}
            </div>
          ))}
        </Box>

        {schema.relatedTables && schema.relatedTables.length > 0 && (
          <Box sx={{ px: 4, pb: 3 }}>
            {schema.relatedTables.map((relatedTable) => {
              const relatedData = (relatedDataMap[relatedTable.entityType] || []) as Record<
                string,
                unknown
              >[]
              const pagination = relatedTablePagination[relatedTable.entityType] || {
                page: 0,
                rowsPerPage: 10,
              }

              // Build columns array from relatedTable.columns
              const columns: Column<Record<string, unknown>>[] = relatedTable.columns.map(
                (col) => ({
                  key: col.key as keyof Record<string, unknown>,
                  label: col.label,
                  renderKey: col.renderKey as keyof Record<string, unknown> | undefined,
                }),
              )

              const handlePageChange = (newPage: number) => {
                setRelatedTablePagination((prev) => ({
                  ...prev,
                  [relatedTable.entityType]: { ...prev[relatedTable.entityType], page: newPage },
                }))
              }

              const handleRowsPerPageChange = (newRowsPerPage: number) => {
                setRelatedTablePagination((prev) => ({
                  ...prev,
                  [relatedTable.entityType]: {
                    ...prev[relatedTable.entityType],
                    rowsPerPage: newRowsPerPage,
                    page: 0,
                  },
                }))
              }

              const handleEditRelatedItem = (relatedItem: Record<string, unknown>) => {
                setSelectedRelatedTable(relatedTable)
                setEditingRelatedItem(relatedItem)
                setRelatedFormInitialValues(relatedItem)
                setOpenRelatedForm(true)
              }

              const handleDeleteRelatedItem = (relatedItem: Record<string, unknown>) => {
                handleDeleteRelated(relatedTable, relatedItem)
              }

              return (
                <Box key={relatedTable.entityType} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{relatedTable.title}</h3>
                    <Button
                      variant='contained'
                      size='small'
                      startIcon={<Add />}
                      onClick={() => handleAddRelated(relatedTable)}
                    >
                      Add
                    </Button>
                  </Box>

                  <DataTable
                    data={relatedData}
                    columns={columns}
                    totalCount={relatedData.length}
                    page={pagination.page}
                    rowsPerPage={pagination.rowsPerPage}
                    sortOrderProp='asc'
                    schema={relatedTable.form}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onDelete={handleDeleteRelatedItem}
                    onEdit={handleEditRelatedItem}
                  />
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
      <Stack direction='row' spacing={2} padding={2} justifyContent='flex-end'>
        <ConfirmationDialog
          title='Confirmation'
          description='Are you sure you want to delete this item?'
          handleConfirm={handleDelete}
        >
          {(showDialog) => (
            <Button variant='outlined' color='error' startIcon={<Delete />} onClick={showDialog}>
              Delete
            </Button>
          )}
        </ConfirmationDialog>
        <Button variant='contained' endIcon={<Edit />} onClick={handleEdit}>
          Edit
        </Button>
      </Stack>
      {selectedRelatedTable && (
        <DataForm
          open={openRelatedForm}
          schema={selectedRelatedTable.form}
          initialValues={relatedFormInitialValues}
          onClose={() => setOpenRelatedForm(false)}
          onSubmit={handleSubmitRelated}
        />
      )}
    </Dialog>
  )
}
