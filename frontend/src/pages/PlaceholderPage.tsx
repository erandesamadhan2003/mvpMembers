import { memo } from 'react'
import { PageContainer, PageHeader } from '@/components/common'

interface PlaceholderPageProps {
  title: string
}

export const PlaceholderPage = memo(function PlaceholderPage({
  title,
}: PlaceholderPageProps) {
  return (
    <PageContainer>
      <PageHeader title={title} />
      <p className="text-sm text-muted-foreground">
        This module will be available in a future release.
      </p>
    </PageContainer>
  )
})