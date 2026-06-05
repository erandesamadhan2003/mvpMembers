export function toDocumentDataUrl(
  base64?: string | null,
  mime = 'image/jpeg',
): string | null {
  if (!base64?.trim()) return null
  if (base64.startsWith('data:')) return base64
  return `data:${mime};base64,${base64}`
}
