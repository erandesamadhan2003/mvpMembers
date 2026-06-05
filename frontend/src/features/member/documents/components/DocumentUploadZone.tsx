import { memo, useCallback, useRef, useState } from 'react'
import { FileImage, FileText, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
]
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf']
const MAX_SIZE_MB = 5

function isAcceptedFile(file: File): boolean {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  return (
    ACCEPTED_TYPES.includes(file.type) ||
    ACCEPTED_EXTENSIONS.includes(ext)
  )
}

function readFileAsBase64(file: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Failed to read file'))
        return
      }
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Read failed'))
    reader.readAsDataURL(file)
  })
}

function isImageBase64(value: string): boolean {
  return value.startsWith('/9j/') || value.startsWith('iVBOR')
}

interface DocumentUploadZoneProps {
  label: string
  value?: string | null
  onChange: (base64: string | null) => void
  disabled?: boolean
  className?: string
}

export const DocumentUploadZone = memo(function DocumentUploadZone({
  label,
  value,
  onChange,
  disabled,
  className,
}: DocumentUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processFile = useCallback(
    async (file: File) => {
      setError(null)
      if (!isAcceptedFile(file)) {
        setError('Only JPG, JPEG, PNG, and PDF files are allowed.')
        return
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File must be smaller than ${MAX_SIZE_MB} MB.`)
        return
      }
      setLoading(true)
      setProgress(0)
      try {
        const base64 = await readFileAsBase64(file, setProgress)
        onChange(base64)
        setProgress(100)
      } catch {
        setError('Failed to process file. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [onChange],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (disabled || loading) return
      const file = e.dataTransfer.files[0]
      if (file) void processFile(file)
    },
    [disabled, loading, processFile],
  )

  const previewSrc = value
    ? isImageBase64(value)
      ? `data:image/jpeg;base64,${value}`
      : null
    : null

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'relative rounded-2xl border-2 border-dashed border-border bg-muted/30 p-4 transition-colors',
          dragOver && 'border-primary bg-primary/5',
          disabled && 'pointer-events-none opacity-60',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          className="sr-only"
          disabled={disabled || loading}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void processFile(file)
            e.target.value = ''
          }}
        />

        {value && previewSrc ? (
          <div className="relative mx-auto max-h-40 overflow-hidden rounded-lg">
            <img
              src={previewSrc}
              alt={`${label} preview`}
              className="mx-auto max-h-40 object-contain"
            />
          </div>
        ) : value ? (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
            <FileText className="size-8 text-primary" />
            <span className="text-sm">Document attached (PDF)</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Upload className="size-8 text-primary" />
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, JPEG, PNG, PDF — max {MAX_SIZE_MB} MB
            </p>
          </div>
        )}

        {loading ? (
          <div className="mt-3 space-y-1">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Uploading… {progress}%
            </p>
          </div>
        ) : null}

        <div className="mt-3 flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || loading}
            onClick={() => inputRef.current?.click()}
          >
            <FileImage className="size-4" />
            Choose File
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || loading}
              onClick={() => {
                onChange(null)
                setProgress(0)
              }}
            >
              <X className="size-4" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
})
