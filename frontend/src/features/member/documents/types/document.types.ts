import type { AuditFields } from '@/types/common.types'

/** Binary document fields are base64-encoded when sent over JSON. */
export type DocumentBinary = string | null

export interface MemberDocument extends AuditFields {
  organizationMemberDocumentID: number
  organizationMemberID: number
  memberPhoto?: DocumentBinary
  aadhaarCopy?: DocumentBinary
  panCopy?: DocumentBinary
  deathCertificate?: DocumentBinary
}

export interface CreateMemberDocumentRequest {
  organizationMemberID: number
  memberPhoto?: DocumentBinary
  aadhaarCopy?: DocumentBinary
  panCopy?: DocumentBinary
  deathCertificate?: DocumentBinary
}

export interface UpdateMemberDocumentRequest {
  organizationMemberID: number
  memberPhoto?: DocumentBinary
  aadhaarCopy?: DocumentBinary
  panCopy?: DocumentBinary
  deathCertificate?: DocumentBinary
}
