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
import { useMemberCentersQuery } from '@/features/memberCenter/hooks'
import { useMemberSectionsQuery } from '@/features/memberSection/hooks'
import {
  useCreateMemberMutation,
  useUpdateMemberMutation,
} from '@/features/member/hooks'
import type { Member } from '@/features/member/types/member.types'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  phoneNo: z.string().optional(),
  eMail: z.union([z.string().email('Invalid email'), z.literal('')]).optional(),
  memberNo: z.string().optional(),
  memberSectionID: z.coerce.number().optional().nullable(),
  organizationMemberCenterID: z.coerce.number().optional().nullable(),
  city: z.string().optional(),
  gender: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface MemberFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: Member | null
}

export const MemberFormDialog = memo(function MemberFormDialog({
  open,
  onOpenChange,
  member,
}: MemberFormDialogProps) {
  const isEdit = Boolean(member)
  const { data: sections = [] } = useMemberSectionsQuery()
  const { data: centers = [] } = useMemberCentersQuery()
  const createMutation = useCreateMemberMutation()
  const updateMutation = useUpdateMemberMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      phoneNo: '',
      eMail: '',
      memberNo: '',
      memberSectionID: null,
      organizationMemberCenterID: null,
      city: '',
      gender: '',
    },
  })

  const sectionOptions = useMemo(
    () =>
      sections.map((s) => ({
        value: String(s.memberSectionID),
        label: s.memberSectionName,
      })),
    [sections],
  )

  const centerOptions = useMemo(
    () =>
      centers.map((c) => ({
        value: String(c.organizationMemberCenterID),
        label: c.centerName,
      })),
    [centers],
  )

  useEffect(() => {
    if (open) {
      form.reset({
        firstName: member?.firstName ?? '',
        lastName: member?.lastName ?? '',
        middleName: member?.middleName ?? '',
        phoneNo: member?.phoneNo ?? '',
        eMail: member?.eMail ?? '',
        memberNo: member?.memberNo ?? '',
        memberSectionID: member?.memberSectionID ?? null,
        organizationMemberCenterID: member?.organizationMemberCenterID ?? null,
        city: member?.city ?? '',
        gender: member?.gender ?? '',
      })
    }
  }, [open, member, form])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName || null,
        middleName: values.middleName || null,
        phoneNo: values.phoneNo || null,
        eMail: values.eMail || null,
        memberNo: values.memberNo || null,
        memberSectionID: values.memberSectionID || null,
        organizationMemberCenterID: values.organizationMemberCenterID || null,
        city: values.city || null,
        gender: values.gender || null,
      }
      if (isEdit && member) {
        await updateMutation.mutateAsync({ id: member.organizationMemberID, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
    } catch (error) {
      form.setError('firstName', { message: getApiErrorMessage(error) })
    }
  })

  const pending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Member' : 'Add Member'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" {...form.register('firstName')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middle-name">Middle Name</Label>
            <Input id="middle-name" {...form.register('middleName')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" {...form.register('lastName')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-no">Member No</Label>
            <Input id="member-no" {...form.register('memberNo')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...form.register('phoneNo')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('eMail')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-section">Section</Label>
            <select
              id="member-section"
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
              value={String(form.watch('memberSectionID') ?? '')}
              onChange={(e) =>
                form.setValue(
                  'memberSectionID',
                  e.target.value ? Number(e.target.value) : null,
                )
              }
            >
              <option value="">Select section</option>
              {sectionOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-center">Center</Label>
            <select
              id="member-center"
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
              value={String(form.watch('organizationMemberCenterID') ?? '')}
              onChange={(e) =>
                form.setValue(
                  'organizationMemberCenterID',
                  e.target.value ? Number(e.target.value) : null,
                )
              }
            >
              <option value="">Select center</option>
              {centerOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...form.register('city')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input id="gender" {...form.register('gender')} />
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
