import { useState } from 'react'
import {
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
import { Form } from '../models/form'
import { DetailsPanel } from './DetailsPanel'

type SortOrder = 'asc' | 'desc'

interface Column<T> {
  key: string | keyof T
  label: string
  render_key?: keyof T
}

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

  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleSort = (column: keyof T) => {
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
    setSelectedItem(item)
    setDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
  }

  const handleDelete = () => {
    if (!selectedItem) {
      console.log('Nothing selected for deletion.')
      return
    }
    onDelete(selectedItem)
  }

  const handleEdit = () => {
    if (!selectedItem) {
      console.log('Nothing selected for deletion.')
      return
    }
    onEdit(selectedItem)
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
                    <TableCell key={String(column.key)}>
                      {column.render_key
                        ? item[column.render_key] !== undefined
                          ? String(Object(item[column.render_key])[column.key])
                          : ''
                        : item[column.key] !== undefined
                          ? String(item[column.key])
                          : ''}
                    </TableCell>
                  ))}
                </TableRow>
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
      {selectedItem && (
        <DetailsPanel
          open={detailsOpen}
          onClose={handleCloseDetails}
          item={selectedItem}
          schema={schema}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      )}
    </>
  )
}
