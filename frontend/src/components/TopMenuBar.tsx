import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import {
  Book,
  Build,
  ChevronLeft,
  ChevronRight,
  Dashboard,
  GridView,
  Inbox,
  Inventory,
  Layers,
  LocalShipping,
  Logout,
  PeopleOutline,
  Person,
  PostAdd,
  QrCode,
  SquareFoot,
  Warehouse,
} from '@mui/icons-material'
import {
  Avatar,
  AppBar,
  AppBarProps,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import * as React from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../contexts/auth'
import { JSX } from 'react/jsx-runtime'

type Tab = {
  label: string
  shortLabel?: string
  icon: JSX.Element
  href: string
}

const TABS: Array<Tab> = [
  {
    label: 'Home',
    icon: <GridView />,
    href: '/',
  },
  {
    label: 'QR',
    icon: <QrCode />,
    href: '/qr',
  },
  {
    label: 'Clients',
    icon: <PeopleOutline />,
    href: '/clients',
  },
  {
    label: 'Projects',
    icon: <Book />,
    href: '/projects',
  },
  {
    label: 'Orders',
    icon: <PostAdd />,
    href: '/orders',
  },
  {
    label: 'Suppliers',
    icon: <Warehouse />,
    href: '/suppliers',
  },
  {
    label: 'Inventory',
    icon: <Inventory />,
    href: '/inventory',
  },
  {
    label: 'Raw Materials',
    shortLabel: 'Materials',
    icon: <Dashboard />,
    href: '/materials',
  },
  {
    label: 'Manufacturing',
    shortLabel: 'Manuf.',
    icon: <Build />,
    href: '/manufacturing',
  },
  {
    label: 'Frames',
    icon: <Layers />,
    href: '/frames',
  },
  {
    label: 'Packages',
    icon: <Inbox />,
    href: '/packages',
  },
  {
    label: 'Shipments',
    icon: <LocalShipping />,
    href: '/shipments',
  },
  {
    label: 'Users',
    icon: <Person />,
    href: '/users',
  },
  {
    label: 'Estimates',
    icon: <SquareFoot />,
    href: '/estimates',
  },
]

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface MuiAppBarProps extends AppBarProps {
  open?: boolean
}

const MuiAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<MuiAppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))

const MuiDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}))

export default function TopMenuBar() {
  const theme = useTheme()
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    setAnchorEl(null)
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MuiAppBar position='absolute' open={drawerOpen}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={[
              {
                marginRight: 5,
              },
              drawerOpen && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
            <Link component={NavLink} to='/' color='inherit' underline='none'>
              TAGS
            </Link>
          </Typography>

          {user === undefined && (
            <Box aria-label='button group'>
              <Button component={NavLink} to='/login' sx={{ color: '#fff' }}>
                Login
              </Button>
              <Button component={NavLink} to='/register' sx={{ color: '#fff' }}>
                Register
              </Button>
            </Box>
          )}

          {user !== undefined && user.is_superuser && (
            <Button component={NavLink} to='/users' sx={{ color: '#fff' }}>
              Users
            </Button>
          )}

          {user !== undefined && (
            <Tooltip title='Account settings'>
              <IconButton
                onClick={handleClick}
                size='small'
                sx={{ ml: 2 }}
                aria-controls={menuOpen ? 'account-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={menuOpen ? 'true' : undefined}
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  alt={user.first_name + ' ' + user.last_name}
                  src={user.picture && user.picture}
                >
                  {user && user.first_name ? user.first_name[0] : 'P'}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          id='account-menu'
          open={menuOpen}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Link component={NavLink} to='/profile' color='inherit' underline='none'>
            <MenuItem onClick={handleClose}>
              <Avatar
                alt={user && user.first_name + ' ' + user.last_name}
                src={user && user.picture && user.picture}
              />{' '}
              Profile
            </MenuItem>
          </Link>

          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize='small' />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </MuiAppBar>
      <MuiDrawer variant='permanent' open={drawerOpen}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          sx={{
            /* Hide scrollbar for Chrome, Safari and Opera */
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            /* Hide scrollbar for IE, Edge and Firefox */
            msOverflowStyle: 'none' /* IE and Edge */,
            scrollbarWidth: 'none' /* Firefox */,
            overflow: 'auto' /* Add this to ensure content can still scroll */,
            bgcolor: 'primary.dark',
          }}
        >
          {TABS.map((tab) => (
            <ListItem key={tab.label} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={window.location.pathname === tab.href}
                component={NavLink}
                to={tab.href}
                sx={[
                  {
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '0%',
                        bottom: '0%',
                        width: '4px',
                        bgcolor: 'secondary.main',
                        borderRadius: '0 4px 4px 0',
                      },
                    },
                  },
                  drawerOpen
                    ? {
                        minHeight: 55,
                        px: 2.5,
                        justifyContent: 'initial',
                      }
                    : {
                        minHeight: 55,
                        px: 2.5,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        py: 1,
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      color: 'primary.light',
                    },
                    drawerOpen
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                          width: '100%',
                        },
                  ]}
                >
                  {tab.icon}
                </ListItemIcon>
                <ListItemText
                  primary={drawerOpen ? tab.label : tab.shortLabel || tab.label}
                  sx={[
                    {
                      color: 'primary.light',
                    },
                    drawerOpen
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 1,
                          '& .MuiListItemText-primary': {
                            fontSize: '0.75rem',
                          },
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </MuiDrawer>
    </Box>
  )
}
