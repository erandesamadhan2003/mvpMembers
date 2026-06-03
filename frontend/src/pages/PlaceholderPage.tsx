import { memo } from 'react'
import { PageContainer, PageHeader } from '@/components/common'

interface PlaceholderPageProps {
  title: string
  description: string
}

export const PlaceholderPage = memo(function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <PageContainer>
      <PageHeader title={title} description={description} />
      <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
        This module will be available in a future release.
      </div>
    </PageContainer>
  )
})
