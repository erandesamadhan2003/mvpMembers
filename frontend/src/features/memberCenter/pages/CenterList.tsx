import { memo, useCallback, useState } from 'react'
import { PageContainer, PageHeader } from '@/components/common'
import { CenterGrid } from '@/features/memberCenter/components/CenterGrid'
import { CenterFormDialog } from '@/features/memberCenter/components/CenterFormDialog'

export const CenterList = memo(function CenterList() {
  const [createOpen, setCreateOpen] = useState(false)
  const handleAdd = useCallback(() => setCreateOpen(true), [])

  return (
    <PageContainer>
      <PageHeader title="Member Centers" description="Manage centers linked to member towns." />
      <CenterGrid onAdd={handleAdd} />
      <CenterFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  )
})
