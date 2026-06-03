import type { AuditFields } from '@/types/common.types'

export interface MemberTown extends AuditFields {
  organizationMemberTownID: number
  townID: number
  townName: string
  oCode?: number | null
}

export interface CreateMemberTownRequest {
  townID: number
  townName: string
  oCode?: number | null
}

export interface UpdateMemberTownRequest {
  townID: number
  townName: string
  oCode?: number | null
}
