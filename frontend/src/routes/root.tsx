import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router'
import TopMenuBar from '../components/TopMenuBar'
import { useLocation } from 'react-router'

export default function Root() {
  const location = useLocation()
  const hideTopMenuBar = ['/login', '/register'].includes(location.pathname)

  return (
    <Box sx={{ display: 'flex' }}>
      {!hideTopMenuBar && <TopMenuBar />}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          paddingBottom: 5,
        }}
      >
        <Toolbar></Toolbar>
        <Outlet />
      </Box>
    </Box>
  )
}
