import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { Add, Book } from '@mui/icons-material'
import DataTable from '../components/DataTable'
import SearchBar from '../components/DataTableSearchBar'
import projectService from '../services/project.service'
import { Project, ProjectForm, ProjectColumns } from '../models/project'
import { useSnackBar } from '../contexts/snackbar'
import DataForm from '../components/DataForm'
import { Column } from '../models/column'

export default function ProjectsPage() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Project | string>('last_updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { showSnackBar } = useSnackBar()

  const fetchData = async () => {
    setLoading(true)

    try {
      const projects = await projectService.getProjects({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 1 : -1,
      })

      setData((projects.items ?? []) as unknown as Array<Record<string, unknown>>)
      setTotal(projects.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch Projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  const handleAdd = () => {
    setEditingProject(null)
    setOpenForm(true)
  }

  const handleDelete = async (project: Record<string, unknown>) => {
    try {
      await projectService.deleteProject(project.uuid as string)
      console.log('Project deleted')
      showSnackBar('Project deleted successfully!', 'success')
      fetchData()
    } catch (err) {
      console.error('Failed to delete project:', err)
      showSnackBar('Failed to delete project. Please try again.', 'error')
    }
  }

  const handleEdit = (project: Record<string, unknown>) => {
    setEditingProject(project as unknown as Project)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmit = async (project: Record<string, unknown>) => {
    if (editingProject) {
      await projectService
        .updateProject(project.uuid as string, project as unknown as Project)
        .then((updatedProject) => {
          console.log('Project updated', updatedProject)
          showSnackBar('Project updated successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to update project:', err)
          showSnackBar('Failed to update project. Please try again.', 'error')
          setOpenForm(false)
          setEditingProject(null)
        })
    } else {
      await projectService
        .createProject(project as unknown as Project)
        .then((createdProject) => {
          console.log('Project created:', createdProject)
          showSnackBar('Project created successfully!', 'success')
          fetchData()
          setOpenForm(false)
        })
        .catch((err) => {
          console.error('Failed to create project:', err)
          showSnackBar('Failed to create project. Please try again.', 'error')
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
          <Book fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>Projects</h1>
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
          searchPlaceholder='Search projects...'
        />
        <>
          <Button variant='contained' startIcon={<Add />} onClick={handleAdd}>
            Add Project
          </Button>
          <DataForm
            open={openForm}
            schema={ProjectForm}
            initialValues={editingProject as Partial<Project>}
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
            columns={ProjectColumns as unknown as Column<Record<string, unknown>>[]}
            totalCount={total}
            page={page}
            rowsPerPage={rowsPerPage}
            sortByProp={sortBy}
            sortOrderProp={sortOrder}
            schema={ProjectForm}
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
