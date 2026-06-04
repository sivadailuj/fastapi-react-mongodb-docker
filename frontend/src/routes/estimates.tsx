import { Box, Typography } from '@mui/material'
import { SquareFoot } from '@mui/icons-material'

export default function EstimatesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SquareFoot fontSize='large' sx={{ color: 'primary.dark', mr: 2 }} />
        <Typography variant='h4'>Estimates</Typography>
      </Box>
      <Typography>
        This section is available in the navigation, but the estimates feature is not implemented
        yet.
      </Typography>
    </Box>
  )
}
