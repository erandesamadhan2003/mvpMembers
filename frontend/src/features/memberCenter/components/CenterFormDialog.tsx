import { memo, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
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
  centerID: z.string().min(1, 'Center ID is required'),
  centerName: z.string().min(1, 'Center name is required'),
  organizationMemberTownID: z.coerce.number().positive('Town is required'),
  oCode: z.coerce.number().optional().nullable(),
})

type FormValues = z.infer<typeof schema>

interface CenterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  center?: MemberCenter | null
}

export const CenterFormDialog = memo(function CenterFormDialog({
  open,
  onOpenChange,
  center,
}: CenterFormDialogProps) {
  const isEdit = Boolean(center)
  const { data: towns = [] } = useMemberTownsQuery()
  const createMutation = useCreateMemberCenterMutation()
  const updateMutation = useUpdateMemberCenterMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      centerID: '',
      centerName: '',
      organizationMemberTownID: 0,
      oCode: null,
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
        centerID: center?.centerID ?? '',
        centerName: center?.centerName ?? '',
        organizationMemberTownID: center?.organizationMemberTownID ?? 0,
        oCode: center?.oCode ?? null,
      })
    }
  }, [open, center, form])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload = {
        centerID: values.centerID,
        centerName: values.centerName,
        organizationMemberTownID: values.organizationMemberTownID,
        oCode: values.oCode ?? null,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Member Center' : 'Add Member Center'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="center-id">Center ID</Label>
            <Input id="center-id" {...form.register('centerID')} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="center-name">Center Name</Label>
            <Input id="center-name" {...form.register('centerName')} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="center-town">Town</Label>
            <select
              id="center-town"
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
              value={townValue}
              onChange={(e) =>
                form.setValue('organizationMemberTownID', Number(e.target.value))
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
          <div className="space-y-2">
            <Label htmlFor="center-ocode">O Code</Label>
            <Input id="center-ocode" type="number" {...form.register('oCode')} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})
