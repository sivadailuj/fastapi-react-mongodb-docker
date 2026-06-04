import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, Inbox } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import packageService from '../services/package.service'
import { Package, PackageForm, PackageColumns } from '../models/package'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'
import { Column } from '../models/column'

export default function PackagesPage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Package | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const packages = await packageService.getPackages({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData((packages.items ?? []) as unknown as Array<Record<string, unknown>>)
      setTotal(packages.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch Packages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const handleAdd = () => {
    setEditingPackage(null)
    setOpenForm(true)
  }

  const handleDelete = async (packageItem: Record<string, unknown>) => {
    try {
      await packageService.deletePackage(packageItem.uuid as string)
      console.log('Package deleted')
      showSnackBar('Package deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete package:', err)
      showSnackBar('Failed to delete package. Please try again.', 'error')
    }
  }

  const handleEdit = (packageItem: Record<string, unknown>) => {
    setEditingPackage(packageItem as unknown as Package)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (packageItem: Record<string, unknown>) => {
    if (editingPackage) {
      await packageService
        .updatePackage(packageItem.uuid as string, packageItem as unknown as Package)
        .then((updatedPackage) => {
          console.log('Package updated', updatedPackage)
          showSnackBar('Package updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update package:', err)
          showSnackBar('Failed to update package. Please try again.', 'error')
          setOpenForm(false)
          setEditingPackage(null)
        })
    } else {
      await packageService
        .createPackage(packageItem as unknown as Package)
        .then((createdPackage) => {
          console.log('Package created:', createdPackage)
          showSnackBar('Package created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create package:', err)
          showSnackBar('Failed to create package. Please try again.', 'error')
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
          <Inbox fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Packages</h1>
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
          searchPlaceholder='Search packages...'
        />
        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Package
          </Button>
          <DataForm
            open={openForm}
            schema={PackageForm}
            initialValues={editingPackage as Partial<Package>}
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
            columns={PackageColumns as unknown as Column<Record<string, unknown>>[]}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={PackageForm}
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
