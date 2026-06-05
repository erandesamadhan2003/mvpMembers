import type { MemberFormValues } from '@/features/member/components/memberForm.schema'
import type {
  CreateMemberRequest,
  Member,
  UpdateMemberRequest,
} from '@/features/member/types/member.types'

export function memberToFormValues(member: Member): MemberFormValues {
  return {
    nameTitleID: member.nameTitleID ?? undefined,
    firstName: member.firstName ?? '',
    lastName: member.lastName ?? '',
    middleName: member.middleName ?? '',
    nameInNativeLanguage: member.nameInNativeLanguage ?? '',
    phoneNo: member.phoneNo ?? '',
    eMail: member.eMail ?? '',
    memberSectionID: member.memberSectionID ?? undefined,
    organizationMemberCenterID:
      member.organizationMemberCenterID ?? undefined,
    city: member.city ?? '',
    taluka: member.taluka ?? '',
    district: member.district ?? '',
    states: member.states ?? '',
    pinCode: member.pinCode ?? '',
    pCity: member.pCity ?? '',
    pTaluka: member.pTaluka ?? '',
    pDistrict: member.pDistrict ?? '',
    pPinCode: member.pPinCode ?? '',
    gender: member.gender ?? '',
    dob: member.dob ? member.dob.slice(0, 10) : '',
    qualification: member.qualification ?? '',
    nominee: member.nominee ?? '',
    adharID: member.adharID ?? '',
    panNo: member.panNo ?? '',
    memberNo: member.memberNo ?? '',
    registrationDate: member.registrationDate
      ? member.registrationDate.slice(0, 10)
      : '',
  }
}

export const emptyMemberFormValues: MemberFormValues = {
  nameTitleID: undefined,
  firstName: '',
  lastName: '',
  middleName: '',
  nameInNativeLanguage: '',
  phoneNo: '',
  eMail: '',
  city: '',
  taluka: '',
  district: '',
  states: '',
  pinCode: '',
  pCity: '',
  pTaluka: '',
  pDistrict: '',
  pPinCode: '',
  gender: '',
  dob: '',
  qualification: '',
  nominee: '',
  adharID: '',
  panNo: '',
  memberNo: '',
  registrationDate: '',
  memberSectionID: null,
}

export interface CreateMemberOptions {
  isTransfer?: boolean
  transferOrganizationMemberID?: number | null
}

export function formValuesToCreatePayload(
  values: MemberFormValues,
  options?: CreateMemberOptions,
): CreateMemberRequest {
  return {
    ...formValuesToPayload(values),
    isTransfer: options?.isTransfer ?? false,
    transferOrganizationMemberID: options?.transferOrganizationMemberID ?? null,
  }
}

export function formValuesToUpdatePayload(
  values: MemberFormValues,
): UpdateMemberRequest {
  return formValuesToPayload(values)
}

function formValuesToPayload(
  values: MemberFormValues,
): CreateMemberRequest & UpdateMemberRequest {
  return {
    nameTitleID: values.nameTitleID ?? null,
    firstName: values.firstName,
    lastName: values.lastName || null,
    middleName: values.middleName || null,
    nameInNativeLanguage: values.nameInNativeLanguage || null,
    phoneNo: values.phoneNo || null,
    eMail: values.eMail || null,
    memberSectionID: values.memberSectionID ?? null,
    organizationMemberCenterID:
      values.organizationMemberCenterID ?? null,
    city: values.city || null,
    taluka: values.taluka || null,
    district: values.district || null,
    states: values.states || null,
    pinCode: values.pinCode || null,
    pCity: values.pCity || null,
    pTaluka: values.pTaluka || null,
    pDistrict: values.pDistrict || null,
    pPinCode: values.pPinCode || null,
    gender: values.gender || null,
    dob: values.dob || null,
    qualification: values.qualification || null,
    nominee: values.nominee || null,
    adharID: values.adharID || null,
    panNo: values.panNo || null,
    memberNo: values.memberNo || null,
    registrationDate: values.registrationDate || null,
  }
}
