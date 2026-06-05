export const NAME_TITLES = [
  { id: 1, label: 'Mr.' },
  { id: 2, label: 'Mrs.' },
  { id: 3, label: 'Ms.' },
  { id: 4, label: 'Miss' },
  { id: 5, label: 'Dr.' },
  { id: 6, label: 'Prof.' },
  { id: 7, label: 'Shri' },
  { id: 8, label: 'Smt.' },
] as const

export function getNameTitleLabel(id?: number | null): string {
  if (!id) return '—'
  return NAME_TITLES.find((t) => t.id === id)?.label ?? '—'
}
