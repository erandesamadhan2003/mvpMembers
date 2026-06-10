import { memo } from 'react'
import { Building2, FileText, MapPin, Users } from 'lucide-react'
import { PageContainer, PageHeader, StatCard } from '@/components/common'
import { useDocumentsQuery } from '@/features/member/documents/hooks'
import { useMemberCentersQuery } from '@/features/memberCenter/hooks'
import { useMemberSectionsQuery } from '@/features/memberSection/hooks'
import { useMemberTownsQuery } from '@/features/memberTown/hooks'
import { useMembersQuery } from '@/features/member/hooks'

export const DashboardPage = memo(function DashboardPage() {
  const { data: members = [] } = useMembersQuery()
  const { data: sections = [] } = useMemberSectionsQuery()
  const { data: towns = [] } = useMemberTownsQuery()
  const { data: centers = [] } = useMemberCentersQuery()
  const { data: documents = [] } = useDocumentsQuery()

  return (
    <PageContainer>
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Members"
          value={members.length}
          description="Registered organization members"
          icon={<Users className="size-5" />}
        />
        <StatCard
          title="Member Sections"
          value={sections.length}
          description="Active membership sections"
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          title="Towns & Centers"
          value={`${towns.length} / ${centers.length}`}
          description="Geographic master data"
          icon={<MapPin className="size-5" />}
        />
        <StatCard
          title="Documents"
          value={documents.length}
          description="Uploaded member documents"
          icon={<FileText className="size-5" />}
        />
      </div>
    </PageContainer>
  )
})