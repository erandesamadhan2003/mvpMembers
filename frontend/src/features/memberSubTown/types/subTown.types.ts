import type { AuditFields } from '@/types/common.types'
import type { MemberCenter } from '@/features/memberCenter/types/memberCenter.types'

export interface MemberSubTown extends AuditFields {
    organisationMemberSubTownID: number
    organizationMemberCenterID: number
    subTownID: string
    subTownName: string
    oCode?: number | null
    organizationMemberCenter?: MemberCenter | null
}

export interface CreateMemberSubTownRequest {
    subTownName: string
    organizationMemberCenterID: number
}

export interface UpdateMemberSubTownRequest {
    subTownName: string
    organizationMemberCenterID: number
}