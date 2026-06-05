import { memo, useCallback, useState } from 'react'
import { PageContainer, PageHeader } from '@/components/common'
import { MemberGrid } from '@/features/member/components/MemberGrid'
import { MemberFormDialog } from '@/features/member/components/MemberFormDialog'
import type { Member } from '@/features/member/types/member.types'

export const MemberList = memo(function MemberList() {
  const [editing, setEditing] = useState<Member | null>(null)

  const handleEdit = useCallback((member: Member) => setEditing(member), [])

  return (
    <PageContainer>
      <PageHeader
        title="Members"
        description="Search, manage, and maintain organization member records."
      />
      <MemberGrid onEdit={handleEdit} />
      <MemberFormDialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        member={editing}
      />
    </PageContainer>
  )
})
