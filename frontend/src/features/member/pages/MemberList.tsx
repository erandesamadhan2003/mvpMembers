import { memo, useCallback, useState } from 'react'
import { PageContainer, PageHeader } from '@/components/common'
import { MemberGrid } from '@/features/member/components/MemberGrid'
import { MemberFormDialog } from '@/features/member/components/MemberFormDialog'
import type { Member } from '@/features/member/types/member.types'

export const MemberList = memo(function MemberList() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)

  const handleAdd = useCallback(() => setCreateOpen(true), [])
  const handleEdit = useCallback((member: Member) => setEditing(member), [])

  return (
    <PageContainer>
      <PageHeader
        title="Members"
        description="Search, manage, and maintain organization member records."
      />
      <MemberGrid onAdd={handleAdd} onEdit={handleEdit} />
      <MemberFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <MemberFormDialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        member={editing}
      />
    </PageContainer>
  )
})
