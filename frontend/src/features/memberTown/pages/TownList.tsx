import { memo, useCallback, useState } from 'react'
import { PageContainer, PageHeader } from '@/components/common'
import { TownGrid } from '@/features/memberTown/components/TownGrid'
import { TownFormDialog } from '@/features/memberTown/components/TownFormDialog'

export const TownList = memo(function TownList() {
  const [createOpen, setCreateOpen] = useState(false)
  const handleAdd = useCallback(() => setCreateOpen(true), [])

  return (
    <PageContainer>
      <PageHeader title="Member Towns" />
      <TownGrid onAdd={handleAdd} />
      <TownFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  )
})