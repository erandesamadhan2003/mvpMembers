import { memo, useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import {
  PageContainer,
  PageHeader,
  LoadingSpinner,
  ErrorState,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/constants/routes.constants'
import { formatDisplayDate } from '@/utils/date'
import { useMemberQuery } from '@/features/member/hooks'
import { MemberFormDialog } from '@/features/member/components/MemberFormDialog'
import { DocumentUploadPanel } from '@/features/document/components/DocumentUploadPanel'

function DetailField({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value?.trim() ? value : '—'}</p>
    </div>
  )
}

function DetailSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </CardContent>
    </Card>
  )
}

export const MemberDetailPage = memo(function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const memberId = Number(id)
  const { data: member, isLoading, isError, error, refetch } = useMemberQuery(
    memberId,
    Number.isFinite(memberId) && memberId > 0,
  )
  const [editOpen, setEditOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const handleEditToggle = useCallback(() => {
    if (editMode) {
      setEditOpen(true)
    }
    setEditMode((v) => !v)
  }, [editMode])

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

  const fullName = [member.firstName, member.middleName, member.lastName]
    .filter(Boolean)
    .join(' ')

  return (
    <PageContainer>
      <PageHeader
        title={fullName}
        description={`Member No: ${member.memberNo ?? 'N/A'}`}
        actions={
          <div className="flex items-center gap-2">
            {member.death ? (
              <Badge variant="destructive">Deceased</Badge>
            ) : (
              <Badge variant="success">Active</Badge>
            )}
            <Button variant="outline" onClick={handleEditToggle} type="button">
              <Pencil className="size-4" aria-hidden />
              {editMode ? 'Save via Form' : 'Edit'}
            </Button>
            <Link to={ROUTES.members}>
              <Button variant="ghost" type="button">
                Back to list
              </Button>
            </Link>
          </div>
        }
      />

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList aria-label="Member detail sections">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="nominee">Nominee</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <DetailSection title="Personal Information">
            <DetailField label="First Name" value={member.firstName} />
            <DetailField label="Middle Name" value={member.middleName} />
            <DetailField label="Last Name" value={member.lastName} />
            <DetailField label="Native Name" value={member.nameInNativeLanguage} />
            <DetailField label="Gender" value={member.gender} />
            <DetailField label="Date of Birth" value={formatDisplayDate(member.dob)} />
            <DetailField label="Qualification" value={member.qualification} />
            <DetailField label="Phone" value={member.phoneNo} />
            <DetailField label="Email" value={member.eMail} />
            <DetailField label="Aadhaar" value={member.adharID} />
            <DetailField label="PAN" value={member.panNo} />
          </DetailSection>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <DetailSection title="Address Information">
            <DetailField label="City" value={member.city} />
            <DetailField label="Taluka" value={member.taluka} />
            <DetailField label="District" value={member.district} />
            <DetailField label="State" value={member.states} />
            <DetailField label="PIN Code" value={member.pinCode} />
            <DetailField label="Permanent City" value={member.pCity} />
            <DetailField label="Permanent Taluka" value={member.pTaluka} />
            <DetailField label="Permanent District" value={member.pDistrict} />
            <DetailField label="Permanent PIN" value={member.pPinCode} />
          </DetailSection>
        </TabsContent>

        <TabsContent value="membership" className="space-y-4">
          <DetailSection title="Membership Information">
            <DetailField label="Member Number" value={member.memberNo} />
            <DetailField
              label="Registration Date"
              value={formatDisplayDate(member.registrationDate)}
            />
            <DetailField
              label="Section"
              value={member.memberSection?.memberSectionName}
            />
            <DetailField
              label="Center"
              value={member.organizationMemberCenter?.centerName}
            />
            <DetailField
              label="Town"
              value={
                member.organizationMemberCenter?.organizationMemberTown
                  ?.townName
              }
            />
            <DetailField
              label="Card Issued"
              value={member.memberCardIssue ? 'Yes' : 'No'}
            />
          </DetailSection>
        </TabsContent>

        <TabsContent value="nominee" className="space-y-4">
          <DetailSection title="Nominee Information">
            <DetailField label="Nominee" value={member.nominee} />
          </DetailSection>
        </TabsContent>

        <TabsContent value="documents">
          <DocumentUploadPanel memberId={member.organizationMemberID} readOnly={!editMode} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <DetailSection title="Audit Information">
            <DetailField label="Created" value={formatDisplayDate(member.addByTime)} />
            <DetailField label="Last Updated" value={formatDisplayDate(member.editByTime)} />
            <DetailField label="URID" value={member.urid} />
          </DetailSection>
        </TabsContent>
      </Tabs>

      <MemberFormDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditMode(false)
        }}
        member={member}
      />
    </PageContainer>
  )
})
