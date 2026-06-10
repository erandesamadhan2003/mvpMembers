import { memo, useCallback, useState } from 'react'
import { PageContainer, PageHeader } from '@/components/common'
import { SectionGrid } from '@/features/memberSection/components/SectionGrid'
import { SectionFormDialog } from '@/features/memberSection/components/SectionFormDialog'

export const SectionList = memo(function SectionList() {
  const [createOpen, setCreateOpen] = useState(false)

  const handleAdd = useCallback(() => setCreateOpen(true), [])

  return (
    <PageContainer>
      <PageHeader title="Member Sections" />
      <SectionGrid onAdd={handleAdd} />
      <SectionFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        section={null}
      />
    </PageContainer>
  )
})