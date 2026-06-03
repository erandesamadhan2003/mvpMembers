import { memo, useCallback, useRef, useState } from 'react'
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
} from '@/features/document/hooks'

type DocField = 'memberPhoto' | 'aadhaarCopy' | 'panCopy' | 'deathCertificate'

const FIELDS: { key: DocField; label: string }[] = [
  { key: 'memberPhoto', label: 'Member Photo' },
  { key: 'aadhaarCopy', label: 'Aadhaar Copy' },
  { key: 'panCopy', label: 'PAN Copy' },
  { key: 'deathCertificate', label: 'Death Certificate' },
]

interface DocumentUploadPanelProps {
  memberId: number
  readOnly?: boolean
}

export const DocumentUploadPanel = memo(function DocumentUploadPanel({
  memberId,
  readOnly = false,
}: DocumentUploadPanelProps) {
  const { data: document, isLoading } = useDocumentByMemberQuery(memberId)
  const createMutation = useCreateDocumentMutation()
  const updateMutation = useUpdateDocumentMutation()
  const [activeField, setActiveField] = useState<DocField>('memberPhoto')
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const pending = createMutation.isPending || updateMutation.isPending

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateMemberDocumentFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setError(null)
      setProgress(10)

      try {
        const base64 = await readFileAsBase64(file)
        setProgress(60)

        if (file.type.startsWith('image/')) {
          setPreview(URL.createObjectURL(file))
        } else {
          setPreview(null)
        }

        const payload = {
          organizationMemberID: memberId,
          [activeField]: base64,
        }

        if (document) {
          await updateMutation.mutateAsync({
            id: document.organizationMemberDocumentID,
            payload: {
              organizationMemberID: memberId,
              memberPhoto: document.memberPhoto,
              aadhaarCopy: document.aadhaarCopy,
              panCopy: document.panCopy,
              deathCertificate: document.deathCertificate,
              ...payload,
            },
          })
        } else {
          await createMutation.mutateAsync(payload)
        }

        setProgress(100)
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        window.setTimeout(() => setProgress(0), 600)
      }
    },
    [activeField, createMutation, document, memberId, updateMutation],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (readOnly) return
      const file = e.dataTransfer.files[0]
      if (file) void uploadFile(file)
    },
    [readOnly, uploadFile],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Member Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {FIELDS.map((field) => (
            <Button
              key={field.key}
              type="button"
              size="sm"
              variant={activeField === field.key ? 'default' : 'outline'}
              onClick={() => setActiveField(field.key)}
            >
              {field.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        ) : null}

        <div
          role="button"
          tabIndex={readOnly ? -1 : 0}
          aria-label="Document upload drop zone"
          onDragOver={(e) => {
            e.preventDefault()
            if (!readOnly) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !readOnly && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          className={cn(
            'flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors',
            dragOver && 'border-primary bg-primary/5',
            readOnly && 'pointer-events-none opacity-60',
          )}
        >
          <Upload className="mb-3 size-10 text-primary" aria-hidden />
          <p className="text-sm font-medium text-foreground">
            Drag and drop or click to upload
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, JPEG, PNG, PDF — max 5MB
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            disabled={readOnly || pending}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void uploadFile(file)
            }}
          />
        </div>

        {progress > 0 ? (
          <div className="space-y-1" aria-live="polite">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Uploading {progress}%</p>
          </div>
        ) : null}

        {preview ? (
          <div className="rounded-lg border border-border p-2">
            <img
              src={preview}
              alt="Document preview"
              className="max-h-48 rounded object-contain"
            />
          </div>
        ) : null}

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {!readOnly ? (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            <FileUp className="size-4" aria-hidden />
            Choose file
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
})
