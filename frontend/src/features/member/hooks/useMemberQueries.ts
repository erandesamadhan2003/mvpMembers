import { useQuery } from '@tanstack/react-query'
import { memberKeys } from '@/features/member/hooks/member.keys'
import { memberService } from '@/features/member/services/member.service'

export function useMembersQuery() {
  return useQuery({
    queryKey: memberKeys.list(),
    queryFn: () => memberService.getAll(),
  })
}

export function useMemberQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: () => memberService.getById(id),
    enabled: enabled && id > 0,
  })
}

export function useMemberByMemberNoQuery(memberNo: string, enabled = true) {
  return useQuery({
    queryKey: memberKeys.byMemberNo(memberNo),
    queryFn: () => memberService.getByMemberNo(memberNo),
    enabled: enabled && memberNo.trim().length > 0,
  })
}

export function useMembersBySectionQuery(
  memberSectionId: number,
  enabled = true,
) {
  return useQuery({
    queryKey: memberKeys.bySection(memberSectionId),
    queryFn: () => memberService.getByMemberSectionId(memberSectionId),
    enabled: enabled && memberSectionId > 0,
  })
}

export function useMembersByCenterQuery(centerId: number, enabled = true) {
  return useQuery({
    queryKey: memberKeys.byCenter(centerId),
    queryFn: () => memberService.getByOrganizationMemberCenterId(centerId),
    enabled: enabled && centerId > 0,
  })
}
