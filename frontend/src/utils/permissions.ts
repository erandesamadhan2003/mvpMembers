import type { Role } from '@/constants/roles.constants'

export function hasRole(
  userRoles: Role[] | undefined,
  required: Role | Role[],
): boolean {
  if (!userRoles?.length) return false
  const requiredRoles = Array.isArray(required) ? required : [required]
  return requiredRoles.some((role) => userRoles.includes(role))
}
