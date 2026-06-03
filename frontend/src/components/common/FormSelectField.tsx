import { memo } from 'react'
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface FormSelectOption {
  value: string
  label: string
}

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  options: FormSelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
  id?: string
}

export const FormSelectField = memo(function FormSelectField<
  T extends FieldValues,
>({
  control,
  name,
  label,
  options,
  placeholder = 'Select...',
  disabled,
  error,
  className,
  id,
}: FormSelectFieldProps<T>) {
  const fieldId = id ?? String(name)

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={fieldId}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value != null ? String(field.value) : ''}
            onValueChange={(value) => {
              if (!value) {
                field.onChange(null)
                return
              }
              const parsed = Number(value)
              field.onChange(Number.isNaN(parsed) ? value : parsed)
            }}
            disabled={disabled}
          >
            <SelectTrigger
              id={fieldId}
              className="w-full"
              aria-invalid={Boolean(error)}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  )
})
