import { Stack, Paper, Box } from '@mui/material'
import { QrCode } from '@mui/icons-material'

export default function QR() {
  return (
    <Stack
      sx={{
        display: 'flex',
        height: '100%',
        p: 4,
        gap: 3,
      }}
    >
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
          <QrCode fontSize='large' sx={{ color: 'primary.dark' }} />
        </Box>
        <h1>QR Scan</h1>
      </Box>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <p>Scan a QR code to open the workflow dialog.</p>
        <p>You can change the status of the workflow by scanning the QR code.</p>
      </Paper>
    </Stack>
  )
}
