import type { AuditFields } from '@/types/common.types'
import type { MemberTown } from '@/features/memberTown/types/memberTown.types'

export interface MemberCenter extends AuditFields {
  organizationMemberCenterID: number
  organizationMemberTownID: number
  centerID: string
  centerName: string
  oCode?: number | null
  organizationMemberTown?: MemberTown | null
}

export interface CreateMemberCenterRequest {
  centerID: string
  centerName: string
  organizationMemberTownID: number
  oCode?: number | null
}

export interface UpdateMemberCenterRequest {
  centerID: string
  centerName: string
  organizationMemberTownID: number
  oCode?: number | null
}
