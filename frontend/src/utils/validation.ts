export function isRequired(value: string | null | undefined): boolean {
  return Boolean(value?.trim())
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function minLength(value: string, length: number): boolean {
  return value.trim().length >= length
}
