import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, Layers } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import frameService from '../services/frame.service'
import { Frame, FrameForm, FrameColumns } from '../models/frame'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'
import { Column } from '../models/column'

export default function FramePage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Frame | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingFrame, setEditingFrame] = useState<Frame | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const frames = await frameService.getFrames({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData((frames.items ?? []) as unknown as Array<Record<string, unknown>>)
      setTotal(frames.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch Frame:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const handleAdd = () => {
    setEditingFrame(null)
    setOpenForm(true)
  }

  const handleDelete = async (frame: Record<string, unknown>) => {
    try {
      await frameService.deleteFrame(frame.uuid as string)
      console.log('Frame deleted')
      showSnackBar('Frame deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete frame:', err)
      showSnackBar('Failed to delete frame. Please try again.', 'error')
    }
  }

  const handleEdit = (frame: Record<string, unknown>) => {
    setEditingFrame(frame as unknown as Frame)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (frame: Record<string, unknown>) => {
    if (editingFrame) {
      await frameService
        .updateFrame(frame.uuid as string, frame as unknown as Frame)
        .then((updatedFrame) => {
          console.log('Frame updated', updatedFrame)
          showSnackBar('Frame updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update frame:', err)
          showSnackBar('Failed to update frame. Please try again.', 'error')
          setOpenForm(false)
          setEditingFrame(null)
        })
    } else {
      await frameService
        .createFrame(frame as unknown as Frame)
        .then((createdFrame) => {
          console.log('Frame created:', createdFrame)
          showSnackBar('Frame created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create frame:', err)
          showSnackBar('Failed to create frame. Please try again.', 'error')
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
          <Layers fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Frames</h1>
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
          searchPlaceholder='Search frames...'
        />
        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Frame
          </Button>
          <DataForm
            open={openForm}
            schema={FrameForm}
            initialValues={editingFrame as Partial<Frame>}
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
            columns={FrameColumns as unknown as Column<Record<string, unknown>>[]}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={FrameForm}
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
