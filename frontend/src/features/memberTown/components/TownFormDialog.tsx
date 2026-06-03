import { memo, useEffect } from 'react'
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
import {
  useCreateMemberTownMutation,
  useUpdateMemberTownMutation,
} from '@/features/memberTown/hooks'
import type { MemberTown } from '@/features/memberTown/types/memberTown.types'

const schema = z.object({
  townID: z.coerce.number().int().positive('Town ID is required'),
  townName: z.string().min(1, 'Town name is required'),
  oCode: z.coerce.number().optional().nullable(),
})

type FormValues = z.infer<typeof schema>

interface TownFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  town?: MemberTown | null
}

export const TownFormDialog = memo(function TownFormDialog({
  open,
  onOpenChange,
  town,
}: TownFormDialogProps) {
  const isEdit = Boolean(town)
  const createMutation = useCreateMemberTownMutation()
  const updateMutation = useUpdateMemberTownMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { townID: 0, townName: '', oCode: null },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        townID: town?.townID ?? 0,
        townName: town?.townName ?? '',
        oCode: town?.oCode ?? null,
      })
    }
  }, [open, town, form])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload = {
        townID: values.townID,
        townName: values.townName,
        oCode: values.oCode ?? null,
      }
      if (isEdit && town) {
        await updateMutation.mutateAsync({ id: town.organizationMemberTownID, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
    } catch (error) {
      form.setError('townName', { message: getApiErrorMessage(error) })
    }
  })

  const pending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Member Town' : 'Add Member Town'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="town-id">Town ID</Label>
            <Input id="town-id" type="number" {...form.register('townID')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="town-name">Town Name</Label>
            <Input id="town-name" {...form.register('townName')} />
            {form.formState.errors.townName ? (
              <p className="text-sm text-destructive">{form.formState.errors.townName.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="town-ocode">O Code</Label>
            <Input id="town-ocode" type="number" {...form.register('oCode')} />
          </div>
          <DialogFooter>
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
