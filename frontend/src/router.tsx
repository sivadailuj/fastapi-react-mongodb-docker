import { createBrowserRouter } from 'react-router'
import ErrorPage from './error-page'
import { HydrateFallback } from './fallback'
import Home, { loader as homeLoader } from './routes/home'
import Login from './routes/login'
import { Profile } from './routes/profile'
import Register from './routes/register'
import Root from './routes/root'
import SSOLogin, { loader as ssoLoader } from './routes/sso.login'
import Users, { loader as usersLoader } from './routes/users'
import QR from './routes/qr'
import Clients from './routes/clients'
import Frames from './routes/frames'
import Inventory from './routes/inventory'
import Projects from './routes/projects'
import Orders from './routes/orders'
import Suppliers from './routes/suppliers'
import Materials from './routes/materials'
import Manufacturing from './routes/manufacturing'
import Packages from './routes/packages'
import Shipments from './routes/shipments'
import Estimates from './routes/estimates'
import ProtectedRoute from './components/ProtectedRoute'

export const routes = [
  {
    path: '/',
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        loader: homeLoader,
        HydrateFallback: HydrateFallback,
      },
      {
        path: 'sso-login-callback',
        Component: SSOLogin,
        loader: ssoLoader,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        ),
        loader: usersLoader,
        HydrateFallback: HydrateFallback,
      },
      {
        path: 'qr',
        element: (
          <ProtectedRoute>
            <QR />
          </ProtectedRoute>
        ),
      },
      {
        path: 'clients',
        element: (
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects',
        element: (
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: 'suppliers',
        element: (
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        ),
      },
      {
        path: 'inventory',
        element: (
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        ),
      },
      {
        path: 'materials',
        element: (
          <ProtectedRoute>
            <Materials />
          </ProtectedRoute>
        ),
      },
      {
        path: 'manufacturing',
        element: (
          <ProtectedRoute>
            <Manufacturing />
          </ProtectedRoute>
        ),
      },
      {
        path: 'frames',
        element: (
          <ProtectedRoute>
            <Frames />
          </ProtectedRoute>
        ),
      },
      {
        path: 'packages',
        element: (
          <ProtectedRoute>
            <Packages />
          </ProtectedRoute>
        ),
      },
      {
        path: 'shipments',
        element: (
          <ProtectedRoute>
            <Shipments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'estimates',
        element: (
          <ProtectedRoute>
            <Estimates />
          </ProtectedRoute>
        ),
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
