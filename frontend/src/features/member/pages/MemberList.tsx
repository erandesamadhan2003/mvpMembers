import { memo, useCallback, useState } from 'react'
import { PageContainer, PageHeader } from '@/components/common'
import { MemberGrid } from '@/features/member/components/MemberGrid'
import {
  MemberRecordDialog,
  type MemberDialogMode,
} from '@/features/member/components/MemberRecordDialog'
import type { Member } from '@/features/member/types/member.types'

export const MemberList = memo(function MemberList() {
  const [dialogMember, setDialogMember] = useState<Member | null>(null)
  const [dialogMode, setDialogMode] = useState<MemberDialogMode>('view')
  const [dialogOpen, setDialogOpen] = useState(false)

  const openDialog = useCallback((member: Member, mode: MemberDialogMode) => {
    setDialogMember(member)
    setDialogMode(mode)
    setDialogOpen(true)
  }, [])

  const handleView = useCallback(
    (member: Member) => openDialog(member, 'view'),
    [openDialog],
  )

  const handleEdit = useCallback(
    (member: Member) => openDialog(member, 'edit'),
    [openDialog],
  )

  return (
    <PageContainer>
      <PageHeader
        title="Members"
        description="Select a member from the list, then use View, Update, or Delete."
      />
      <MemberGrid onView={handleView} onEdit={handleEdit} />
      <MemberRecordDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setDialogMember(null)
        }}
        member={dialogMember}
        mode={dialogMode}
      />
    </PageContainer>
  )
})
