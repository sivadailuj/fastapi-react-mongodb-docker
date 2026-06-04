import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, Dashboard } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import materialService from '../services/material.service'
import { RawMaterial, RawMaterialForm, RawMaterialColumns } from '../models/rawmaterial'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'
import { Column } from '../models/column'

export default function MaterialsPage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof RawMaterial | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingRawMaterial, setEditingRawMaterial] = useState<RawMaterial | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const materials = await materialService.getMaterials({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData((materials.items ?? []) as unknown as Array<Record<string, unknown>>)
      setTotal(materials.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch Materials:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const handleAdd = () => {
    setEditingRawMaterial(null)
    setOpenForm(true)
  }

  const handleDelete = async (material: Record<string, unknown>) => {
    try {
      await materialService.deleteMaterial(material.uuid as string)
      console.log('Material deleted')
      showSnackBar('Material deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete material:', err)
      showSnackBar('Failed to delete material. Please try again.', 'error')
    }
  }

  const handleEdit = (material: Record<string, unknown>) => {
    setEditingRawMaterial(material as unknown as RawMaterial)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (material: Record<string, unknown>) => {
    if (editingRawMaterial) {
      await materialService
        .updateMaterial(material.uuid as string, material as unknown as RawMaterial)
        .then((updatedMaterial) => {
          console.log('Material updated', updatedMaterial)
          showSnackBar('Material updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update material:', err)
          showSnackBar('Failed to update material. Please try again.', 'error')
          setOpenForm(false)
          setEditingRawMaterial(null)
        })
    } else {
      await materialService
        .createMaterial(material as unknown as RawMaterial)
        .then((createdMaterial) => {
          console.log('Material created:', createdMaterial)
          showSnackBar('Material created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create material:', err)
          showSnackBar('Failed to create material. Please try again.', 'error')
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
          <Dashboard fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Raw Materials</h1>
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
          searchPlaceholder='Search raw materials...'
        />
        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Material
          </Button>
          <DataForm
            open={openForm}
            schema={RawMaterialForm}
            initialValues={editingRawMaterial as Partial<RawMaterial>}
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
            columns={RawMaterialColumns as unknown as Column<Record<string, unknown>>[]}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={RawMaterialForm}
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
