import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { Column } from '../models/column'
import { Form, RelatedTable } from '../models/form'
import {
  fetchRelatedData,
  getServiceForEntityType,
  getServiceMethods,
  getParentUuidField,
} from '../services/serviceRegistry'
import DataForm from './DataForm'
import { ConfirmationDialog } from './ConfirmationDialog'

type SortOrder = 'asc' | 'desc'

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  totalCount: number
  page: number
  rowsPerPage: number
  sortByProp?: keyof T
  sortOrderProp: SortOrder
  schema: Form
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onSortChange?: (column: keyof T | string, order: SortOrder) => void
  onDelete: (item: T) => void
  onEdit: (item: T) => void
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  totalCount,
  page,
  rowsPerPage,
  sortByProp,
  sortOrderProp,
  schema,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  onDelete,
  onEdit,
}: DataTableProps<T>) {
  const [sortBy, setSortBy] = useState<keyof T | undefined>(sortByProp)
  const [sortOrder, setSortOrder] = useState<SortOrder>(sortOrderProp)

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [relatedDataMap, setRelatedDataMap] = useState<Record<string, Record<string, unknown[]>>>(
    {},
  )
  const [selectedRelatedTable, setSelectedRelatedTable] = useState<RelatedTable | null>(null)
  const [openRelatedForm, setOpenRelatedForm] = useState(false)
  const [editingRelatedItem, setEditingRelatedItem] = useState<Record<string, unknown> | null>(null)
  const [relatedFormInitialValues, setRelatedFormInitialValues] = useState<Record<string, unknown>>(
    {},
  )
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  useEffect(() => {
    const loadRelatedDataForExpandedRows = async () => {
      if (!schema.relatedTables || schema.relatedTables.length === 0) return

      for (const item of data) {
        const itemId = String(item.id || item.uuid || item._id)
        if (expandedRows.has(itemId) && !relatedDataMap[itemId]) {
          try {
            const dataMap: Record<string, unknown[]> = {}
            for (const relatedTable of schema.relatedTables) {
              const parentUuid = item.uuid as string
              if (parentUuid) {
                const relatedData = await fetchRelatedData(relatedTable.entityType, parentUuid)
                dataMap[relatedTable.entityType] = relatedData || []
              }
            }
            setRelatedDataMap((prev) => ({
              ...prev,
              [itemId]: dataMap,
            }))
          } catch (err) {
            console.error('Failed to load related data:', err)
          }
        }
      }
    }

    loadRelatedDataForExpandedRows()
  }, [expandedRows, data, schema.relatedTables, relatedDataMap])

  const handleSort = (column: keyof T | string) => {
    let newOrder: SortOrder = 'asc'

    if (sortBy === column) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    }

    setSortBy(column)
    setSortOrder(newOrder)
    onSortChange?.(column, newOrder)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10)
    onRowsPerPageChange(newSize)
  }

  const handleRowClick = (item: T) => {
    const itemId = String(item.id || item.uuid || item._id)
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleAddRelated = (relatedTable: RelatedTable, parentItem: T) => {
    setSelectedRelatedTable(relatedTable)
    setEditingRelatedItem(null)
    setExpandedItemId(String(parentItem.id || parentItem.uuid || parentItem._id))
    // Set initial values using initialValueKeys if defined
    if (relatedTable.initialValueKeys) {
      const initialValues: Record<string, unknown> = {}
      relatedTable.initialValueKeys.forEach((keyPair) => {
        initialValues[keyPair.localKey] = parentItem[keyPair.parentKey as keyof T]
      })
      setRelatedFormInitialValues(initialValues)
    } else {
      setRelatedFormInitialValues({})
    }
    setOpenRelatedForm(true)
  }

  const handleEditRelatedItem = (
    relatedTable: RelatedTable,
    relatedItem: Record<string, unknown>,
    parentItem: T,
  ) => {
    setSelectedRelatedTable(relatedTable)
    setEditingRelatedItem(relatedItem)
    setExpandedItemId(String(parentItem.id || parentItem.uuid || parentItem._id))
    setRelatedFormInitialValues(relatedItem)
    setOpenRelatedForm(true)
  }

  const handleDeleteRelatedItem = async (
    relatedTable: RelatedTable,
    relatedItem: Record<string, unknown>,
  ) => {
    try {
      const service = getServiceForEntityType(relatedTable.entityType)
      const methods = getServiceMethods(relatedTable.entityType)
      const serviceWithMethod = service as Record<string, (uuid: string) => Promise<unknown>>
      await serviceWithMethod[methods.delete](relatedItem.uuid as string)

      // Refresh related data for the expanded item
      if (expandedItemId && relatedDataMap[expandedItemId]) {
        const parentItem = data.find(
          (item) => String(item.id || item.uuid || item._id) === expandedItemId,
        )
        if (parentItem) {
          const parentUuid = (parentItem as Record<string, unknown>).uuid as string
          const updatedData = await fetchRelatedData(relatedTable.entityType, parentUuid)
          setRelatedDataMap((prev) => ({
            ...prev,
            [expandedItemId]: {
              ...prev[expandedItemId],
              [relatedTable.entityType]: updatedData || [],
            },
          }))
        }
      }
    } catch (err) {
      console.error('Failed to delete related item:', err)
    }
  }

  const handleSubmitRelated = async (relatedItem: Record<string, unknown>) => {
    if (!selectedRelatedTable || !expandedItemId) return

    try {
      const service = getServiceForEntityType(selectedRelatedTable.entityType)
      const parentItem = data.find(
        (item) => String(item.id || item.uuid || item._id) === expandedItemId,
      )
      if (!parentItem) return

      const parentUuid = (parentItem as Record<string, unknown>).uuid

      // Add parent UUID to the related item
      const itemWithParent = {
        ...relatedItem,
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
      const parentUuidValue = (parentItem as Record<string, unknown>).uuid as string
      const updatedData = await fetchRelatedData(selectedRelatedTable.entityType, parentUuidValue)
      setRelatedDataMap((prev) => ({
        ...prev,
        [expandedItemId]: {
          ...prev[expandedItemId],
          [selectedRelatedTable.entityType]: updatedData || [],
        },
      }))

      setOpenRelatedForm(false)
    } catch (err) {
      console.error('Failed to save related item:', err)
    }
  }

  return (
    <>
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    sortDirection={sortBy === column.key ? sortOrder : false}
                  >
                    {onSortChange ? (
                      <TableSortLabel
                        active={sortBy === column.key}
                        direction={sortBy === column.key ? sortOrder : 'asc'}
                        onClick={() => handleSort(column.key)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((item, index) => (
                <>
                  <TableRow
                    key={String(item.id || index)}
                    onClick={() => handleRowClick(item)}
                    sx={{
                      backgroundColor: index % 2 === 0 ? 'action.hover' : 'background.paper',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {column.renderKey
                          ? item[column.renderKey] !== undefined
                            ? String(Object(item[column.renderKey])[column.key])
                            : ''
                          : item[column.key] !== undefined
                            ? String(item[column.key])
                            : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={columns.length} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedRows.has(String(item.id || item.uuid || item._id))}>
                        <Box sx={{ p: 2 }}>
                          {/* Details content */}
                          <Box
                            sx={{
                              columnCount: schema.groups.length > 1 ? '2' : '1',
                              columnGap: 4,
                              mb: 2,
                            }}
                          >
                            {schema.groups.map((group) => (
                              <div key={group.title} style={{ marginBottom: 16 }}>
                                {group.renderKey ? (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {group.fields.map((field) => (
                                      <div key={field.label}>
                                        <strong>{field.label}: </strong>
                                        {item[group.renderKey as keyof T] !== undefined
                                          ? String(
                                              Object(item[group.renderKey as keyof T])[field.name],
                                            )
                                          : ''}
                                      </div>
                                    ))}
                                  </Box>
                                ) : (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {group.fields.map((field) => (
                                      <div key={field.label}>
                                        <strong>{field.label}: </strong>
                                        {item[field.name as keyof T] !== undefined
                                          ? String(item[field.name as keyof T])
                                          : ''}
                                      </div>
                                    ))}
                                  </Box>
                                )}
                              </div>
                            ))}
                          </Box>

                          {/* Related Tables */}
                          {schema.relatedTables && schema.relatedTables.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              {schema.relatedTables.map((relatedTable) => {
                                const itemId = String(item.id || item.uuid || item._id)
                                const relatedData = (relatedDataMap[itemId]?.[
                                  relatedTable.entityType
                                ] || []) as Record<string, unknown>[]

                                return (
                                  <Box key={relatedTable.entityType} sx={{ mb: 3 }}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                      }}
                                    >
                                      <h4 style={{ margin: 0 }}>{relatedTable.title}</h4>
                                      <Button
                                        variant='contained'
                                        size='small'
                                        startIcon={<Add />}
                                        onClick={() => handleAddRelated(relatedTable, item)}
                                      >
                                        Add
                                      </Button>
                                    </Box>
                                    {relatedData.length > 0 ? (
                                      <DataTable
                                        data={relatedData}
                                        columns={relatedTable.columns}
                                        totalCount={relatedData.length}
                                        page={0}
                                        rowsPerPage={10}
                                        sortOrderProp='asc'
                                        schema={relatedTable.form}
                                        onPageChange={() => {}}
                                        onRowsPerPageChange={() => {}}
                                        onDelete={(relatedItem) =>
                                          handleDeleteRelatedItem(relatedTable, relatedItem)
                                        }
                                        onEdit={(relatedItem) =>
                                          handleEditRelatedItem(relatedTable, relatedItem, item)
                                        }
                                      />
                                    ) : (
                                      <div>
                                        No related {relatedTable.title.toLowerCase()} found.
                                      </div>
                                    )}
                                  </Box>
                                )
                              })}
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                              variant='outlined'
                              color='error'
                              size='small'
                              onClick={() => onDelete(item)}
                            >
                              Delete
                            </Button>
                            <Button variant='contained' size='small' onClick={() => onEdit(item)}>
                              Edit
                            </Button>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component='div'
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {selectedRelatedTable && (
        <DataForm
          open={openRelatedForm}
          schema={selectedRelatedTable.form}
          initialValues={relatedFormInitialValues}
          onClose={() => setOpenRelatedForm(false)}
          onSubmit={handleSubmitRelated}
        />
      )}
    </>
  )
}
