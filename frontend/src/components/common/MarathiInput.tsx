import { memo, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface MarathiInputProps {
  value: string
  onChange: (value: string) => void
  id?: string
  className?: string
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
}

async function transliterate(text: string): Promise<string> {
  if (!text.trim()) return text
  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=mr-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`
    const res = await fetch(url)
    const data = await res.json()
    // Response: ["SUCCESS", [["word", ["transliterated"], ...]]]
    if (data[0] === 'SUCCESS' && data[1]?.[0]?.[1]?.[0]) {
      return data[1][0][1][0]
    }
    return text
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
}: MarathiInputProps) {
  const [inputBuffer, setInputBuffer] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value

      const lastChar = raw.slice(-1)
      const isRoman = lastChar && /^[a-zA-Z\s]$/.test(lastChar)

      if (!isRoman) {
        setInputBuffer('')
        onChange(raw)
        return
      }

      setInputBuffer(raw)
      onChange(raw) // show Roman while typing

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        setIsConverting(true)
        const converted = await transliterate(raw)
        setInputBuffer('')
        onChange(converted)
        setIsConverting(false)
      }, 400)
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
          'font-[Noto Sans Devanagari,Arial Unicode MS,sans-serif]',
          readOnly
            ? 'border-border bg-muted/40 text-foreground cursor-default'
            : 'border-input bg-card text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
      {isConverting ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          converting...
        </span>
      ) : null}
    </div>
  )
})