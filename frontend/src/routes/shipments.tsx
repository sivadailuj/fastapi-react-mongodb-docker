import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, LocalShipping } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import shipmentService from '../services/shipment.service'
import { Shipment, ShipmentForm, ShipmentColumns } from '../models/shipment'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'
import { Column } from '../models/column'

export default function ShipmentsPage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Shipment | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const shipments = await shipmentService.getShipments({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData((shipments.items ?? []) as unknown as Array<Record<string, unknown>>)
      setTotal(shipments.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch Shipments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const handleAdd = () => {
    setEditingShipment(null)
    setOpenForm(true)
  }

  const handleDelete = async (shipment: Record<string, unknown>) => {
    try {
      await shipmentService.deleteShipment(shipment.uuid as string)
      console.log('Shipment deleted')
      showSnackBar('Shipment deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete shipment:', err)
      showSnackBar('Failed to delete shipment. Please try again.', 'error')
    }
  }

  const handleEdit = (shipment: Record<string, unknown>) => {
    setEditingShipment(shipment as unknown as Shipment)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (shipment: Record<string, unknown>) => {
    if (editingShipment) {
      await shipmentService
        .updateShipment(shipment.uuid as string, shipment as unknown as Shipment)
        .then((updatedShipment) => {
          console.log('Shipment updated', updatedShipment)
          showSnackBar('Shipment updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update shipment:', err)
          showSnackBar('Failed to update shipment. Please try again.', 'error')
          setOpenForm(false)
          setEditingShipment(null)
        })
    } else {
      await shipmentService
        .createShipment(shipment as unknown as Shipment)
        .then((createdShipment) => {
          console.log('Shipment created:', createdShipment)
          showSnackBar('Shipment created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create shipment:', err)
          showSnackBar('Failed to create shipment. Please try again.', 'error')
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
          <LocalShipping fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Shipments</h1>
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
          searchPlaceholder='Search shipments...'
        />
        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Shipment
          </Button>
          <DataForm
            open={openForm}
            schema={ShipmentForm}
            initialValues={editingShipment as Partial<Shipment>}
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
            columns={ShipmentColumns as unknown as Column<Record<string, unknown>>[]}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={ShipmentForm}
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
