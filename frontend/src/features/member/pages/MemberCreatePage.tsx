import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/components/common'
import { ROUTES } from '@/constants/routes.constants'
import { MemberFormDialog } from '@/features/member/components/MemberFormDialog'

export const MemberCreatePage = memo(function MemberCreatePage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <PageHeader
        title="Add Member"
        description="Create a new organization member record."
      />
      <MemberFormDialog
        open
        onOpenChange={(open) => {
          if (!open) navigate(ROUTES.members)
        }}
      />
    </PageContainer>
  )
})
