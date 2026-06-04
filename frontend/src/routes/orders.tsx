import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, PostAdd } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import orderService from '../services/order.service'
import { Order, OrderForm, OrderColumns } from '../models/order'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'
import { Column } from '../models/column'

export default function OrdersPage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Order | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const orders = await orderService.getOrders({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData((orders.items ?? []) as unknown as Array<Record<string, unknown>>)
      setTotal(orders.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch Orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const handleAdd = () => {
    setEditingOrder(null)
    setOpenForm(true)
  }

  const handleDelete = async (order: Record<string, unknown>) => {
    try {
      await orderService.deleteOrder(order.uuid as string)
      console.log('Order deleted')
      showSnackBar('Order deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete order:', err)
      showSnackBar('Failed to delete order. Please try again.', 'error')
    }
  }

  const handleEdit = (order: Record<string, unknown>) => {
    setEditingOrder(order as unknown as Order)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (order: Record<string, unknown>) => {
    if (editingOrder) {
      await orderService
        .updateOrder(order.uuid as string, order as unknown as Order)
        .then((updatedOrder) => {
          console.log('Order updated', updatedOrder)
          showSnackBar('Order updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update order:', err)
          showSnackBar('Failed to update order. Please try again.', 'error')
          setOpenForm(false)
          setEditingOrder(null)
        })
    } else {
      await orderService
        .createOrder(order as unknown as Order)
        .then((createdOrder) => {
          console.log('Order created:', createdOrder)
          showSnackBar('Order created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create order:', err)
          showSnackBar('Failed to create order. Please try again.', 'error')
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
          <PostAdd fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Orders</h1>
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
          searchPlaceholder='Search orders...'
        />
        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Order
          </Button>
          <DataForm
            open={openForm}
            schema={OrderForm}
            initialValues={editingOrder as Partial<Order>}
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
            columns={OrderColumns as unknown as Column<Record<string, unknown>>[]}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={OrderForm}
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
