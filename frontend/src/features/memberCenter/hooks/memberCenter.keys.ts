export const memberCenterKeys = {
  all: ['memberCenters'] as const,
  lists: () => [...memberCenterKeys.all, 'list'] as const,
  list: () => [...memberCenterKeys.lists()] as const,
  details: () => [...memberCenterKeys.all, 'detail'] as const,
  detail: (id: number) => [...memberCenterKeys.details(), id] as const,
  byTown: (townId: number) =>
    [...memberCenterKeys.all, 'byTown', townId] as const,
  byCenterId: (centerId: string) =>
    [...memberCenterKeys.all, 'byCenterId', centerId] as const,
}
