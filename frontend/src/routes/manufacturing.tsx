import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, Build } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import manufacturingService from '../services/manufacturing.service'
import { Manufacturing, ManufacturingForm, ManufacturingColumns } from '../models/manufacturing'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'
import { Column } from '../models/column'

export default function ManufacturingPage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Manufacturing | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingManufacturing, setEditingManufacturing] = useState<Manufacturing | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const manufacturing = await manufacturingService.getManufacturings({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData((manufacturing.items ?? []) as unknown as Array<Record<string, unknown>>)
      setTotal(manufacturing.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch Manufacturing:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const handleAdd = () => {
    setEditingManufacturing(null)
    setOpenForm(true)
  }

  const handleDelete = async (manufacturing: Record<string, unknown>) => {
    try {
      await manufacturingService.deleteManufacturing(manufacturing.uuid as string)
      console.log('Manufacturing deleted')
      showSnackBar('Manufacturing deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete manufacturing:', err)
      showSnackBar('Failed to delete manufacturing. Please try again.', 'error')
    }
  }

  const handleEdit = (manufacturing: Record<string, unknown>) => {
    setEditingManufacturing(manufacturing as unknown as Manufacturing)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (manufacturing: Record<string, unknown>) => {
    if (editingManufacturing) {
      await manufacturingService
        .updateManufacturing(
          manufacturing.uuid as string,
          manufacturing as unknown as Manufacturing,
        )
        .then((updatedManufacturing) => {
          console.log('Manufacturing updated', updatedManufacturing)
          showSnackBar('Manufacturing updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update manufacturing:', err)
          showSnackBar('Failed to update manufacturing. Please try again.', 'error')
          setOpenForm(false)
          setEditingManufacturing(null)
        })
    } else {
      await manufacturingService
        .createManufacturing(manufacturing as unknown as Manufacturing)
        .then((createdManufacturing) => {
          console.log('Manufacturing created:', createdManufacturing)
          showSnackBar('Manufacturing created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create manufacturing:', err)
          showSnackBar('Failed to create manufacturing. Please try again.', 'error')
        })
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box
          sx={{
            display: 'inline-flex',
            backgroundColor: 'primary.light',
            opacity: 0.5,
            borderRadius: '50%',
            p: 2,
            mr: 2,
          }}
        >
          <Build fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Manufacturing</h1>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <SearchBar
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(0)
          }}
          searchPlaceholder='Search manufacturing...'
        />
        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Manufacturing
          </Button>
          <DataForm
            open={openForm}
            schema={ManufacturingForm}
            initialValues={editingManufacturing as Partial<Manufacturing>}
            onClose={handleCloseForm}
            onSubmit={handleSubmit}
          />
        </>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DataTable<Record<string, unknown>>
            data={Array.from(data)}
            columns={ManufacturingColumns as unknown as Column<Record<string, unknown>>[]}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={ManufacturingForm}
            onPageChange={setPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows)
              setPage(0)
            }}
            onSortChange={(column, order) => {
              setSortBy(column)
              setSortOrder(order)
            }}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </>
      )}
    </Box>
  )
}
