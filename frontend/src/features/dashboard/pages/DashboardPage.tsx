import { memo } from 'react'
import {
  Building2,
  Layers,
  MapPin,
  Users,
  FileStack,
} from 'lucide-react'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDocumentsQuery } from '@/features/document/hooks'
import { useMembersQuery } from '@/features/member/hooks'
import { useMemberCentersQuery } from '@/features/memberCenter/hooks'
import { useMemberSectionsQuery } from '@/features/memberSection/hooks'
import { useMemberTownsQuery } from '@/features/memberTown/hooks'
import { useAuth } from '@/features/auth/hooks'

export const DashboardPage = memo(function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const { data: members = [] } = useMembersQuery()
  const { data: towns = [] } = useMemberTownsQuery()
  const { data: centers = [] } = useMemberCentersQuery()
  const { data: sections = [] } = useMemberSectionsQuery()
  const { data: documents = [] } = useDocumentsQuery()

  const activeMembers = members.filter((m) => !m.death).length

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your MVP Members organization data."
      />

      <Card className="mb-6 border-primary/20 bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">
            Welcome to MVP Members
          </CardTitle>
          <CardDescription>
            {isAuthenticated
              ? 'Manage members, centers, towns, sections, and documents from the navigation menu.'
              : 'Sign in to access the membership management system.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You have{' '}
            <span className="font-semibold text-foreground">
              {activeMembers}
            </span>{' '}
            active members across{' '}
            <span className="font-semibold text-foreground">
              {centers.length}
            </span>{' '}
            centers in{' '}
            <span className="font-semibold text-foreground">
              {towns.length}
            </span>{' '}
            towns.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Members"
          value={members.length}
          description={`${activeMembers} active`}
          icon={<Users className="size-4 text-primary" />}
        />
        <StatCard
          title="Towns"
          value={towns.length}
          icon={<MapPin className="size-4 text-primary" />}
        />
        <StatCard
          title="Centers"
          value={centers.length}
          icon={<Building2 className="size-4 text-primary" />}
        />
        <StatCard
          title="Sections"
          value={sections.length}
          icon={<Layers className="size-4 text-primary" />}
        />
        <StatCard
          title="Documents"
          value={documents.length}
          icon={<FileStack className="size-4 text-primary" />}
        />
      </div>
    </PageContainer>
  )
})
