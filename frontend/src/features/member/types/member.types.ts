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

  // Permanent Address
  town?: string | null
  city?: string | null
  taluka?: string | null
  district?: string | null
  states?: string | null
  pinCode?: string | null

  // Present Address
  pTown?: string | null
  pCity?: string | null
  pTaluka?: string | null
  pDistrict?: string | null
  pPinCode?: string | null

  // Marathi Permanent Address
  mTown?: string | null
  mCity?: string | null
  mTaluka?: string | null
  mDistrict?: string | null
  mStates?: string | null
  mPinCode?: string | null

  // Marathi Present Address
  mPTown?: string | null
  mPCity?: string | null
  mPTaluka?: string | null
  mPDistrict?: string | null
  mPPinCode?: string | null

  gender?: string | null
  dob?: string | null
  qualification?: string | null
  occupationID?: number | null
  nominee?: string | null
  phoneNo?: string | null
  mobileNo?: string | null
  eMail?: string | null
  adharID?: string | null
  panNo?: string | null
  memberNo?: string | null
  regNo?: string | null
  applicationNo?: number | null
  registrationDate?: string | null
  memberCardIssue: boolean
  death: boolean
  deathDate?: string | null
  deathRef?: string | null
  prvShareHolder?: string | null
  objection?: string | null
  memberSectionID?: number | null
  organizationMemberCenterID?: number | null
  organizationMemberSubTownID?: number | null
  oCode?: number | null
  transferOrganizationMemberID?: number | null
  isTransfer?: boolean | null
  flagStatus?: string | null
  memberSection?: MemberSection | null
  organizationMemberCenter?: MemberCenter | null
}

export interface CreateMemberRequest {
  nameTitleID?: number | null
  firstName: string
  lastName?: string | null
  middleName?: string | null
  nameInNativeLanguage?: string | null
  town?: string | null
  city?: string | null
  taluka?: string | null
  district?: string | null
  states?: string | null
  pinCode?: string | null
  pTown?: string | null
  pCity?: string | null
  pTaluka?: string | null
  pDistrict?: string | null
  pPinCode?: string | null
  mTown?: string | null
  mCity?: string | null
  mTaluka?: string | null
  mDistrict?: string | null
  mStates?: string | null
  mPinCode?: string | null
  mPTown?: string | null
  mPCity?: string | null
  mPTaluka?: string | null
  mPDistrict?: string | null
  mPPinCode?: string | null
  gender?: string | null
  dob?: string | null
  qualification?: string | null
  occupationID?: number | null
  nominee?: string | null
  phoneNo?: string | null
  mobileNo?: string | null
  eMail?: string | null
  adharID?: string | null
  panNo?: string | null
  memberNo?: string | null
  regNo?: string | null
  applicationNo?: number | null
  registrationDate?: string | null
  prvShareHolder?: string | null
  objection?: string | null
  memberSectionID?: number | null
  organizationMemberCenterID?: number | null
  organizationMemberSubTownID?: number | null
  isTransfer?: boolean
  transferOrganizationMemberID?: number | null
}

export interface UpdateMemberRequest {
  nameTitleID?: number | null
  firstName: string
  lastName?: string | null
  middleName?: string | null
  nameInNativeLanguage?: string | null
  town?: string | null
  city?: string | null
  taluka?: string | null
  district?: string | null
  states?: string | null
  pinCode?: string | null
  pTown?: string | null
  pCity?: string | null
  pTaluka?: string | null
  pDistrict?: string | null
  pPinCode?: string | null
  mTown?: string | null
  mCity?: string | null
  mTaluka?: string | null
  mDistrict?: string | null
  mStates?: string | null
  mPinCode?: string | null
  mPTown?: string | null
  mPCity?: string | null
  mPTaluka?: string | null
  mPDistrict?: string | null
  mPPinCode?: string | null
  gender?: string | null
  dob?: string | null
  qualification?: string | null
  occupationID?: number | null
  nominee?: string | null
  phoneNo?: string | null
  mobileNo?: string | null
  eMail?: string | null
  adharID?: string | null
  panNo?: string | null
  regNo?: string | null
  applicationNo?: number | null
  prvShareHolder?: string | null
  objection?: string | null
  death?: boolean
  deathDate?: string | null
  deathRef?: string | null
  memberSectionID?: number | null
  organizationMemberCenterID?: number | null
  organizationMemberSubTownID?: number | null
}