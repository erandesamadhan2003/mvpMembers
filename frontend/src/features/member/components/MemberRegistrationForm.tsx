import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getApiErrorMessage } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  emptyMemberFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  memberToFormValues,
} from '@/features/member/components/memberForm.mappers'
import {
  memberFormSchema,
  type MemberFormValues,
} from '@/features/member/components/memberForm.schema'
import { MemberFormFields } from '@/features/member/components/MemberFormFields'
import { TransferMemberVerifyDialog } from '@/features/member/components/TransferMemberVerifyDialog'
import { TransferSourceSection } from '@/features/member/components/TransferSourceSection'
import {
  useCreateMemberMutation,
  useMembersBySectionQuery,
  useUpdateMemberMutation,
} from '@/features/member/hooks'
import type { Member } from '@/features/member/types/member.types'
import { generateNextMemberNo } from '@/features/member/utils/memberNo'
import { isMemberActive } from '@/features/member/utils/memberStatus'
import { useMemberSectionsQuery } from '@/features/memberSection/hooks'

interface MemberRegistrationFormProps {
  member?: Member | null
  onSuccess?: (memberId: number) => void
  onCancel?: () => void
  submitLabel?: string
  showCancel?: boolean
  embedded?: boolean
  readOnly?: boolean
}

export const MemberRegistrationForm = memo(function MemberRegistrationForm({
  member,
  onSuccess,
  onCancel,
  submitLabel,
  showCancel = true,
  embedded = false,
  readOnly = false,
}: MemberRegistrationFormProps) {
  const isEdit = Boolean(member)
  const { data: sections = [] } = useMemberSectionsQuery()
  const createMutation = useCreateMemberMutation()
  const updateMutation = useUpdateMemberMutation()
  const pending = createMutation.isPending || updateMutation.isPending
  const fieldsDisabled = readOnly || pending

  const [transferEnabled, setTransferEnabled] = useState(false)
  const [transferSource, setTransferSource] = useState<Member | null>(null)
  const [transferVerified, setTransferVerified] = useState(false)
  const [lookupMemberNo, setLookupMemberNo] = useState('')
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [transferError, setTransferError] = useState<string | null>(null)

  const form = useForm<MemberFormValues, any, MemberFormValues>({
    resolver: zodResolver(memberFormSchema) as Resolver<MemberFormValues, any, MemberFormValues>,
    defaultValues: emptyMemberFormValues,
  })
  const { errors } = form.formState

  const memberSectionID = form.watch('memberSectionID')
  const { data: sectionMembers = [] } = useMembersBySectionQuery(
    memberSectionID ?? 0,
    !isEdit && Boolean(memberSectionID),
  )

  const selectedSection = useMemo(
    () => sections.find((s) => s.memberSectionID === memberSectionID),
    [memberSectionID, sections],
  )

  const resetCreateForm = useCallback(() => {
    form.reset({
      ...emptyMemberFormValues,
      registrationDate: new Date().toISOString().slice(0, 10),
    })
  }, [form])

  useEffect(() => {
    if (isEdit && member) {
      form.reset(memberToFormValues(member))
      return
    }
    resetCreateForm()
  }, [form, isEdit, member, resetCreateForm])

  useEffect(() => {
    if (isEdit || !selectedSection) return
    const nextMemberNo = generateNextMemberNo(
      selectedSection.memberSectionName,
      sectionMembers,
    )
    form.setValue('memberNo', nextMemberNo)
  }, [form, isEdit, sectionMembers, selectedSection])

  const handleTransferEnabledChange = useCallback((enabled: boolean) => {
    setTransferEnabled(enabled)
    setTransferSource(null)
    setTransferVerified(false)
    setLookupMemberNo('')
    setTransferError(null)
  }, [])

  const handleTransferVerify = useCallback((source: Member) => {
    if (!isMemberActive(source)) {
      setTransferError('This member is already inactive and cannot be transferred.')
      setVerifyOpen(false)
      return
    }
    setTransferSource(source)
    setTransferVerified(true)
    setTransferError(null)
    setVerifyOpen(false)
  }, [])

  const onSubmit = form.handleSubmit(async (values) => {
    if (!values.memberSectionID) {
      form.setError('memberSectionID', { message: 'Section is required' })
      return
    }

    if (!isEdit && !values.memberNo) {
      form.setError('memberNo', { message: 'Member number could not be generated' })
      return
    }

    if (!isEdit && transferEnabled) {
      if (!transferVerified || !transferSource) {
        setTransferError('Verify the existing member number before registering.')
        return
      }
    }

    try {
      if (isEdit && member) {
        await updateMutation.mutateAsync({
          id: member.organizationMemberID,
          payload: formValuesToUpdatePayload(values),
        })
        onSuccess?.(member.organizationMemberID)
      } else {
        const memberId = await createMutation.mutateAsync(
          formValuesToCreatePayload(values, {
            isTransfer: transferEnabled && transferVerified,
            transferOrganizationMemberID:
              transferSource?.organizationMemberID ?? null,
          }),
        )
        onSuccess?.(memberId)
      }
    } catch (error) {
      form.setError('firstName', { message: getApiErrorMessage(error) })
    }
  })

  const formContent = readOnly ? (
    <div className="space-y-6">
      <MemberFormFields
        register={form.register}
        control={form.control}
        errors={errors}
        disabled
        memberNoReadOnly
        readOnly
      />
    </div>
  ) : (
    <form onSubmit={onSubmit} className="space-y-6">
      <MemberFormFields
        register={form.register}
        control={form.control}
        errors={errors}
        disabled={fieldsDisabled}
        memberNoReadOnly
      />

      {!isEdit ? (
        <TransferSourceSection
          enabled={transferEnabled}
          onEnabledChange={handleTransferEnabledChange}
          lookupMemberNo={lookupMemberNo}
          onLookupMemberNoChange={setLookupMemberNo}
          onLookup={() => setVerifyOpen(true)}
          transferSource={transferSource}
          verified={transferVerified}
          disabled={fieldsDisabled}
          error={transferError ?? undefined}
        />
      ) : null}

      <div className="flex justify-end gap-2">
        {showCancel && onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={fieldsDisabled}
          >
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={fieldsDisabled}>
          {pending ? 'Saving...' : submitLabel ?? (isEdit ? 'Update Member' : 'Register')}
        </Button>
      </div>

      <TransferMemberVerifyDialog
        open={verifyOpen}
        memberNo={lookupMemberNo}
        onOpenChange={setVerifyOpen}
        onVerify={handleTransferVerify}
      />
    </form>
  )

  if (embedded) return formContent

  return (
    <Card>
      <CardContent className="pt-6">{formContent}</CardContent>
    </Card>
  )
})
