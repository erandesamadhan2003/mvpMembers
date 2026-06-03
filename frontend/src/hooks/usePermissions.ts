import { useMemo } from 'react'
import type { Role } from '@/constants/roles.constants'
import { hasRole } from '@/utils/permissions'

interface UsePermissionsOptions {
  roles?: Role[]
}

export function usePermissions({ roles = [] }: UsePermissionsOptions = {}) {
  return useMemo(
    () => ({
      roles,
      can: (required: Role | Role[]) => hasRole(roles, required),
    }),
    [roles],
  )
}
