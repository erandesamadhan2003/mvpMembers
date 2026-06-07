import { memo } from 'react'
import { ExternalLink, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common'
import { useDocumentByMemberQuery } from '@/features/member/documents/hooks'
import type { Member } from '@/features/member/types/member.types'
import {
  openDocumentInNewWindow,
  toDocumentDataUrl,
} from '@/features/member/utils/documentDisplay'

function PreviewFrame({
  label,
  src,
  base64,
  alt,
}: {
  label: string
  src: string | null
  base64?: string | null
  alt: string
}) {
  const isPdf = base64?.trim().startsWith('JVBERi')

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
        {src && !isPdf ? (
          <img src={src} alt={alt} className="max-h-36 w-full rounded object-contain" />
        ) : isPdf ? (
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium">PDF on file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UserRound className="size-10" aria-hidden />
            <span className="text-sm">Not available</span>
          </div>
        )}
      </div>
      {base64 ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => openDocumentInNewWindow(base64, label)}
        >
          <ExternalLink className="size-4" aria-hidden />
          Open
        </Button>
      ) : null}
    </div>
  )
}

interface MemberSelectionPreviewProps {
  member: Member | null
}

export const MemberSelectionPreview = memo(function MemberSelectionPreview({
  member,
}: MemberSelectionPreviewProps) {
  const memberId = member?.organizationMemberID ?? 0
  const { data: document, isLoading } = useDocumentByMemberQuery(
    memberId,
    memberId > 0,
  )

  const photoSrc = toDocumentDataUrl(document?.memberPhoto)
  const signatureSrc = toDocumentDataUrl(document?.panCopy)

  return (
    <Card className="h-full border-border/80 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
        <CardTitle className="text-lg font-semibold">Member Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {!member ? (
          <div className="flex min-h-105 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
            <UserRound className="mb-3 size-12 text-muted-foreground/70" aria-hidden />
            <p className="text-base font-medium text-foreground">No member selected</p>
          </div>
        ) : (
          <>
            {isLoading ? (
              <LoadingSpinner className="" label="Loading documents..." />
            ) : (
              <div className="space-y-4">
                <PreviewFrame
                  label="Photo"
                  src={photoSrc}
                  base64={document?.memberPhoto}
                  alt="Member photo"
                />
                <PreviewFrame
                  label="Signature"
                  src={signatureSrc}
                  base64={document?.panCopy}
                  alt="Member signature"
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
})
