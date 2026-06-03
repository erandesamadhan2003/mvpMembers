import type { MemberFormValues } from '@/features/member/components/memberForm.schema'
import type {
  CreateMemberRequest,
  Member,
  UpdateMemberRequest,
} from '@/features/member/types/member.types'

export function memberToFormValues(member: Member): MemberFormValues {
  return {
    firstName: member.firstName ?? '',
    lastName: member.lastName ?? '',
    middleName: member.middleName ?? '',
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
    memberNo: member.memberNo ?? '',
    registrationDate: member.registrationDate
      ? member.registrationDate.slice(0, 10)
      : '',
  }
}

export const emptyMemberFormValues: MemberFormValues = {
  firstName: '',
  lastName: '',
  middleName: '',
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
  memberNo: '',
  registrationDate: '',
}

export function formValuesToCreatePayload(
  values: MemberFormValues,
): CreateMemberRequest {
  return formValuesToPayload(values)
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
    firstName: values.firstName,
    lastName: values.lastName || null,
    middleName: values.middleName || null,
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
    memberNo: values.memberNo || null,
    registrationDate: values.registrationDate || null,
  }
}
