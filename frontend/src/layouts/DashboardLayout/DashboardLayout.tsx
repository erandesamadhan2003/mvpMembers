import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import '@/App.css'
import { AppSidebar } from '@/components/sidebar/AppSidebar'
import { AppNavbar } from '@/components/navbar/AppNavbar'
import { LayoutProvider, useLayout } from '@/layouts/DashboardLayout/layout-context'

function DashboardShell() {
  const { sidebarCollapsed, mobileDrawerOpen, closeMobileDrawer } = useLayout()

  return (
    <div
      className="dashboard-shell"
      data-sidebar-collapsed={sidebarCollapsed}
      data-mobile-drawer-open={mobileDrawerOpen}
    >
      {mobileDrawerOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-35 bg-stone-900/40 lg:hidden"
          aria-label="Close navigation menu"
          onClick={closeMobileDrawer}
        />
      ) : null}
      <AppSidebar />
      <AppNavbar />
      <div className="dashboard-main">
        <main className="dashboard-content page-enter" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export const DashboardLayout = memo(function DashboardLayout() {
  return (
    <LayoutProvider>
      <DashboardShell />
    </LayoutProvider>
  )
})