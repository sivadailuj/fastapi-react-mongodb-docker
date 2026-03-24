import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, PeopleOutline } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import clientService from '../services/client.service'
import { Client, ClientForm } from '../models/client'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'

export default function ClientPage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Client | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const clients = await clientService.getClients({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData(clients.items as unknown as Array<Record<string, unknown>>)
      setTotal(clients.total)
    } catch (err) {
      console.error('Failed to fetch Client:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const columns = [
    { key: 'company' as keyof Client, label: 'Company' },
    { key: 'email' as keyof Client, label: 'Email' },
    { key: 'category' as keyof Client, label: 'Category' },
    { key: 'street', label: 'Street', render_key: 'address' as keyof Client },
    { key: 'city', label: 'City', render_key: 'address' as keyof Client },
    { key: 'state', label: 'State', render_key: 'address' as keyof Client },
    { key: 'country', label: 'Country', render_key: 'address' as keyof Client },
    { key: 'mobile' as keyof Client, label: 'Mobile' },
    { key: 'web_page' as keyof Client, label: 'Web Page' },
    { key: 'notes' as keyof Client, label: 'Notes' },
    { key: 'last_updated' as keyof Client, label: 'Last Updated' },
  ]

  const handleAdd = () => {
    setEditingClient(null)
    setOpenForm(true)
  }

  const handleDelete = async (client: Record<string, unknown>) => {
    try {
      await clientService.deleteClient(client.uuid as string)
      console.log('Client deleted')
      showSnackBar('Client deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete client:', err)
      showSnackBar('Failed to delete client. Please try again.', 'error')
    }
  }

  const handleEdit = (client: Record<string, unknown>) => {
    setEditingClient(client as unknown as Client)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (client: Record<string, unknown>) => {
    if (editingClient) {
      await clientService
        .updateClient(client.uuid as string, client as unknown as Client)
        .then((updatedClient) => {
          console.log('Client updated', updatedClient)
          showSnackBar('Client updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update client:', err)
          showSnackBar('Failed to update client. Please try again.', 'error')
          setOpenForm(false)
          setEditingClient(null)
        })
    } else {
      await clientService
        .createClient(client as unknown as Client)
        .then((createdClient) => {
          console.log('Client created:', createdClient)
          showSnackBar('Client created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create client:', err)
          showSnackBar('Failed to create client. Please try again.', 'error')
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
          <PeopleOutline fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Clients</h1>
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
          searchPlaceholder='Search clients...'
        />

        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Client
          </Button>
          <DataForm
            open={openForm}
            schema={ClientForm}
            initialValues={editingClient as Partial<Client>}
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
            columns={columns}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={ClientForm}
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
