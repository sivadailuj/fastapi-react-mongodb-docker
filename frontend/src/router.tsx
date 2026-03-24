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
//import Clients, { loader as clientsLoader } from './routes/clients'
import Clients from './routes/clients'
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
        //loader: clientsLoader,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
