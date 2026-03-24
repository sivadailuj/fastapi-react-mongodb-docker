import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from '@mui/material'
import { Form, InputField, SelectOption } from '../models/form'

interface DataFormProps<T> {
  open: boolean
  schema: Form
  initialValues?: Partial<T>
  onClose: () => void
  onSubmit: (data: T) => void
}

export default function DataForm<T extends Record<string, unknown>>({
  open,
  schema,
  initialValues = {},
  onClose,
  onSubmit,
}: DataFormProps<T>) {
  const [asyncOptions, setAsyncOptions] = useState<Record<string, SelectOption[]>>({})

  const [formData, setFormData] = useState<Partial<T>>({
    ...initialValues,
  })

  useEffect(() => {
    setFormData({ ...initialValues })
  }, [initialValues])

  // const handleChange = (name: string, value: unknown) => {
  //   setFormData((prev) => ({ ...prev, [name]: value }))
  // }

  const handleChange = (name: string, value: unknown, renderKey?: string) => {
    setFormData((prev) => {
      if (!renderKey) {
        return { ...prev, [name]: value }
      }

      const nested = (prev[renderKey] as Record<string, unknown>) || {}
      return {
        ...prev,
        [renderKey]: {
          ...nested,
          [name]: value,
        },
      }
    })
  }

  const renderField = (field: InputField, renderKey?: string) => {
    const value = renderKey ? Object(formData[renderKey])[field.name] : (formData[field.name] ?? '')
    const options = field.loadOptions ? asyncOptions[field.name] || [] : field.options || []

    switch (field.type) {
      case 'textarea':
        return (
          <TextField
            required={field.required}
            fullWidth
            multiline
            rows={3}
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value, renderKey)}
          />
        )

      case 'select':
        return (
          <TextField
            required={field.required}
            select
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value, renderKey)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </TextField>
        )

      default:
        return (
          <TextField
            required={field.required}
            fullWidth
            type={field.type}
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value, renderKey)}
          />
        )
    }
  }

  useEffect(() => {
    schema.groups.forEach((group) => {
      group.fields.forEach(async (field) => {
        if (field.loadOptions) {
          const options = await field.loadOptions()
          setAsyncOptions((prev) => ({
            ...prev,
            [field.name]: options,
          }))
        }
      })
    })
  }, [])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>{schema.title}</DialogTitle>

      <DialogContent>
        {schema.groups.map((group) => (
          <div key={group.title} style={{ marginBottom: 24 }}>
            <h3>{group.title}</h3>
            {group.description && <p>{group.description}</p>}
            <Grid container spacing={2}>
              {group.renderKey
                ? group.fields.map((field) => (
                    <Grid key={field.name}>{renderField(field, group.renderKey)}</Grid>
                  ))
                : group.fields.map((field) => <Grid key={field.name}>{renderField(field)}</Grid>)}
            </Grid>
          </div>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='contained' onClick={() => onSubmit(formData as T)}>
          {initialValues ? 'Save' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
