import { memo, useEffect, useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getApiErrorMessage } from '@/api'
import { useMemberTownsQuery } from '@/features/memberTown/hooks'
import {
  useCreateMemberCenterMutation,
  useUpdateMemberCenterMutation,
} from '@/features/memberCenter/hooks'
import type { MemberCenter } from '@/features/memberCenter/types/memberCenter.types'

const schema = z.object({
  centerName: z.string().min(1, 'Center name is required'),
  organizationMemberTownID: z.coerce.number().positive('Town is required'),
})

type FormInput = {
  centerName: string
  organizationMemberTownID: number | string
}
type FormValues = z.output<typeof schema>

interface CenterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  center?: MemberCenter | null
  readOnly?: boolean
}

export const CenterFormDialog = memo(function CenterFormDialog({
  open,
  onOpenChange,
  center,
  readOnly = false,
}: CenterFormDialogProps) {
  const isEdit = Boolean(center)
  const { data: towns = [] } = useMemberTownsQuery()
  const createMutation = useCreateMemberCenterMutation()
  const updateMutation = useUpdateMemberCenterMutation()

  const form = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(schema) as Resolver<FormInput, any, FormValues>,
    defaultValues: {
      centerName: '',
      organizationMemberTownID: 0,
    },
  })

  const townOptions = useMemo(
    () =>
      towns.map((t) => ({
        value: String(t.organizationMemberTownID),
        label: t.townName,
      })),
    [towns],
  )

  useEffect(() => {
    if (open) {
      form.reset({
        centerName: center?.centerName ?? '',
        organizationMemberTownID: center?.organizationMemberTownID ?? 0,
      })
    }
  }, [open, center, form])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload = {
        centerName: values.centerName,
        organizationMemberTownID: values.organizationMemberTownID,
      }
      if (isEdit && center) {
        await updateMutation.mutateAsync({
          id: center.organizationMemberCenterID,
          payload,
        })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
    } catch (error) {
      form.setError('centerName', { message: getApiErrorMessage(error) })
    }
  })

  const pending = createMutation.isPending || updateMutation.isPending
  const townValue = String(form.watch('organizationMemberTownID') || '')
  const title = readOnly
    ? 'View Member Center'
    : isEdit
      ? 'Update Member Center'
      : 'Add Member Center'

  const fieldClass =
    'flex h-10 w-full rounded-md border border-border bg-muted/40 px-3 text-base text-foreground'
  const inputClass = 'h-10 text-base md:text-base'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {readOnly ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="center-name" className="text-base">
                Center Name
              </Label>
              <Input
                id="center-name"
                className={`${inputClass} bg-muted/40`}
                readOnly
                value={center?.centerName ?? ''}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="center-town" className="text-base">
                Town
              </Label>
              <select
                id="center-town"
                className={fieldClass}
                disabled
                value={String(center?.organizationMemberTownID ?? '')}
              >
                <option value="">
                  {center?.organizationMemberTown?.townName ?? '—'}
                </option>
              </select>
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button type="button" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="center-name" className="text-base">
                Center Name
              </Label>
              <Input
                id="center-name"
                className={inputClass}
                {...form.register('centerName')}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="center-town" className="text-base">
                Town
              </Label>
              <select
                id="center-town"
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 text-base"
                value={townValue}
                onChange={(e) =>
                  form.setValue('organizationMemberTownID', e.target.value)
                }
                aria-label="Select town"
              >
                <option value="">Select town</option>
                {townOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
})
