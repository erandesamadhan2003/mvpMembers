import { memo, useCallback, useState } from 'react'
import { PageContainer, PageHeader } from '@/components/common'
import { SubTownGrid } from '@/features/memberSubTown/components/SubTownGrid'
import { SubTownFormDialog } from '@/features/memberSubTown/components/SubTownFormDialog'

export const SubTownList = memo(function SubTownList() {
    const [createOpen, setCreateOpen] = useState(false)
    const handleAdd = useCallback(() => setCreateOpen(true), [])

    return (
        <PageContainer>
            <PageHeader title="Member Sub Towns" />
            <SubTownGrid onAdd={handleAdd} />
            <SubTownFormDialog open={createOpen} onOpenChange={setCreateOpen} />
        </PageContainer>
    )
})