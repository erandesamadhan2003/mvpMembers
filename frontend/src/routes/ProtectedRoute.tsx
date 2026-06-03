import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.constants'
import { isAuthenticated } from '@/utils/token'

export function ProtectedRoute() {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
