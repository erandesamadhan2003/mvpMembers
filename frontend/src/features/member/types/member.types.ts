import type { AuditFields } from '@/types/common.types'
import type { MemberCenter } from '@/features/memberCenter/types/memberCenter.types'
import type { MemberSection } from '@/features/memberSection/types/memberSection.types'

export interface Member extends AuditFields {
  organizationMemberID: number
  nameTitleID?: number | null
  lastName?: string | null
  firstName?: string | null
  middleName?: string | null
  nameInNativeLanguage?: string | null
  city?: string | null
  taluka?: string | null
  district?: string | null
  states?: string | null
  pinCode?: string | null
  pCity?: string | null
  pTaluka?: string | null
  pDistrict?: string | null
  pPinCode?: string | null
  gender?: string | null
  dob?: string | null
  qualification?: string | null
  occupationID?: number | null
  nominee?: string | null
  phoneNo?: string | null
  eMail?: string | null
  adharID?: string | null
  panNo?: string | null
  memberNo?: string | null
  registrationDate?: string | null
  memberCardIssue: boolean
  death: boolean
  deathDate?: string | null
  memberSectionID?: number | null
  organizationMemberCenterID?: number | null
  oCode?: number | null
  transferOrganizationMemberID?: number | null
  isTransfer?: boolean | null
  prvShareHolder?: string | null
  flagStatus?: string | null
  memberSection?: MemberSection | null
  organizationMemberCenter?: MemberCenter | null
}

export interface CreateMemberRequest {
  firstName: string
  lastName?: string | null
  middleName?: string | null
  nameInNativeLanguage?: string | null
  city?: string | null
  taluka?: string | null
  district?: string | null
  states?: string | null
  pinCode?: string | null
  pCity?: string | null
  pTaluka?: string | null
  pDistrict?: string | null
  pPinCode?: string | null
  gender?: string | null
  dob?: string | null
  qualification?: string | null
  occupationID?: number | null
  nominee?: string | null
  phoneNo?: string | null
  eMail?: string | null
  adharID?: string | null
  panNo?: string | null
  memberNo?: string | null
  registrationDate?: string | null
  memberSectionID?: number | null
  organizationMemberCenterID?: number | null
}

export interface UpdateMemberRequest {
  firstName: string
  lastName?: string | null
  middleName?: string | null
  nameInNativeLanguage?: string | null
  city?: string | null
  taluka?: string | null
  district?: string | null
  states?: string | null
  pinCode?: string | null
  pCity?: string | null
  pTaluka?: string | null
  pDistrict?: string | null
  pPinCode?: string | null
  gender?: string | null
  dob?: string | null
  qualification?: string | null
  occupationID?: number | null
  nominee?: string | null
  phoneNo?: string | null
  eMail?: string | null
  adharID?: string | null
  panNo?: string | null
  memberSectionID?: number | null
  organizationMemberCenterID?: number | null
}
