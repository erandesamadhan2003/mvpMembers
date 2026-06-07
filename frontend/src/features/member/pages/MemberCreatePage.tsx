import { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes.constants'
import { MemberRegistrationForm } from '@/features/member/components/MemberRegistrationForm'
import { DocumentUploadPanel } from '@/features/member/documents/components/DocumentUploadPanel'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'

type CreateStep = 'registration' | 'documents'

export const MemberCreatePage = memo(function MemberCreatePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<CreateStep>('registration')
  const [createdMemberId, setCreatedMemberId] = useState<number | null>(null)

  return (
    <PageContainer>
      <PageHeader
        title="Register Member"
        actions={
          <Link to={ROUTES.members}>
            <Button variant="ghost" type="button">
              Back to list
            </Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span
            className={
              step === 'registration'
                ? 'flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground'
                : 'flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground'
            }
          >
            {step === 'documents' ? <CheckCircle2 className="size-4" /> : '1'}
          </span>
          <span className={step === 'registration' ? 'font-medium' : ''}>
            Member Details
          </span>
        </div>
        <span className="text-muted-foreground">→</span>
        <div className="flex items-center gap-2">
          <span
            className={
              step === 'documents'
                ? 'flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground'
                : 'flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground'
            }
          >
            2
          </span>
          <span className={step === 'documents' ? 'font-medium' : ''}>
            Documents
          </span>
        </div>
      </div>

      {step === 'registration' ? (
        <MemberRegistrationForm
          showCancel={false}
          submitLabel="Register"
          onSuccess={(memberId) => {
            setCreatedMemberId(memberId)
            setStep('documents')
          }}
        />
      ) : createdMemberId ? (
        <div className="space-y-4">
          <DocumentUploadPanel memberId={createdMemberId} requireAll />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.memberDetail(createdMemberId))}
            >
              View Member
            </Button>
            <Button type="button" onClick={() => navigate(ROUTES.members)}>
              Finish
            </Button>
          </div>
        </div>
      ) : null}
    </PageContainer>
  )
})
