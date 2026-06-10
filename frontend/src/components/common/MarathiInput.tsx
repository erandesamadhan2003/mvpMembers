import { memo, useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MarathiInputProps {
  value: string
  onChange: (value: string) => void
  id?: string
  className?: string
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  autoTransliterateFrom?: string
}

const MARATHI_CODE = 'mr-t-i0-und'

export async function transliterateToMarathi(text: string): Promise<string> {
  if (!text.trim()) return ''
  try {
    const words = text.trim().split(/\s+/)
    const converted = await Promise.all(
      words.map(async (word) => {
        if (!word) return ''
        const params = new URLSearchParams({
          text: word,
          itc: MARATHI_CODE,
          num: '1',
          cp: '0',
          cs: '1',
          ie: 'utf-8',
          oe: 'utf-8',
          app: 'demopage',
        })
        const res = await fetch(`https://inputtools.google.com/request?${params.toString()}`)
        if (!res.ok) return word
        const json = await res.json()
        return json?.[1]?.[0]?.[1]?.[0] ?? word
      }),
    )
    return converted.join(' ')
  } catch {
    return text
  }
}

export const MarathiInput = memo(function MarathiInput({
  value,
  onChange,
  id,
  className,
  disabled = false,
  readOnly = false,
  placeholder,
  autoTransliterateFrom,
}: MarathiInputProps) {
  const [isConverting, setIsConverting] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const romanBufferRef = useRef('')
  const prevAutoRef = useRef<string | undefined>(undefined)

  // Auto-transliterate when parent pushes an English value — debounced 800ms
  useEffect(() => {
    if (autoTransliterateFrom === undefined) return

    // Clear any pending debounce
    if (debounceRef.current) clearTimeout(debounceRef.current)

    // If value hasn't changed, do nothing
    if (autoTransliterateFrom === prevAutoRef.current) return

    // If cleared, immediately empty the Marathi field
    if (!autoTransliterateFrom.trim()) {
      prevAutoRef.current = autoTransliterateFrom
      onChange('')
      setIsConverting(false)
      return
    }

    // Show converting only after user pauses typing (800ms debounce)
    setIsConverting(true)
    debounceRef.current = setTimeout(async () => {
      // Skip if value changed again while waiting
      if (autoTransliterateFrom === prevAutoRef.current) {
        setIsConverting(false)
        return
      }

      prevAutoRef.current = autoTransliterateFrom
      const result = await transliterateToMarathi(autoTransliterateFrom)
      onChange(result)
      setIsConverting(false)
    }, 800)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [autoTransliterateFrom, onChange])

  // Manual typing handler — user types Roman, gets Devanagari after pause
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value

      // Devanagari typed directly or deletion — pass through immediately
      if (!raw || !/^[a-zA-Z\s.,'-]*$/.test(raw)) {
        romanBufferRef.current = ''
        onChange(raw)
        return
      }

      romanBufferRef.current = raw
      onChange(raw) // show Roman while debouncing

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        const toConvert = romanBufferRef.current
        if (!toConvert) return
        setIsConverting(true)
        const converted = await transliterateToMarathi(toConvert)
        romanBufferRef.current = ''
        onChange(converted)
        setIsConverting(false)
      }, 500)
    },
    [onChange],
  )

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        className={cn(
          'flex h-10 w-full rounded-md border px-3 py-2 text-base',
          readOnly
            ? 'border-border bg-muted/40 text-foreground cursor-default'
            : 'border-input bg-card text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
      {isConverting ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground animate-pulse">
          converting...
        </span>
      ) : null}
    </div>
  )
})