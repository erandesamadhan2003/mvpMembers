import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink, FileUp, Upload } from 'lucide-react'
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
import {
  openDocumentInNewWindow,
  toDocumentDataUrl,
} from '@/features/member/utils/documentDisplay'

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
  readOnly,
  onSelect,
  onOpen,
}: {
  field: DocField
  label: string
  required?: boolean
  storedValue?: string | null
  pendingValue?: string
  disabled?: boolean
  readOnly?: boolean
  onSelect: (field: DocField, file: File) => void
  onOpen: (field: DocField, value: string, label: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const activeValue = pendingValue ?? storedValue ?? null
  const previewSrc = useMemo(() => toDocumentDataUrl(activeValue), [activeValue])
  const hasFile = Boolean(activeValue)
  const isPdf = activeValue?.trim().startsWith('JVBERi')

  const handleOpen = useCallback(() => {
    if (activeValue) onOpen(field, activeValue, label)
  }, [activeValue, field, label, onOpen])

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base font-semibold text-foreground">
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </p>
        {hasFile ? (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            Uploaded
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Not uploaded</span>
        )}
      </div>

      <div
        className={cn(
          'flex min-h-32 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/25 p-3 text-center',
          !readOnly && !disabled && 'cursor-pointer hover:border-primary/40 hover:bg-primary/5',
          readOnly && hasFile && 'cursor-pointer hover:border-primary/40',
        )}
        onClick={() => {
          if (readOnly && hasFile) {
            handleOpen()
            return
          }
          if (!readOnly && !disabled) inputRef.current?.click()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (readOnly && hasFile) handleOpen()
            else if (!readOnly && !disabled) inputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={0}
      >
        {previewSrc && !isPdf ? (
          <img
            src={previewSrc}
            alt={label}
            className="max-h-28 rounded object-contain"
          />
        ) : hasFile && isPdf ? (
          <div className="space-y-1 text-muted-foreground">
            <Upload className="mx-auto size-8" aria-hidden />
            <p className="text-sm font-medium">PDF document</p>
            <p className="text-xs">Click to open</p>
          </div>
        ) : (
          <>
            <Upload className="mb-2 size-7 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {readOnly ? 'No document' : 'Click to choose file'}
            </p>
          </>
        )}
      </div>

      {hasFile ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleOpen}
        >
          <ExternalLink className="size-4" aria-hidden />
          Open in New Window
        </Button>
      ) : null}

      {!readOnly ? (
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
      ) : null}
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

  const handleOpenDocument = useCallback(
    (_field: DocField, value: string, label: string) => {
      openDocumentInNewWindow(value, label)
    },
    [],
  )

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
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg font-semibold">Member Documents</CardTitle>
        {!readOnly ? (
          <Button
            type="button"
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
          <p className="text-base text-muted-foreground">Loading documents...</p>
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
              readOnly={readOnly}
              onSelect={handleFileSelect}
              onOpen={handleOpenDocument}
            />
          ))}
        </div>

        {error ? (
          <p className="text-base text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-base text-primary" role="status">
            {success}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
})
