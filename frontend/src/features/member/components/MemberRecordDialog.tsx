import { memo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MemberRegistrationForm } from '@/features/member/components/MemberRegistrationForm'
import { DocumentUploadPanel } from '@/features/member/documents/components/DocumentUploadPanel'
import type { Member } from '@/features/member/types/member.types'
import { formatMemberFullName } from '@/features/member/utils/memberDisplay'

export type MemberDialogMode = 'view' | 'edit'

interface MemberRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Member | null
  mode: MemberDialogMode
}

export const MemberRecordDialog = memo(function MemberRecordDialog({
  open,
  onOpenChange,
  member,
  mode,
}: MemberRecordDialogProps) {
  const isView = mode === 'view'
  const title = member
    ? isView
      ? `View — ${formatMemberFullName(member)}`
      : `Update — ${formatMemberFullName(member)}`
    : isView
      ? 'View Member'
      : 'Update Member'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {member ? (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Member Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <MemberRegistrationForm
                member={member}
                embedded
                readOnly={isView}
                showCancel={!isView}
                submitLabel="Update Member"
                onCancel={() => onOpenChange(false)}
                onSuccess={() => onOpenChange(false)}
              />
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <DocumentUploadPanel
                memberId={member.organizationMemberID}
                readOnly={isView}
              />
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  )
})
