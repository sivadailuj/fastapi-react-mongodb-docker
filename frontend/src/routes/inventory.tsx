import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, Inventory as InventoryIcon } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import inventoryService from '../services/inventory.service'
import { Inventory, InventoryForm, InventoryColumns } from '../models/inventory'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'
import { Column } from '../models/column'

export default function InventoryPage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Inventory | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const inventories = await inventoryService.getInventories({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData((inventories.items ?? []) as unknown as Array<Record<string, unknown>>)
      setTotal(inventories.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch Inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const handleAdd = () => {
    setEditingInventory(null)
    setOpenForm(true)
  }

  const handleDelete = async (inventory: Record<string, unknown>) => {
    try {
      await inventoryService.deleteInventory(inventory.uuid as string)
      console.log('Inventory deleted')
      showSnackBar('Inventory deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete inventory:', err)
      showSnackBar('Failed to delete inventory. Please try again.', 'error')
    }
  }

  const handleEdit = (inventory: Record<string, unknown>) => {
    setEditingInventory(inventory as unknown as Inventory)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (inventory: Record<string, unknown>) => {
    if (editingInventory) {
      await inventoryService
        .updateInventory(inventory.uuid as string, inventory as unknown as Inventory)
        .then((updatedInventory) => {
          console.log('Inventory updated', updatedInventory)
          showSnackBar('Inventory updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update inventory:', err)
          showSnackBar('Failed to update inventory. Please try again.', 'error')
          setOpenForm(false)
          setEditingInventory(null)
        })
    } else {
      await inventoryService
        .createInventory(inventory as unknown as Inventory)
        .then((createdInventory) => {
          console.log('Inventory created:', createdInventory)
          showSnackBar('Inventory created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create inventory:', err)
          showSnackBar('Failed to create inventory. Please try again.', 'error')
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
          <InventoryIcon fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Inventory</h1>
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
          searchPlaceholder='Search inventory...'
        />
        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Inventory
          </Button>
          <DataForm
            open={openForm}
            schema={InventoryForm}
            initialValues={editingInventory as Partial<Inventory>}
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
            columns={InventoryColumns as unknown as Column<Record<string, unknown>>[]}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={InventoryForm}
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
