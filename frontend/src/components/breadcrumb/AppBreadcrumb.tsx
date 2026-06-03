import { memo, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ROUTES } from '@/constants/routes.constants'

const LABELS: Record<string, string> = {
  '': 'Dashboard',
  'member-sections': 'Member Sections',
  'member-towns': 'Member Towns',
  'member-centers': 'Member Centers',
  members: 'Members',
  documents: 'Documents',
  create: 'Create',
  edit: 'Edit',
  admin: 'Administration',
  users: 'Users',
  roles: 'Roles',
  permissions: 'Permissions',
  settings: 'Settings',
}

export const AppBreadcrumb = memo(function AppBreadcrumb() {
  const location = useLocation()

  const segments = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    return parts.map((part, index) => ({
      label: LABELS[part] ?? part,
      path: `/${parts.slice(0, index + 1).join('/')}`,
      isLast: index === parts.length - 1,
    }))
  }, [location.pathname])

  if (location.pathname === ROUTES.dashboard) {
    return (
      <Breadcrumb aria-label="Breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb aria-label="Breadcrumb">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to={ROUTES.dashboard} />}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment) => (
          <span key={segment.path} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {segment.isLast ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link to={segment.path} />}>
                  {segment.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
})
