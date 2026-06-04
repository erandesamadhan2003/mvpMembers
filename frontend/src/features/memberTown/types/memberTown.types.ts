import type { AuditFields } from '@/types/common.types'

export interface MemberTown extends AuditFields {
  organizationMemberTownID: number
  townID: number
  townName: string
}

export interface CreateMemberTownRequest {
  townName: string
}

export interface UpdateMemberTownRequest {
  townName: string
}
