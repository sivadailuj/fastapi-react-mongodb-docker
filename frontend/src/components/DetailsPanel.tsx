import { Button, Dialog, DialogTitle, Box, DialogContentText, Stack } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import { Form } from '../models/form'

interface DetailsPanelProps<T> {
  open: boolean
  item: T
  schema: Form
  onClose: () => void
  handleDelete: () => void
  handleEdit: () => void
}

export function DetailsPanel<T extends Record<string, unknown>>({
  open,
  item,
  schema,
  onClose,
  handleDelete,
  handleEdit,
}: DetailsPanelProps<T>) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{schema.title}</DialogTitle>
      {schema.groups.map((group) => (
        <div key={group.title} style={{ marginBottom: 16 }}>
          {group.renderKey ? (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1, px: 4 }}>
              {group.fields.map((field) => {
                return (
                  <DialogContentText key={field.label}>
                    <strong>{field.label}: </strong>
                    {item[group.renderKey as keyof T] !== undefined
                      ? String(Object(item[group.renderKey as keyof T])[field.name])
                      : ''}
                  </DialogContentText>
                )
              })}
            </Box>
          ) : (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1, px: 4 }}>
              {group.fields.map((field) => {
                return (
                  <DialogContentText key={field.label}>
                    <strong>{field.label}: </strong>
                    {item[field.name as keyof T] !== undefined
                      ? String(item[field.name as keyof T])
                      : ''}
                  </DialogContentText>
                )
              })}
            </Box>
          )}
        </div>
      ))}
      <Stack direction='row' spacing={2} padding={2} justifyContent='flex-end'>
        <Button variant='outlined' color='error' startIcon={<Delete />} onClick={handleDelete}>
          Delete
        </Button>
        <Button variant='contained' endIcon={<Edit />} onClick={handleEdit}>
          Edit
        </Button>
      </Stack>
    </Dialog>
  )
}
