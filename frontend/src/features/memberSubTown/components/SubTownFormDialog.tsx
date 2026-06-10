import { memo, useEffect, useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getApiErrorMessage } from '@/api'
import { useMemberCentersQuery } from '@/features/memberCenter/hooks'
import {
    useCreateMemberSubTownMutation,
    useUpdateMemberSubTownMutation,
} from '@/features/memberSubTown/hooks/useSubTownMutations'
import type { MemberSubTown } from '@/features/memberSubTown/types/subTown.types'

const schema = z.object({
    subTownName: z.string().min(1, 'Sub town name is required'),
    organizationMemberCenterID: z.coerce.number().positive('Center is required'),
})

type FormInput = {
    subTownName: string
    organizationMemberCenterID: number | string
}
type FormValues = z.output<typeof schema>

interface SubTownFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    subTown?: MemberSubTown | null
    readOnly?: boolean
}

export const SubTownFormDialog = memo(function SubTownFormDialog({
    open,
    onOpenChange,
    subTown,
    readOnly = false,
}: SubTownFormDialogProps) {
    const isEdit = Boolean(subTown)
    const { data: centers = [] } = useMemberCentersQuery()
    const createMutation = useCreateMemberSubTownMutation()
    const updateMutation = useUpdateMemberSubTownMutation()

    const form = useForm<FormInput, any, FormValues>({
        resolver: zodResolver(schema) as Resolver<FormInput, any, FormValues>,
        defaultValues: { subTownName: '', organizationMemberCenterID: 0 },
    })

    const centerOptions = useMemo(
        () =>
            centers.map((c) => ({
                value: String(c.organizationMemberCenterID),
                label: `${c.centerName} (${c.organizationMemberTown?.townName ?? '—'})`,
            })),
        [centers],
    )

    useEffect(() => {
        if (open) {
            form.reset({
                subTownName: subTown?.subTownName ?? '',
                organizationMemberCenterID: subTown?.organizationMemberCenterID ?? 0,
            })
        }
    }, [open, subTown, form])

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            const payload = {
                subTownName: values.subTownName,
                organizationMemberCenterID: values.organizationMemberCenterID,
            }
            if (isEdit && subTown) {
                await updateMutation.mutateAsync({ id: subTown.organisationMemberSubTownID, payload })
            } else {
                await createMutation.mutateAsync(payload)
            }
            onOpenChange(false)
        } catch (error) {
            form.setError('subTownName', { message: getApiErrorMessage(error) })
        }
    })

    const pending = createMutation.isPending || updateMutation.isPending
    const centerValue = String(form.watch('organizationMemberCenterID') || '')
    const title = readOnly ? 'View Sub Town' : isEdit ? 'Update Sub Town' : 'Add Sub Town'

    const fieldClass = 'flex h-10 w-full rounded-md border border-border bg-muted/40 px-3 text-base text-foreground'
    const inputClass = 'h-10 text-base md:text-base'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {readOnly ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <Label className="text-base">Sub Town Name</Label>
                            <Input className={`${inputClass} bg-muted/40`} readOnly value={subTown?.subTownName ?? ''} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label className="text-base">Center</Label>
                            <select className={fieldClass} disabled value={String(subTown?.organizationMemberCenterID ?? '')}>
                                <option value="">
                                    {subTown?.organizationMemberCenter?.centerName ?? '—'}
                                </option>
                            </select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label className="text-base">Sub Town ID</Label>
                            <Input className={`${inputClass} bg-muted/40`} readOnly value={subTown?.subTownID ?? ''} />
                        </div>
                        <DialogFooter className="sm:col-span-2">
                            <Button type="button" onClick={() => onOpenChange(false)}>Close</Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="sub-town-name" className="text-base">Sub Town Name</Label>
                            <Input
                                id="sub-town-name"
                                className={inputClass}
                                {...form.register('subTownName')}
                            />
                            {form.formState.errors.subTownName ? (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.subTownName.message}
                                </p>
                            ) : null}
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="sub-town-center" className="text-base">Center</Label>
                            <select
                                id="sub-town-center"
                                className="flex h-10 w-full rounded-md border border-input bg-card px-3 text-base"
                                value={centerValue}
                                onChange={(e) => form.setValue('organizationMemberCenterID', e.target.value)}
                                aria-label="Select center"
                            >
                                <option value="">Select center</option>
                                {centerOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {form.formState.errors.organizationMemberCenterID ? (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.organizationMemberCenterID.message}
                                </p>
                            ) : null}
                        </div>
                        <DialogFooter className="sm:col-span-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={pending}>
                                {pending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
})