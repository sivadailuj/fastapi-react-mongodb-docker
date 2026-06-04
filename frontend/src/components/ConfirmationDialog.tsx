import { useState, ReactNode } from 'react'
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'

interface ConfirmationDialogProps {
  title: string
  description: string
  handleConfirm: () => void
  children: (showDialog: () => void) => ReactNode
}

export function ConfirmationDialog({
  title,
  description,
  handleConfirm,
  children,
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false)

  const showDialog = () => {
    setOpen(true)
  }

  const hideDialog = () => {
    setOpen(false)
  }

  const confirmRequest = () => {
    handleConfirm()
    hideDialog()
  }

  return (
    <>
      {children(showDialog)}
      {open && (
        <Dialog
          open={open}
          onClose={hideDialog}
          disableEnforceFocus
          disableAutoFocus
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>{description}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmRequest} color='primary'>
              Yes
            </Button>
            <Button onClick={hideDialog} color='primary'>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
