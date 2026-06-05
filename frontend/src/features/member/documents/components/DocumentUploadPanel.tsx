import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FileUp, Upload } from 'lucide-react'
import { getApiErrorMessage } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { readFileAsBase64, validateMemberDocumentFile } from '@/utils/file'
import {
  useCreateDocumentMutation,
  useDocumentByMemberQuery,
  useUpdateDocumentMutation,
} from '@/features/member/documents/hooks'
import type { MemberDocument } from '@/features/member/documents/types/document.types'
import { toDocumentDataUrl } from '@/features/member/utils/documentDisplay'

type DocField = 'memberPhoto' | 'aadhaarCopy' | 'panCopy' | 'deathCertificate'

const FIELDS: { key: DocField; label: string; required?: boolean }[] = [
  { key: 'memberPhoto', label: 'Member Photo', required: true },
  { key: 'aadhaarCopy', label: 'Aadhaar Copy', required: true },
  { key: 'panCopy', label: 'PAN Copy', required: true },
  { key: 'deathCertificate', label: 'Death Certificate' },
]

type PendingFiles = Partial<Record<DocField, string>>

function DocumentSlot({
  field,
  label,
  required,
  storedValue,
  pendingValue,
  disabled,
  onSelect,
}: {
  field: DocField
  label: string
  required?: boolean
  storedValue?: string | null
  pendingValue?: string
  disabled?: boolean
  onSelect: (field: DocField, file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewSrc = useMemo(() => {
    const value = pendingValue ?? storedValue
    return toDocumentDataUrl(value)
  }, [pendingValue, storedValue])

  const hasFile = Boolean(pendingValue ?? storedValue)

  return (
    <div className="space-y-2 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </p>
        {hasFile ? (
          <span className="text-xs text-primary">Selected</span>
        ) : (
          <span className="text-xs text-muted-foreground">Not uploaded</span>
        )}
      </div>

      <div
        className={cn(
          'flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 p-3 text-center',
          disabled && 'pointer-events-none opacity-60',
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={label}
            className="max-h-24 rounded object-contain"
          />
        ) : (
          <>
            <Upload className="mb-2 size-6 text-muted-foreground" aria-hidden />
            <p className="text-xs text-muted-foreground">Click to choose file</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onSelect(field, file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

interface DocumentUploadPanelProps {
  memberId: number
  readOnly?: boolean
  requireAll?: boolean
}

export const DocumentUploadPanel = memo(function DocumentUploadPanel({
  memberId,
  readOnly = false,
  requireAll = false,
}: DocumentUploadPanelProps) {
  const { data: document, isLoading, refetch } = useDocumentByMemberQuery(memberId)
  const createMutation = useCreateDocumentMutation()
  const updateMutation = useUpdateDocumentMutation()
  const [pendingFiles, setPendingFiles] = useState<PendingFiles>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const pending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    setPendingFiles({})
    setError(null)
    setSuccess(null)
  }, [memberId])

  const handleFileSelect = useCallback(async (field: DocField, file: File) => {
    const validationError = validateMemberDocumentFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      const base64 = await readFileAsBase64(file)
      setPendingFiles((prev) => ({ ...prev, [field]: base64 }))
      setError(null)
      setSuccess(null)
    } catch {
      setError('Failed to read the selected file.')
    }
  }, [])

  const buildPayload = useCallback(
    (existing: MemberDocument | null | undefined, pending: PendingFiles) => ({
      organizationMemberID: memberId,
      memberPhoto: pending.memberPhoto ?? existing?.memberPhoto ?? null,
      aadhaarCopy: pending.aadhaarCopy ?? existing?.aadhaarCopy ?? null,
      panCopy: pending.panCopy ?? existing?.panCopy ?? null,
      deathCertificate:
        pending.deathCertificate ?? existing?.deathCertificate ?? null,
    }),
    [memberId],
  )

  const saveDocuments = useCallback(async () => {
    setError(null)
    setSuccess(null)

    const payload = buildPayload(document, pendingFiles)

    if (requireAll) {
      const missing = FIELDS.filter(
        (f) => f.required && !payload[f.key],
      ).map((f) => f.label)
      if (missing.length > 0) {
        setError(`Required documents missing: ${missing.join(', ')}`)
        return
      }
    }

    const hasAny =
      payload.memberPhoto ||
      payload.aadhaarCopy ||
      payload.panCopy ||
      payload.deathCertificate

    if (!hasAny) {
      setError('Select at least one document to upload.')
      return
    }

    try {
      if (document) {
        await updateMutation.mutateAsync({
          id: document.organizationMemberDocumentID,
          payload,
        })
      } else {
        await createMutation.mutateAsync(payload)
      }
      setPendingFiles({})
      setSuccess('Documents saved successfully.')
      await refetch()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }, [
    buildPayload,
    createMutation,
    document,
    pendingFiles,
    refetch,
    requireAll,
    updateMutation,
  ])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base">Member Documents</CardTitle>
        {!readOnly ? (
          <Button
            type="button"
            size="sm"
            disabled={pending || isLoading}
            onClick={() => void saveDocuments()}
          >
            <FileUp className="size-4" aria-hidden />
            Save All Documents
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FIELDS.map((field) => (
            <DocumentSlot
              key={field.key}
              field={field.key}
              label={field.label}
              required={field.required}
              storedValue={document?.[field.key]}
              pendingValue={pendingFiles[field.key]}
              disabled={readOnly || pending}
              onSelect={handleFileSelect}
            />
          ))}
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm text-primary" role="status">
            {success}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
})
