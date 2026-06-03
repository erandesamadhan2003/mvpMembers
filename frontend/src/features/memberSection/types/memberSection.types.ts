import type { AuditFields } from '@/types/common.types'

export interface MemberSection extends AuditFields {
  memberSectionID: number
  memberSectionName: string
}

export interface CreateMemberSectionRequest {
  name: string
}

export interface UpdateMemberSectionRequest {
  name: string
}
