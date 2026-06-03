import { memo } from 'react'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLayout } from '@/layouts/DashboardLayout/layout-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const AppNavbar = memo(function AppNavbar() {
  const { sidebarCollapsed, toggleSidebar, setMobileDrawerOpen } = useLayout()

  return (
    <header className="dashboard-navbar flex items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          className="lg:hidden"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden lg:inline-flex"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-3">
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
