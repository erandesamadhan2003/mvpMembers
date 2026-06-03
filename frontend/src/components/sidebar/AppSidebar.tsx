import { memo, useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SIDEBAR_MENU, type MenuItem } from '@/constants/menu.constants'
import { ROUTES } from '@/constants/routes.constants'
import { useLayout } from '@/layouts/DashboardLayout/layout-context'
import { useAuth } from '@/features/auth/hooks'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

function MenuLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: MenuItem
  collapsed: boolean
  onNavigate: () => void
}) {
  const location = useLocation()
  const isActive =
    item.href !== undefined &&
    (location.pathname === item.href ||
      (item.href !== ROUTES.dashboard && location.pathname.startsWith(item.href)))

  if (!item.href) return null

  const Icon = item.icon

  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        collapsed && 'justify-center px-2',
      )}
      title={collapsed ? item.label : undefined}
    >
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
      {!collapsed ? <span>{item.label}</span> : null}
    </Link>
  )
}

function MenuGroup({
  item,
  collapsed,
  onNavigate,
}: {
  item: MenuItem
  collapsed: boolean
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(true)
  const Icon = item.icon

  if (!item.children?.length) {
    return <MenuLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted',
          collapsed && 'justify-center px-2',
        )}
        title={collapsed ? item.label : undefined}
      >
        {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
        {!collapsed ? (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {open ? (
              <ChevronDown className="size-4" aria-hidden />
            ) : (
              <ChevronRight className="size-4" aria-hidden />
            )}
          </>
        ) : null}
      </button>
      {open && !collapsed ? (
        <div className="ml-3 space-y-0.5 border-l border-border pl-3">
          {item.children.map((child) => (
            <MenuLink
              key={child.id}
              item={child}
              collapsed={false}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export const AppSidebar = memo(function AppSidebar() {
  const { sidebarCollapsed, closeMobileDrawer } = useLayout()
  const { logout } = useAuth()

  const onNavigate = useCallback(() => {
    closeMobileDrawer()
  }, [closeMobileDrawer])

  return (
    <aside
      className="dashboard-sidebar flex flex-col"
      aria-label="Main navigation"
    >
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b border-sidebar-border px-4',
          sidebarCollapsed && 'justify-center px-2',
        )}
      >
        <div
          className={cn(
            'flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground',
          )}
          aria-hidden
        >
          MV
        </div>
        {!sidebarCollapsed ? (
          <div className="ml-3 min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              MVP Members
            </p>
            <p className="truncate text-xs text-muted-foreground">ERP System</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {SIDEBAR_MENU.map((item) => (
          <MenuGroup
            key={item.id}
            item={item}
            collapsed={sidebarCollapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="p-3">
        <Separator className="mb-3" />
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-muted-foreground',
            sidebarCollapsed && 'justify-center px-2',
          )}
          onClick={() => logout()}
          aria-label="Logout"
        >
          <LogOut className="size-4" aria-hidden />
          {!sidebarCollapsed ? <span>Logout</span> : null}
        </Button>
      </div>
    </aside>
  )
})
