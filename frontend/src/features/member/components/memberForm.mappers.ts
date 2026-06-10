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
    mobileNo: member.mobileNo ?? '',
    eMail: member.eMail ?? '',
    memberSectionID: member.memberSectionID ?? undefined,
    organizationMemberSubTownID: member.organizationMemberSubTownID ?? undefined,

    town: member.town ?? '',
    city: member.city ?? '',
    taluka: member.taluka ?? '',
    district: member.district ?? '',
    states: member.states ?? '',
    pinCode: member.pinCode ?? '',

    pTown: member.pTown ?? '',
    pCity: member.pCity ?? '',
    pTaluka: member.pTaluka ?? '',
    pDistrict: member.pDistrict ?? '',
    pPinCode: member.pPinCode ?? '',

    mTown: member.mTown ?? '',
    mCity: member.mCity ?? '',
    mTaluka: member.mTaluka ?? '',
    mDistrict: member.mDistrict ?? '',
    mStates: member.mStates ?? '',
    mPinCode: member.mPinCode ?? '',

    mPTown: member.mPTown ?? '',
    mPCity: member.mPCity ?? '',
    mPTaluka: member.mPTaluka ?? '',
    mPDistrict: member.mPDistrict ?? '',
    mPPinCode: member.mPPinCode ?? '',

    gender: member.gender ?? '',
    dob: member.dob ? member.dob.slice(0, 10) : '',
    qualification: member.qualification ?? '',
    nominee: member.nominee ?? '',
    adharID: member.adharID ?? '',
    panNo: member.panNo ?? '',
    regNo: member.regNo ?? '',
    applicationNo: member.applicationNo ?? undefined,
    prvShareHolder: member.prvShareHolder ?? '',
    objection: member.objection ?? '',
    memberNo: member.memberNo ?? '',
    registrationDate: member.registrationDate ? member.registrationDate.slice(0, 10) : '',

    death: member.death ?? false,
    deathDate: member.deathDate ? member.deathDate.slice(0, 10) : '',
    deathRef: member.deathRef ?? '',
  }
}

export const emptyMemberFormValues: MemberFormValues = {
  nameTitleID: undefined,
  firstName: '',
  lastName: '',
  middleName: '',
  nameInNativeLanguage: '',
  phoneNo: '',
  mobileNo: '',
  eMail: '',
  memberSectionID: null,
  organizationMemberSubTownID: undefined,

  town: '',
  city: '',
  taluka: '',
  district: '',
  states: '',
  pinCode: '',

  pTown: '',
  pCity: '',
  pTaluka: '',
  pDistrict: '',
  pPinCode: '',

  mTown: '',
  mCity: '',
  mTaluka: '',
  mDistrict: '',
  mStates: '',
  mPinCode: '',

  mPTown: '',
  mPCity: '',
  mPTaluka: '',
  mPDistrict: '',
  mPPinCode: '',

  gender: '',
  dob: '',
  qualification: '',
  nominee: '',
  adharID: '',
  panNo: '',
  regNo: '',
  applicationNo: undefined,
  prvShareHolder: '',
  objection: '',
  memberNo: '',
  registrationDate: '',

  death: false,
  deathDate: '',
  deathRef: '',
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

export function formValuesToUpdatePayload(values: MemberFormValues): UpdateMemberRequest {
  return {
    ...formValuesToPayload(values),
    death: values.death ?? false,
    deathDate: values.deathDate || null,
    deathRef: values.deathRef || null,
  }
}

function formValuesToPayload(values: MemberFormValues): Omit<CreateMemberRequest, 'isTransfer' | 'transferOrganizationMemberID'> {
  return {
    nameTitleID: values.nameTitleID ?? null,
    firstName: values.firstName,
    lastName: values.lastName || null,
    middleName: values.middleName || null,
    nameInNativeLanguage: values.nameInNativeLanguage || null,
    phoneNo: values.phoneNo || null,
    mobileNo: values.mobileNo || null,
    eMail: values.eMail || null,
    memberSectionID: values.memberSectionID ?? null,
    organizationMemberSubTownID: values.organizationMemberSubTownID ?? null,
    town: values.town || null,
    city: values.city || null,
    taluka: values.taluka || null,
    district: values.district || null,
    states: values.states || null,
    pinCode: values.pinCode || null,
    pTown: values.pTown || null,
    pCity: values.pCity || null,
    pTaluka: values.pTaluka || null,
    pDistrict: values.pDistrict || null,
    pPinCode: values.pPinCode || null,
    mTown: values.mTown || null,
    mCity: values.mCity || null,
    mTaluka: values.mTaluka || null,
    mDistrict: values.mDistrict || null,
    mStates: values.mStates || null,
    mPinCode: values.mPinCode || null,
    mPTown: values.mPTown || null,
    mPCity: values.mPCity || null,
    mPTaluka: values.mPTaluka || null,
    mPDistrict: values.mPDistrict || null,
    mPPinCode: values.mPPinCode || null,
    gender: values.gender || null,
    dob: values.dob || null,
    qualification: values.qualification || null,
    nominee: values.nominee || null,
    adharID: values.adharID || null,
    panNo: values.panNo || null,
    memberNo: values.memberNo || null,
    regNo: values.regNo || null,
    applicationNo: values.applicationNo ?? null,
    registrationDate: values.registrationDate || null,
    prvShareHolder: values.prvShareHolder || null,
    objection: values.objection || null,
  }
}