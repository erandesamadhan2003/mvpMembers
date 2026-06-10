export const memberSubTownKeys = {
    all: ['memberSubTowns'] as const,
    lists: () => [...memberSubTownKeys.all, 'list'] as const,
    list: () => [...memberSubTownKeys.lists()] as const,
    details: () => [...memberSubTownKeys.all, 'detail'] as const,
    detail: (id: number) => [...memberSubTownKeys.details(), id] as const,
    byCenter: (centerId: number) =>
        [...memberSubTownKeys.all, 'byCenter', centerId] as const,
    bySubTownId: (subTownId: string) =>
        [...memberSubTownKeys.all, 'bySubTownId', subTownId] as const,
}