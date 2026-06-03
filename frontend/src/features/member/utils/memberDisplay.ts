import type { Member } from '@/features/member/types/member.types'

export function formatMemberFullName(member: Member): string {
  return [member.firstName, member.middleName, member.lastName]
    .filter((part) => part?.trim())
    .join(' ')
}

export function getMemberTownName(member: Member): string {
  return (
    member.organizationMemberCenter?.organizationMemberTown?.townName ?? ''
  )
}

export function getMemberCenterName(member: Member): string {
  return member.organizationMemberCenter?.centerName ?? ''
}

export function getMemberSectionName(member: Member): string {
  return member.memberSection?.memberSectionName ?? ''
}
