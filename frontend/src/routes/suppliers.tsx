import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, Warehouse } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import supplierService from '../services/supplier.service'
import { Supplier, SupplierForm, SupplierColumns } from '../models/supplier'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'
import { Column } from '../models/column'

export default function SuppliersPage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Supplier | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const suppliers = await supplierService.getSuppliers({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData((suppliers.items ?? []) as unknown as Array<Record<string, unknown>>)
      setTotal(suppliers.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch Suppliers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const handleAdd = () => {
    setEditingSupplier(null)
    setOpenForm(true)
  }

  const handleDelete = async (supplier: Record<string, unknown>) => {
    try {
      await supplierService.deleteSupplier(supplier.uuid as string)
      console.log('Supplier deleted')
      showSnackBar('Supplier deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete supplier:', err)
      showSnackBar('Failed to delete supplier. Please try again.', 'error')
    }
  }

  const handleEdit = (supplier: Record<string, unknown>) => {
    setEditingSupplier(supplier as unknown as Supplier)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (supplier: Record<string, unknown>) => {
    if (editingSupplier) {
      await supplierService
        .updateSupplier(supplier.uuid as string, supplier as unknown as Supplier)
        .then((updatedSupplier) => {
          console.log('Supplier updated', updatedSupplier)
          showSnackBar('Supplier updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update supplier:', err)
          showSnackBar('Failed to update supplier. Please try again.', 'error')
          setOpenForm(false)
          setEditingSupplier(null)
        })
    } else {
      await supplierService
        .createSupplier(supplier as unknown as Supplier)
        .then((createdSupplier) => {
          console.log('Supplier created:', createdSupplier)
          showSnackBar('Supplier created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create supplier:', err)
          showSnackBar('Failed to create supplier. Please try again.', 'error')
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
          <Warehouse fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Suppliers</h1>
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
          searchPlaceholder='Search suppliers...'
        />
        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Supplier
          </Button>
          <DataForm
            open={openForm}
            schema={SupplierForm}
            initialValues={editingSupplier as Partial<Supplier>}
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
            columns={SupplierColumns as unknown as Column<Record<string, unknown>>[]}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={SupplierForm}
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
