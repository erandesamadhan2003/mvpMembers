import { memo } from 'react'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppBreadcrumb } from '@/components/breadcrumb/AppBreadcrumb'
import { useLayout } from '@/layouts/DashboardLayout/layout-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const AppNavbar = memo(function AppNavbar() {
  const { sidebarCollapsed, toggleSidebar, setMobileDrawerOpen } = useLayout()

  return (
    <header className="dashboard-navbar flex items-center justify-between gap-4 px-4 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          className="shrink-0 lg:hidden"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden shrink-0 lg:inline-flex"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
        <div className="min-w-0 flex-1 overflow-hidden">
          <AppBreadcrumb />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">Administrator</p>
          <p className="text-xs text-muted-foreground">MVP Members ERP</p>
        </div>
        <Avatar aria-hidden>
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
})