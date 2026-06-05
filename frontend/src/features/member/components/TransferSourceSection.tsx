import { memo } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Member } from '@/features/member/types/member.types'
import { formatMemberFullName } from '@/features/member/utils/memberDisplay'

interface TransferSourceSectionProps {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  lookupMemberNo: string
  onLookupMemberNoChange: (value: string) => void
  onLookup: () => void
  transferSource: Member | null
  verified: boolean
  disabled?: boolean
  error?: string
}

export const TransferSourceSection = memo(function TransferSourceSection({
  enabled,
  onEnabledChange,
  lookupMemberNo,
  onLookupMemberNoChange,
  onLookup,
  transferSource,
  verified,
  disabled = false,
  error,
}: TransferSourceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Transfer From Existing Member</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 rounded border-input"
            checked={enabled}
            disabled={disabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
          />
          This registration is a transfer from an existing member 
        </label>

        {enabled ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="transfer-source-member-no">Existing Member No. (X)</Label>
                <Input
                  id="transfer-source-member-no"
                  value={lookupMemberNo}
                  disabled={disabled || verified}
                  onChange={(e) => onLookupMemberNoChange(e.target.value)}
                  placeholder="Enter member number to transfer from"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  disabled={disabled || verified || !lookupMemberNo.trim()}
                  onClick={onLookup}
                >
                  Verify Member
                </Button>
              </div>
            </div>

            {verified && transferSource ? (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
                <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden />
                <span>
                  Verified: <strong>{transferSource.memberNo}</strong> —{' '}
                  {formatMemberFullName(transferSource)} will be marked inactive after
                  registration.
                </span>
              </div>
            ) : null}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
})
