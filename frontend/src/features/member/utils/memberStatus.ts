import type { Member } from '@/features/member/types/member.types'

export function isMemberInactive(member: Member): boolean {
  return member.flagStatus?.toLowerCase() === 'inactive'
}

export function isMemberActive(member: Member): boolean {
  if (member.death) return false
  if (isMemberInactive(member)) return false
  return true
}

export function getMemberStatusLabel(member: Member): 'Active' | 'Inactive' | 'Deceased' | 'Pending' {
  if (member.death) return 'Deceased'
  if (isMemberInactive(member)) return 'Inactive'
  if (member.memberCardIssue || member.isTransfer) return 'Active'
  return 'Pending'
}
