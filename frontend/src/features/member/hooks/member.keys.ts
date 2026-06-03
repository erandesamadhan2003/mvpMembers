export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: () => [...memberKeys.lists()] as const,
  details: () => [...memberKeys.all, 'detail'] as const,
  detail: (id: number) => [...memberKeys.details(), id] as const,
  byMemberNo: (memberNo: string) =>
    [...memberKeys.all, 'byMemberNo', memberNo] as const,
  bySection: (memberSectionId: number) =>
    [...memberKeys.all, 'bySection', memberSectionId] as const,
  byCenter: (centerId: number) =>
    [...memberKeys.all, 'byCenter', centerId] as const,
}
