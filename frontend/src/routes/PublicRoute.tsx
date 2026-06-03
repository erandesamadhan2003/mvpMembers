import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.constants'
import { isAuthenticated } from '@/utils/token'

export function PublicRoute() {
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
