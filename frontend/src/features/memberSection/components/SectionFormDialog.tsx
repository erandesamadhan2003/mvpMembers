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
  useCreateMemberSectionMutation,
  useUpdateMemberSectionMutation,
} from '@/features/memberSection/hooks'
import type { MemberSection } from '@/features/memberSection/types/memberSection.types'

const schema = z.object({
  name: z.string().min(1, 'Section name is required').max(50),
})

type FormValues = z.infer<typeof schema>

interface SectionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section?: MemberSection | null
  readOnly?: boolean
}

export const SectionFormDialog = memo(function SectionFormDialog({
  open,
  onOpenChange,
  section,
  readOnly = false,
}: SectionFormDialogProps) {
  const isEdit = Boolean(section)
  const createMutation = useCreateMemberSectionMutation()
  const updateMutation = useUpdateMemberSectionMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (open) {
      form.reset({ name: section?.memberSectionName ?? '' })
    }
  }, [open, section, form])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (isEdit && section) {
        await updateMutation.mutateAsync({
          id: section.memberSectionID,
          payload: { name: values.name },
        })
      } else {
        await createMutation.mutateAsync({ name: values.name })
      }
      onOpenChange(false)
    } catch (error) {
      form.setError('name', { message: getApiErrorMessage(error) })
    }
  })

  const pending = createMutation.isPending || updateMutation.isPending
  const title = readOnly
    ? 'View Member Section'
    : isEdit
      ? 'Update Member Section'
      : 'Add Member Section'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {readOnly ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="section-name" className="text-base">
                Section Name
              </Label>
              <Input
                id="section-name"
                className="h-10 text-base md:text-base bg-muted/40"
                readOnly
                value={section?.memberSectionName ?? ''}
              />
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="section-name" className="text-base">
                Section Name
              </Label>
              <Input
                id="section-name"
                className="h-10 text-base md:text-base"
                {...form.register('name')}
                aria-invalid={Boolean(form.formState.errors.name)}
                placeholder="Enter section name"
              />
              {form.formState.errors.name ? (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>
            <DialogFooter>
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
