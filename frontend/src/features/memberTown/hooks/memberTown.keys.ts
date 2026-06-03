export const memberTownKeys = {
  all: ['memberTowns'] as const,
  lists: () => [...memberTownKeys.all, 'list'] as const,
  list: () => [...memberTownKeys.lists()] as const,
  details: () => [...memberTownKeys.all, 'detail'] as const,
  detail: (id: number) => [...memberTownKeys.details(), id] as const,
  byName: (townName: string) =>
    [...memberTownKeys.all, 'byName', townName] as const,
}
