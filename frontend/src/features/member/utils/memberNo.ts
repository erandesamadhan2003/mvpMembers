import type { Member } from '@/features/member/types/member.types'

export function getSectionPrefix(sectionName: string): string {
  const letters = sectionName.replace(/[^a-zA-Z]/g, '').toUpperCase()
  if (letters.length >= 3) return letters.slice(0, 3)
  return letters.padEnd(3, 'X')
}

export function generateNextMemberNo(
  sectionName: string,
  existingMembers: Member[],
): string {
  const prefix = getSectionPrefix(sectionName)
  const pattern = new RegExp(`^${prefix}(\\d{4})$`)
  let maxNum = -1

  for (const member of existingMembers) {
    if (!member.memberNo) continue
    const match = member.memberNo.match(pattern)
    if (match) {
      maxNum = Math.max(maxNum, Number.parseInt(match[1], 10))
    }
  }

  return `${prefix}${String(maxNum + 1).padStart(4, '0')}`
}
