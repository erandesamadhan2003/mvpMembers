import { memo } from 'react'
import { UserRound } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common'
import { useMemberByMemberNoQuery } from '@/features/member/hooks'
import { useDocumentByMemberQuery } from '@/features/member/documents/hooks'
import type { Member } from '@/features/member/types/member.types'
import { formatMemberFullName } from '@/features/member/utils/memberDisplay'
import { isMemberActive } from '@/features/member/utils/memberStatus'
import { toDocumentDataUrl } from '@/features/member/utils/documentDisplay'
import { getNameTitleLabel } from '@/features/member/constants/nameTitles.constants'

interface TransferMemberVerifyDialogProps {
  open: boolean
  memberNo: string
  onOpenChange: (open: boolean) => void
  onVerify: (member: Member) => void
}

function PreviewSlot({
  label,
  src,
  alt,
}: {
  label: string
  src: string | null
  alt: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex min-h-36 items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
        {src ? (
          <img src={src} alt={alt} className="max-h-32 rounded object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UserRound className="size-8" aria-hidden />
            <span className="text-xs">Not available</span>
          </div>
        )}
      </div>
    </div>
  )
}

export const TransferMemberVerifyDialog = memo(function TransferMemberVerifyDialog({
  open,
  memberNo,
  onOpenChange,
  onVerify,
}: TransferMemberVerifyDialogProps) {
  const trimmedNo = memberNo.trim()
  const {
    data: member,
    isLoading: memberLoading,
    isError: memberError,
  } = useMemberByMemberNoQuery(trimmedNo, open && trimmedNo.length > 0)

  const memberId = member?.organizationMemberID ?? 0
  const { data: document, isLoading: docLoading } = useDocumentByMemberQuery(
    memberId,
    open && memberId > 0,
  )

  const loading = memberLoading || docLoading
  const photoSrc = toDocumentDataUrl(document?.memberPhoto)
  const signatureSrc = toDocumentDataUrl(document?.panCopy, 'image/png')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Verify Transfer Member</DialogTitle>
        </DialogHeader>

        {loading ? (
          <LoadingSpinner className="py-12" label="Loading member details..." />
        ) : memberError || !member ? (
          <p className="py-8 text-center text-sm text-destructive">
            No member found with number &quot;{trimmedNo}&quot;.
          </p>
        ) : !isMemberActive(member) ? (
          <p className="py-8 text-center text-sm text-destructive">
            Member &quot;{trimmedNo}&quot; is inactive and cannot be used for transfer.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="text-xs font-medium text-muted-foreground">Member No.</p>
              <p className="text-lg font-semibold">{member.memberNo}</p>
              <p className="mt-2 text-sm text-foreground">
                {getNameTitleLabel(member.nameTitleID)}{' '}
                {formatMemberFullName(member)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <PreviewSlot label="Photo" src={photoSrc} alt="Member photo" />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Name</p>
                <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-border bg-muted/30 p-4 text-center">
                  <p className="text-base font-semibold text-foreground">
                    {getNameTitleLabel(member.nameTitleID)}
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {formatMemberFullName(member)}
                  </p>
                  {member.nameInNativeLanguage ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {member.nameInNativeLanguage}
                    </p>
                  ) : null}
                </div>
              </div>
              <PreviewSlot label="Signature" src={signatureSrc} alt="Member signature" />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading || memberError || !member || !isMemberActive(member)}
            onClick={() => member && onVerify(member)}
          >
            Verify &amp; Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
