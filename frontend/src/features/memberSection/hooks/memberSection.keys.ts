export const memberSectionKeys = {
  all: ['memberSections'] as const,
  lists: () => [...memberSectionKeys.all, 'list'] as const,
  list: () => [...memberSectionKeys.lists()] as const,
  details: () => [...memberSectionKeys.all, 'detail'] as const,
  detail: (id: number) => [...memberSectionKeys.details(), id] as const,
}
