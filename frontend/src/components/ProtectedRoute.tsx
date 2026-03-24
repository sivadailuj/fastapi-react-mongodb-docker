import { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../contexts/auth'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to='/login' />

  return <>{children}</>
}
