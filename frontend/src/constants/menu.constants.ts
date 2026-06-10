import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  LayoutDashboard,
  MapPin,
  Settings,
  Shield,
  UserCog,
  Users,
  UsersRound,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes.constants'

export interface MenuItem {
  id: string
  label: string
  href?: string
  icon?: LucideIcon
  children?: MenuItem[]
  badge?: string
}

export const SIDEBAR_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
  },
  {
    id: 'master-data',
    label: 'Master Data',
    icon: Building2,
    children: [
      {
        id: 'member-sections',
        label: 'Member Sections',
        href: ROUTES.memberSections,
      },
      {
        id: 'member-towns',
        label: 'Member Towns',
        href: ROUTES.memberTowns,
      },
      {
        id: 'member-centers',
        label: 'Member Centers',
        href: ROUTES.memberCenters,
      },
      {
        id: 'member-sub-towns',
        label: 'Member Sub Towns',
        href: ROUTES.memberSubTowns,
      }
    ],
  },
  {
    id: 'members',
    label: 'Members',
    icon: Users,
    children: [
      { id: 'member-list', label: 'Member List', href: ROUTES.members },
      { id: 'add-member', label: 'Register Member', href: ROUTES.memberCreate },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: Shield,
    children: [
      { id: 'users', label: 'Users', href: ROUTES.users, icon: UserCog },
      { id: 'roles', label: 'Roles', href: ROUTES.roles, icon: UsersRound },
      {
        id: 'permissions',
        label: 'Permissions',
        href: ROUTES.permissions,
        icon: MapPin,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: ROUTES.settings,
    icon: Settings,
  },

]
