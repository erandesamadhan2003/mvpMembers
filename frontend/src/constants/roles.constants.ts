export const ROLES = {
  admin: 'Admin',
  user: 'User',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
