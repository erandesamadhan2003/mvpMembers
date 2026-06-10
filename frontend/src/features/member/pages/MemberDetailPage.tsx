import { memo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  PageContainer,
  PageHeader,
  LoadingSpinner,
  ErrorState,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/constants/routes.constants'
import { useMemberQuery } from '@/features/member/hooks'
import { MemberRegistrationForm } from '@/features/member/components/MemberRegistrationForm'
import { DocumentUploadPanel } from '@/features/member/documents/components/DocumentUploadPanel'
import { formatMemberFullName } from '@/features/member/utils/memberDisplay'

export const MemberDetailPage = memo(function MemberDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const memberId = Number(id)
  const { data: member, isLoading, isError, error, refetch } = useMemberQuery(
    memberId,
    Number.isFinite(memberId) && memberId > 0,
  )

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner className="py-24" label="Loading member details..." />
      </PageContainer>
    )
  }

  if (isError || !member) {
    return (
      <PageContainer>
        <ErrorState
          message={error instanceof Error ? error.message : 'Member not found'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title={formatMemberFullName(member)}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(ROUTES.members)}
            >
              Back to list
            </Button>
            <Link to={ROUTES.members}>
              <Button type="button">Close</Button>
            </Link>
          </div>
        }
      />

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList aria-label="Member sections">
          <TabsTrigger value="details">Member Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <MemberRegistrationForm member={member} readOnly embedded />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentUploadPanel memberId={member.organizationMemberID} readOnly />
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
})