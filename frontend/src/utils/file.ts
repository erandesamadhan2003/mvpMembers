const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
] as const

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'] as const

const MAX_FILE_SIZE_MB = 5

export function validateMemberDocumentFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (
    !ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number]) &&
    !ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])
  ) {
    return 'Only JPG, JPEG, PNG, and PDF files are allowed.'
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `File must be smaller than ${MAX_FILE_SIZE_MB}MB.`
  }
  return null
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Failed to read file'))
        return
      }
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64 ?? '')
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
