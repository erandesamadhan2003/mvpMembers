import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import '@/App.css'

export const AuthLayout = memo(function AuthLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <Outlet />
    </div>
  )
})
